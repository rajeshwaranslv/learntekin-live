const DEFAULT_API_BASE_URL = "https://lte-node.onrender.com";

export const normalizeApiBase = (value, fallback = "") => {
  const rawValue = String(value || "").trim() || fallback;
  if (!rawValue) return "";
  const withProtocol = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : `https://${rawValue}`;
  return withProtocol.replace(/\/$/, "");
};

const normalizePath = (path = "") =>
  path.startsWith("/") ? path : `/${path}`;

const resolveProductionApiBase = () =>
  normalizeApiBase(import.meta.env.VITE_API_BASE_URL, DEFAULT_API_BASE_URL);

// Dev: use VITE_API_PROXY_TARGET (defaults to hosted API)
// Prod: use VITE_API_BASE_URL from env
const resolveApiBase = () => {
  if (import.meta.env.DEV) {
    return normalizeApiBase(
      import.meta.env.VITE_API_PROXY_TARGET || import.meta.env.VITE_API_BASE_URL,
      DEFAULT_API_BASE_URL
    );
  }
  return resolveProductionApiBase();
};

export const API_BASE = resolveApiBase();
export const API_FALLBACK_BASE = normalizeApiBase(DEFAULT_API_BASE_URL);

export const buildApiUrl = (path = "") =>
  `${API_BASE}${normalizePath(path)}`;

export const buildApiFallbackUrl = (path = "") =>
  `${API_FALLBACK_BASE}${normalizePath(path)}`;

export const buildWebSocketUrl = (path = "") => {
  const base = import.meta.env.DEV
    ? normalizeApiBase(
      import.meta.env.VITE_API_PROXY_TARGET || import.meta.env.VITE_API_BASE_URL,
      DEFAULT_API_BASE_URL
    )
    : API_BASE;
  return `${base.replace(/^http/i, "ws")}${normalizePath(path)}`;
};

export const resolveApiAssetUrl = (value = "") => {
  const normalizedValue = String(value || "").trim();
  if (
    !normalizedValue ||
    /^https?:\/\//i.test(normalizedValue) ||
    normalizedValue.startsWith("data:") ||
    normalizedValue.startsWith("blob:")
  ) {
    return normalizedValue;
  }
  return `${API_BASE}${normalizePath(normalizedValue)}`;
};
