"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Download,
  Sparkles,
  Zap,
  Code2,
  Cpu,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { useProfile } from "../hooks/useProfile";

const ROLES = [
  "Front-End Developer",
  "Next.js & React Architect",
  "Full-Stack Web Craftsman",
  "UI/UX & Performance Specialist",
];

const SocialLink = ({
  href,
  icon: Icon,
  label,
  isDark,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  isDark: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`p-3 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:scale-110 ${
      isDark
        ? "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
        : "bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg"
    }`}
    aria-label={label}
  >
    <Icon size={22} />
  </a>
);

const HeroSection: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const { profile } = useProfile();

  // Typewriter states
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // 3D Card tilt states
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentRole.length) {
          setDisplayedText(currentRole.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentRole.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex]);

  // Card Mouse Move for 3D Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 16, y: -y * 16 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[92vh] flex flex-col justify-center relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Side: Hero Info */}
        <div className="lg:col-span-7 space-y-8">
          {/* Status Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase border transition-all ${
                isDark
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                  : "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Available for Hire & Projects</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border ${
                isDark
                  ? "bg-slate-900/60 border-slate-800 text-slate-400"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <Zap size={12} className="text-amber-400" />
              <span>{profile.location || "Dhaka, Bangladesh"}</span>
            </div>
          </div>

          {/* Main Hero Heading */}
          <div className="space-y-3">
            <h1
              className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Hi, I&apos;m <span className="text-indigo-500">{profile.name || "Moniruzzaman"}</span>
            </h1>

            {/* Dynamic Typewriter Heading */}
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold flex items-center min-h-[50px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
                {displayedText}
              </span>
              <span className="inline-block w-1 h-8 sm:h-9 bg-indigo-500 ml-1.5 animate-pulse" />
            </div>
          </div>

          {/* Description */}
          <p
            className={`text-lg sm:text-xl max-w-2xl leading-relaxed font-normal ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {profile.bio || "Engineering high-performance, scalable web apps with Next.js, React, and TypeScript. Turning complex challenges into elegant, accessible, and hyper-responsive digital experiences."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#projects"
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base transition-all duration-300 shadow-[0_0_25px_rgba(99,102,241,0.45)] hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] hover:-translate-y-1 flex items-center gap-2.5 group"
            >
              Explore Projects
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              download={true}
              href="/resume.pdf"
              className={`px-7 py-4 rounded-2xl font-bold text-base transition-all duration-300 border-2 hover:-translate-y-1 flex items-center gap-2.5 ${
                isDark
                  ? "border-slate-700 hover:border-indigo-500 hover:bg-slate-900 text-slate-100 shadow-md"
                  : "border-slate-200 hover:border-indigo-600 hover:text-indigo-600 bg-white text-slate-800 shadow-sm"
              }`}
            >
              Download CV <Download size={18} />
            </a>

            <a
              href="#contact"
              className={`px-6 py-4 rounded-2xl font-semibold text-base transition-all duration-300 border flex items-center gap-2 ${
                isDark
                  ? "border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 hover:text-slate-900"
              }`}
            >
              <Sparkles size={16} className="text-amber-400" />
              Let&apos;s Talk
            </a>
          </div>

          {/* Social Links & Quick Stats */}
          <div
            className={`pt-6 border-t flex flex-wrap items-center justify-between gap-6 ${
              isDark ? "border-slate-800/80" : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <SocialLink
                href={profile.github || "https://github.com/alvinmonir411"}
                icon={Github}
                label="GitHub Profile"
                isDark={isDark}
              />
              <SocialLink
                href={profile.linkedin || "https://www.linkedin.com/in/moniruzzaman13663/"}
                icon={Linkedin}
                label="LinkedIn Profile"
                isDark={isDark}
              />
              <SocialLink
                href={`mailto:${profile.email || "alvinmonir411@gmail.com"}`}
                icon={Mail}
                label={`Email ${profile.name || "Moniruzzaman"}`}
                isDark={isDark}
              />
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  100+
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Projects Built</div>
              </div>
              <div className="w-[1px] h-8 bg-slate-700/50" />
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  100%
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Satisfaction</div>
              </div>
              <div className="w-[1px] h-8 bg-slate-700/50" />
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  99+
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Lighthouse UI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 3D Holographic Developer Showcase Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transition: tilt.x === 0 ? "transform 0.5s ease-out" : "none",
            }}
            className="relative w-full max-w-[380px] group cursor-pointer"
          >
            {/* Ambient Multi-Color Glow Backdrop */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-80 transition duration-700 animate-pulse-glow" />

            {/* Main Hologram Container */}
            <div
              className={`relative rounded-[2.2rem] p-4 border overflow-hidden backdrop-blur-xl ${
                isDark
                  ? "bg-slate-900/90 border-slate-700/80 shadow-2xl"
                  : "bg-white/95 border-slate-200 shadow-2xl"
              }`}
            >
              {/* Picture Container */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-950">
                <img
                  src="/my%20image.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/My_picture.png";
                  }}
                  alt="Moniruzzaman - Front-End Engineer"
                  className="w-full h-full object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105 filter brightness-105"
                />
                
                {/* Tech Scanner Grid Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                {/* Floating Tag 1: Top Left */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-indigo-500/40 text-[11px] font-mono text-indigo-300 shadow-lg flex items-center gap-1.5 animate-float">
                  <Code2 size={12} className="text-cyan-400" />
                  <span>Next.js 16 + TS</span>
                </div>

                {/* Floating Tag 2: Top Right */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-purple-500/40 text-[11px] font-mono text-purple-300 shadow-lg flex items-center gap-1.5 animate-float-delayed">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Full-Stack MERN</span>
                </div>

                {/* Bottom Card Identity Details */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/70 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-base">Moniruzzaman</h4>
                      <p className="text-xs text-indigo-400 font-mono">Senior-Level Problem Solver</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <Cpu size={18} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                    <span>Clean Code Architecture</span>
                    <span className="text-emerald-400">● 100% Responsive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
