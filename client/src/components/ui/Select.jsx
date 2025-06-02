import React, { useEffect, useState } from "react";

function Select({
  label,
  name,
  items = [],
  config = {
    descripCol: "",
    idCol: "",
  },
  value,
  className = "",
  classLabel = "",
  placeholder = "",
  showPlaceholder = true,
  onChange = () => {},
  requiredInput = false,
  disabled = false,
  ...rest
}) {
  const [selected, setSelected] = useState(value);
  const handleChange = (e) => {
    setSelected(e.target.value);
    onChange(e);
  };

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const options = items.map((item) => {
    return (
      <option
        key={item[config.idCol] || item.value}
        value={item[config.idCol] || item.value}
      >
        {item[config.descripCol] || item.name}
      </option>
    );
  });

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm mb-1 font-medium ${classLabel}`}
        >
          {label}
        </label>
      )}
      {requiredInput && (
        <span className="text-danger">
          <strong> * </strong>
        </span>
      )}
      <select
        id={name}
        name={name}
        onChange={handleChange}
        value={selected}
        className={`px-2 py-1 rounded-xl border border-[var(--muted)] bg-white text-[var(--text)] placeholder-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--primary)] transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        disabled={disabled}
        requerido={requiredInput.toString()}
        {...rest}
      >
        {showPlaceholder && (
          <option value="">
            {placeholder === "" ? "Seleccionar..." : placeholder}
          </option>
        )}
        {options}
      </select>
    </div>
  );
}

export default Select;
