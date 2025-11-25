"use client";

import React from "react";
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react"; // Added ArrowRight for the 'View All' link
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

// --- CUSTOM COLOR DEFINITION ---
// We will strictly use 'indigo' as requested.
const PRIMARY_ACCENT_CLASS = "text-indigo-500";
const PRIMARY_BG_CLASS = "bg-indigo-500/10";
const PRIMARY_SHADOW_CLASS = "shadow-indigo-500/20";

const academicData = [
  {
    title: "Bachelor of Social Science (BSS)",
    institution: "Govt. Begum Rokeya College, Rangpur",
    timeline: "Expected 2026",
    icon: "🎓",
  },
  {
    title: "Higher Secondary Certificate (HSC)",
    institution: "Cantonment Public School & College, Rangpur",
    timeline: "2020 – 2022",
    icon: "🏫",
  },
  {
    title: "Secondary School Certificate (SSC)",
    institution: "R.K.M School & College, Rangpur",
    timeline: "2018 – 2020",
    icon: "📘",
  },
];

const experienceData = [
  {
    role: "Wix Developer",
    company: "SM Technology",
    timeline: "Duration: 5 Months",
    icon: "💼",
    description:
      "Designed and developed professional Wix websites, optimized SEO, and handled cross-device experiences for clients.",
  },
];

// Enhanced InfoCard component
const InfoCard = ({
  title,
  subtitle,
  timeline,
  icon,
  isDark,
  colSpan = "col-span-1",
  description,
}: {
  title: string;
  subtitle: string;
  timeline: string;
  icon: string;
  isDark: boolean;
  colSpan?: string;
  description?: string;
}) => (
  <div
    className={`${colSpan} p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl h-full flex flex-col justify-between
      ${
        isDark
          ? `bg-slate-900 border-slate-700 shadow-xl ${PRIMARY_SHADOW_CLASS} hover:shadow-indigo-900/40`
          : `bg-white border-gray-100 shadow-xl hover:shadow-indigo-100`
      }`}
  >
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`p-3 rounded-xl ${PRIMARY_BG_CLASS} ${PRIMARY_ACCENT_CLASS} text-2xl`}
        >
          {icon}
        </div>
        <h3
          className={`text-2xl font-extrabold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h3>
      </div>

      <p
        className={`text-lg font-semibold mb-1 ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {subtitle}
      </p>

      {description && (
        <p
          className={`text-base mb-4 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </div>

    <div className="pt-4 border-t border-dashed border-gray-200 dark:border-slate-800 mt-4">
      <p
        className={`text-sm font-medium ${
          isDark ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        {timeline}
      </p>
    </div>
  </div>
);

export default function AcademicJourneySection() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  const sectionSubtitleClasses = `text-3xl font-bold tracking-tight mb-6 ${
    isDark ? "text-indigo-400" : "text-indigo-700"
  }`;

  return (
    <section
      id="experience"
      className={`py-32 relative z-10 ${isDark ? "" : "bg-gray-50/50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 text-center">
          <div
            className={`inline-block px-5 py-2 mb-4 rounded-full text-sm font-bold uppercase tracking-wider ${PRIMARY_BG_CLASS} ${PRIMARY_ACCENT_CLASS}`}
          >
            Academic Journey & Experience
          </div>

          <h2
            className={`text-5xl md:text-6xl font-extrabold mb-4 tracking-tighter ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            My <span className={PRIMARY_ACCENT_CLASS}>Background</span> Story
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            A quick glance at where I studied and the professional experiences
            that shaped my journey.
          </p>
        </div>

        {/* --- Enhanced Bento Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Experience Section Title (Spans all 3 columns) */}
          <div className="lg:col-span-3">
            <h3 className={sectionSubtitleClasses}>
              <Briefcase size={32} className="inline mr-3 align-text-bottom" />{" "}
              Professional Experience
            </h3>
          </div>

          {/* 2. Experience Card (Can be styled to take up 2 columns if needed, but 1 works for one entry) */}
          {experienceData.map((item) => (
            <InfoCard
              key={item.role}
              title={item.role}
              subtitle={item.company}
              timeline={item.timeline}
              icon={item.icon}
              description={item.description}
              isDark={isDark}
              colSpan="lg:col-span-2" // Make the main experience card wider for impact
            />
          ))}

          {/* Placeholder/Extra Info Card (If you only have one experience, this fills the gap) */}
          <div
            className={`p-8 rounded-3xl border transition-all duration-300 h-full flex flex-col justify-center items-center text-center
              ${
                isDark
                  ? "bg-slate-900 border-slate-700/50"
                  : "bg-white border-gray-100 shadow-sm"
              }`}
          >
            <p className={`text-xl font-semibold mb-2 ${PRIMARY_ACCENT_CLASS}`}>
              Seeking New Opportunities
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Open to Full-Stack or Front-end Development roles.
            </p>
            <a
              href="#contact"
              className={`mt-3 inline-flex items-center text-sm font-medium ${PRIMARY_ACCENT_CLASS} hover:opacity-80`}
            >
              <ArrowRight size={16} className="mr-1" /> Contact Me
            </a>
          </div>

          {/* Horizontal Rule for separation */}
          <div className="lg:col-span-3">
            <hr className="my-10 border-t border-gray-200 dark:border-slate-800" />
          </div>

          {/* 3. Academic Section Title (Spans all 3 columns) */}
          <div className="lg:col-span-3">
            <h3 className={sectionSubtitleClasses}>
              <GraduationCap
                size={32}
                className="inline mr-3 align-text-bottom"
              />{" "}
              Educational Background
            </h3>
          </div>

          {/* 4. Academic Cards (Flows naturally in the grid) */}
          {academicData.map((item) => (
            <InfoCard
              key={item.title}
              title={item.title}
              subtitle={item.institution}
              timeline={item.timeline}
              icon={item.icon}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
