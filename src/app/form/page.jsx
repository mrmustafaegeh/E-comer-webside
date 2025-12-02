"use client";

import { useTranslation } from "react-i18next";
import { useFormLogic } from "../../hooks/useFormLogic";
import FormInput from "../../components/form/FormInput";
import ErrorAlert from "../../components/form/ErrorAlert";
import SubmitButton from "../../components/form/SubmitButton";
import EmploymentToggle from "../../components/form/EmploymentToggle";
import FormSelect from "../../components/form/FormSelect";

import Model from "../../components/ui/Model";

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

  const salaryOptions = [
    { value: "0-500", label: "$0 - $500" },
    { value: "500-1500", label: "$500 - $1,500" },
    { value: "1500-3000", label: "$1,500 - $3,000" },
    { value: "3000-6000", label: "$3,000 - $6,000" },
    { value: "6000+", label: "$6,000+" },
  ];

  const isFormValid = form.name && form.phoneNumber && form.age && form.salary;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">{t("form.title")}</h1>
          <p className="text-gray-600 text-lg">{t("form.subtitle")}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            <ErrorAlert errors={errors} />

            <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(v) =>
                  handleChange("phoneNumber", v.replace(/\D/g, ""))
                }
                placeholder={t("form.placeholders.phone")}
              />

              <FormInput
                label={t("form.labels.age")}
                icon={Calendar}
                type="number"
                value={form.age}
                onChange={(v) => handleChange("age", v)}
              />

              <EmploymentToggle
                checked={form.isEmployee}
                onChange={(val) => handleChange("isEmployee", val)}
                label={t("form.labels.isEmployee")}
              />

              <FormSelect
                id="salary"
                label={t("form.labels.salary")}
                value={form.salary}
                onChange={(v) => handleChange("salary", v)}
                options={salaryOptions}
                placeholder={t("form.placeholders.salary")}
              />

              <SubmitButton
                isSubmitting={isSubmitting}
                disabled={!isFormValid}
              />
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {t("form.terms.text")}{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t("form.terms.link")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAlert && <Model onClose={() => setShowAlert(false)} />}
    </div>
  );
}
