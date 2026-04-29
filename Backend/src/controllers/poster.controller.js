import prisma from "../db/prisma.js";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { buildPosterHTML } from "../assets/posterTemplate.js";
import { uploadImage } from "../utils/cloudinary.js";

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
      include: { user: true },
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
    // 3. Upload user image to Cloudinary
    //////////////////////////////////////////////////////
    console.log("☁️ Uploading user image to Cloudinary...");
    const uploadedImage = await uploadImage(userImagePath, "posters/uploads");
    const imageDataUri = uploadedImage.url;
    console.log("✅ User image uploaded:", imageDataUri);

    // Clean up local file after upload
    try { fs.unlinkSync(userImagePath); } catch (_) {}
    userImagePath = null;

    //////////////////////////////////////////////////////
    // 4. Get Event Config for Date/Venue
    //////////////////////////////////////////////////////
    const config = await prisma.eventConfig.findFirst();
    const eventDate = config ? config.eventDate : undefined;
    const eventVenue = config ? config.venue : undefined;

    //////////////////////////////////////////////////////
    // 5. Build the HTML
    //////////////////////////////////////////////////////
    const html = buildPosterHTML({ name, imageDataUri, eventDate, eventVenue });

    //////////////////////////////////////////////////////
    // 6. Launch Puppeteer
    //////////////////////////////////////////////////////
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");

    const posterElement = await page.$("#poster");
    const screenshotBuffer = await posterElement.screenshot({ type: "png" });

    await browser.close();
    browser = null;

    //////////////////////////////////////////////////////
    // 7. Upload generated poster to Cloudinary
    //////////////////////////////////////////////////////
    console.log("☁️ Uploading generated poster to Cloudinary...");
    const base64Poster = `data:image/png;base64,${screenshotBuffer.toString("base64")}`;
    const posterUpload = await uploadImage(base64Poster, "posters/generated");
    console.log("✅ Poster uploaded:", posterUpload.url);

    return res.status(200).json({
      success: true,
      url: posterUpload.url,
      publicId: posterUpload.publicId
    });
  } catch (error) {
    console.error("POSTER ERROR:", error);

    if (browser) {
      try { await browser.close(); } catch (_) {}
    }
    if (userImagePath) {
      try { fs.unlinkSync(userImagePath); } catch (_) {}
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate poster",
      error: error.message,
    });
  }
};
