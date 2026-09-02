"use client";

import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Heart,
  Code2,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Sparkles,
  ArrowRight,
  Send,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { useProfile } from "../hooks/useProfile";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Footer: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const { profile } = useProfile();
  const pathname = usePathname();
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (id: string) => {
    if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const whatsappClean = (profile.whatsapp || "+8801340571927").replace(/[^0-9]/g, "");

  return (
    <footer
      className={`border-t transition-colors duration-500 relative z-10 overflow-hidden ${
        isDark
          ? "bg-slate-950 border-slate-800/80 text-slate-400"
          : "bg-slate-50 border-slate-200 text-slate-600"
      }`}
    >
      {/* Subtle Background Glow Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top Call To Action Card */}
        <div
          className={`p-8 sm:p-10 rounded-3xl border mb-16 relative overflow-hidden transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border-indigo-500/20 shadow-2xl shadow-indigo-950/30"
              : "bg-gradient-to-r from-indigo-50 via-purple-50 to-white border-indigo-100 shadow-xl"
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles size={13} className="text-amber-400" />
                <span>Ready to start a project?</span>
              </div>
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Let&apos;s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">extraordinary</span> together.
              </h3>
              <p className={`text-sm max-w-xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Available for full-time engineering roles, high-impact contract work, and custom web applications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleNavClick("contact")}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Send size={16} />
                <span>Get In Touch</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={profile.github || "https://github.com/alvinmonir411"}
                target="_blank"
                rel="noreferrer"
                className={`px-5 py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? "border-slate-800 bg-slate-900/80 text-slate-200 hover:border-slate-700 hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-sm"
                }`}
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Col 1: Brand & Bio (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center w-11 h-11 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="PixelNest Logo"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.display = "none";
                    const fallback = el.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "block";
                  }}
                />
                <Code2 size={22} className="hidden" />
              </div>
              <div className="flex flex-col">
                <h2
                  className={`text-2xl font-mono font-black tracking-tight leading-none ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  PixelNest
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">.Studio</span>
                </h2>
                <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                  Founder & Lead: Moniruzzaman
                </span>
              </div>
            </div>

            <p className={`text-sm leading-relaxed max-w-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {profile.bio ||
                "PixelNest Studio creates high-performance digital platforms, modern web applications, and full-stack solutions engineered by Moniruzzaman."}
            </p>

            {/* Social Links Row */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <a
                href={profile.github || "https://github.com/alvinmonir411"}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? "border-slate-800 bg-slate-900 text-slate-300 hover:text-purple-400 hover:border-purple-500/50"
                    : "border-slate-200 bg-white text-slate-700 hover:text-purple-600 hover:border-purple-300 shadow-sm"
                }`}
                aria-label="GitHub Profile"
              >
                <Github size={18} />
              </a>

              <a
                href={profile.linkedin || "https://www.linkedin.com/in/moniruzzaman13663/"}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? "border-slate-800 bg-slate-900 text-slate-300 hover:text-blue-400 hover:border-blue-500/50"
                    : "border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm"
                }`}
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={18} />
              </a>

              <a
                href={profile.facebook || "https://www.facebook.com/pexelneststudio/"}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? "border-slate-800 bg-slate-900 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/50"
                    : "border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-sm"
                }`}
                aria-label="Facebook Page"
              >
                <Facebook size={18} />
              </a>

              <a
                href={profile.instagram || "https://www.instagram.com/pixelneststudio.official/"}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? "border-slate-800 bg-slate-900 text-slate-300 hover:text-pink-400 hover:border-pink-500/50"
                    : "border-slate-200 bg-white text-slate-700 hover:text-pink-600 hover:border-pink-300 shadow-sm"
                }`}
                aria-label="Instagram Profile"
              >
                <Instagram size={18} />
              </a>

              <a
                href={`https://wa.me/${whatsappClean}`}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? "border-slate-800 bg-slate-900 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50"
                    : "border-slate-200 bg-white text-slate-700 hover:text-emerald-600 hover:border-emerald-300 shadow-sm"
                }`}
                aria-label="WhatsApp"
              >
                <Phone size={18} />
              </a>

              <a
                href={`mailto:${profile.email || "alvinmonir411@gmail.com"}`}
                className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? "border-slate-800 bg-slate-900 text-slate-300 hover:text-rose-400 hover:border-rose-500/50"
                    : "border-slate-200 bg-white text-slate-700 hover:text-rose-600 hover:border-rose-300 shadow-sm"
                }`}
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3
              className={`text-xs font-mono uppercase font-bold tracking-wider ${
                isDark ? "text-slate-200" : "text-slate-900"
              }`}
            >
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-2.5 text-sm">
              <button
                onClick={() => handleNavClick("about")}
                className="text-left hover:text-indigo-400 transition cursor-pointer"
              >
                About Me
              </button>
              <button
                onClick={() => handleNavClick("skills")}
                className="text-left hover:text-indigo-400 transition cursor-pointer"
              >
                Skills & Stack
              </button>
              <button
                onClick={() => handleNavClick("projects")}
                className="text-left hover:text-indigo-400 transition cursor-pointer"
              >
                Projects
              </button>
              <button
                onClick={() => handleNavClick("github")}
                className="text-left hover:text-indigo-400 transition cursor-pointer flex items-center gap-1"
              >
                <span>GitHub</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </button>
              <button
                onClick={() => handleNavClick("terminal")}
                className="text-left hover:text-indigo-400 transition cursor-pointer"
              >
                Interactive CLI
              </button>
              <button
                onClick={() => handleNavClick("experience")}
                className="text-left hover:text-indigo-400 transition cursor-pointer"
              >
                Experience
              </button>
              <button
                onClick={() => handleNavClick("contact")}
                className="text-left hover:text-indigo-400 transition cursor-pointer"
              >
                Contact
              </button>
              <Link
                href="/projects"
                className="hover:text-indigo-400 transition cursor-pointer"
              >
                All Projects →
              </Link>
            </div>
          </div>

          {/* Col 3: Direct Contact Details (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h3
              className={`text-xs font-mono uppercase font-bold tracking-wider ${
                isDark ? "text-slate-200" : "text-slate-900"
              }`}
            >
              Direct Reach
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${profile.email || "alvinmonir411@gmail.com"}`}
                  className="flex items-center gap-2.5 hover:text-indigo-400 transition truncate group"
                >
                  <Mail size={15} className="text-indigo-400 flex-shrink-0 group-hover:scale-110 transition" />
                  <span className="truncate">{profile.email || "alvinmonir411@gmail.com"}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappClean}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:text-emerald-400 transition group"
                >
                  <Phone size={15} className="text-emerald-400 flex-shrink-0 group-hover:scale-110 transition" />
                  <span>{profile.whatsapp || profile.phone || "+880 1340-571927"}</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-purple-400 flex-shrink-0" />
                <span>{profile.location || "Dhaka, Bangladesh"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Back-to-Top Bar */}
        <div
          className={`border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
            isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-500"
          }`}
        >
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>Designed & Built by <strong className={isDark ? "text-slate-300" : "text-slate-800"}>{profile.name || "Moniruzzaman"}</strong> with</span>
            <Heart size={13} className="text-rose-500 fill-rose-500 inline animate-pulse" />
            <span>using Next.js 16 & Neon DB</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Moniruzzaman</span>
            <button
              onClick={scrollToTop}
              className={`p-2 px-3 rounded-xl border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-600"
                  : "border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 shadow-sm"
              }`}
              title="Back to Top"
            >
              <ArrowUp size={13} />
              <span className="text-[11px] font-sans font-semibold">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
