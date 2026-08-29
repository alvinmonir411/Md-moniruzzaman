"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Loader2,
  Trash2,
  User,
  ExternalLink,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { calculateExperience, WIX_JOIN_DATE } from "../lib/experience";

interface Message {
  role: "user" | "model";
  text: string;
}

const QUICK_PROMPTS = [
  "🛠️ What is Moniruzzaman's tech stack?",
  "💼 Is Moniruzzaman available to hire?",
  "🚀 Tell me about his best project",
  "⚡ Why should I hire Moniruzzaman?",
];

const FALLBACK_KNOWLEDGE: Record<string, string> = {
  stack:
    "Moniruzzaman specializes in Next.js (App Router), React.js, TypeScript, Tailwind CSS, Redux Toolkit, Node.js, Express.js, PostgreSQL (Neon DB), MongoDB, and Firebase.",
  hire: "Yes! Moniruzzaman is actively open for Full-Time Front-End/Full-Stack Roles, contract engineering, and high-impact freelance projects.",
  project:
    "Moniruzzaman has developed several production-ready MERN & Next.js web platforms with secure authentication, responsive pixel-perfect UIs, and payment integrations.",
  why: "Moniruzzaman combines rapid execution, clean scalable architecture, 100% responsiveness, and senior-level dedication to delivering high-performance digital products.",
};

// Inline helper to parse bold and markdown links [Label](url)
const renderInlineContent = (content: string) => {
  // Regex to match [Label](URL), **bold**, or raw URLs
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*.*?\*\*|https?:\/\/[^\s<)]+)/g;
  const parts = content.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Markdown link: [Title](https://...)
    const mdLinkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLinkMatch) {
      const [, linkText, linkUrl] = mdLinkMatch;
      return (
        <a
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 break-all"
        >
          <span>{linkText}</span>
          <ExternalLink size={11} className="inline flex-shrink-0" />
        </a>
      );
    }

    // 2. Bold text: **bold**
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-indigo-300 dark:text-indigo-300">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // 3. Raw URL: https://...
    if (part.startsWith("http://") || part.startsWith("https://")) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 break-all"
        >
          <span>{part.replace(/^https?:\/\/(www\.)?/, "")}</span>
          <ExternalLink size={11} className="inline flex-shrink-0" />
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Horizontal Rule
        if (trimmed === "---" || trimmed === "***") {
          return <hr key={idx} className="border-slate-700/60 my-2" />;
        }

        // Heading 3: ### Header
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-bold text-sm text-indigo-400 pt-2 pb-0.5">
              {renderInlineContent(trimmed.slice(4))}
            </h4>
          );
        }

        // Heading 2: ## Header
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-bold text-sm sm:text-base text-indigo-300 pt-2.5 pb-0.5">
              {renderInlineContent(trimmed.slice(3))}
            </h3>
          );
        }

        // Bullet points: * Item or - Item or • Item
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const bulletContent = trimmed.replace(/^(\*|-|•)\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="text-indigo-400 font-bold leading-tight select-none">•</span>
              <div className="flex-1 leading-relaxed">{renderInlineContent(bulletContent)}</div>
            </div>
          );
        }

        // Empty line
        if (trimmed === "") {
          return <div key={idx} className="h-1.5" />;
        }

        // Normal paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineContent(line)}
          </p>
        );
      })}
    </div>
  );
};

const ChatWidget: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "model",
      text: "👋 Hi! I'm Moniruzzaman's AI representative. Ask me anything about his technical stack, commercial experience, or projects!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatFeedRef = useRef<HTMLDivElement>(null);
  const wixExp = calculateExperience(WIX_JOIN_DATE);

  useEffect(() => {
    if (isChatOpen && chatFeedRef.current) {
      chatFeedRef.current.scrollTo({
        top: chatFeedRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim() || isChatLoading) return;

    const currentHistory = [...chatMessages];
    setChatMessages((prev) => [...prev, { role: "user", text: msgText }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: msgText,
          history: currentHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          role: "model",
          text:
            data.reply ||
            `Moniruzzaman is a Front-End & MERN Developer specializing in Next.js & React with ${wixExp.formatted} commercial experience. Reach him at alvinmonir411@gmail.com!`,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `I'm here to help! Moniruzzaman is an experienced React & Next.js developer with ${wixExp.formatted} industry experience at SM Technology. You can email him at alvinmonir411@gmail.com!`,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClear = () => {
    setChatMessages([
      {
        role: "model",
        text: "Conversation cleared. How can I assist you with Moniruzzaman's portfolio? 🚀",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="group relative flex items-center gap-3 p-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(99,102,241,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot size={28} className="animate-bounce" style={{ animationDuration: "2s" }} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-bold text-sm pr-1">
            Ask Moniruzzaman AI ✨
          </span>
        </button>
      )}

      {/* Chat Window Container */}
      {isChatOpen && (
        <div
          className={`w-[360px] sm:w-[420px] h-[560px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border transition-all duration-300 ${
            isDark
              ? "bg-slate-950/95 border-slate-800 shadow-indigo-950/50 backdrop-blur-xl"
              : "bg-white/95 border-slate-200 shadow-2xl backdrop-blur-xl"
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <img
                  src="/my%20image.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/My_picture.png";
                  }}
                  alt="Moniruzzaman AI"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5 leading-tight">
                  Moniruzzaman AI
                  <Sparkles size={14} className="text-amber-300" />
                </h3>
                <p className="text-[11px] text-indigo-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Online • Powered by Gemini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Clear Chat"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close Window"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div ref={chatFeedRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "model" && (
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-1 bg-slate-900 shadow-sm">
                    <img
                      src="/my%20image.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/My_picture.png";
                      }}
                      alt="Moniruzzaman AI"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none shadow-md whitespace-pre-wrap"
                      : isDark
                      ? "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md"
                      : "bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.role === "model" ? (
                    <FormattedMessage text={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs font-mono animate-pulse ${
                    isDark ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div
            className={`px-3 py-2 border-t flex gap-1.5 overflow-x-auto no-scrollbar ${
              isDark ? "border-slate-900 bg-slate-950/60" : "border-slate-100 bg-slate-50"
            }`}
          >
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isChatLoading}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex-shrink-0 cursor-pointer ${
                  isDark
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-850"
                    : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(chatInput);
            }}
            className={`p-3 border-t flex items-center gap-2 ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about Moniruzzaman..."
              disabled={isChatLoading}
              className={`flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm outline-none transition-all ${
                isDark
                  ? "bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                  : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600"
              }`}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
