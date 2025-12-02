"use client";

import { useTranslation } from "react-i18next";
import { useFormLogic } from "@/hooks/useFormLogic";
import FormInput from "@/components/form/FormInput";
import ErrorAlert from "@/components/form/ErrorAlert";
import SubmitButton from "@/components/form/SubmitButton";
import Model from "@/components/ui/Model";

import { User, Phone, Calendar, DollarSign } from "lucide-react";

export default function FormPage() {
  const { t } = useTranslation();
  const {
    form,
    errors,
    isSubmitting,
    showAlert,
    setShowAlert,
    handleChange,
    handleSubmit,
  } = useFormLogic(t);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-lg">
        {/* Error Messages */}
        <ErrorAlert errors={errors} />

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/80 p-8 rounded-3xl shadow-2xl"
        >
          <FormInput
            label={t("form.labels.name")}
            icon={User}
            value={form.name}
            onChange={(v) => handleChange("name", v)}
            placeholder={t("form.placeholders.name")}
          />

          <FormInput
            label={t("form.labels.phone")}
            icon={Phone}
            value={form.phoneNumber}
            onChange={(v) => handleChange("phoneNumber", v.replace(/\D/g, ""))}
            placeholder={t("form.placeholders.phone")}
          />

          <FormInput
            label={t("form.labels.age")}
            type="number"
            icon={Calendar}
            value={form.age}
            onChange={(v) => handleChange("age", v)}
          />

          <FormInput
            label={t("form.labels.salary")}
            icon={DollarSign}
            value={form.salary}
            onChange={(v) => handleChange("salary", v)}
            placeholder={t("form.placeholders.salary")}
          />

          <SubmitButton isSubmitting={isSubmitting} disabled={false} />
        </form>
      </div>

      {showAlert && <Model onClose={() => setShowAlert(false)} />}
    </div>
  );
}
