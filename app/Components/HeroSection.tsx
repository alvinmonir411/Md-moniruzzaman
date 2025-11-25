"use client";

import React from "react";
import {
  Github,
  Linkedin,
  Mail,
  Layout,
  Download,
  Sparkles,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

interface HeroSectionProps {
  isDark: boolean;
}

const SocialLink = ({
  href,
  icon: Icon,
  label,
  isDark,
}: {
  href: string;
  icon: any;
  label: string;
  isDark: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`transition-all duration-300 hover:-translate-y-1 ${
      isDark
        ? "text-slate-400 hover:text-indigo-400"
        : "text-slate-500 hover:text-indigo-600"
    }`}
    aria-label={label}
  >
    <Icon size={28} />
  </a>
);

const HeroSection = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  return (
    <section className="pt-40 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center min-h-screen relative z-10">
      <div className="max-w-4xl">
        {/* Available for Hire Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full text-sm font-semibold tracking-wide uppercase border ${
            isDark
              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              : "bg-white border-indigo-100 text-indigo-700 shadow-sm"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Available for Hire
        </div>

        {/* Main Heading */}
        <h1
          className={`text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Hi, I'm Alvin Monir. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
            Front-End Dev.
          </span>
        </h1>

        {/* Description */}
        <p
          className={`text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed font-light ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          I craft{" "}
          <span
            className={
              isDark ? "text-white font-medium" : "text-slate-900 font-medium"
            }
          >
            pixel-perfect, high-performance
          </span>{" "}
          web experiences using Next.js and TypeScript. Blending technical
          mastery with modern design aesthetics.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5">
          <button className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2">
            View Work <Layout size={20} />
          </button>

          <a
            download={true}
            href="/resume.pdf"
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 hover:-translate-y-1 flex items-center justify-center gap-2 ${
              isDark
                ? "border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white"
                : "border-gray-200 hover:border-indigo-600 hover:text-indigo-600 bg-white text-slate-900"
            }`}
          >
            Resume <Download size={20} />
          </a>
        </div>

        {/* Social Links */}
        <div
          className={`mt-16 pt-8 border-t flex gap-8 ${
            isDark ? "border-slate-800" : "border-gray-200"
          }`}
        >
          <SocialLink
            href="https://github.com/alvinmonir411"
            icon={Github}
            label="Github"
            isDark={isDark}
          />
          <SocialLink
            href="https://www.linkedin.com/in/alvin-monir/"
            icon={Linkedin}
            label="LinkedIn"
            isDark={isDark}
          />
          <SocialLink
            href="mailto:alvinmonir411@gmail.com"
            icon={Mail}
            label="Email"
            isDark={isDark}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
