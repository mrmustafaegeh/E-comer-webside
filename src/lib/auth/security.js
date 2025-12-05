// src/lib/auth/security.js
import crypto from "crypto";

export class SecurityUtils {
  // Input validation
  static validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    return /^\d{10,15}$/.test(cleaned);
  }

  static validateAge(age) {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum >= 18 && ageNum <= 100;
  }

  static validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Password strength checker
  static checkPasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    return {
      score,
      strength: score >= 4 ? "strong" : score >= 3 ? "medium" : "weak",
      checks,
    };
  }

  // Generate secure random strings
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString("hex");
  }

  // Hash sensitive data (not passwords - use bcrypt for that)
  static hashData(data, salt = "") {
    return crypto
      .createHash("sha256")
      .update(data + salt)
      .digest("hex");
  }

  // XSS protection
  static sanitizeInput(input) {
    if (typeof input !== "string") return input;

    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  // CSRF token generation and validation
  static generateCSRFToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  static validateCSRFToken(token, sessionToken) {
    if (!token || !sessionToken) return false;
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(sessionToken)
    );
  }
}
