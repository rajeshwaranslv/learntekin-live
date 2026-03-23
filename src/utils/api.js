const DEFAULT_API_BASE = "https://lte-node.onrender.com";

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE)
  .trim()
  .replace(/\/$/, "");

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};
