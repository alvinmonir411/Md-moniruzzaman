"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, CornerDownLeft, Copy, Check } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../lib/store";
import { toggleTheme } from "../lib/features/theme/themeSlice";
import { calculateExperience, WIX_JOIN_DATE } from "../lib/experience";

interface CommandHistory {
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const TerminalSection: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const dispatch = useDispatch<AppDispatch>();
  const [input, setInput] = useState("");
  const wixExp = calculateExperience(WIX_JOIN_DATE);
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "welcome",
      timestamp: "12:00:00",
      output: (
        <div className="space-y-2 text-slate-300">
          <p className="text-emerald-400 font-mono font-semibold">
            ✨ Moniruzzaman Interactive Developer Shell v2.5.0 (x86_64-portfolio)
          </p>
          <p className="text-slate-400 text-sm">
            Type <span className="text-indigo-400 font-bold">help</span> to view available commands, or click any suggested pill below.
          </p>
        </div>
      ),
    },
  ]);
  const [copied, setCopied] = useState(false);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    const now = new Date().toLocaleTimeString();

    if (!trimmed) return;

    if (trimmed === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    let output: React.ReactNode = null;

    switch (trimmed) {
      case "help":
        output = (
          <div className="space-y-1 text-slate-300 font-mono text-sm">
            <p className="text-amber-400 font-bold mb-2">🚀 Available Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><span className="text-indigo-400 font-semibold">bio</span> - Who is Moniruzzaman?</div>
              <div><span className="text-indigo-400 font-semibold">skills</span> - View technical toolkit</div>
              <div><span className="text-indigo-400 font-semibold">projects</span> - View selected live projects</div>
              <div><span className="text-indigo-400 font-semibold">experience</span> - Work & education timeline</div>
              <div><span className="text-indigo-400 font-semibold">hire</span> - Check hiring availability & roles</div>
              <div><span className="text-indigo-400 font-semibold">contact</span> - Email, phone & social profiles</div>
              <div><span className="text-indigo-400 font-semibold">theme</span> - Toggle Dark/Light visual theme</div>
              <div><span className="text-indigo-400 font-semibold">clear</span> - Clear terminal screen</div>
            </div>
          </div>
        );
        break;

      case "bio":
        output = (
          <div className="space-y-2 font-mono text-sm text-slate-300">
            <p className="text-indigo-400 font-bold">👤 Moniruzzaman | Front-End & Full-Stack Engineer</p>
            <p className="leading-relaxed">
              Passionate developer based in Dhaka, Bangladesh. Specializing in architecting high-performance Next.js,
              React, and TypeScript applications with clean architecture, accessible UX, and pixel-perfect design.
            </p>
            <p className="text-emerald-400">⚡ Passion: Building scalable web platforms & AI-integrated web experiences.</p>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="space-y-2 font-mono text-sm">
            <p className="text-cyan-400 font-bold">🛠️ Core Engineering Stack:</p>
            <p><span className="text-purple-400 font-semibold">Frontend:</span> Next.js 15/16, React 19, TypeScript, Tailwind CSS, Redux Toolkit, Zustand, HTML5/CSS3</p>
            <p><span className="text-emerald-400 font-semibold">Backend & DB:</span> Node.js, Express.js, MongoDB (Mongoose), PostgreSQL (Neon), Firebase Auth, REST APIs</p>
            <p><span className="text-amber-400 font-semibold">Tools & DevOps:</span> Git, GitHub, VS Code, Postman, Vercel, Figma, ESLint</p>
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="space-y-2 font-mono text-sm">
            <p className="text-indigo-400 font-bold">📂 Featured Production Projects:</p>
            <div className="space-y-1">
              <p>🔹 <span className="text-white font-semibold">Smart Portfolio & AI</span> - Next.js + Tailwind + Gemini AI</p>
              <p>🔹 <span className="text-white font-semibold">Full-Stack MERN Apps</span> - Auth, Stripe payment, CRUD & MongoDB</p>
              <p>🔹 <span className="text-white font-semibold">Wix & No-Code Solutions</span> - Client-ready scalable business sites</p>
            </div>
            <p className="text-slate-400 text-xs mt-1">Scroll to the Projects section or visit github.com/alvinmonir411</p>
          </div>
        );
        break;

      case "experience":
        output = (
          <div className="space-y-2 font-mono text-sm">
            <p className="text-purple-400 font-bold">💼 Experience & Track Record:</p>
            <p>🏢 <span className="text-white font-semibold">SM Technology</span> - Wix Developer ({wixExp.formatted})</p>
            <p>💻 <span className="text-white font-semibold">Freelance & Open Source</span> - 100+ Complete Projects Delivered</p>
            <p>🎓 <span className="text-white font-semibold">Academic Journey</span> - BSS in Social Science (Govt. Begum Rokeya College)</p>
          </div>
        );
        break;

      case "hire":
        output = (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2 font-mono text-sm">
            <p className="text-emerald-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              🟢 STATUS: AVAILABLE FOR HIRE
            </p>
            <p className="text-slate-200">
              Open to: <span className="text-indigo-300 font-semibold">Full-time Roles</span>, <span className="text-purple-300 font-semibold">Contracts</span>, and <span className="text-cyan-300 font-semibold">High-Impact Freelance Projects</span>.
            </p>
            <p className="text-slate-400 text-xs">Reach out via email: alvinmonir411@gmail.com</p>
          </div>
        );
        break;

      case "contact":
        output = (
          <div className="space-y-1 font-mono text-sm text-slate-300">
            <p className="text-cyan-400 font-bold">📬 Connect with Moniruzzaman:</p>
            <p>📧 Email: <a href="mailto:alvinmonir411@gmail.com" className="text-indigo-400 underline">alvinmonir411@gmail.com</a></p>
            <p>📞 Phone/WhatsApp: <a href="https://wa.me/8801340571927" target="_blank" rel="noreferrer" className="text-emerald-400 underline">+8801340571927</a></p>
            <p>🐙 GitHub: <a href="https://github.com/alvinmonir411" target="_blank" rel="noreferrer" className="text-purple-400 underline">github.com/alvinmonir411</a></p>
            <p>💼 LinkedIn: <a href="https://www.linkedin.com/in/moniruzzaman13663/" target="_blank" rel="noreferrer" className="text-blue-400 underline">linkedin.com/in/moniruzzaman13663</a></p>
            <p>🌐 Facebook: <a href="https://www.facebook.com/pexelneststudio/" target="_blank" rel="noreferrer" className="text-indigo-400 underline">facebook.com/pexelneststudio</a></p>
            <p>📸 Instagram: <a href="https://www.instagram.com/pixelneststudio.official/" target="_blank" rel="noreferrer" className="text-pink-400 underline">@pixelneststudio.official</a></p>
          </div>
        );
        break;

      case "theme":
        dispatch(toggleTheme());
        output = (
          <p className="text-amber-300 font-mono text-sm">
            🌓 Theme toggled to {isDark ? "Light Mode" : "Dark Mode"}!
          </p>
        );
        break;

      case "sudo":
      case "sudo rm -rf /":
      case "rm -rf":
        output = (
          <p className="text-rose-400 font-mono text-sm">
            🚨 Permission denied: Moniruzzaman&apos;s codebase is bulletproof and indestructible! 🛡️
          </p>
        );
        break;

      default:
        output = (
          <p className="text-rose-400 font-mono text-sm">
            command not found: <span className="text-white font-bold">{trimmed}</span>. Type <span className="text-indigo-400 font-bold">help</span> for available commands.
          </p>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        command: cmdStr,
        output,
        timestamp: now,
      },
    ]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  const handleCopy = () => {
    const textToCopy = "git clone https://github.com/alvinmonir411/protfolio.git";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickCommands = ["help", "skills", "projects", "experience", "hire", "contact"];

  return (
    <section id="terminal" className="py-20 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDark ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-indigo-50 text-indigo-700 border border-indigo-100"
            }`}
          >
            <TerminalIcon size={14} />
            Developer Console
          </div>
          <h2
            className={`text-3xl md:text-5xl font-black tracking-tight mb-3 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Interactive CLI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Terminal</span>
          </h2>
          <p className={`text-base md:text-lg max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Interact directly with my developer environment. Type commands or click the shortcuts below.
          </p>
        </div>

        {/* Quick Command Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className={`text-xs font-mono font-semibold mr-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Quick run:
          </span>
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 border hover:scale-105 active:scale-95 ${
                isDark
                  ? "bg-slate-900/80 border-slate-700 text-indigo-300 hover:border-indigo-500 hover:bg-slate-800"
                  : "bg-white border-slate-200 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50 shadow-sm"
              }`}
            >
              ${cmd}
            </button>
          ))}
        </div>

        {/* Terminal Container */}
        <div
          onClick={() => inputRef.current?.focus()}
          className={`rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 ${
            isDark
              ? "bg-slate-950/90 border-slate-800 shadow-indigo-950/40"
              : "bg-slate-900 border-slate-700 shadow-slate-900/30"
          }`}
        >
          {/* Header Bar */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm cursor-pointer" title="Close" />
              <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm cursor-pointer" title="Minimize" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm cursor-pointer" title="Maximize" />
              <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">
                moniruzzaman@macbook-pro: ~/workspace/portfolio
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Copy git clone"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span className="hidden sm:inline">{copied ? "Copied!" : "git clone"}</span>
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div ref={terminalBodyRef} className="p-5 font-mono text-sm max-h-[380px] overflow-y-auto space-y-4">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-emerald-400 font-bold">➜</span>
                  <span className="text-cyan-400">moniruzzaman@portfolio</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-indigo-400">~</span>
                  <span className="text-slate-300">$ {item.command}</span>
                  <span className="text-[10px] text-slate-600 ml-auto">{item.timestamp}</span>
                </div>
                <div className="pl-5 border-l border-slate-800/80">{item.output}</div>
              </div>
            ))}

            {/* Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
              <span className="text-emerald-400 font-bold">➜</span>
              <span className="text-cyan-400 hidden sm:inline">moniruzzaman@portfolio</span>
              <span className="text-slate-500 hidden sm:inline">:</span>
              <span className="text-indigo-400 hidden sm:inline">~</span>
              <span className="text-emerald-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type 'help', 'skills', 'projects', 'hire'..."
                className="flex-1 bg-transparent text-slate-100 outline-none border-none font-mono text-sm placeholder:text-slate-600 focus:ring-0"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="submit"
                className="text-slate-500 hover:text-indigo-400 transition px-2 py-1 rounded"
                title="Execute (Enter)"
              >
                <CornerDownLeft size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TerminalSection;
