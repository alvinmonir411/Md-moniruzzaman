"use client";

import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  Cpu,
  Database,
  Wrench,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

interface SkillItem {
  name: string;
  category: "frontend" | "backend" | "tools";
  level: number;
  icon: string;
  color: string;
  description: string;
  tag: string;
}

const SKILLS_DATA: SkillItem[] = [
  // Frontend
  {
    name: "React.js",
    category: "frontend",
    level: 95,
    icon: "⚛️",
    color: "from-cyan-500 to-blue-500",
    description: "Custom hooks, Context API, state optimization, concurrent mode.",
    tag: "Expert",
  },
  {
    name: "Next.js (App Router)",
    category: "frontend",
    level: 92,
    icon: "🚀",
    color: "from-slate-300 to-slate-600",
    description: "SSR, SSG, Server Actions, route handlers, dynamic SEO optimization.",
    tag: "Advanced",
  },
  {
    name: "TypeScript",
    category: "frontend",
    level: 90,
    icon: "🟦",
    color: "from-blue-500 to-indigo-600",
    description: "Generics, strict typing, interfaces, utility types, clean schemas.",
    tag: "Advanced",
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    level: 98,
    icon: "💨",
    color: "from-teal-400 to-cyan-500",
    description: "Responsive layouts, custom utilities, modern dark/light theming.",
    tag: "Master",
  },
  {
    name: "Redux Toolkit / Zustand",
    category: "frontend",
    level: 88,
    icon: "🔴",
    color: "from-purple-500 to-pink-500",
    description: "Global state management, slices, async thunks, persistence.",
    tag: "Advanced",
  },
  {
    name: "JavaScript (ES6+)",
    category: "frontend",
    level: 95,
    icon: "⚡",
    color: "from-yellow-400 to-amber-500",
    description: "Async/await, closures, prototypes, event loops, DOM manipulation.",
    tag: "Expert",
  },
  {
    name: "HTML5 & CSS3 Animations",
    category: "frontend",
    level: 96,
    icon: "🎨",
    color: "from-orange-500 to-rose-500",
    description: "Semantic HTML, flexbox/grid, keyframe animations, glassmorphism.",
    tag: "Master",
  },

  // Backend
  {
    name: "Node.js",
    category: "backend",
    level: 85,
    icon: "🟢",
    color: "from-emerald-500 to-green-600",
    description: "Event-driven runtime, asynchronous architecture, backend APIs.",
    tag: "Proficient",
  },
  {
    name: "Express.js",
    category: "backend",
    level: 88,
    icon: "⚡",
    color: "from-slate-400 to-slate-700",
    description: "RESTful architecture, custom middlewares, JWT authentication, CORS.",
    tag: "Advanced",
  },
  {
    name: "MongoDB & Mongoose",
    category: "backend",
    level: 86,
    icon: "🍃",
    color: "from-green-500 to-emerald-600",
    description: "Schema modeling, aggregation pipelines, indexing, CRUD pipelines.",
    tag: "Advanced",
  },
  {
    name: "Firebase / Firestore",
    category: "backend",
    level: 85,
    icon: "🔥",
    color: "from-amber-500 to-orange-600",
    description: "Firebase Auth, real-time database, cloud firestore, security rules.",
    tag: "Proficient",
  },
  {
    name: "REST API Integration",
    category: "backend",
    level: 92,
    icon: "🔗",
    color: "from-indigo-500 to-blue-600",
    description: "Secure endpoints, pagination, token auth, error handling standard.",
    tag: "Advanced",
  },

  // Tools & DevOps
  {
    name: "Git & GitHub",
    category: "tools",
    level: 92,
    icon: "🐙",
    color: "from-purple-500 to-indigo-600",
    description: "Branching strategies, pull requests, merge conflict resolution.",
    tag: "Advanced",
  },
  {
    name: "Vercel / Cloud Deployment",
    category: "tools",
    level: 90,
    icon: "🌐",
    color: "from-blue-400 to-cyan-500",
    description: "Automated CI/CD pipelines, custom domains, environment variables.",
    tag: "Advanced",
  },
  {
    name: "Figma to Code",
    category: "tools",
    level: 95,
    icon: "📐",
    color: "from-pink-500 to-rose-500",
    description: "Pixel-perfect conversion of complex design systems into React code.",
    tag: "Expert",
  },
  {
    name: "Postman & API Testing",
    category: "tools",
    level: 88,
    icon: "📬",
    color: "from-orange-500 to-amber-600",
    description: "Endpoint validation, header config, automated payload testing.",
    tag: "Advanced",
  },
];

const SkillsSection: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [activeFilter, setActiveFilter] = useState<"all" | "frontend" | "backend" | "tools">("all");
  const [skills, setSkills] = useState<SkillItem[]>(SKILLS_DATA);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(SKILLS_DATA[0]);

  React.useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: SkillItem[] = data.map((item: any) => ({
            name: item.name,
            category: (item.category || "frontend").toLowerCase() as "frontend" | "backend" | "tools",
            level: Number(item.proficiency) || 85,
            icon: item.icon || "⚡",
            color: item.color || "from-indigo-500 to-purple-500",
            description: item.description || "Production-tested skill used in real-world applications.",
            tag: item.tag || (Number(item.proficiency) >= 95 ? "Master" : Number(item.proficiency) >= 90 ? "Expert" : "Advanced"),
          }));
          setSkills(mapped);
          setSelectedSkill(mapped[0]);
        }
      })
      .catch((err) => console.log("Using cached skills data:", err));
  }, []);

  const filteredSkills =
    activeFilter === "all"
      ? skills
      : skills.filter((s) => s.category === activeFilter);

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "bg-cyan-50 text-cyan-700 border border-cyan-100"
            }`}
          >
            <Cpu size={14} />
            Mastered Technologies
          </div>
          <h2
            className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500">Toolkit</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            A curated stack of tools, frameworks, and languages I utilize to craft blazing-fast web solutions.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {[
              { id: "all" as const, label: "All Skills", icon: Sparkles },
              { id: "frontend" as const, label: "Frontend", icon: Layers },
              { id: "backend" as const, label: "Backend & DB", icon: Database },
              { id: "tools" as const, label: "Tools & DevOps", icon: Wrench },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-105"
                      : isDark
                      ? "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkill.name === skill.name;
            return (
              <div
                key={skill.name}
                onClick={() => setSelectedSkill(skill)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden ${
                  isSelected
                    ? isDark
                      ? "bg-slate-900 border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.3)]"
                      : "bg-indigo-50/50 border-indigo-400 shadow-lg"
                    : isDark
                    ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <span
                    className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full ${
                      isDark
                        ? "bg-slate-800 text-indigo-300 border border-slate-700"
                        : "bg-slate-100 text-indigo-700 border border-slate-200"
                    }`}
                  >
                    {skill.tag}
                  </span>
                </div>

                {/* Skill Name */}
                <h3
                  className={`text-lg font-bold mb-1 group-hover:text-indigo-400 transition-colors ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {skill.name}
                </h3>

                {/* Description */}
                <p
                  className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {skill.description}
                </p>

                {/* Progress Level Bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/40">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className={isDark ? "text-slate-500" : "text-slate-400"}>Proficiency</span>
                    <span className="text-indigo-400 font-bold">{skill.level}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-700`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Skill Quick Detail Showcase */}
        {selectedSkill && (
          <div
            className={`mt-10 p-6 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 ${
              isDark
                ? "bg-slate-900/90 border-slate-800 shadow-xl"
                : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl">
                {selectedSkill.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {selectedSkill.name}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {selectedSkill.level}% Mastered
                  </span>
                </div>
                <p className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {selectedSkill.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md hover:scale-105"
              >
                Hire with {selectedSkill.name}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
