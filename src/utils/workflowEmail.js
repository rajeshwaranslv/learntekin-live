import { API_BASE } from "./api";

const EMAIL_API_URL = "https://api.emailjs.com/api/v1.0/email/send";
const DEFAULT_LIVE_APP_URL = "https://learntekin.co.in";

const normalizeValue = (value) => String(value || "").trim();

const EMAIL_CONFIG = {
  serviceId: normalizeValue(import.meta.env.VITE_EMAILJS_SERVICE_ID),
  templateId: normalizeValue(import.meta.env.VITE_EMAILJS_TEMPLATE_ID),
  publicKey: normalizeValue(import.meta.env.VITE_EMAILJS_PUBLIC_KEY),
};

const isEmailJsConfigured = () =>
  Boolean(
    EMAIL_CONFIG.serviceId &&
      EMAIL_CONFIG.templateId &&
      EMAIL_CONFIG.publicKey
  );

export const getLiveAppUrl = () =>
  normalizeValue(import.meta.env?.VITE_LIVE_APP_URL) || DEFAULT_LIVE_APP_URL;

export const buildCertificateVerificationUrl = (certificateId, options = {}) => {
  const baseUrl = getLiveAppUrl().replace(/\/$/, "");
  const params = new URLSearchParams();

  if (certificateId) {
    params.set("certificateId", certificateId);
  }
  if (options.download) {
    params.set("download", "1");
  }

  const query = params.toString();
  return `${baseUrl}/Products${query ? `?${query}` : ""}`;
};

const sendViaBackend = async ({
  toEmail,
  toName,
  subject,
  message,
  actionLabel,
  actionUrl,
}) => {
  const response = await fetch(`${API_BASE}/api/workflow-email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      toEmail: normalizeValue(toEmail),
      toName: normalizeValue(toName),
      subject: normalizeValue(subject),
      message: normalizeValue(message),
      actionLabel: normalizeValue(actionLabel),
      actionUrl: normalizeValue(actionUrl),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(errorText || "Unable to send workflow email.");
  }

  return { sent: true, provider: "backend" };
};

const sendViaEmailJs = async ({
  toEmail,
  toName,
  subject,
  message,
  actionLabel,
  actionUrl,
  templateParams = {},
}) => {
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
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(errorText || "Unable to send workflow email.");
  }

  return { sent: true, provider: "emailjs" };
};

export const sendWorkflowEmail = async (options) => {
  try {
    return await sendViaBackend(options);
  } catch (backendError) {
    if (!isEmailJsConfigured()) {
      throw backendError;
    }
    return sendViaEmailJs(options);
  }
};

export const isWorkflowEmailConfigured = () =>
  Boolean(API_BASE) || isEmailJsConfigured();
