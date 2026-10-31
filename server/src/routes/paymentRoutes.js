import express, { Router } from "express";
import { paystackWebhook } from "../controllers/webhookController.js";

const router = Router();

// The signature is checked against the exact raw bytes, so this route needs express.raw
router.post("/webhook", express.raw({ type: "application/json" }), paystackWebhook);

export default router;