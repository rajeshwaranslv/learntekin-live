import React from "react";

function SocialLoginButton({
  label,
  icon,
  onClick,
  ariaLabel,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      disabled={disabled}
      className="auth-social-btn"
    >
      <span className="auth-social-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

export default SocialLoginButton;
