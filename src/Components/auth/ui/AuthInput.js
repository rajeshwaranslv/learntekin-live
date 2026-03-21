import React from "react";

function AuthInput({
  id,
  label,
  type = "text",
  registration,
  error,
  autoComplete,
  disabled,
  value,
  ariaLabel,
}) {
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";
  const groupClassName = `auth-input-group ${
    hasValue ? "has-value" : ""
  } ${error ? "has-error" : ""}`.trim();

  return (
    <div className={groupClassName}>
      <input
        id={id}
        type={type}
        placeholder=" "
        autoComplete={autoComplete}
        aria-label={ariaLabel || label}
        aria-invalid={Boolean(error)}
        disabled={disabled}
        className="auth-input-field"
        {...registration}
      />
      <label htmlFor={id} className="auth-input-label">
        {label}
      </label>
      {error ? (
        <p className="auth-input-error" role="alert">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}

export default AuthInput;
