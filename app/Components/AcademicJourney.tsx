"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Briefcase, Calendar, MapPin, CheckCircle, Sparkles, Building2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { calculateExperience, WIX_JOIN_DATE } from "../lib/experience";

const ACADEMIC_DATA = [
  {
    title: "Bachelor of Social Science (BSS)",
    institution: "Govt. Begum Rokeya College, Rangpur",
    timeline: "2022 – Expected 2026",
    tag: "Higher Education",
    icon: "🎓",
    details: "Focusing on analytical problem solving, social dynamics, communication, and software research.",
  },
  {
    title: "Higher Secondary Certificate (HSC)",
    institution: "Cantonment Public School & College, Rangpur",
    timeline: "2020 – 2022",
    tag: "Science Background",
    icon: "🏫",
    details: "Excelled in core science disciplines, mathematical logic, and analytical problem-solving foundation.",
  },
  {
    title: "Secondary School Certificate (SSC)",
    institution: "R.K.M School & College, Rangpur",
    timeline: "2018 – 2020",
    tag: "Graduated with Honors",
    icon: "📘",
    details: "Built initial passion for computers, programming fundamentals, algorithms, and web technologies.",
  },
];

const AcademicJourney: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [wixExp, setWixExp] = useState(() => calculateExperience(WIX_JOIN_DATE));
  const [experiences, setExperiences] = useState<any[]>([]);
  const [academics, setAcademics] = useState<any[]>(ACADEMIC_DATA);

  useEffect(() => {
    setWixExp(calculateExperience(WIX_JOIN_DATE));
    const interval = setInterval(() => {
      setWixExp(calculateExperience(WIX_JOIN_DATE));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const expItems = data.filter((item: any) => item.type === "experience" || !item.type);
          const eduItems = data.filter((item: any) => item.type === "education");

          if (expItems.length > 0) {
            setExperiences(
              expItems.map((item: any) => ({
                role: item.position || item.role,
                company: item.company,
                timeline: item.isLive ? `${wixExp.formatted}` : item.timeline || "Present",
                location: item.location || "Remote",
                tag: item.tag || (item.isLive ? "Live Experience" : "Active"),
                icon: item.icon || "💼",
                isLive: Boolean(item.isLive),
                highlights: Array.isArray(item.highlights) && item.highlights.length > 0
                  ? item.highlights
                  : [item.details || "Professional development & engineering deliverables."],
              }))
            );
          }

          if (eduItems.length > 0) {
            setAcademics(
              eduItems.map((item: any) => ({
                title: item.position || item.role,
                institution: item.company,
                timeline: item.timeline || "Academic",
                tag: item.tag || "Education",
                icon: item.icon || "🎓",
                details: item.details || (Array.isArray(item.highlights) ? item.highlights.join(" ") : "Academic coursework and foundational studies."),
              }))
            );
          }
        }
      })
      .catch((err) => console.log("Using cached experience data:", err));
  }, [wixExp.formatted]);

  const defaultExpData = [
    {
      role: "Wix Developer",
      company: "SM Technology",
      timeline: `${wixExp.formatted}`,
      location: "Rangpur / Remote",
      tag: "Live Experience",
      icon: "💼",
      isLive: true,
      highlights: [
        `Active commercial experience: ${wixExp.fullFormatted} of production-grade Wix and web engineering.`,
        "Engineered tailored corporate websites with high SEO scores and responsive cross-device layouts.",
        "Collaborated with clients to translate business requirements into intuitive UI/UX workflows.",
        "Optimized load speeds, customized Velo/JavaScript scripts, and handled deployment pipelines.",
      ],
    },
    {
      role: "Independent Full-Stack Developer",
      company: "Freelance & Open Source",
      timeline: "2023 – Present",
      location: "Remote",
      tag: "Active",
      icon: "🚀",
      isLive: false,
      highlights: [
        "Built 100+ full-stack MERN, Next.js & web applications with authentication, databases, and payment flows.",
        "Maintained 100% client satisfaction and delivered modern, accessible codebases.",
      ],
    },
  ];

  const experienceData = experiences.length > 0 ? experiences : defaultExpData;
  const academicData = academics.length > 0 ? academics : ACADEMIC_DATA;

  return (
    <section id="experience" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDark
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "bg-purple-50 text-purple-700 border border-purple-100"
            }`}
          >
            <Sparkles size={14} />
            Career & Education
          </div>
          <h2
            className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Experience & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Education</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            My professional milestones and academic foundation that shaped my journey as an engineer.
          </p>
        </div>

        {/* 2-Column Grid: Experience on Left, Education on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Column 1: Experience */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800/60">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Professional Experience
                </h3>
                <p className="text-xs text-indigo-400 font-mono">Real-world commercial impact</p>
              </div>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500 before:to-transparent pl-8">
              {experienceData.map((exp, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border transition-all duration-300 relative group hover:-translate-y-1 ${
                    isDark
                      ? "bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 shadow-xl hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]"
                      : "bg-white border-slate-200 hover:border-indigo-300 shadow-md hover:shadow-xl"
                  }`}
                >
                  {/* Glowing Node on Timeline */}
                  <div className="absolute -left-[41px] top-7 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-950 shadow-[0_0_10px_#6366f1]" />

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 ${
                        exp.isLive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      }`}
                    >
                      {exp.isLive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                      {exp.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-indigo-300 font-mono font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      <Calendar size={13} className="text-indigo-400" /> {exp.timeline}
                    </span>
                  </div>

                  <h4 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {exp.role}
                  </h4>
                  <p className="text-sm font-semibold text-indigo-400 mb-4 flex items-center gap-1.5">
                    <Building2 size={15} /> {exp.company} • {exp.location}
                  </p>

                  <ul className="space-y-2">
                    {exp.highlights.map((point: string, pIdx: number) => (
                      <li key={pIdx} className={`flex items-start gap-2 text-xs sm:text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Academic Journey */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800/60">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Academic Milestones
                </h3>
                <p className="text-xs text-purple-400 font-mono">Formal education & background</p>
              </div>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-pink-500 before:to-transparent pl-8">
              {academicData.map((edu, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border transition-all duration-300 relative group hover:-translate-y-1 ${
                    isDark
                      ? "bg-slate-900/80 border-slate-800 hover:border-purple-500/40 shadow-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                      : "bg-white border-slate-200 hover:border-purple-300 shadow-md hover:shadow-xl"
                  }`}
                >
                  {/* Glowing Node on Timeline */}
                  <div className="absolute -left-[41px] top-7 w-4 h-4 rounded-full bg-purple-500 border-4 border-slate-950 shadow-[0_0_10px_#a855f7]" />

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {edu.tag}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                      <Calendar size={13} /> {edu.timeline}
                    </span>
                  </div>

                  <h4 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {edu.title}
                  </h4>
                  <p className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-1.5">
                    <MapPin size={15} /> {edu.institution}
                  </p>

                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {edu.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademicJourney;
