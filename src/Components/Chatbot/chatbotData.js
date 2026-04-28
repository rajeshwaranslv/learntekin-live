const WELCOME_MESSAGE = "Hi there! I'm the Learn TEK In Assistant. How can I help you today?";

const FALLBACK_MESSAGE =
  "I'm not sure about that. You can reach our team directly on the Contact page for more help!";

const QUICK_REPLIES = [
  { label: "Courses", key: "courses" },
  { label: "PC Building", key: "pcbuild" },
  { label: "ESeva", key: "eseva" },
  { label: "Internships", key: "internships" },
  { label: "Placements", key: "placements" },
  { label: "Contact", key: "contact" },
];

const FAQ_ENTRIES = [
  // ── Courses / LMS ──
  {
    keywords: ["course", "courses", "lms", "learn", "class", "program"],
    answer:
      "We offer courses in MERN Full-Stack, Python, Data Science, UI/UX Design, Digital Marketing, and more. Visit our LMS page to browse all courses and enroll!",
    link: "/Products/lms",
  },
  {
    keywords: ["free", "free course", "no cost"],
    answer:
      "Yes! We have free courses like Digital Marketing & SEO. Check our LMS page and filter by 'Free' to see all free options.",
    link: "/Products/lms",
  },
  {
    keywords: ["price", "cost", "fee", "pricing", "how much"],
    answer:
      "Course prices range from FREE to INR 6,999 depending on the level and content. Each course page shows the exact price. We also run seasonal discounts!",
    link: "/Products/lms",
  },
  {
    keywords: ["enroll", "register", "join", "sign up", "signup"],
    answer:
      "To enroll, visit the course page, click 'Enroll Now', and fill in your details. For paid courses, you'll be guided through payment after enrollment.",
    link: "/Products/lms",
  },
  {
    keywords: ["certificate", "certification"],
    answer:
      "Yes, you receive a digital certificate upon completing a course or internship. Certificates include a unique ID for verification.",
  },

  // ── PC Building ──
  {
    keywords: ["pc", "computer", "build", "pc build", "pc factory", "desktop", "gaming pc"],
    answer:
      "Our PC Factory lets you build a custom PC! Choose from CPUs, GPUs, RAM, storage, motherboards, cabinets, and PSUs. We check compatibility automatically and deliver to your door.",
    link: "/Products/pc-factory",
  },
  {
    keywords: ["gpu", "graphics", "rtx", "nvidia", "amd radeon"],
    answer:
      "We stock NVIDIA RTX 4060, 4060 Ti, 4070, and AMD RX 7600 GPUs. All at competitive Indian market prices. Check them out in PC Factory!",
    link: "/Products/pc-factory",
  },
  {
    keywords: ["compatible", "compatibility", "fit", "socket"],
    answer:
      "Our PC Builder automatically checks CPU-motherboard socket, RAM type, form factor, and PSU wattage compatibility. You'll see warnings if something doesn't match!",
    link: "/Products/pc-factory",
  },

  // ── ESeva ──
  {
    keywords: ["eseva", "e-seva", "digital service", "government", "aadhar", "pan", "ration"],
    answer:
      "Our eSeva centre offers digital services like Aadhaar updates, PAN card applications, ration card services, passport assistance, and more. Book a slot online!",
    link: "/eseva",
  },

  // ── Internships ──
  {
    keywords: ["internship", "intern", "training", "experience"],
    answer:
      "We offer internships in Web Development, Python, Data Science, UI/UX, and more. Internships include real projects, mentorship, and a certificate on completion.",
    link: "/internships",
  },
  {
    keywords: ["stipend", "paid intern"],
    answer:
      "Some of our internships are paid while others are learning-focused with certificates. Check the Internships page for details on each posting.",
    link: "/internships",
  },

  // ── Placements ──
  {
    keywords: ["placement", "job", "hire", "hiring", "career", "placed"],
    answer:
      "We have a strong placement track record! Our learners have been placed at top companies. Visit the Careers page or check our placement stats on the homepage.",
    link: "/Careers",
  },

  // ── Contact / General ──
  {
    keywords: ["contact", "reach", "phone", "email", "address", "location"],
    answer:
      "You can reach us via the Contact page. We're available by email, phone, and at our office. We typically respond within 24 hours!",
    link: "/Contact",
  },
  {
    keywords: ["about", "who", "company", "learn tek in", "learntekin"],
    answer:
      "Learn TEK In is an ed-tech platform offering courses, internships, PC building, and digital services. We're focused on making technology education accessible to everyone.",
    link: "/About",
  },
  {
    keywords: ["blog", "article", "read"],
    answer:
      "Check out our Blogs section for tech articles, tutorials, career tips, and industry insights written by our team.",
    link: "/Blogs",
  },
  {
    keywords: ["library", "resource", "material", "download"],
    answer:
      "Our Library has curated learning resources, reference materials, and downloadable content to supplement your courses.",
    link: "/Products/library",
  },
  {
    keywords: ["youtube", "video", "promo"],
    answer:
      "We offer YouTube promotion services for creators and businesses. Check our Services page for details and pricing!",
    link: "/Services/youtube-promo",
  },
  {
    keywords: ["hi", "hello", "hey", "good morning", "good evening"],
    answer: "Hello! Welcome to Learn TEK In. How can I help you today? Pick a topic below or type your question!",
  },
  {
    keywords: ["thanks", "thank you", "bye", "goodbye"],
    answer: "You're welcome! Feel free to come back anytime. Have a great day!",
  },
];

/**
 * Find the best matching FAQ entry for user input.
 */
export function findAnswer(input) {
  const lower = input.toLowerCase().trim();
  let best = null;
  let bestScore = 0;

  for (const entry of FAQ_ENTRIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return best || null;
}

/**
 * Get answer for a quick-reply key.
 */
export function getQuickReplyAnswer(key) {
  const map = {
    courses: FAQ_ENTRIES.find((e) => e.keywords.includes("course")),
    pcbuild: FAQ_ENTRIES.find((e) => e.keywords.includes("pc")),
    eseva: FAQ_ENTRIES.find((e) => e.keywords.includes("eseva")),
    internships: FAQ_ENTRIES.find((e) => e.keywords.includes("internship")),
    placements: FAQ_ENTRIES.find((e) => e.keywords.includes("placement")),
    contact: FAQ_ENTRIES.find((e) => e.keywords.includes("contact")),
  };
  return map[key] || null;
}

export { WELCOME_MESSAGE, FALLBACK_MESSAGE, QUICK_REPLIES, FAQ_ENTRIES };
