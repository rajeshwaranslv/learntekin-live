import { API_BASE } from "./api";

let wakeupPromise = null;
let wakeupDone = false;

/**
 * Ping the backend to wake it up from Render.com free-tier spin-down.
 * Called once at app startup. Subsequent calls return the same promise.
 *
 * @param {object} [options]
 * @param {number} [options.retries=4]       - Number of ping attempts
 * @param {number} [options.baseDelayMs=4000] - Base delay between retries (ms)
 * @param {number} [options.timeoutMs=15000]  - Per-request timeout (ms)
 * @returns {Promise<boolean>} - true if backend responded, false otherwise
 */
export const wakeupBackend = (options = {}) => {
  if (wakeupDone) return Promise.resolve(true);
  if (wakeupPromise) return wakeupPromise;

  const { retries = 4, baseDelayMs = 4000, timeoutMs = 15000 } = options;

  const ping = async (attempt) => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(`${API_BASE}/`, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timer);
      if (res.ok) {
        wakeupDone = true;
        console.log("[wakeup] Backend is online.");
        return true;
      }
    } catch {
      // timeout or network error — expected during cold start
    }

    if (attempt < retries) {
      const delay = baseDelayMs * Math.pow(1.5, attempt);
      console.log(`[wakeup] Backend not ready yet, retrying in ${Math.round(delay / 1000)}s... (attempt ${attempt + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delay));
      return ping(attempt + 1);
    }

    console.warn("[wakeup] Backend did not respond after all retries.");
    return false;
  };

  wakeupPromise = ping(0);
  return wakeupPromise;
};

/**
 * Call this once in main.jsx / App startup.
 * Fires in background — does NOT block app rendering.
 */
export const startBackendWakeup = () => {
  if (import.meta.env.PROD) {
    wakeupBackend().catch(() => {});
  }
};
