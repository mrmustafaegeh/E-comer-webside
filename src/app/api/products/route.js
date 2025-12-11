import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../../models/Product";

export async function GET(req) {
  await dbConnect();

  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    pageSize = 12,
  } = Object.fromEntries(req.nextUrl.searchParams);

  const query = {};

  if (search) query.title = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * pageSize;

  const products = await Product.find(query)
    .sort(sort || "-createdAt")
    .skip(skip)
    .limit(Number(pageSize));

  const totalItems = await Product.countDocuments(query);

  return NextResponse.json({
    products,
    pagination: {
      page: Number(page),
      totalPages: Math.ceil(totalItems / pageSize),
      pageSize: Number(pageSize),
      totalItems,
    },
  });
}
