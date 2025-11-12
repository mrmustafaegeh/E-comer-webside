"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Model from "../ui/Model.jsx";
import {
  User,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function FormPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    age: "",
    isEmployee: false,
    salary: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const validationErrors = [];

    if (!form.name.trim()) validationErrors.push(t("form.errors.name"));
    if (
      !form.phoneNumber ||
      form.phoneNumber.length < 8 ||
      form.phoneNumber.length > 10
    )
      validationErrors.push(t("form.errors.phone"));
    if (!form.age || form.age < 18 || form.age > 55)
      validationErrors.push(t("form.errors.age"));
    if (!form.salary) validationErrors.push(t("form.errors.salary"));

    if (validationErrors.length) {
      setErrors(validationErrors);
      setIsSubmitting(false);
    } else {
      setErrors([]);
      setTimeout(() => {
        setShowAlert(true);
        setIsSubmitting(false);
      }, 500);
    }
  }

  const isFormValid = form.name && form.phoneNumber && form.age && form.salary;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {t("form.title")}
          </h1>
          <p className="text-gray-600 text-lg">{t("form.subtitle")}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {/* Error Alert */}
            {errors.length > 0 && (
              <div className="mb-6 animate-fade-in">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-800 mb-1">
                        {t("form.errorTitle", { count: errors.length })}
                      </h3>
                      <ul className="text-sm text-red-700 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label
                  htmlFor="name"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  {t("form.labels.name")}
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white/50"
                  placeholder={t("form.placeholders.name")}
                />
              </div>

              {/* Phone Field */}
              <div className="group">
                <label
                  htmlFor="phone"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  {t("form.labels.phone")}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phoneNumber: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white/50"
                  placeholder={t("form.placeholders.phone")}
                  maxLength="10"
                />
              </div>

              {/* Age Field */}
              <div className="group">
                <label
                  htmlFor="age"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  {t("form.labels.age")}
                </label>
                <input
                  id="age"
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white/50"
                  placeholder={t("form.placeholders.age")}
                  min="18"
                  max="55"
                />
              </div>

              {/* Employment Status */}
              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  id="isEmployee"
                  type="checkbox"
                  checked={form.isEmployee}
                  onChange={(e) =>
                    setForm({ ...form, isEmployee: e.target.checked })
                  }
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isEmployee"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {t("form.labels.isEmployee")}
                </label>
              </div>

              {/* Salary Range */}
              <div className="group">
                <label
                  htmlFor="salary"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                  {t("form.labels.salary")}
                </label>
                <select
                  id="salary"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white/50 appearance-none"
                >
                  <option value="">{t("form.placeholders.salary")}</option>
                  <option value="0-500">$0 - $500</option>
                  <option value="500-1500">$500 - $1,500</option>
                  <option value="1500-3000">$1,500 - $3,000</option>
                  <option value="3000-6000">$3,000 - $6,000</option>
                  <option value="6000+">$6,000+</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:scale-95 ${
                  !isFormValid || isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {t("form.buttons.processing")}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {t("form.buttons.submit")}
                  </div>
                )}
              </button>
            </form>

            {/* Form Tips */}
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
