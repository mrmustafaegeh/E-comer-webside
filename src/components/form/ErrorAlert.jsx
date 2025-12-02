import { AlertCircle } from "lucide-react";

export default function ErrorAlert({ errors }) {
  if (!errors.length) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm animate-fade-in">
      <div className="flex space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <ul className="text-sm text-red-700 space-y-1">
          {errors.map((err, i) => (
            <li key={i} className="flex items-center">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              {err}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
