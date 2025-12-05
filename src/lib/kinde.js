// Kinde helper functions and configuration

import {
  getKindeServerSession,
  createKindeManagementAPIClient,
} from "@kinde-oss/kinde-auth-nextjs/server";

// Get current user session
export async function getCurrentUser() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  const user = await getUser();
  const authenticated = await isAuthenticated();

  return {
    user,
    isAuthenticated: authenticated,
    isLoading: false,
  };
}

// Get user permissions
export async function getUserPermissions() {
  const { getPermissions } = getKindeServerSession();
  return await getPermissions();
}

// Get user organization
export async function getUserOrganization() {
  const { getOrganization } = getKindeServerSession();
  return await getOrganization();
}

// Check if user has specific permission
export async function hasPermission(permission) {
  const permissions = await getUserPermissions();
  return permissions?.permissions?.includes(permission) || false;
}

// Check if user has specific role
export async function hasRole(role) {
  const { getRoles } = getKindeServerSession();
  const roles = await getRoles();
  return roles?.roles?.includes(role) || false;
}

// Get management API client (for admin operations)
export async function getKindeManagementClient() {
  const client = await createKindeManagementAPIClient();
  return client;
}

// Helper to get user data for forms
export async function getUserFormData() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return null;

  // Extract custom claims from JWT (you can add these in Kinde dashboard)
  const customClaims = user?.customClaims || {};

  return {
    id: user.id,
    email: user.email,
    name: `${user.given_name || ""} ${user.family_name || ""}`.trim(),
    firstName: user.given_name,
    lastName: user.family_name,
    picture: user.picture,
    phone: customClaims.phone || "",
    age: customClaims.age || "",
    isEmployee: customClaims.isEmployee || false,
    salary: customClaims.salary || "",
    role: user.roles?.[0] || "user",
  };
}

// Update user profile (custom claims)
export async function updateUserProfile(userId, updates) {
  try {
    const client = await getKindeManagementClient();

    // Update user custom claims
    await client.users.updateUser({
      id: userId,
      custom_claims: updates,
    });

    return { success: true };
  } catch (error) {
    console.error("Update user error:", error);
    return { success: false, error: error.message };
  }
}
