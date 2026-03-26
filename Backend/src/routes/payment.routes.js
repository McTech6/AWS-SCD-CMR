import { Router } from 'express';
import { createPayment } from "../controllers/payment.controller.js";

const router = Router();

// POST /api/payments
router.post("/", createPayment);

export default router;