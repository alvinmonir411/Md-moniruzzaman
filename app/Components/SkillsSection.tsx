// src/components/SkillsSection.tsx
"use client";

import React from "react";
import {
  Layers,
  Server,
  Code,
  Terminal,
  Zap,
  CheckCircle,
  Brain,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

const skillData = {
  frontend: [
    { name: "React.js", icon: "⚛️" },
    { name: "Next.js", icon: "🚀" },
    { name: "TypeScript", icon: "🟦" },
    { name: "JavaScript (ES6+)", icon: "🔸" },
    { name: "Tailwind CSS", icon: "💨" },
    { name: "Redux / Zustand", icon: "🔴" },
    { name: "HTML5 / CSS3", icon: "🎨" },
    { name: "Figma to Code", icon: "📐" },
  ],
  backend: [
    { name: "Node.js", icon: "🟢" },
    { name: "Express.js", icon: "💨" },
    { name: "MongoDB (Mongoose)", icon: "🍃" },
    { name: "Firebase / Firestore", icon: "🔥" },
    { name: "REST APIs", icon: "🔗" },
    { name: "Basic Authentication", icon: "🔑" },
  ],
  tools: [
    { name: "Git & GitHub", icon: "🐙" },
    { name: "VS Code", icon: "💻" },
    { name: "NPM / Yarn", icon: "📦" },
    { name: "Vercel / Netlify", icon: "🌐" },
    { name: "Postman", icon: "📬" },
    { name: "Eslint & Prettier", icon: "🧹" },
    { name: "Trello / Jira", icon: "📌" },
  ],
};

const SkillCard = ({
  name,
  icon,
  isDark,
}: {
  name: string;
  icon: string;
  isDark: boolean;
}) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isDark
        ? "bg-slate-800/50 hover:bg-slate-800"
        : "bg-white hover:bg-indigo-50 shadow-sm"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span
      className={`font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}
    >
      {name}
    </span>
  </div>
);

const SkillsSection = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  return (
    <section id="skills" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div
            className={`inline-block px-4 py-1 mb-4 rounded-full text-sm font-semibold uppercase ${
              isDark
                ? "bg-purple-500/10 text-purple-400"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            My Toolkit
          </div>
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Technical Expertise
          </h2>
          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Technologies I use to build scalable, high-performance web
            applications.
          </p>
        </div>

        {/* Skills Grid - Bento Style Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Frontend Development */}
          <div
            className={`p-8 rounded-3xl border ${
              isDark
                ? "bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-900/10"
                : "bg-white border-gray-100 shadow-xl"
            }`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-500">
                <Layers size={24} />
              </div>
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Frontend
              </h3>
            </div>
            <div className="space-y-4">
              {skillData.frontend.map((skill) => (
                <SkillCard
                  key={skill.name}
                  name={skill.name}
                  icon={skill.icon}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* 2. Backend & Database */}
          <div
            className={`p-8 rounded-3xl border ${
              isDark
                ? "bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-900/10"
                : "bg-white border-gray-100 shadow-xl"
            }`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                <Server size={24} />
              </div>
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Backend & DB
              </h3>
            </div>
            <div className="space-y-4">
              {skillData.backend.map((skill) => (
                <SkillCard
                  key={skill.name}
                  name={skill.name}
                  icon={skill.icon}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* 3. Tools & Workflow */}
          <div
            className={`p-8 rounded-3xl border ${
              isDark
                ? "bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-900/10"
                : "bg-white border-gray-100 shadow-xl"
            }`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                <Terminal size={24} />
              </div>
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Tools & Workflow
              </h3>
            </div>
            <div className="space-y-4">
              {skillData.tools.map((skill) => (
                <SkillCard
                  key={skill.name}
                  name={skill.name}
                  icon={skill.icon}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div
          className={`mt-20 p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between ${
            isDark
              ? "bg-slate-900 border-slate-800"
              : "bg-indigo-50 border-indigo-100"
          }`}
        >
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Brain className="w-8 h-8 text-indigo-500" />
            <p
              className={`text-xl font-semibold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Core Competencies:
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isDark
                  ? "bg-indigo-700/30 text-indigo-300"
                  : "bg-indigo-200 text-indigo-800"
              }`}
            >
              <CheckCircle size={14} className="inline mr-2" />
              Clean Code Architecture
            </span>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isDark
                  ? "bg-indigo-700/30 text-indigo-300"
                  : "bg-indigo-200 text-indigo-800"
              }`}
            >
              <CheckCircle size={14} className="inline mr-2" />
              Performance Optimization
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
