import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";
import markOrderPaid from "../utils/markOrderPaid.js";

// Paystack calls this directly whenever a payment succeeds
export const paystackWebhook = async (req, res) => {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new AppError("Payments are not configured yet", 500);

  // 1. Only trust requests signed with our secret key
  const signature = req.get("x-paystack-signature") || "";
  const expected = crypto.createHmac("sha512", key).update(req.body).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new AppError("Invalid signature", 401);
  }

  let event;
  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    throw new AppError("Bad payload", 400);
  }

  // 2. We only care about successful charges
  if (event.event === "charge.success") {
    const data = event.data ?? {};
    const orderId = data.metadata?.orderId;

    if (mongoose.isValidObjectId(orderId)) {
      const order = await Order.findById(orderId);

      if (order && order.status === "pending") {
        const matches =
          data.status === "success" &&
          data.currency === "NGN" &&
          data.amount === order.amountChargedKobo;

        if (matches) {
          await markOrderPaid(order._id, data.id);
        } else {
          console.error(`Webhook mismatch on order ${order._id}, reference ${data.reference}`);
        }
      }
    }
  }

  // Always answer 200 quickly so Paystack doesn't keep retrying
  res.sendStatus(200);
};