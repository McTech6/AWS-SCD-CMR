import prisma from "../db/prisma.js";

export const createPayment = async (req, res) => {
  const { attendeeId, phoneNumber } = req.body;
  console.log(`🚀 [PAYMENT] Initiating payment for Attendee: ${attendeeId}, Phone: ${phoneNumber}`);
  try {
    // Hardcoded amount to protect against frontend tampering (hacker prevention)
    const amount = 2500;

    // 1. Validate input
    if (!attendeeId || !phoneNumber) {
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

    // 4. Freemopay Flow - Phase 1: Generate Token
    const authResponse = await fetch(`${process.env.FREEMOPAY_URL}/api/v2/payment/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appKey: process.env.FREEMOPAY_APP_KEY,
        secretKey: process.env.FREEMOPAY_SECRET_KEY,
      }),
    });

    if (!authResponse.ok) {
      const err = await authResponse.text();
      console.error("Freemopay Auth Error:", err);
      return res.status(authResponse.status).json({
        success: false,
        message: "Failed to authenticate with payment provider",
      });
    }

    const { access_token } = await authResponse.json();
    console.log("🔑 [PAYMENT] Freemopay Access Token generated successfully");

    // 4. Phase 2: Initiate Payment
    console.log("📤 [PAYMENT] Sending initialization request to Freemopay...");
    const response = await fetch(`${process.env.FREEMOPAY_URL}/api/v2/payment`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.toString(), // Some APIs prefer string amounts
        payer: phoneNumber.startsWith('237') ? phoneNumber : `237${phoneNumber}`, 
        description: "AWS SCD T-Shirt",
        externalId: `AWS${Date.now().toString().slice(-8)}`, // Shorter, no hyphen
        callback: `${process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`}/api/v1/payments/webhook`,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Freemopay payment error:", err);
      return res.status(response.status).json({
        success: false,
        message: "Payment provider error",
        error: err,
      });
    }

    const result = await response.json();
    console.log("Freemopay response:", result);

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
          amount,
          phoneNumber,
          status: "PENDING", // Wait for webhook to confirm success
          providerRef: result.reference || result.id || `TRANS-${Date.now()}`,
        },
      });

      // We explicitly DO NOT mark hasPaid = true here.
      // We will only mark it true when the webhook confirms payment success!

      return newPayment;
    }, {
      maxWait: 5000,
      timeout: 15000
    });

    console.log(`💾 [PAYMENT] Success! Pending payment saved in DB. ID: ${payment.id}, Ref: ${payment.providerRef}`);

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

// Webhook endpoint to receive confirmation from payment provider
export const paymentWebhook = async (req, res) => {
  console.log("🔔 [WEBHOOK] Received notification from Freemopay!");
  console.log("📦 [WEBHOOK] Payload:", JSON.stringify(req.body, null, 2));
  try {
    // Freemopay sends a POST request to our callbackUrl.
    // Based on their documentation: status: SUCCESS or FAILED.
    // And external_reference or reference for the transaction search.
    const { reference, status, external_reference } = req.body;

    const providerRef = reference || external_reference;

    if (!providerRef) {
      console.error("⚠️ [WEBHOOK] Error: Missing transaction reference in payload");
      return res.status(400).json({ success: false, message: 'Missing transaction reference' });
    }

    console.log(`🔍 [WEBHOOK] Searching for payment with Ref: ${providerRef}...`);
    // Find the pending payment
    const payment = await prisma.payment.findFirst({
      where: { providerRef: providerRef }
    });

    if (!payment) {
      console.error(`❌ [WEBHOOK] Error: Payment not found for Ref: ${providerRef}`);
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    console.log(`💳 [WEBHOOK] Found Payment ID: ${payment.id}. Current Status: ${payment.status}. New Status from Provider: ${status}`);

    // Check if the provider indicated success
    if (status === 'SUCCESS' || status === 'COMPLETED' || status === 'SUCCESSFUL') {
      console.log(`✅ [WEBHOOK] Finalizing SUCCESS for Attendee: ${payment.attendeeId}...`);
      // Atomic update
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS' }
        });

        // ONLY mark attendee hasPaid = true securely here!
        await tx.attendee.update({
          where: { id: payment.attendeeId },
          data: { hasPaid: true }
        });
      }, {
        maxWait: 5000,
        timeout: 15000
      });
      console.log(`✅ Webhook: Payment ${payment.id} verified and saved as SUCCESS`);
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });
      console.log(`❌ Webhook: Payment ${payment.id} verified as FAILED`);
    }

    // Acknowledge receipt to the provider
    return res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
