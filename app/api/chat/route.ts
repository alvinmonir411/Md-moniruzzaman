import { NextRequest } from "next/server";
import { calculateExperience, WIX_JOIN_DATE } from "@/app/lib/experience";

const GEMINI_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

export async function POST(request: NextRequest) {
  try {
    const { prompt, history } = await request.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const wixExp = calculateExperience(WIX_JOIN_DATE);

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_API_SERECT ||
      "";

    const systemInstruction = `
You are the official AI representative for Moniruzzaman (https://moniruzzaman-dev.vercel.app), Front-End & Lead Full-Stack Engineer.
Respond warmly, intelligently, and professionally. Speak in first person ("I" representing Moniruzzaman or his AI representative).
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

Guidelines:
- CRITICAL: Always provide COMPLETE, relevant answers. Never stop mid-sentence.
- Answer specifically what the user asked.
- Keep answers engaging, crisp, and beautifully formatted with bullet points and markdown.
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
                  temperature: 0.7,
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
    const lower = prompt.toLowerCase().trim().replace(/[^a-z0-9\s]/g, " ");
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
      lower.includes("about yourself")
    ) {
      reply = "👋 Hi there! I am the official AI assistant for **Moniruzzaman**.\n\nMoniruzzaman is a **Front-End & MERN Full-Stack Engineer** specializing in Next.js 16, React 19, TypeScript, and modern scalable web architecture. I am here to help answer any questions about his technical skills, projects, commercial experience, or discuss hiring opportunities!";
    }
    // B. Technologies / Skills / Stacks (typo-tolerant)
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
      lower.includes("javascript")
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
      lower.includes("wix")
    ) {
      reply = `💼 **Moniruzzaman's Commercial Experience:**\n\n• **Role:** Wix & Front-End Web Developer at **SM Technology**\n• **Duration:** ${wixExp.formatted} (${wixExp.fullFormatted}) — since March 29, 2025\n• **Impact:** Built bespoke client websites, engineered dynamic workflows, optimized page speeds, and delivered production systems with 100% client satisfaction.`;
    }
    // D. Projects
    else if (
      lower.includes("project") ||
      lower.includes("portfolio") ||
      lower.includes("built") ||
      lower.includes("app") ||
      lower.includes("website")
    ) {
      reply = "🚀 **Moniruzzaman has shipped 100+ production-grade web applications**, including:\n\n1. **Full-Stack SaaS & LMS Platforms** with role-based access control and payment integrations.\n2. **E-Commerce Web Apps** featuring real-time carts, product filters, and secure checkouts.\n3. **Modern Portfolios & Corporate Portals** with dynamic CMS and serverless database sync.\n\nCheck out the **Projects** section on this site to explore live demos and source code!";
    }
    // E. Why Hire / Value Proposition
    else if (
      lower.includes("why") &&
      (lower.includes("hire") || lower.includes("choose") || lower.includes("select"))
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
      lower.includes("call")
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
      lower.includes("good evening")
    ) {
      reply = "Hello there! 👋 Welcome to Moniruzzaman's portfolio. How can I assist you today? You can ask me about his tech stack, 100+ projects, commercial experience, or hiring availability!";
    }
    // H. How are you
    else if (
      lower.includes("how are you") ||
      lower.includes("kemon achen") ||
      lower.includes("kemon acho") ||
      lower.includes("what up") ||
      lower.includes("whats up")
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
      lower.includes("university")
    ) {
      reply = "🎓 **Education & Academic Background:**\n\n• **Bachelor of Social Science (BSS):** Govt. Begum Rokeya College (2022–2026)\n• **Science Background (HSC & SSC):** Cantonment Public School & College, Rangpur\n• **Continuous Learning:** Self-driven research into modern software engineering, distributed systems, and AI integrations.";
    }
    // J. General default
    else {
      reply = `Moniruzzaman is a **Front-End & MERN Full-Stack Engineer** with ${wixExp.formatted} commercial experience and 100+ projects shipped. You can ask me about his **tech stack**, **projects**, **commercial experience**, or get in touch directly at **alvinmonir411@gmail.com**!`;
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
