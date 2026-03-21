import React from "react";

function AuthButton({
  children,
  loading = false,
  disabled = false,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const variantClassName =
    variant === "primary" ? "gfg-btn" : "gfg-btn gfg-btn-outline";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`auth-btn ${variantClassName} gfg-btn-full ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <>
          <span className="auth-spinner" aria-hidden="true" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default AuthButton;
