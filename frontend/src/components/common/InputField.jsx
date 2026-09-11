import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";
import "./InputField.css";

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  icon,
  inputMode,
  maxLength,
  isPassword = false,
  error = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="form-input-group">
      {label && (
        <label htmlFor={id} className="form-input-label">
          {label}
        </label>
      )}

      <div className={`form-input-wrapper ${error ? "has-error" : ""}`}>
        {icon && (
          <span className="form-input-icon" aria-hidden="true">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={effectiveType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          inputMode={inputMode}
          maxLength={maxLength}
          className="form-input-control"
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>

      {error && <p className="form-field-error">{error}</p>}
    </div>
  );
}

export default InputField;
