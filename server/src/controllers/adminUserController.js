import Order from "../models/Order.js";
import User from "../models/User.js";
import { listUsersQuerySchema } from "../validators/adminValidator.js";

const REVENUE_STATUSES = ["paid", "shipped", "delivered"];

// Stops a search like "a.b(" from being treated as a regex pattern
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/admin/users?page&limit&search
export const listUsers = async (req, res) => {
  const { page, limit, search } = listUsersQuerySchema.parse(req.query);

  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: rx }, { email: rx }];
  }

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .select("name email role createdAt"), // never the password
  ]);

  // Order count and money spent, just for the users on this page
  const stats = users.length
    ? await Order.aggregate([
        { $match: { user: { $in: users.map((u) => u._id) } } },
        {
          $group: {
            _id: "$user",
            orders: { $sum: 1 },
            spent: { $sum: { $cond: [{ $in: ["$status", REVENUE_STATUSES] }, "$total", 0] } },
          },
        },
      ])
    : [];
  const byUser = new Map(stats.map((s) => [s._id.toString(), s]));

  res.json({
    success: true,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    users: users.map((u) => {
      const s = byUser.get(u._id.toString());
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        orders: s?.orders ?? 0,
        spent: Math.round((s?.spent ?? 0) * 100) / 100,
      };
    }),
  });
};