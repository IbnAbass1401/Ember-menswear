import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import markOrderPaid from "../utils/markOrderPaid.js";
import { initializeTransaction, verifyTransaction, usdToKobo } from "../utils/paystack.js";

const allowedOrigins = () =>
  (process.env.CLIENT_URL || "http://localhost:3000").split(",").map((s) => s.trim());

// Re-check stock right before taking money
async function assertInStock(order) {
  const wanted = new Map();
  for (const i of order.items) {
    const id = i.product.toString();
    wanted.set(id, (wanted.get(id) ?? 0) + i.qty);
  }
  const products = await Product.find({ _id: { $in: [...wanted.keys()] } });
  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  for (const [id, qty] of wanted) {
    const p = byId.get(id);
    if (!p) throw new AppError("An item in this order is no longer available", 409);
    if (qty > p.stock) {
      throw new AppError(
        p.stock === 0 ? `${p.name} just sold out` : `Only ${p.stock} left of ${p.name}`,
        409
      );
    }
  }
}

// POST /api/orders/:id/pay  ->  starts a Paystack payment, returns the checkout link
export const payOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new AppError("Order not found", 404);
  if (order.status === "paid") throw new AppError("This order is already paid", 400);
  if (order.status !== "pending") throw new AppError("This order can't be paid for", 400);

  await assertInStock(order);

  const { rate, kobo } = usdToKobo(order.total);
  const reference = `ember-${order._id}-${Date.now().toString(36)}`;

  // Send the customer back to the same site they came from (phone testing uses the LAN address)
  const origins = allowedOrigins();
  const origin = req.get("origin");
  const base = origins.includes(origin) ? origin : origins[0];

  const tx = await initializeTransaction({
    email: req.user.email,
    amount: kobo,
    currency: "NGN",
    reference,
    callback_url: `${base}/order/${order._id}`,
    metadata: { orderId: order._id.toString() },
  });

  order.paymentReference = reference;
  order.amountChargedKobo = kobo;
  order.usdNgnRate = rate;
  await order.save();

  res.json({
    success: true,
    authorizationUrl: tx.authorization_url,
    reference,
    amountNGN: kobo / 100,
  });
};

// POST /api/orders/:id/verify  { reference }  ->  asks Paystack if it was paid, then updates the order
export const verifyOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new AppError("Order not found", 404);

  // Already handled (by an earlier verify or later by the webhook)
  if (order.status === "paid") return res.json({ success: true, paid: true, order });
  if (order.status !== "pending") throw new AppError("This order can't be paid for", 400);

  const { reference } = req.body;
  if (!reference.startsWith(`ember-${order._id}-`)) {
    throw new AppError("That payment doesn't belong to this order", 400);
  }

  const tx = await verifyTransaction(reference);

  // Not paid (yet): abandoned, failed, ongoing...
  if (tx.status !== "success") {
    return res.json({ success: true, paid: false, paymentStatus: tx.status, order });
  }

  // Paid, but make sure it is really THIS order and the RIGHT amount
  if (
    tx.currency !== "NGN" ||
    tx.amount !== order.amountChargedKobo ||
    tx.metadata?.orderId !== order._id.toString()
  ) {
    console.error(`Payment mismatch on order ${order._id}, reference ${reference}`);
    throw new AppError("Payment details didn't match this order. Please contact support.", 400);
  }

  const paidOrder = await markOrderPaid(order._id, tx.id);
  res.json({ success: true, paid: true, order: paidOrder });
};