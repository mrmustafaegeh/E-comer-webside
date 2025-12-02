export default function FormInput({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="group">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
        <Icon className="w-4 h-4 mr-2 text-gray-500" />
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      />
    </div>
  );
}
