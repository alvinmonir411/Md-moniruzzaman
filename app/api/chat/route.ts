import { NextRequest } from "next/server";
import { calculateExperience, WIX_JOIN_DATE } from "@/app/lib/experience";

const GEMINI_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

// In-memory sliding window rate limiter: Max 5 requests per 1 minute (60 seconds)
interface RateLimitEntry {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 5; // 5 requests max

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { timestamps: [] };

  // Retain only requests that occurred within the last 60 seconds
  const activeTimestamps = entry.timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (activeTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    const oldestTimestamp = activeTimestamps[0];
    const retryAfter = Math.ceil(
      (oldestTimestamp + RATE_LIMIT_WINDOW_MS - now) / 1000
    );
    rateLimitMap.set(ip, { timestamps: activeTimestamps });
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, { timestamps: activeTimestamps });

  // Cleanup old records to prevent memory leak
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      const filtered = val.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (filtered.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, { timestamps: filtered });
      }
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, history } = await request.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Valid prompt string is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Security Layer 1: Max Input Length (500 characters) to prevent token exhaustion
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length > 500) {
      return new Response(
        JSON.stringify({
          reply: "⚠️ Your message is too long (maximum 500 characters allowed). Please shorten your question.\n\nআপনার মেসেজটি ৫০০ অক্ষরের বেশি। অনুগ্রহ করে সংক্ষিপ্ত প্রশ্ন করুন।",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Security Layer 2: Prompt Injection / Jailbreak Guard
    const lowerRaw = trimmedPrompt.toLowerCase();
    const injectionPatterns = [
      "ignore all previous",
      "ignore previous instructions",
      "disregard all previous",
      "system override",
      "developer mode",
      "you are now dan",
      "jailbreak",
      "reveal your system prompt",
      "print your instructions",
      "show your initial prompt",
      "api_key",
      "gemini_api_key",
      "database_url",
    ];

    if (injectionPatterns.some((pattern) => lowerRaw.includes(pattern))) {
      return new Response(
        JSON.stringify({
          reply: "🛡️ I am strictly configured to assist with **Moniruzzaman's portfolio**, projects, skills, and hiring inquiries. System overrides are not permitted.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Security Layer 3: Client IP Rate Limiting (5 requests / 1 minute)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "client-default-ip";

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          reply: `⏳ **Rate limit exceeded:** You can send a maximum of 5 messages per 1 minute. Please wait ${rateLimit.retryAfterSeconds} seconds before sending another question.\n\nআপনি প্রতি মিনিটে সর্বোচ্চ ৫টি মেসেজ পাঠাতে পারবেন। অনুগ্রহ করে ${rateLimit.retryAfterSeconds} সেকেন্ড অপেক্ষা করুন।`,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const wixExp = calculateExperience(WIX_JOIN_DATE);

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_API_SERECT ||
      "";

    const systemInstruction = `
You are the official AI representative for Moniruzzaman (https://moniruzzaman-dev.vercel.app), Front-End & Full-Stack Engineer.
Respond warmly, intelligently, and professionally. Speak in first person ("I" representing Moniruzzaman or his official portfolio AI).
You can understand and reply in English, Bengali (বাংলা), or Banglish based on what the user speaks.

Moniruzzaman's Profile:
- Name: Moniruzzaman
- Professional Title: Front-End & MERN Full-Stack Engineer
- Industry Experience: ${wixExp.formatted} (${wixExp.fullFormatted}) as Wix & Front-End Developer at SM Technology (joined March 29, 2025).
- Projects Shipped: 100+ production-grade web applications, SaaS platforms, and client websites worldwide.
- Core Technical Stack:
  * Front-End: Next.js 15/16 (App Router), React 19, TypeScript, Tailwind CSS, Redux Toolkit, Zustand, HTML5, CSS3.
  * Back-End & Databases: Node.js, Express.js, PostgreSQL (Neon DB), MongoDB (Mongoose), REST APIs.
  * Tools & Services: Git, GitHub, Firebase Auth, Cloudinary, Vercel, Postman, Figma.
- Motivation / Passion: Loves turning complex ideas into ultra-fast, accessible, and pixel-perfect interactive web experiences. Enjoys problem solving and clean architecture.
- Education: Bachelor of Social Science (BSS) at Govt. Begum Rokeya College (2022–2026), Science background from Cantonment Public School & College, Rangpur.
- Contact Details:
  * Portfolio / Live Site: https://moniruzzaman-dev.vercel.app
  * Email: alvinmonir411@gmail.com
  * WhatsApp / Phone Call: +8801340571927 (https://wa.me/8801340571927)
  * Facebook: https://www.facebook.com/pexelneststudio/
  * Instagram: https://www.instagram.com/pixelneststudio.official/ (@pixelneststudio.official)
  * GitHub: https://github.com/alvinmonir411
  * LinkedIn: https://www.linkedin.com/in/moniruzzaman13663/
  * Location: Dhaka & Rangpur, Bangladesh
- Hiring Availability: Actively open and ready for Full-Time Front-End / Full-Stack Engineer roles, high-impact contracts, and client projects worldwide.

STRICT TOPIC RESTRICTION & GUARDRAILS (MANDATORY POLICY):
- You are STRICTLY AND EXCLUSIVELY an AI portfolio assistant for Moniruzzaman.
- You are ONLY permitted to answer questions directly related to:
  1. Moniruzzaman (his identity, background, education, location, bio)
  2. His technical skills & stack (React, Next.js, TypeScript, Tailwind, MERN, Node, Neon DB, etc.)
  3. His projects, web applications, portfolio works, and architecture
  4. His commercial work experience at SM Technology (Wix/Web Developer)
  5. Hiring him, contracts, freelance work, rates, availability, collaboration
  6. His contact details (email, WhatsApp, LinkedIn, GitHub, etc.)
  7. Inquiries about building a website or project with him
- UNRELATED QUESTIONS (MUST BE POLITELY DECLINED):
  - If the user asks about ANYTHING outside Moniruzzaman's portfolio (e.g. general knowledge, math calculations, essays, recipes, news, politics, weather, sports, movies, science, medicine, general coding homework not related to Moniruzzaman's work, general AI prompts), YOU MUST POLITELY REFUSE TO ANSWER.
  - Decline politely and guide them back to Moniruzzaman's portfolio.
  - In English example: "I specialize exclusively in answering questions about Moniruzzaman, his web development projects, tech stack, and hiring availability. Feel free to ask about his work or get in touch with him!"
  - In Bengali example: "আমি শুধুমাত্র মনিরুজ্জামান, তার টেক স্ট্যাক, প্রজেক্ট, কাজের অভিজ্ঞতা এবং তাকে হায়ার/যোগাযোগ সম্পর্কিত প্রশ্নের উত্তর দিতে পারি। মনিরুজ্জামানের কাজ বা পোর্টফোলিও সংক্রান্ত যেকোনো প্রশ্ন আমাকে করতে পারেন!"
`;

    // 1. Try Calling Google Gemini API with model fallback
    if (apiKey) {
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const msg of history.slice(-6)) {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: prompt }],
      });

      for (const modelName of GEMINI_MODELS) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 9000);

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: controller.signal,
              body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: systemInstruction }] },
                generationConfig: {
                  maxOutputTokens: 1000,
                  temperature: 0.3,
                },
              }),
            }
          );
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply && reply.trim()) {
              return new Response(JSON.stringify({ reply: reply.trim() }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }
          }
        } catch (modelError) {
          console.warn(`Gemini model ${modelName} failed, trying next fallback:`, modelError);
        }
      }
    }

    // 2. Intelligent Local Conversational Engine (Fallback if offline or API quota exceeded)
    const lower = prompt.toLowerCase().trim().replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ");
    let reply = "";

    // A. Identity / Who are you
    if (
      lower.includes("who you are") ||
      lower.includes("who are you") ||
      lower.includes("who r u") ||
      lower.includes("tumi ke") ||
      lower.includes("apni ke") ||
      lower.includes("your name") ||
      lower.includes("introduce") ||
      lower.includes("about yourself") ||
      lower.includes("তুমি কে") ||
      lower.includes("আপনি কে") ||
      lower.includes("তোমার নাম") ||
      lower.includes("আপনার নাম") ||
      lower.includes("পরিচয়") ||
      lower.includes("পরিচয়")
    ) {
      reply = "👋 Hi there! I am the official AI assistant for **Moniruzzaman**.\n\nMoniruzzaman is a **Front-End & MERN Full-Stack Engineer** specializing in Next.js 16, React 19, TypeScript, and modern scalable web architecture. I am here to help answer any questions about his technical skills, projects, commercial experience, or discuss hiring opportunities!";
    }
    // B. Technologies / Skills / Stacks (typo-tolerant & multilingual)
    else if (
      lower.includes("technol") ||
      lower.includes("tech") ||
      lower.includes("skill") ||
      lower.includes("stack") ||
      lower.includes("know") ||
      lower.includes("language") ||
      lower.includes("framework") ||
      lower.includes("tool") ||
      lower.includes("react") ||
      lower.includes("next") ||
      lower.includes("typescript") ||
      lower.includes("javascript") ||
      lower.includes("টেকনোলজি") ||
      lower.includes("দক্ষতা") ||
      lower.includes("কি কাজ") ||
      lower.includes("কী কাজ") ||
      lower.includes("কি পারেন") ||
      lower.includes("কী পারেন") ||
      lower.includes("কোন টেকনোলজি")
    ) {
      reply = "Here is **Moniruzzaman's** complete technical stack & toolkit:\n\n• 🌐 **Front-End:** Next.js 15/16 (App Router), React 19, TypeScript, Tailwind CSS, Redux Toolkit, Zustand, HTML5, CSS3\n• ⚡ **Back-End & APIs:** Node.js, Express.js, RESTful APIs, Server Actions\n• 🗄️ **Databases:** PostgreSQL (Neon Serverless DB), MongoDB (Mongoose)\n• 🛠️ **DevOps & Cloud:** Git, GitHub, Vercel, Firebase Auth, Cloudinary, Postman, Figma\n\nEvery solution is built with strict TypeScript typing, 100% responsive UI, and optimized Lighthouse scores!";
    }
    // C. Experience / Work History
    else if (
      lower.includes("experience") ||
      lower.includes("work") ||
      lower.includes("job") ||
      lower.includes("company") ||
      lower.includes("sm technology") ||
      lower.includes("wix") ||
      lower.includes("অভিজ্ঞতা") ||
      lower.includes("চাকরি") ||
      lower.includes("কাজের অভিজ্ঞতা")
    ) {
      reply = `💼 **Moniruzzaman's Commercial Experience:**\n\n• **Role:** Wix & Front-End Web Developer at **SM Technology**\n• **Duration:** ${wixExp.formatted} (${wixExp.fullFormatted}) — since March 29, 2025\n• **Impact:** Built bespoke client websites, engineered dynamic workflows, optimized page speeds, and delivered production systems with 100% client satisfaction.`;
    }
    // D. Projects
    else if (
      lower.includes("project") ||
      lower.includes("portfolio") ||
      lower.includes("built") ||
      lower.includes("app") ||
      lower.includes("website") ||
      lower.includes("প্রজেক্ট") ||
      lower.includes("কাজ করেছেন")
    ) {
      reply = "🚀 **Moniruzzaman has shipped 100+ production-grade web applications**, including:\n\n1. **Full-Stack SaaS & LMS Platforms** with role-based access control and payment integrations.\n2. **E-Commerce Web Apps** featuring real-time carts, product filters, and secure checkouts.\n3. **Modern Portfolios & Corporate Portals** with dynamic CMS and serverless database sync.\n\nCheck out the **Projects** section on this site to explore live demos and source code!";
    }
    // E. Why Hire / Value Proposition
    else if (
      (lower.includes("why") &&
        (lower.includes("hire") || lower.includes("choose") || lower.includes("select"))) ||
      lower.includes("কেন হায়ার") ||
      lower.includes("কেন নিব")
    ) {
      reply = "⚡ **Why Hire Moniruzzaman?**\n\n1. **High Agency & Fast Execution:** Delivers clean, production-ready code quickly without cutting corners on quality.\n2. **Modern Stack Mastery:** Deep proficiency in Next.js 16, React 19, TypeScript, and serverless databases.\n3. **Pixel-Perfect & Accessible:** Obsessive attention to UI/UX design, micro-animations, and responsiveness.\n4. **End-to-End Problem Solver:** Comfortable working across full-stack architecture from UI to database design.";
    }
    // F. Hire / Contact / Availability
    else if (
      lower.includes("hire") ||
      lower.includes("contact") ||
      lower.includes("email") ||
      lower.includes("phone") ||
      lower.includes("whatsapp") ||
      lower.includes("available") ||
      lower.includes("reach") ||
      lower.includes("call") ||
      lower.includes("যোগাযোগ") ||
      lower.includes("হায়ার") ||
      lower.includes("ফোন") ||
      lower.includes("ইমেইল")
    ) {
      reply = "📬 **Moniruzzaman is actively open for Full-Time Front-End & Full-Stack roles, contracts, and freelance projects!**\n\n• 📧 **Email:** [alvinmonir411@gmail.com](mailto:alvinmonir411@gmail.com)\n• 📱 **WhatsApp / Call:** [+8801340571927](https://wa.me/8801340571927)\n• 💼 **LinkedIn:** [linkedin.com/in/moniruzzaman13663](https://www.linkedin.com/in/moniruzzaman13663/)\n• 🐙 **GitHub:** [github.com/alvinmonir411](https://github.com/alvinmonir411)\n• 🌐 **Facebook:** [facebook.com/pexelneststudio](https://www.facebook.com/pexelneststudio/)";
    }
    // G. Greetings
    else if (
      lower.startsWith("hi") ||
      lower.startsWith("hello") ||
      lower.startsWith("hey") ||
      lower.includes("salam") ||
      lower.includes("good morning") ||
      lower.includes("good evening") ||
      lower.includes("সালাম") ||
      lower.includes("হ্যালো") ||
      lower.includes("হাই")
    ) {
      reply = "Hello there! 👋 Welcome to Moniruzzaman's portfolio. How can I assist you today? You can ask me about his tech stack, 100+ projects, commercial experience, or hiring availability!";
    }
    // H. How are you
    else if (
      lower.includes("how are you") ||
      lower.includes("kemon achen") ||
      lower.includes("kemon acho") ||
      lower.includes("what up") ||
      lower.includes("whats up") ||
      lower.includes("কেমন আছেন") ||
      lower.includes("কেমন আছো")
    ) {
      reply = "I'm doing great, thank you for asking! 😊 I'm ready to answer any questions you have about Moniruzzaman's skills, experience, or upcoming projects. What would you like to know?";
    }
    // I. Education
    else if (
      lower.includes("education") ||
      lower.includes("degree") ||
      lower.includes("college") ||
      lower.includes("study") ||
      lower.includes("school") ||
      lower.includes("university") ||
      lower.includes("পড়াশোনা") ||
      lower.includes("পড়াশোনা") ||
      lower.includes("কলেজ")
    ) {
      reply = "🎓 **Education & Academic Background:**\n\n• **Bachelor of Social Science (BSS):** Govt. Begum Rokeya College (2022–2026)\n• **Science Background (HSC & SSC):** Cantonment Public School & College, Rangpur\n• **Continuous Learning:** Self-driven research into modern software engineering, distributed systems, and AI integrations.";
    }
    // J. Unrelated query rejection (Strict Boundary)
    else {
      reply = "I specialize exclusively in answering questions about **Moniruzzaman**, his technical stack, web development projects, commercial experience, and hiring availability. Feel free to ask about his work or reach him directly at **alvinmonir411@gmail.com**!\n\nআমি শুধুমাত্র মনিরুজ্জামান, তার টেক স্ট্যাক, প্রজেক্ট, কাজের অভিজ্ঞতা ও যোগাযোগ সম্পর্কিত প্রশ্নের উত্তর দিতে পারি।";
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        reply: "Moniruzzaman is ready to collaborate on your next project! Reach out at alvinmonir411@gmail.com or WhatsApp +8801340571927.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
