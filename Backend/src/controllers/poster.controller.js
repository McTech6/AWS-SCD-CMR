import prisma from "../db/prisma.js";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { buildPosterHTML } from "../assets/posterTemplate.js";

//////////////////////////////////////////////////////
// Generate Poster — Puppeteer HTML → PNG screenshot
//////////////////////////////////////////////////////

export const generatePoster = async (req, res) => {
  let userImagePath = null;
  let browser = null;

  try {
    console.log("🎨 POSTER GENERATION START");

    //////////////////////////////////////////////////////
    // 1. Validate input
    //////////////////////////////////////////////////////
    const { email } = req.body;

    if (!email || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Email and image are required",
      });
    }

    userImagePath = req.file.path;

    //////////////////////////////////////////////////////
    // 2. Get user from DB by email
    //////////////////////////////////////////////////////
    const attendee = await prisma.attendee.findFirst({
      where: { user: { email } },
      include: { user: true, certificate: true, payments: true },
    });

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: "No registration found for this email. Please register first.",
      });
    }

    const name = attendee.user.name;
    console.log("✅ User found:", name);

    //////////////////////////////////////////////////////
    // 3. Convert user image → base64 data URI
    //    Puppeteer is sandboxed — local paths are blocked,
    //    so the image must be embedded inline.
    //////////////////////////////////////////////////////
    const imageBuffer = fs.readFileSync(userImagePath);
    const mimeType = req.file.mimetype || "image/jpeg";
    const imageDataUri = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;

    //////////////////////////////////////////////////////
    // 4. Build the HTML
    //////////////////////////////////////////////////////
    const html = buildPosterHTML({ name, imageDataUri });

    //////////////////////////////////////////////////////
    // 5. Launch Puppeteer
    //////////////////////////////////////////////////////
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();

    // Exact poster size — no scrollbars, no clipping
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });

    // networkidle0 waits for Tailwind CDN + Google Fonts to fully load
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Belt-and-suspenders: also wait for document.fonts.ready
    await page.evaluateHandle("document.fonts.ready");

    // Screenshot the #poster element only (exactly 1080×1080)
    const posterElement = await page.$("#poster");
    const screenshotBuffer = await posterElement.screenshot({ type: "png" });

    await browser.close();
    browser = null;

    //////////////////////////////////////////////////////
    // 6. Write to disk and stream back
    //////////////////////////////////////////////////////
    const fileName = `poster-${Date.now()}.png`;
    const filePath = path.join("uploads", fileName);

    fs.writeFileSync(filePath, screenshotBuffer);

    return res.download(filePath, "my-aws-poster.png", () => {
      try {
        fs.unlinkSync(filePath);
      } catch (_) {}
      try {
        fs.unlinkSync(userImagePath);
      } catch (_) {}
    });
  } catch (error) {
    console.error("POSTER ERROR:", error);

    if (browser) {
      try {
        await browser.close();
      } catch (_) {}
    }
    if (userImagePath) {
      try {
        fs.unlinkSync(userImagePath);
      } catch (_) {}
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate poster",
      error: error.message,
    });
  }
};
