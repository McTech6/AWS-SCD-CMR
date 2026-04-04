import { Router } from 'express';
import { createPayment, paymentWebhook } from "../controllers/payment.controller.js";

const router = Router();

// POST /api/payments
router.post("/", createPayment);

// POST /api/v1/payments/webhook
router.post("/webhook", paymentWebhook);

export default router;