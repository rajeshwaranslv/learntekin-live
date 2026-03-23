const EMAIL_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

const normalizeValue = (value) => String(value || "").trim();

const EMAIL_CONFIG = {
  serviceId: normalizeValue(import.meta.env.VITE_EMAILJS_SERVICE_ID),
  templateId: normalizeValue(import.meta.env.VITE_EMAILJS_TEMPLATE_ID),
  publicKey: normalizeValue(import.meta.env.VITE_EMAILJS_PUBLIC_KEY),
};

export const isWorkflowEmailConfigured = () =>
  Boolean(
    EMAIL_CONFIG.serviceId &&
    EMAIL_CONFIG.templateId &&
    EMAIL_CONFIG.publicKey
  );

export const sendWorkflowEmail = async ({
  toEmail,
  toName,
  subject,
  message,
  actionLabel,
  actionUrl,
  templateParams = {},
}) => {
  if (!isWorkflowEmailConfigured()) {
    return { sent: false, skipped: true, reason: "missing-email-config" };
  }

  const response = await fetch(EMAIL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAIL_CONFIG.serviceId,
      template_id: EMAIL_CONFIG.templateId,
      user_id: EMAIL_CONFIG.publicKey,
      template_params: {
        recipient_email: normalizeValue(toEmail),
        recipient_name: normalizeValue(toName),
        subject: normalizeValue(subject),
        message: normalizeValue(message),
        action_label: normalizeValue(actionLabel),
        action_url: normalizeValue(actionUrl),
        ...templateParams,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Unable to send workflow email.");
  }

  return { sent: true };
};
