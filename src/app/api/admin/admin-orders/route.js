import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("users");

    const params = Object.fromEntries(req.nextUrl.searchParams);
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 10);
    const search = params.search || "";

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await col
      .find(filter, { projection: { password: 0 } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    const total = await col.countDocuments(filter);

    return NextResponse.json(
      {
        users: users.map((u) => ({
          ...u,
          _id: u._id.toString(),
          id: u._id.toString(),
        })),
        total,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN USERS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("users");

    const body = await req.json();

    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!password || password.length < 6)
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );

    const exists = await col.findOne({ email });
    if (exists)
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );

    const passwordHash = await bcrypt.hash(password, 10);

    const doc = { name, email, password: passwordHash, createdAt: new Date() };
    const result = await col.insertOne(doc);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        _id: result.insertedId.toString(),
        name,
        email,
        createdAt: doc.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("ADMIN USERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
