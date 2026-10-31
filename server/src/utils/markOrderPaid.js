import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Safe to call more than once for the same order: only the first call changes anything.
export default async function markOrderPaid(orderId, transactionId) {
  // Atomically flip pending -> paid. If another request got there first, this returns null.
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: "pending" },
    { status: "paid", paidAt: new Date(), paystackTransactionId: String(transactionId) },
    { new: true }
  );
  if (!order) return Order.findById(orderId);

  // Reduce stock, never below zero
  let stockIssue = false;
  for (const item of order.items) {
    const result = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } }
    );
    if (result.modifiedCount === 0) {
      stockIssue = true;
      console.error(`Stock problem on paid order ${order._id}: ${item.name}`);
    }
  }
  if (stockIssue) {
    order.stockIssue = true;
    await order.save();
  }
  return order;
}