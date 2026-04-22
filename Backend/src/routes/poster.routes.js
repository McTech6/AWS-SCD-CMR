import express from "express";
import { generatePoster } from "../controllers/poster.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/generate", upload.single("image"), generatePoster);

export default router;