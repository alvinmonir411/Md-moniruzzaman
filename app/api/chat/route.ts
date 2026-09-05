import { NextRequest } from "next/server";
import { calculateExperience, WIX_JOIN_DATE } from "@/app/lib/experience";

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
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
You are the official AI representative for Moniruzzaman (pexelneststudio.vercel.app), Front-End & Lead Full-Stack Engineer.
Respond warmly, intelligently, and professionally. Speak in first person ("I" representing Moniruzzaman).
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
  * Portfolio / Live Site: https://pexelneststudio.vercel.app
  * Email: alvinmonir411@gmail.com
  * WhatsApp / Phone Call: +8801340571927 (https://wa.me/8801340571927)
  * Facebook: https://www.facebook.com/pexelneststudio/
  * Instagram: https://www.instagram.com/pixelneststudio.official/ (@pixelneststudio.official)
  * GitHub: https://github.com/alvinmonir411
  * LinkedIn: https://www.linkedin.com/in/moniruzzaman13663/
  * Location: Dhaka & Rangpur, Bangladesh
- Hiring Availability: Actively open and ready for Full-Time Front-End / Full-Stack Engineer roles, high-impact contracts, and client projects worldwide.

Guidelines:
- CRITICAL: Always provide COMPLETE answers. Never stop mid-sentence.
- When sharing links or contact, format them as clean, standard markdown links like [GitHub Profile](https://github.com/alvinmonir411) or [LinkedIn](https://www.linkedin.com/in/moniruzzaman13663/) or direct URLs.
- When asked about tech stack, list the complete categories clearly (Front-End, Back-End/DB, Tools).
- Keep answers engaging, crisp, and beautifully formatted with bullet points.
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
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
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

    // 2. Intelligent Local Conversational Engine (Fallback if API key is invalid or offline)
    const lower = prompt.toLowerCase().trim();
    let reply = "";

    if (
      lower.includes("how old") ||
      lower.includes("age") ||
      lower.includes("boyos") ||
      lower.includes("boyosh")
    ) {
      reply = `Moniruzzaman is a young and driven developer in his early 20s (graduating batch 2022–2026), with ${wixExp.formatted} of commercial industry experience at SM Technology and 100+ delivered web applications!`;
    } else if (
      lower.includes("why") && (lower.includes("developer") || lower.includes("coding") || lower.includes("program"))
    ) {
      reply = "Moniruzzaman became a developer out of a deep passion for building things that solve real-world problems. The ability to turn lines of logic and code into interactive, responsive, and beautiful user interfaces that people around the world can use is what drives him every single day!";
    } else if (
      lower.includes("how are you") ||
      lower.includes("kemon achen") ||
      lower.includes("kemon acho") ||
      lower.includes("what's up") ||
      lower.includes("whats up")
    ) {
      reply = "I'm doing great, thank you for asking! 😊 I'm here to answer any questions about Moniruzzaman's engineering stack, projects, work experience, or availability to hire. How can I help you today?";
    } else if (
      lower.startsWith("hi") ||
      lower.startsWith("hello") ||
      lower.startsWith("hey") ||
      lower === "hi" ||
      lower === "hello" ||
      lower.includes("salam")
    ) {
      reply = "Hello there! 👋 Welcome to Moniruzzaman's portfolio. I can answer questions about his Next.js & React stack, 100+ projects, or hiring availability. Feel free to ask me anything!";
    } else if (
      lower.includes("stack") ||
      lower.includes("skill") ||
      lower.includes("technolog") ||
      lower.includes("react") ||
      lower.includes("next")
    ) {
      reply = "Here is Moniruzzaman's core technical toolkit:\n\n• **Front-End:** Next.js 15/16 (App Router), React 19, TypeScript, Tailwind CSS, Redux Toolkit, HTML5/CSS3\n• **Backend & DB:** Node.js, Express.js, PostgreSQL (Neon DB), MongoDB, REST APIs\n• **Tools & DevOps:** Git, GitHub, Firebase, Cloudinary, Vercel, Postman, Figma";
    } else if (
      lower.includes("experience") ||
      lower.includes("sm technology") ||
      lower.includes("wix")
    ) {
      reply = `Moniruzzaman has ${wixExp.formatted} (${wixExp.fullFormatted}) of commercial experience as a Wix & Web Developer at SM Technology, where he built client websites, optimized speed, and created custom workflows.`;
    } else if (
      lower.includes("best project") ||
      lower.includes("project") ||
      lower.includes("portfolio") ||
      lower.includes("built")
    ) {
      reply = "Moniruzzaman has built 100+ web applications, including full-featured LMS platforms, E-Commerce web apps, and modern Next.js systems with secure auth, Stripe checkout, and database pipelines! Check the Projects section to explore them.";
    } else if (
      lower.includes("hire") ||
      lower.includes("available") ||
      lower.includes("contact") ||
      lower.includes("email") ||
      lower.includes("phone")
    ) {
      reply = "Moniruzzaman is actively open for Full-Time Front-End/Full-Stack Roles, contracts, and freelance projects! Reach him directly at alvinmonir411@gmail.com, WhatsApp/Call at +8801340571927, Facebook at facebook.com/pexelneststudio, Instagram @pixelneststudio.official, or LinkedIn at linkedin.com/in/moniruzzaman13663.";
    } else if (
      lower.includes("education") ||
      lower.includes("degree") ||
      lower.includes("college")
    ) {
      reply = "Moniruzzaman is studying Bachelor of Social Science (BSS) at Govt. Begum Rokeya College (2022–2026) with a strong Science background from Cantonment Public School & College, Rangpur.";
    } else {
      reply = `Moniruzzaman is a Front-End & MERN Full-Stack Developer with ${wixExp.formatted} commercial experience and 100+ projects built. Feel free to ask about his technical stack, hire availability, or email him at alvinmonir411@gmail.com!`;
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        reply: "Moniruzzaman is ready to collaborate on your next project! Reach out at alvinmonir411@gmail.com.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
