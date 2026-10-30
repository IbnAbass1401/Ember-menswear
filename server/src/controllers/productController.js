import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import { listQuerySchema } from "../validators/productValidator.js";

// Only what a product card needs, so the list stays light on phones
const LIST_FIELDS = "name slug price category images featured stock";

const SORTS = {
  newest: { createdAt: -1, _id: -1 },
  "price-asc": { price: 1, _id: 1 },
  "price-desc": { price: -1, _id: 1 },
  name: { name: 1, _id: 1 },
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getProducts = async (req, res) => {
  const q = listQuerySchema.parse(req.query);

  const filter = {};
  if (q.category) filter.category = q.category;
  if (q.featured) filter.featured = q.featured === "true";
  if (q.search) filter.name = { $regex: escapeRegex(q.search), $options: "i" };
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    filter.price = {};
    if (q.minPrice !== undefined) filter.price.$gte = q.minPrice;
    if (q.maxPrice !== undefined) filter.price.$lte = q.maxPrice;
  }

  const skip = (q.page - 1) * q.limit;

  const [products, total] = await Promise.all([
    Product.find(filter).select(LIST_FIELDS).sort(SORTS[q.sort]).skip(skip).limit(q.limit).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    total,
    page: q.page,
    pages: Math.ceil(total / q.limit),
    count: products.length,
    products,
  });
};

export const getProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).lean();
  if (!product) throw new AppError("Product not found", 404);
  res.json({ success: true, product });
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found", 404);

  product.set(req.body);
  await product.save(); // save() so the slug refreshes when the name changes

  res.json({ success: true, product });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError("Product not found", 404);
  res.json({ success: true, message: "Product deleted" });
};