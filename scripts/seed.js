import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import Product from "../models/product.js";

const MONGODB_URI = process.env.MONGODB_URI;

const products = [
  {
    title: "Apple AirPods Pro 2nd gen",
    description:
      "Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C) provide excellent sound, active noise cancellation, and a comfortable fit.",
    price: 499.99,
    offerPrice: 399.99,
    rating: 4.5,
    category: "Electronics",
    image: "/image/apple_earphone_image.png",
    stock: 25,
    numReviews: 150,
    featured: true,
  },
  {
    title: "Bose QuietComfort 45",
    description:
      "The Bose QuietComfort 45 headphones are engineered for exceptional sound quality and unparalleled noise cancellation.",
    price: 429.99,
    offerPrice: 329.99,
    rating: 3,
    category: "Electronics",
    image: "/image/bose_headphone_image.png",
    stock: 18,
    numReviews: 89,
    featured: false,
  },
  {
    title: "Samsung Galaxy S23",
    description:
      "The Samsung Galaxy S23 offers an all-encompassing mobile experience with its advanced AMOLED display.",
    price: 899.99,
    offerPrice: 799.99,
    rating: 3.5,
    category: "Electronics",
    image: "/image/samsung_s23phone_image.png",
    stock: 12,
    numReviews: 203,
    featured: true,
  },
  {
    title: "Garmin Venu 2",
    description:
      "The Garmin Venu 2 smartwatch blends advanced fitness tracking with sophisticated design.",
    price: 399.99,
    offerPrice: 349.99,
    rating: 2,
    category: "Electronics",
    image: "/image/venu_watch_image.png",
    stock: 30,
    numReviews: 67,
    featured: false,
  },
  {
    title: "PlayStation 5",
    description:
      "The PlayStation 5 takes gaming to the next level with ultra-HD graphics.",
    price: 599.99,
    offerPrice: 499.99,
    rating: 4.7,
    category: "Electronics",
    image: "/image/playstation_image.png",
    stock: 8,
    numReviews: 421,
    featured: true,
  },
  {
    title: "Canon EOS R5",
    description:
      "The Canon EOS R5 is a game-changing mirrorless camera with a 45MP full-frame sensor.",
    price: 4199.99,
    offerPrice: 3899.99,
    rating: 3,
    category: "Electronics",
    image: "/image/cannon_camera_image.png",
    stock: 5,
    numReviews: 92,
    featured: false,
  },
  {
    title: "MacBook Pro 16",
    description:
      "The MacBook Pro 16, powered by Apple's M2 Pro chip, offers outstanding performance.",
    price: 2799.99,
    offerPrice: 2499.99,
    rating: 4.5,
    category: "Electronics",
    image: "/image/macbook_image.png",
    stock: 15,
    numReviews: 234,
    featured: true,
  },
  {
    title: "Sony WF-1000XM5",
    description:
      "Sony WF-1000XM5 true wireless earbuds deliver immersive sound with Hi-Res Audio.",
    price: 349.99,
    offerPrice: 299.99,
    rating: 3.9,
    category: "Electronics",
    image: "/image/sony_airbuds_image.png",
    stock: 40,
    numReviews: 178,
    featured: false,
  },
  {
    title: "Samsung Projector 4k",
    description:
      "The Samsung 4K Projector offers an immersive cinematic experience.",
    price: 1699.99,
    offerPrice: 1499.99,
    rating: 3,
    category: "Electronics",
    image: "/image/projector_image.png",
    stock: 7,
    numReviews: 45,
    featured: false,
  },
  {
    title: "ASUS ROG Zephyrus G16",
    description:
      "The ASUS ROG Zephyrus G16 gaming laptop is powered by the Intel Core i9 processor.",
    price: 2199.99,
    offerPrice: 1999.99,
    rating: 3,
    category: "Electronics",
    image: "/image/asus_laptop_image.png",
    stock: 10,
    numReviews: 112,
    featured: false,
  },
  {
    title: "Google Pixel 7",
    description: "Advanced Camera, Tensor Chip",
    rating: 4.3,
    price: 599.99,
    category: "Electronics",
    image: "/image/Google Pixel 7.jpg",
    stock: 22,
    numReviews: 189,
    featured: false,
  },
  {
    title: "DJI Mini 3 Pro",
    description: "Compact Drone, 4K Video",
    rating: 3,
    price: 759.99,
    category: "Electronics",
    image: "/image/DJI Mini 3 Pro.jpg",
    stock: 14,
    numReviews: 78,
    featured: false,
  },
  {
    title: "Fitbit Charge 5",
    description: "Health Metrics, Built-in GPS",
    rating: 2,
    price: 179.99,
    category: "Electronics",
    image: "/image/Fitbit Charge.jpeg",
    stock: 35,
    numReviews: 256,
    featured: false,
  },
  {
    title: "Apple Watch Series 8",
    description: "Advanced Health Tracking",
    rating: 4.6,
    price: 399.99,
    category: "Electronics",
    image: "/image/apple_watch8_image.jpg",
    stock: 28,
    numReviews: 312,
    featured: true,
  },
  {
    title: "Nintendo Switch OLED",
    description: "7-inch OLED Screen, Portable Gaming",
    rating: 3,
    price: 349.99,
    category: "Electronics",
    image: "/image/Nintendo Switch.png",
    stock: 19,
    numReviews: 167,
    featured: false,
  },
  {
    title: "JBL Flip 6",
    description: "Portable Bluetooth Speaker",
    rating: 3.2,
    price: 129.99,
    category: "Electronics",
    image: "/image/JBL Flip 6.png",
    stock: 45,
    numReviews: 134,
    featured: false,
  },
  {
    title: "Logitech MX Master 3",
    description: "Advanced Wireless Mouse",
    rating: 2.4,
    price: 99.99,
    category: "Electronics",
    image: "/image/Logitech MX.jpg",
    stock: 50,
    numReviews: 98,
    featured: false,
  },
  {
    title: "Kindle Paperwhite",
    description: "Waterproof, High-resolution Display",
    rating: 3.2,
    price: 139.99,
    category: "Books",
    image: "/image/Kindle Paperwh.jpg",
    stock: 32,
    numReviews: 421,
    featured: false,
  },
  {
    title: "Razer BlackWidow V4",
    description: "Mechanical Gaming Keyboard",
    rating: 1.4,
    price: 169.99,
    category: "Electronics",
    image: "/image/Razer BlackWi.jpg",
    stock: 27,
    numReviews: 67,
    featured: false,
  },
  {
    title: "Samsung Galaxy Tab S8",
    description: "11-inch Display, S Pen Included",
    rating: 3,
    price: 699.99,
    category: "Electronics",
    image: "/image/Samsung Galaxy Tab S8.jpg",
    stock: 16,
    numReviews: 145,
    featured: false,
  },
];

async function seedProducts() {
  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);

    console.log("🗑️  Clearing existing products...");
    await Product.deleteMany({});

    console.log("📦 Seeding products...");
    await Product.insertMany(products);

    console.log(`✅ Successfully seeded ${products.length} products!`);
    await mongoose.disconnect();

    console.log("👋 Disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
}

seedProducts();
