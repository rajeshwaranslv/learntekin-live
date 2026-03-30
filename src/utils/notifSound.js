const HIGH = new Set([
  "certificate_new",
  "internship_certificate_issued",
  "internship_certificate_sent",
  "internship_certificate_ready",
]);

const MEDIUM = new Set([
  "internship_application_submitted",
  "internship_applied",
  "internship_status_updated",
  "charity_created",
  "charity_updated",
  "contact_new",
  "career_applied",
  "blog_comment",
  "blog_post",
  "faq_updated",
  "eseva_booking",
]);

const LOW = new Set([
  "charity_deleted",
  "contact_deleted",
]);

let sharedAudioContext = null;

const getAudioContext = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return null;
  }

  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new AudioCtx();
  }

  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume().catch(() => {
      // Ignore resume failures. Browsers may still require user interaction.
    });
  }

  return sharedAudioContext;
};

const normalizeType = (type) => String(type || "").trim().toLowerCase();

const getSoundTier = (type) => {
  const normalizedType = normalizeType(type);

  if (!normalizedType) {
    return "low";
  }

  if (HIGH.has(normalizedType) || normalizedType.includes("certificate")) {
    return "high";
  }

  if (LOW.has(normalizedType) || normalizedType.endsWith("_deleted")) {
    return "low";
  }

  if (
    MEDIUM.has(normalizedType) ||
    normalizedType.startsWith("internship_") ||
    normalizedType.startsWith("charity_") ||
    normalizedType.startsWith("contact_") ||
    normalizedType.startsWith("career_") ||
    normalizedType.startsWith("blog_") ||
    normalizedType.startsWith("faq_") ||
    normalizedType.startsWith("eseva_")
  ) {
    return "medium";
  }

  return "low";
};

const scheduleTone = (ctx, { freq, start, dur, vol = 0.22, type = "sine" }) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(vol, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

  osc.start(start);
  osc.stop(start + dur);
};

const SOUND_PATTERNS = {
  high: [
    { freq: 523.25, offset: 0, dur: 0.22, vol: 0.28, type: "triangle" },
    { freq: 659.25, offset: 0.12, dur: 0.22, vol: 0.24, type: "triangle" },
    { freq: 783.99, offset: 0.24, dur: 0.3, vol: 0.22, type: "triangle" },
  ],
  medium: [
    { freq: 880, offset: 0, dur: 0.16, vol: 0.22, type: "sine" },
    { freq: 660, offset: 0.11, dur: 0.2, vol: 0.18, type: "sine" },
  ],
  low: [
    { freq: 550, offset: 0, dur: 0.15, vol: 0.16, type: "sine" },
  ],
};

export const playNotifSound = (type) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    const tier = getSoundTier(type);
    const now = ctx.currentTime;

    SOUND_PATTERNS[tier].forEach((note) => {
      scheduleTone(ctx, {
        freq: note.freq,
        start: now + note.offset,
        dur: note.dur,
        vol: note.vol,
        type: note.type,
      });
    });
  } catch (_) {
    // Ignored: AudioContext may not be available
  }
};
