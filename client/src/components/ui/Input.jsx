export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false,
  disabled = false,
  ...rest
}) {
  return (
    <div className="">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm mb-1 font-medium"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`px-2 py-1 rounded-xl border border-[var(--muted)] bg-white text-[var(--text)] placeholder-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--primary)] transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...rest}
      />
    </div>
  );
}