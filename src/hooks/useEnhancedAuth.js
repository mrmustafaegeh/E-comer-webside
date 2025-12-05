// src/hooks/useEnhancedAuth.js
"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useState, useEffect, useCallback } from "react";

export function useEnhancedAuth() {
  const kinde = useKindeBrowserClient();
  const [enhancedUser, setEnhancedUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [featureFlags, setFeatureFlags] = useState({});
  const [loading, setLoading] = useState(true);
  const [securityInfo, setSecurityInfo] = useState(null);

  // Fetch additional user data from our database
  const fetchEnhancedData = useCallback(async () => {
    if (!kinde.user?.id) return;

    try {
      // Fetch custom user data in parallel
      const [userRes, permsRes, flagsRes] = await Promise.all([
        fetch(`/api/user/profile?userId=${kinde.user.id}`),
        fetch(`/api/user/permissions?userId=${kinde.user.id}`),
        fetch(`/api/user/feature-flags?userId=${kinde.user.id}`),
      ]);

      const [userData, permsData, flagsData] = await Promise.all([
        userRes.json(),
        permsRes.json(),
        flagsRes.json(),
      ]);

      // Merge Kinde data with our custom data
      setEnhancedUser({
        ...kinde.user,
        ...userData,
        // Add custom business fields
        department: userData.department,
        role: userData.role,
        permissions: permsData.permissions,
        featureFlags: flagsData.flags,
      });

      setPermissions(permsData.permissions || []);
      setFeatureFlags(flagsData.flags || {});

      // Security info (last login, login count, etc.)
      setSecurityInfo({
        lastLogin: userData.lastLogin,
        loginCount: userData.loginCount,
        accountAge: Math.floor(
          (Date.now() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24)
        ),
      });
    } catch (error) {
      console.error("Failed to fetch enhanced auth data:", error);
    } finally {
      setLoading(false);
    }
  }, [kinde.user]);

  useEffect(() => {
    if (kinde.isAuthenticated && kinde.user) {
      fetchEnhancedData();
    } else {
      setLoading(false);
    }
  }, [kinde.isAuthenticated, kinde.user, fetchEnhancedData]);

  // Enhanced permission checks
  const hasPermission = useCallback(
    (permissionName) => {
      return (
        permissions.includes(permissionName) ||
        enhancedUser?.role === "ADMIN" ||
        enhancedUser?.role === "SUPER_ADMIN"
      );
    },
    [permissions, enhancedUser]
  );

  const hasFeature = useCallback(
    (featureName) => {
      return featureFlags[featureName] === true;
    },
    [featureFlags]
  );

  const isInDepartment = useCallback(
    (department) => {
      return enhancedUser?.department === department;
    },
    [enhancedUser]
  );

  // Custom logout with audit logging
  const enhancedLogout = useCallback(async () => {
    try {
      // Log the logout action
      await fetch("/api/user/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "LOGOUT",
          userId: kinde.user?.id,
        }),
      });

      // Clear local cache
      localStorage.removeItem("user_permissions");
      localStorage.removeItem("feature_flags");

      // Call Kinde logout
      window.location.href = "/api/auth/logout";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [kinde.user]);

  return {
    // Kinde properties
    ...kinde,

    // Enhanced properties
    enhancedUser,
    permissions,
    featureFlags,
    securityInfo,
    loading: kinde.isLoading || loading,

    // Enhanced methods
    hasPermission,
    hasFeature,
    isInDepartment,
    enhancedLogout,
    refreshData: fetchEnhancedData,
  };
}
