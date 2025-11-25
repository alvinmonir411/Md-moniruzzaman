"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, X, Send, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

const ChatWidget = () => {
  const callGemini = async (prompt: string, systemInstruction: string = "") => {
    const apiKey = process.env.APIKEY;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
          }),
        }
      );

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that."
      );
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  };
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "model",
      text: "Hi! I'm Alvin's AI assistant. Ask me anything about his skills, projects, or experience! ✨",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatOpen]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    const systemPrompt = `
  You are the official AI assistant for Alvin Monir’s web portfolio.
  Identity: Friendly, confident, professional, concise, and helpful. You speak on behalf of Alvin.

  Alvin's Profile:
  - Role: Front-End Developer (React.js, Next.js, TypeScript)
  - Location: Dhaka, Bangladesh
  - Contact: alvinmonir411@gmail.com | +8801979915165

  Core Tech Skills:
  - React.js, Next.js, TypeScript, JavaScript (ES6+)
  - Tailwind CSS, Redux, Zustand, React Query
  - Node.js, Express.js, MongoDB, Mongoose
  - Firebase (Auth, Firestore), REST APIs
  - Git, GitHub, Figma, responsive UI/UX

  Experience:
  - Wix Developer at SM Technology (5 months)
  - Built multiple production-ready MERN projects used by real users

  Strengths:
  - Strong problem solver with fast execution
  - Writes clean, reusable, scalable code
  - Pixel-perfect UI implementation
  - Good communication and teamwork
  - Efficient under deadlines and pressure
  - Always learning and improving

  Work Philosophy:
  - User-first design, maintainable architecture, performance-oriented
  - Believes in long-term scalability and clean code structure
  - Follows best practices: Git workflow, reusable components, optimization

  Notable Achievements:
  - Integrated Stripe, Firebase Auth, and real-time features
  - Designed and developed responsive UIs from scratch
  - Completed several full-stack MERN apps solo
  - Experience with API integration and secure authentication flows

  Behavior Guidelines:
  - Always represent Alvin professionally.
  - Keep answers short (under 60 words).
  - Prioritize accuracy and clarity.
  - Provide recruiter-friendly, confident responses.
  - If asked about skills, experience, or projects, give concise, factual descriptions.

  Goal:
  Help recruiters, clients, or visitors understand Alvin’s skills, experience, and potential quickly and accurately.
`;

    const response = await callGemini(userMsg, systemPrompt);
    setChatMessages((prev) => [...prev, { role: "model", text: response }]);
    setIsChatLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="group flex items-center gap-2 p-4 rounded-full bg-indigo-600 text-white shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105"
        >
          <div className="relative">
            <Bot size={28} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-600"></span>
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
            Ask Alvin AI
          </span>
        </button>
      )}

      {isChatOpen && (
        <div
          className={`w-[350px] md:w-[400px] h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
            isDark
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Alvin AI Assistant</h4>
                <div className="flex items-center gap-1 text-xs opacity-80">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>{" "}
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : isDark
                      ? "bg-slate-800 text-slate-200 rounded-bl-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div
                  className={`p-3 rounded-2xl rounded-bl-none ${
                    isDark ? "bg-slate-800" : "bg-gray-100"
                  }`}
                >
                  <Loader2 className="animate-spin text-indigo-500" size={18} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleChatSubmit}
            className={`p-3 border-t flex gap-2 ${
              isDark
                ? "border-slate-800 bg-slate-900"
                : "border-gray-100 bg-white"
            }`}
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about Alvin..."
              className={`flex-1 px-4 py-2 rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                isDark
                  ? "bg-slate-800 text-white placeholder-slate-500"
                  : "bg-gray-50 text-gray-900"
              }`}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
