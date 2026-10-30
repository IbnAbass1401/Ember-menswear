import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";

const clothing = ["S", "M", "L", "XL"];
const shoes = ["40", "41", "42", "43", "44", "45"];

const products = [
  { name: "Classic Oxford Shirt", category: "Tops", price: 45, sizes: clothing, featured: true, description: "A sharp everyday shirt in soft, breathable cotton." },
  { name: "Slim Fit Polo", category: "Tops", price: 30, sizes: clothing, description: "Clean slim-fit polo that works from work to weekend." },
  { name: "Essential Crew Tee", category: "Tops", price: 20, sizes: clothing, description: "Heavyweight cotton tee with a relaxed, solid feel." },
  { name: "Linen Short-Sleeve Shirt", category: "Tops", price: 38, sizes: clothing, description: "Light linen shirt made for hot days." },
  { name: "Tapered Chinos", category: "Bottoms", price: 55, sizes: clothing, featured: true, description: "Stretch chinos with a tapered, tailored leg." },
  { name: "Straight Denim Jeans", category: "Bottoms", price: 62, sizes: clothing, description: "Classic straight-cut denim that lasts." },
  { name: "Utility Cargo Pants", category: "Bottoms", price: 58, sizes: clothing, description: "Roomy cargo pants with practical pockets." },
  { name: "Bomber Jacket", category: "Outerwear", price: 110, sizes: clothing, featured: true, description: "A statement bomber with a clean, modern cut." },
  { name: "Zip-Up Hoodie", category: "Outerwear", price: 70, sizes: clothing, description: "Warm, soft zip hoodie for everyday layering." },
  { name: "Leather Chelsea Boots", category: "Footwear", price: 160, sizes: shoes, featured: true, description: "Slip-on leather boots that dress up any outfit." },
  { name: "Minimal White Sneakers", category: "Footwear", price: 95, sizes: shoes, description: "Clean white sneakers that go with everything." },
  { name: "Suede Loafers", category: "Footwear", price: 105, sizes: shoes, description: "Smart suede loafers for a polished look." },
  { name: "Leather Belt", category: "Accessories", price: 25, sizes: [], description: "Genuine leather belt with a classic buckle." },
  { name: "Aviator Sunglasses", category: "Accessories", price: 35, sizes: [], description: "Timeless aviators with UV protection." },
  { name: "Classic Wristwatch", category: "Accessories", price: 135, sizes: [], featured: true, description: "A refined watch with a leather strap." },
  { name: "Leather Wallet", category: "Accessories", price: 28, sizes: [], description: "Slim leather wallet with card slots." },
].map((p) => ({ ...p, stock: 25, images: [] }));

await connectDB();
await Product.deleteMany();
await Product.create(products);
console.log(`Seeded ${products.length} products`);
await mongoose.disconnect();