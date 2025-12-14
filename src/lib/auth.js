"use server";

import {
  LoginSchema,
  RegisterSchema,
  formatZodErrors,
} from "../lib/validation";
import { createSession, deleteSession } from "../lib/session";
import bcrypt from "bcryptjs";
import clientPromise from "./mongodb"; // MongoDB connection helper

// ------------------------
// Helper functions
// ------------------------

export async function findUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email: email.toLowerCase() });
  return user;
}

export async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const client = await clientPromise;
  const db = client.db();
  const usersCollection = db.collection("users");

  const newUser = {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    roles: ["user"],
    createdAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);
  return { ...newUser, id: result.insertedId.toString() };
}

// ------------------------
// Register Action
// ------------------------

export async function registerAction(prevState, formData) {
  try {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // Validate input
    const result = await RegisterSchema.safeParseAsync(data);
    if (!result.success) {
      return {
        success: false,
        errors: formatZodErrors(result.error),
        message: "Validation failed",
      };
    }

    // Check if user exists
    const existingUser = await findUserByEmail(result.data.email);
    if (existingUser) {
      return {
        success: false,
        errors: { email: "Email already registered" },
        message: "Email already registered",
      };
    }

    // Create user in MongoDB
    const newUser = await createUser(
      result.data.name,
      result.data.email,
      result.data.password
    );

    // Create session
    await createSession(newUser.id, newUser.email, ["user"]);

    return {
      success: true,
      message: "Registration successful!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (error) {
    console.error("💥 Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration",
    };
  }
}

// ------------------------
// Login Action
// ------------------------

export async function loginAction(prevState, formData) {
  try {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validate input
    const result = await LoginSchema.safeParseAsync(data);
    if (!result.success) {
      return {
        success: false,
        errors: formatZodErrors(result.error),
        message: "Validation failed. Please check your input.",
      };
    }

    // Find user in MongoDB
    const user = await findUserByEmail(result.data.email);
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      result.data.password,
      user.password
    );
    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Create session
    await createSession(
      user._id.toString(),
      user.email,
      user.roles || ["user"]
    );

    return {
      success: true,
      message: "Login successful!",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("💥 Login error:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

// ------------------------
// Logout Action
// ------------------------

export async function logoutAction() {
  try {
    await deleteSession();
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("💥 Logout error:", error);
    return { success: false, message: "Failed to log out" };
  }
}
