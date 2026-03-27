import { useEffect, useRef, useCallback } from "react";
import { buildApiUrl } from "./api";

/**
 * SSE stream hook for learntekin-live.
 * Connects to /api/notifications/stream?app=APP and calls onNotification on each event.
 */
export const useNotifStream = (app, onNotification) => {
  const esRef       = useRef(null);
  const timerRef    = useRef(null);
  const retriesRef  = useRef(0);
  const callbackRef = useRef(onNotification);
  callbackRef.current = onNotification;

  const connect = useCallback(() => {
    if (esRef.current) { try { esRef.current.close(); } catch (_) {} }

    const url = buildApiUrl(`/api/notifications/stream?app=${encodeURIComponent(app)}`);
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => { retriesRef.current = 0; };

    es.addEventListener("notification", (e) => {
      try { callbackRef.current?.(JSON.parse(e.data)); } catch (_) {}
    });

    es.onerror = () => {
      try { es.close(); } catch (_) {}
      esRef.current = null;
      const delay = Math.min(1000 * Math.pow(2, retriesRef.current), 30000);
      retriesRef.current = Math.min(retriesRef.current + 1, 5);
      timerRef.current = setTimeout(connect, delay);
    };
  }, [app]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(timerRef.current);
      try { esRef.current?.close(); } catch (_) {}
    };
  }, [connect]);
};
