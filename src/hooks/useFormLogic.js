"use client";
import { useState, useEffect } from "react";
import { validateForm } from "../lib/validations/formValidation";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveTempForm, clearTempForm } from "../store/formSlice";
import { login as loginAction } from "../store/authSlice"; // if you need

export function useFormLogic(t) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const tempForm = useAppSelector((state) => state.form.tempForm);

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    age: "",
    isEmployee: false,
    salary: "",
  });

  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (tempForm) {
      setForm(tempForm);
      dispatch(clearTempForm());
    }
  }, [tempForm, dispatch]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If not logged in save and redirect to login
    if (!isLoggedIn) {
      dispatch(saveTempForm(form));
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    const validationErrors = validateForm(form, t);

    if (validationErrors.length) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // success simulate
    setTimeout(() => {
      setShowAlert(true);
      setIsSubmitting(false);
    }, 600);
  };

  return {
    form,
    errors,
    isSubmitting,
    showAlert,
    setShowAlert,
    handleChange,
    handleSubmit,
    setForm,
  };
}
