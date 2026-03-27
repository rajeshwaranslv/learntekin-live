const HIGH = new Set([
  "certificate_new", "internship_certificate_issued",
  "internship_certificate_sent", "internship_certificate_ready",
]);
const MEDIUM = new Set([
  "internship_application_submitted", "internship_status_updated",
  "charity_created",
]);

const getSoundTier = (type) => {
  if (HIGH.has(type)) return "high";
  if (MEDIUM.has(type)) return "medium";
  return "low";
};

export const playNotifSound = (type) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const t = ctx.currentTime;

    const note = (freq, start, dur, vol = 0.25) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.start(start);
      osc.stop(start + dur);
    };

    const tier = getSoundTier(type);
    if (tier === "high") {
      note(523.25, t,        0.25, 0.30);
      note(659.25, t + 0.12, 0.25, 0.27);
      note(783.99, t + 0.24, 0.32, 0.24);
      setTimeout(() => { try { ctx.close(); } catch (_) {} }, 800);
    } else if (tier === "medium") {
      note(880, t,        0.18, 0.25);
      note(660, t + 0.12, 0.22, 0.20);
      setTimeout(() => { try { ctx.close(); } catch (_) {} }, 600);
    } else {
      note(550, t, 0.15, 0.18);
      setTimeout(() => { try { ctx.close(); } catch (_) {} }, 400);
    }
  } catch (_) {}
};
