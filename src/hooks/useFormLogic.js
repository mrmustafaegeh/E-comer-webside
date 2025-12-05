"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useFormLogic(initialForm = {}) {
  const router = useRouter();
  const { isAuthenticated, user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    isEmployee: false,
    salary: "",
    ...initialForm,
  });

  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle form field changes
  const handleChange = useCallback(
    (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));

      // Clear errors when user starts typing
      if (errors.length > 0) {
        setErrors([]);
      }

      // Clear success message
      if (success) {
        setSuccess(false);
      }
    },
    [errors, success]
  );

  // Validate form
  const validateForm = useCallback(() => {
    const validationErrors = [];

    if (!form.name.trim()) {
      validationErrors.push("Name is required");
    }

    if (form.phone && !/^\d{10,15}$/.test(form.phone.replace(/\D/g, ""))) {
      validationErrors.push("Please enter a valid phone number (10-15 digits)");
    }

    if (form.age) {
      const ageNum = parseInt(form.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        validationErrors.push("Age must be between 18 and 100");
      }
    }

    return validationErrors;
  }, [form]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      const validationErrors = validateForm();

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      setErrors([]);

      try {
        const result = await updateProfile({
          name: form.name.trim(),
          phone: form.phone.replace(/\D/g, ""),
          age: parseInt(form.age) || null,
          isEmployee: form.isEmployee,
          salary: form.salary,
        });

        if (result.success) {
          setSuccess(true);

          // Reset form if needed
          if (!user) {
            setForm({
              name: "",
              phone: "",
              age: "",
              isEmployee: false,
              salary: "",
            });
          }

          // Auto-hide success message after 3 seconds
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setErrors([result.error || "Failed to update profile"]);
        }
      } catch (err) {
        setErrors(["An error occurred. Please try again."]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, isAuthenticated, router, updateProfile, user, validateForm]
  );

  // Initialize form with user data
  const initializeWithUser = useCallback((userData) => {
    if (userData) {
      setForm({
        name: userData.name || "",
        phone: userData.phone || "",
        age: userData.age?.toString() || "",
        isEmployee: userData.isEmployee || false,
        salary: userData.salary || "",
      });
    }
  }, []);

  return {
    form,
    errors,
    isSubmitting,
    success,
    handleChange,
    handleSubmit,
    setErrors,
    setSuccess,
    setIsSubmitting,
    initializeWithUser,
    isFormValid: form.name && form.phone && form.age,
  };
}
