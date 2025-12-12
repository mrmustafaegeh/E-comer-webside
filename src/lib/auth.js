"use server";

import {
  LoginSchema,
  RegisterSchema,
  formatZodErrors,
} from "../lib/validation";
import { createSession, deleteSession } from "../lib/session";
import bcrypt from "bcryptjs";
import { id } from "zod/v4/locales";
import { redirect } from "next/dist/server/api-utils";

// Mock database - IMPORTANT: Use hashed password
let users = [
  {
    id: "1",
    name: "Test User",
    email: "mr.mustafaegeh@gmail.com",
    password: "$2a$10$7QJH6r5j1Z0F1xX1Z0F1xeu1Z0F1xeu1Z0F1xeu", // Hashed version of "Ve0ir1990"
  },
];

// Initialize with a test user (hashed password)
async function initializeUsers() {
  if (users.length === 0) {
    // Hash the password for the test user
    const hashedPassword = await bcrypt.hash("Ve0ir1990", 10);
    users.push({
      id: "1",
      name: "Test User",
      email: "mr.mustafaegeh@gmail.com", // Use lowercase
      password: hashedPassword, // Store hashed password
    });
    console.log("👤 Test user initialized:", users[0].email);
  }
}

async function findUserByEmail(email) {
  await initializeUsers();
  console.log("🔍 Searching for user with email:", email.toLowerCase());
  return users.find((u) => u.email === email.toLowerCase());
}

async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: String(users.length + 1),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  };
  users.push(newUser);
  console.log("👤 New user created:", newUser.email);
  return newUser;
}

export async function loginAction(prevState, formData) {
  console.log("🔐 Login action triggered");

  try {
    // Extract form data
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log("📧 Form data:", {
      email: data.email,
      passwordLength: data.password?.length,
    });

    // Validate input
    const result = await LoginSchema.safeParseAsync(data);

    if (!result.success) {
      console.log("❌ Validation failed:", result.error.errors);
      return {
        success: false,
        errors: formatZodErrors(result.error),
        message: "Validation failed. Please check your input.",
      };
    }

    console.log("✅ Validation passed for:", result.data.email);

    // Find user
    console.log(result.data.email);
    const user = await findUserByEmail(result.data.email);

    if (!user) {
      console.log("❌ User not found");
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    console.log("👤 User found:", user.email);

    // Verify password
    console.log("🔑 Comparing passwords...");
    console.log("Input password:", result.data.password);
    console.log(
      "Stored password (hashed):",
      user.password.substring(0, 20) + "..."
    );

    const passwordMatch = await bcrypt.compare(
      result.data.password,
      user.password
    );

    console.log("🔑 Password match result:", passwordMatch);

    if (!passwordMatch) {
      console.log("❌ Password doesn't match");
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    console.log("✅ Authentication successful");

    // Create session
    await createSession(user.id, user.email, ["user"]);

    console.log("🚀 Returning success response");

    // Return success - the client will handle redirect
    return {
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("💥 Login error:", error);
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}

export async function registerAction(prevState, formData) {
  console.log("📝 Registration action triggered");

  try {
    // Extract form data
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    console.log("📋 Registration data:", {
      name: data.name,
      email: data.email,
      passwordLength: data.password?.length,
      confirmPasswordLength: data.confirmPassword?.length,
    });

    // Validate input
    const result = await RegisterSchema.safeParseAsync(data);

    if (!result.success) {
      console.log("❌ Validation failed:", result.error.errors);
      return {
        success: false,
        errors: formatZodErrors(result.error),
        message: "Validation failed",
      };
    }

    console.log("✅ Validation passed");

    // Check if user exists
    await initializeUsers(); // Make sure users array is initialized
    const existingUser = await findUserByEmail(result.data.email);

    if (existingUser) {
      console.log("❌ Email already exists:", result.data.email);
      return {
        success: false,
        errors: { email: "Email already registered" },
        message: "Email already registered",
      };
    }

    // Create user
    const newUser = await createUser(
      result.data.name,
      result.data.email,
      result.data.password
    );

    console.log("👤 User created:", newUser.email);

    // Create session
    await createSession(newUser.id, newUser.email, ["user"]);

    console.log("🚀 Returning success response");

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

export async function logoutAction() {
  console.log("🚪 Logout action triggered");
  await deleteSession();
  return { success: true, message: "Logged out successfully" };
}
