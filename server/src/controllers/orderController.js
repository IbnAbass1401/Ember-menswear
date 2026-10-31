import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";

const FREE_SHIPPING_OVER = 120; // free delivery over $120
const SHIPPING_FEE = 8; // flat fee otherwise

const round2 = (n) => Math.round(n * 100) / 100;

export const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  // 1. Merge duplicate lines (same product + size)
  const merged = new Map();
  for (const item of items) {
    const key = `${item.productId}-${item.size ?? ""}`;
    const existing = merged.get(key);
    if (existing) existing.qty += item.qty;
    else merged.set(key, { ...item });
  }
  const lines = [...merged.values()];

  // 2. Load the real products from the database
  const ids = [...new Set(lines.map((l) => l.productId))];
  const products = await Product.find({ _id: { $in: ids } });
  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  // Total quantity wanted per product (across sizes) for the stock check
  const wanted = new Map();
  for (const l of lines) {
    wanted.set(l.productId, (wanted.get(l.productId) ?? 0) + l.qty);
  }

  // 3. Verify each line and build the order items using DB prices only
  const orderItems = lines.map((l) => {
    const p = byId.get(l.productId);
    if (!p) throw new AppError("An item in your cart is no longer available", 400);

    const hasSizes = p.sizes.length > 0;
    if (hasSizes && (!l.size || !p.sizes.map(String).includes(l.size))) {
      throw new AppError(`Please choose a valid size for ${p.name}`, 400);
    }

    const totalWanted = wanted.get(l.productId);
    if (totalWanted > p.stock) {
      throw new AppError(
        p.stock === 0 ? `${p.name} is sold out` : `Only ${p.stock} left of ${p.name}`,
        409
      );
    }

    return {
      product: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.images?.[0],
      size: hasSizes ? l.size : undefined,
      qty: l.qty,
    };
  });

  // 4. Server-side totals
  const itemsTotal = round2(orderItems.reduce((sum, i) => sum + i.price * i.qty, 0));
  const shippingFee = itemsTotal > FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const total = round2(itemsTotal + shippingFee);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    itemsTotal,
    shippingFee,
    total,
  });

  res.status(201).json({ success: true, order });
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json({ success: true, count: orders.length, orders });
};

export const getOrder = async (req, res) => {
  // Only the owner can see their order
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new AppError("Order not found", 404);

  // Rough naira amount, shown before the customer pays (the real charge is set when they tap Pay)
  const rate = Number(process.env.USD_NGN_RATE);
  const estimatedNGN = rate > 0 ? Math.round(order.total * rate) : null;

  res.json({ success: true, order, estimatedNGN });
};