import { useState } from "react";
import { validateForm } from "@/lib/validations/formValidation";

export function useFormLogic(t) {
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm(form, t);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors([]);

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
  };
}
