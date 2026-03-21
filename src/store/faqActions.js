import {
  FETCH_FAQS_REQUEST,
  FETCH_FAQS_SUCCESS,
  FETCH_FAQS_FAILURE,
} from "./actionTypes";
import { db } from "../firebase";

const FAQ_CACHE_KEY = "learntekin_faq_cache_v1";
const FAQ_COLLECTION_CANDIDATES = ["FAQ", "faq", "faqs", "Faq"];
const FAQ_FETCH_TIMEOUT_MS = 7000;

const DEFAULT_FAQS = [
  {
    id: "default-1",
    question: "What is Learn TEK In Fellowship Program?",
    answer:
      "It is a paid training program led by experienced industry experts with practical projects and mentorship.",
  },
  {
    id: "default-2",
    question: "Do you provide internship opportunities?",
    answer:
      "Yes. Internship opportunities are available across web development, app development, testing, and data domains.",
  },
  {
    id: "default-3",
    question: "How can I contact Learn TEK In?",
    answer:
      "You can use the Contact page form or reach us via the phone and email details shown on the website.",
  },
  {
    id: "default-4",
    question: "Is there placement support?",
    answer:
      "Yes. Placement assistance is provided, while final selection depends on candidate performance and hiring criteria.",
  },
];

const normalizeFaq = (id, data = {}) => {
  const question =
    data.question ??
    data.Question ??
    data.title ??
    data.Title ??
    data.q ??
    "";
  const answer =
    data.answer ??
    data.Answer ??
    data.description ??
    data.Description ??
    data.a ??
    "";

  return {
    id,
    question: String(question || "").trim(),
    answer: String(answer || "").trim(),
    raw: data,
  };
};

const withTimeout = (promise, timeoutMs, message) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => {
        reject(new Error(message));
      }, timeoutMs);
    }),
  ]);
};

const loadFaqsFromFirestore = async () => {
  for (const collectionName of FAQ_COLLECTION_CANDIDATES) {
    try {
      const snapshot = await withTimeout(
        db.collection(collectionName).get(),
        FAQ_FETCH_TIMEOUT_MS,
        `FAQ fetch timed out for collection "${collectionName}"`
      );
      if (!snapshot.empty) {
        const normalized = snapshot.docs
          .map((doc) => normalizeFaq(doc.id, doc.data()))
          .filter(
            (faq) => faq.question || faq.answer || Object.keys(faq.raw).length > 0
          );

        return normalized;
      }
    } catch {
      // Try the next collection candidate.
    }
  }

  return [];
};

const readFaqCache = () => {
  try {
    const cached = localStorage.getItem(FAQ_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeFaqCache = (faqs) => {
  try {
    localStorage.setItem(FAQ_CACHE_KEY, JSON.stringify(faqs));
  } catch {
    // Ignore localStorage write failures.
  }
};

export const fetchFaqs = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_FAQS_REQUEST });

    try {
      const faqs = await loadFaqsFromFirestore();
      const resolvedFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS;
      writeFaqCache(resolvedFaqs);
      dispatch({ type: FETCH_FAQS_SUCCESS, payload: resolvedFaqs });
    } catch (error) {
      const cachedFaqs = readFaqCache();
      const fallbackFaqs =
        cachedFaqs && cachedFaqs.length > 0 ? cachedFaqs : DEFAULT_FAQS;

      dispatch({
        type: FETCH_FAQS_SUCCESS,
        payload: fallbackFaqs,
      });

      dispatch({
        type: FETCH_FAQS_FAILURE,
        error:
          cachedFaqs && cachedFaqs.length > 0
            ? "Live FAQ data could not be loaded. Showing your previously loaded content."
            : "Live FAQ data could not be loaded. Showing default FAQs.",
      });
    }
  };
};
