import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const REVENUE_STATUSES = ["paid", "shipped", "delivered"];
const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];
const LOW_STOCK = 5;

const round2 = (n) => Math.round((n ?? 0) * 100) / 100;

// GET /api/admin/stats
export const getStats = async (req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [revenueAgg, recentRevenueAgg, statusAgg, customers, productTotal, soldOut, lowStock, recent] =
    await Promise.all([
      Order.aggregate([
        { $match: { status: { $in: REVENUE_STATUSES } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { status: { $in: REVENUE_STATUSES }, paidAt: { $gte: since } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      Product.find({ stock: { $gt: 0, $lte: LOW_STOCK } })
        .sort("stock")
        .limit(5)
        .select("name slug stock"),
      Order.find()
        .sort("-createdAt")
        .limit(5)
        .populate("user", "name email")
        .select("total status createdAt user"),
    ]);

  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const row of statusAgg) byStatus[row._id] = row.count;

  res.json({
    success: true,
    stats: {
      revenue: {
        total: round2(revenueAgg[0]?.total),
        last30Days: round2(recentRevenueAgg[0]?.total),
      },
      orders: {
        total: Object.values(byStatus).reduce((a, b) => a + b, 0),
        byStatus,
      },
      customers,
      products: { total: productTotal, soldOut, lowStock },
      recentOrders: recent.map((o) => ({
        _id: o._id,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
        customer: o.user ? { name: o.user.name, email: o.user.email } : null,
      })),
    },
  });
};