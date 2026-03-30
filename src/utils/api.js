const DEFAULT_API_BASE = "https://lte-node-production.up.railway.app";
const LEGACY_API_BASE = "https://lte-node.onrender.com";

export const normalizeApiBase = (value, fallback = DEFAULT_API_BASE) => {
  const rawValue = String(value || "").trim() || fallback;
  const withProtocol = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : `https://${rawValue}`;
  return withProtocol.replace(/\/$/, "");
};

const normalizePath = (path = "") =>
  path.startsWith("/") ? path : `/${path}`;

export const API_BASE = normalizeApiBase(
  import.meta.env.VITE_API_BASE_URL,
  DEFAULT_API_BASE
);

export const API_FALLBACK_BASE = normalizeApiBase(LEGACY_API_BASE);

export const buildApiUrl = (path = "") =>
  `${API_BASE}${normalizePath(path)}`;

export const buildWebSocketUrl = (path = "") =>
  buildApiUrl(path).replace(/^http/i, "ws");

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
