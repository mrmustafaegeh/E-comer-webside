// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { createSession } from "../../../../lib/session";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session with userId, email, and roles
    await createSession(
      user._id.toString(),
      user.email,
      user.roles || ["user"]
    );

    // Return success response (don't send password)
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        roles: user.roles || ["user"],
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
