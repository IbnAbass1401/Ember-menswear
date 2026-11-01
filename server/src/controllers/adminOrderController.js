import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";
import { listOrdersQuerySchema } from "../validators/adminValidator.js";

// Which current status each new status may come from (one-way only)
const SOURCE_STATUS = {
  shipped: "paid",
  delivered: "shipped",
  cancelled: "pending",
};

// GET /api/admin/orders?status&page&limit
export const listOrders = async (req, res) => {
  const { page, limit, status } = listOrdersQuerySchema.parse(req.query);
  const filter = status ? { status } : {};

  const [total, orders] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email")
      .select("status total createdAt user items"),
  ]);

  res.json({
    success: true,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    orders: orders.map((o) => ({
      _id: o._id,
      status: o.status,
      total: o.total,
      createdAt: o.createdAt,
      customer: o.user ? { name: o.user.name, email: o.user.email } : null,
      items: o.items.map((i) => ({ name: i.name, qty: i.qty })),
    })),
  });
};

// GET /api/admin/orders/:id
export const getAdminOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) throw new AppError("Order not found", 404);

  const { user, ...rest } = order.toObject();
  res.json({
    success: true,
    order: { ...rest, customer: user ? { name: user.name, email: user.email } : null },
  });
};

// PATCH /api/admin/orders/:id/status  { status }
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  // The current status is part of the filter, so two admins clicking at once can't both win
  const updated = await Order.findOneAndUpdate(
    { _id: req.params.id, status: SOURCE_STATUS[status] },
    { status },
    { new: true }
  );

  if (!updated) {
    const existing = await Order.findById(req.params.id).select("status");
    if (!existing) throw new AppError("Order not found", 404);
    throw new AppError(`Can't change an order from "${existing.status}" to "${status}"`, 400);
  }

  res.json({ success: true, status: updated.status });
};