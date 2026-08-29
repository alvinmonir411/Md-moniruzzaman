"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Code2,
  Coffee,
  Award,
  Zap,
  Globe2,
  Clock,
  Sparkles,
  CheckCircle2,
  Laptop,
  Terminal,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { calculateExperience, WIX_JOIN_DATE } from "../lib/experience";

const AboutSection: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [time, setTime] = useState<string>("");
  const [wixExp, setWixExp] = useState(() => calculateExperience(WIX_JOIN_DATE));

  useEffect(() => {
    setWixExp(calculateExperience(WIX_JOIN_DATE));
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(() => {
      updateTime();
      setWixExp(calculateExperience(WIX_JOIN_DATE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDark
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "bg-purple-50 text-purple-700 border border-purple-100"
            }`}
          >
            <Sparkles size={14} />
            Engineering Persona
          </div>
          <h2
            className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Me</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            A high-agency Front-End and MERN Developer focused on engineering scalable, performant, and visually stunning web systems.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Bento 1: Large Bio Card (Span 2 cols on MD/LG) */}
          <div
            className={`md:col-span-2 lg:col-span-2 p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between group ${
              isDark
                ? "bg-slate-900/70 border-slate-800 hover:border-indigo-500/40"
                : "bg-white border-slate-200 hover:border-indigo-300 shadow-md"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-500/30 flex items-center justify-center bg-slate-900 shadow-md">
                    <img
                      src="/my%20image.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/My_picture.png";
                      }}
                      alt="Moniruzzaman"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      Moniruzzaman
                    </h3>
                    <p className="text-xs text-indigo-400 font-mono">Front-End & Next.js Specialist</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Full Stack Capable
                </span>
              </div>

              <p className={`text-base leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                I am a dedicated software developer with deep expertise in modern React ecosystems, Next.js App Router, TypeScript, and state management. I bridge the gap between complex backend architectures and intuitive, pixel-perfect user interfaces.
              </p>

              <p className={`text-base leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Having worked as a <strong className="text-indigo-400">Wix Developer at SM Technology</strong> ({wixExp.formatted}) and delivered numerous bespoke full-stack applications solo, I pride myself on rapid execution, clean code discipline, and zero compromise on performance.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap gap-2">
              {["Clean Code", "Pixel-Perfect UI", "Fast Execution", "API Integration", "State Architecture"].map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-3 py-1 rounded-lg font-medium ${
                    isDark
                      ? "bg-slate-800 text-slate-300 border border-slate-700"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bento 2: Live Code Philosophy Terminal (Span 2 cols on MD/LG) */}
          <div
            className={`md:col-span-1 lg:col-span-2 p-6 rounded-3xl border transition-all duration-300 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between ${
              isDark
                ? "bg-slate-950/80 border-slate-800 hover:border-purple-500/40"
                : "bg-slate-900 border-slate-800 text-slate-100 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">developer.config.ts</span>
              </div>
              <Code2 size={16} className="text-purple-400" />
            </div>

            <div className="my-4 font-mono text-xs sm:text-sm space-y-1.5 overflow-x-auto text-slate-300">
              <p><span className="text-pink-400">const</span> <span className="text-indigo-300">developer</span> = &#123;</p>
              <p className="pl-4"><span className="text-cyan-300">name</span>: <span className="text-amber-300">"Moniruzzaman"</span>,</p>
              <p className="pl-4"><span className="text-cyan-300">skills</span>: [<span className="text-amber-300">"React"</span>, <span className="text-amber-300">"Next.js"</span>, <span className="text-amber-300">"TypeScript"</span>, <span className="text-amber-300">"MongoDB"</span>],</p>
              <p className="pl-4"><span className="text-cyan-300">philosophy</span>: <span className="text-emerald-300">"Write code that humans love and machines optimize"</span>,</p>
              <p className="pl-4"><span className="text-cyan-300">caffeineDriven</span>: <span className="text-pink-400">true</span>,</p>
              <p className="pl-4"><span className="text-cyan-300">openToHire</span>: <span className="text-pink-400">true</span></p>
              <p>&#125;;</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={14} /> Production Ready
              </span>
              <span>100% TypeScript Strict</span>
            </div>
          </div>

          {/* Bento 3: Stats 1 - Projects */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark
                ? "bg-slate-900/70 border-slate-800 hover:border-indigo-500/50"
                : "bg-white border-slate-200 hover:border-indigo-300 shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Rocket size={20} />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-1">
              100+
            </div>
            <div className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              Projects Shipped
            </div>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              End-to-end full stack web platforms, dashboards, and portfolio sites.
            </p>
          </div>

          {/* Bento 4: Stats 2 - Work Experience */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark
                ? "bg-slate-900/70 border-slate-800 hover:border-purple-500/50"
                : "bg-white border-slate-200 hover:border-purple-300 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Award size={20} />
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                Live
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-1 font-mono">
              {wixExp.shortFormatted}
            </div>
            <div className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              Wix & Web Experience
            </div>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {wixExp.formatted} at SM Technology with real clients.
            </p>
          </div>

          {/* Bento 5: Stats 3 - Code Commit & Dedication */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark
                ? "bg-slate-900/70 border-slate-800 hover:border-pink-500/50"
                : "bg-white border-slate-200 hover:border-pink-300 shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
              <Coffee size={20} />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mb-1">
              500+
            </div>
            <div className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              Git Commits
            </div>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Continuous development, test-driven logic, and active open source.
            </p>
          </div>

          {/* Bento 6: Live Dhaka Location & Time Card */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark
                ? "bg-slate-900/70 border-slate-800 hover:border-emerald-500/50"
                : "bg-white border-slate-200 hover:border-emerald-300 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Globe2 size={20} />
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Time
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 mb-1">
              {time || "12:00:00 PM"}
            </div>
            <div className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Dhaka, Bangladesh
            </div>
            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Available for remote global teams & local collaborations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
