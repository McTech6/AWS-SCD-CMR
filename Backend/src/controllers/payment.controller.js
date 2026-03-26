import prisma from "../db/prisma.js";

export const createPayment = async (req, res) => {
  try {
    const { attendeeId, amount, phoneNumber } = req.body;
    // 1. Validate input
    if (!attendeeId || !amount || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 2. Check attendee exists
    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: "Attendee not found",
      });
    }

    // 3. block duplicate payments
    const existing = await prisma.payment.findFirst({
      where: {
        attendeeId,
        status: "SUCCESS",
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Payment already completed for this attendee",
      });
    }

    // 4. Call Mynkwa FIRST
    const response = await fetch(process.env.MYNKWA_URL + "/collect", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.MYNKWA_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        phoneNumber,
        description: "T-shirt payment",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Mynkwa error:", err);
      return res.status(response.status).json({
        success: false,
        message: "Payment provider error",
        error: err,
      });
    }

    const result = await response.json();
    console.log("Mynkwa response:", result);

    // 5. Atomic transaction — write payment + mark attendee
    //    Both succeed or both roll back. No partial state.
    const payment = await prisma.$transaction(async (tx) => {
      // Check again inside the transaction — prevents race condition
      // where two requests slip through step 3 simultaneously
      const duplicate = await tx.payment.findFirst({
        where: {
          attendeeId,
          status: "SUCCESS",
        },
      });

      if (duplicate) {
        throw new Error("DUPLICATE_PAYMENT");
      }

      const newPayment = await tx.payment.create({
        data: {
          attendeeId,
          amount: Number(amount),
          phoneNumber,
          status: "SUCCESS",
          providerRef: result.id || null,
        },
      });

      // Mark the attendee as having paid — the flag your DB tracks
      await tx.attendee.update({
        where: { id: attendeeId },
        data: { hasPaid: true },
      });

      return newPayment;
    });

    console.log("Payment saved:", payment.id);

    // 6. Final response
    return res.status(200).json({
      success: true,
      message: "Payment request sent successfully",
      data: payment,
    });
  } catch (error) {
    console.error("======== PAYMENT ERROR ========");
    console.error(error);

    // Surface the duplicate case cleanly
    if (error.message === "DUPLICATE_PAYMENT") {
      return res.status(409).json({
        success: false,
        message: "Payment already completed for this attendee",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
};
