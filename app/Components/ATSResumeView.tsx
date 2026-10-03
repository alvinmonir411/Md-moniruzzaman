"use client";

import React, { useRef, useState, useEffect } from "react";
import { ATSResumeData } from "@/app/types";
import {
  Printer,
  Copy,
  Check,
  Download,
  ExternalLink,
  Edit3,
  Eye,
  AlertTriangle,
  Sparkles,
  Scissors,
  Layers,
  ChevronDown,
} from "lucide-react";
import Swal from "sweetalert2";

interface ATSResumeViewProps {
  data: ATSResumeData;
  pageTarget?: "1" | "2";
  isEditable?: boolean;
  onUpdate?: (updated: ATSResumeData) => void;
  onPageTargetChange?: (target: "1" | "2") => void;
}

export default function ATSResumeView({
  data,
  pageTarget = "1",
  isEditable = false,
  onUpdate,
  onPageTargetChange,
}: ATSResumeViewProps) {
  const [copied, setCopied] = useState(false);
  const [spacingMode, setSpacingMode] = useState<"normal" | "compact" | "tight">("normal");
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Standard Letter/A4 single-page safe height budget at 850px container width
  const SINGLE_PAGE_BUDGET_PX = 980;

  // Measure DOM height after rendering
  useEffect(() => {
    const updateHeight = () => {
      if (printContainerRef.current) {
        setMeasuredHeight(printContainerRef.current.scrollHeight);
      }
    };

    updateHeight();
    const timeout = setTimeout(updateHeight, 200);

    const observer = new ResizeObserver(updateHeight);
    if (printContainerRef.current) {
      observer.observe(printContainerRef.current);
    }

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [data, spacingMode]);

  const isOverflow = pageTarget === "1" && measuredHeight > SINGLE_PAGE_BUDGET_PX;
  const overflowPercentage = measuredHeight
    ? Math.round((measuredHeight / SINGLE_PAGE_BUDGET_PX) * 100)
    : 100;
  const estimatedPages = (measuredHeight / SINGLE_PAGE_BUDGET_PX).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  // Auto-compress resume so it fits strictly onto 1 page
  const handleAutoFitToOnePage = () => {
    if (!onUpdate) return;

    const updated: ATSResumeData = JSON.parse(JSON.stringify(data));

    // 1. If experience is enabled and there are projects, turn off experience
    if (updated.experience?.enabled && updated.projects.length >= 2) {
      updated.experience.enabled = false;
    }

    // 2. Keep at most top 2 projects
    if (updated.projects.length > 2) {
      updated.projects = updated.projects.slice(0, 2);
    }

    // 3. Trim each project's bullets to max 3 concise bullet points (shorten long ones)
    updated.projects = updated.projects.map((proj) => ({
      ...proj,
      bullets: proj.bullets.slice(0, 3).map((b) => {
        if (b.length > 130) {
          const cut = b.slice(0, 125);
          const lastSpace = cut.lastIndexOf(" ");
          return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut) + ".";
        }
        return b;
      }),
    }));

    // 4. Switch spacing mode to compact
    setSpacingMode("compact");

    onUpdate(updated);

    Swal.fire({
      icon: "success",
      title: "Auto-Compressed to 1 Page!",
      text: "Streamlined projects, shortened bullet points, and set compact layout to fit perfectly on a single sheet.",
      toast: true,
      position: "top-end",
      timer: 3500,
      showConfirmButton: false,
    });
  };

  // Remove SM Technology experience with one click
  const handleRemoveExperience = () => {
    if (!onUpdate) return;
    const updated = {
      ...data,
      experience: data.experience ? { ...data.experience, enabled: false } : undefined,
    };
    onUpdate(updated);
  };

  // Keep only top 2 projects
  const handleKeepTopTwoProjects = () => {
    if (!onUpdate) return;
    const updated = {
      ...data,
      projects: data.projects.slice(0, 2),
    };
    onUpdate(updated);
  };

  const copyAsPlainText = () => {
    let text = `${data.header.name}\n${data.header.title}\n`;
    text += `${data.header.phone} | ${data.header.email} | ${data.header.location}\n`;
    text += `Portfolio: ${data.header.portfolioDisplay} | GitHub: ${data.header.githubDisplay}\n`;
    text += `LinkedIn: ${data.header.linkedinDisplay}\n\n`;

    text += `Career Objective: ${data.careerObjective}\n\n`;

    text += `Technical Skills:\n`;
    data.technicalSkills.forEach((s) => {
      text += `${s.category}: ${s.skills}\n`;
    });
    text += `\n`;

    if (data.experience?.enabled) {
      text += `Experience:\n`;
      text += `${data.experience.role} | ${data.experience.company} (${data.experience.duration})\n`;
      text += `${data.experience.description}\n\n`;
    }

    text += `Projects\n`;
    data.projects.forEach((p) => {
      const links = [
        p.liveUrl ? "Live Link" : "",
        p.clientSiteUrl ? "Client Site" : "",
        p.serverSiteUrl ? "Server Site" : "",
      ]
        .filter(Boolean)
        .join(" | ");

      text += `${p.title}${links ? `  [${links}]` : ""}\n`;
      text += `Technologies: ${p.technologies}\n`;
      p.bullets.forEach((b) => {
        text += `• ${b}\n`;
      });
      text += `\n`;
    });

    text += `Education\n${data.education.degree} ${data.education.expectedYear} (${data.education.location})\n\n`;
    text += `Languages: ${data.languages}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Spacing style variations based on user selection
  const paddingClass =
    spacingMode === "tight"
      ? "p-5 sm:p-7"
      : spacingMode === "compact"
      ? "p-6 sm:p-8"
      : "p-7 sm:p-10";

  const sectionMarginClass =
    spacingMode === "tight"
      ? "mb-2"
      : spacingMode === "compact"
      ? "mb-2.5"
      : "mb-3";

  const projectSpacingClass =
    spacingMode === "tight"
      ? "space-y-2"
      : spacingMode === "compact"
      ? "space-y-2.5"
      : "space-y-3";

  return (
    <div className="w-full flex flex-col items-center">
      {/* ================= CONTROLS & LENGTH BUDGET BAR (Hidden during print) ================= */}
      <div className="no-print w-full max-w-[850px] mb-4 space-y-3">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Page Target Selector: 1 Page vs 2 Pages */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Target:
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => onPageTargetChange && onPageTargetChange("1")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  pageTarget === "1"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                1 Page (Strict)
              </button>
              <button
                type="button"
                onClick={() => onPageTargetChange && onPageTargetChange("2")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  pageTarget === "2"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                2 Pages (Senior)
              </button>
            </div>

            {/* Real-time Height Budget Status Badge */}
            {pageTarget === "1" ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  isOverflow
                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/30 animate-pulse"
                    : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                }`}
              >
                {isOverflow ? (
                  <>
                    <AlertTriangle size={13} />
                    <span>
                      {overflowPercentage}% Height (⚠️ Spills to Page 2)
                    </span>
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    <span>Fits 1 Page ({overflowPercentage}%)</span>
                  </>
                )}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                2-Page Layout Active ({estimatedPages} Pages)
              </span>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Spacing Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-medium text-slate-500">
              <span className="px-1.5 hidden md:inline">Density:</span>
              <button
                type="button"
                onClick={() => setSpacingMode("normal")}
                className={`px-2 py-0.5 rounded-lg ${
                  spacingMode === "normal"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                    : "hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setSpacingMode("compact")}
                className={`px-2 py-0.5 rounded-lg ${
                  spacingMode === "compact"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                    : "hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Compact
              </button>
              <button
                type="button"
                onClick={() => setSpacingMode("tight")}
                className={`px-2 py-0.5 rounded-lg ${
                  spacingMode === "tight"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                    : "hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Tight
              </button>
            </div>

            <button
              onClick={copyAsPlainText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title="Copy ATS Plain Text for Job Portals"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Plain Text"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              title="Print or Save as ATS PDF"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* ================= 1-PAGE OVERFLOW WARNING & AUTO-FIT BANNER ================= */}
        {isOverflow && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 space-y-3 shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                    ⚠️ 1-Page Overflow Warning (Estimated {estimatedPages} Pages)
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                    আপনার রেজুমেটি ১-পেজের নির্ধারিত উচ্চতা অতিক্রম করেছে (প্রায় +
                    {measuredHeight - SINGLE_PAGE_BUDGET_PX}px বেশি)। প্রিন্ট করলে এটি দ্বিতীয় পেজে চলে যাবে।
                  </p>
                </div>
              </div>

              {/* ✨ ONE-CLICK AUTO FIT TO 1-PAGE BUTTON */}
              <button
                type="button"
                onClick={handleAutoFitToOnePage}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-indigo-600 hover:opacity-95 text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Sparkles size={14} />
                <span>✨ Auto-Fit to 1 Page</span>
              </button>
            </div>

            {/* Smart Specific Suggestions */}
            <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-amber-500 text-[11px] uppercase">
                Suggestions:
              </span>

              {data.experience?.enabled && (
                <button
                  type="button"
                  onClick={handleRemoveExperience}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Scissors size={12} />
                  <span>Remove SM Technology Experience</span>
                </button>
              )}

              {data.projects.length > 2 && (
                <button
                  type="button"
                  onClick={handleKeepTopTwoProjects}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Scissors size={12} />
                  <span>Keep Top 2 Projects Only</span>
                </button>
              )}

              {spacingMode !== "compact" && spacingMode !== "tight" && (
                <button
                  type="button"
                  onClick={() => setSpacingMode("compact")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Layers size={12} />
                  <span>Switch to Compact Density</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 
        ================= ATS-FRIENDLY RESUME PAPER ================= 
        Strict Standard:
        - White Background
        - Classic High-Legibility Serif Font (Georgia, Times New Roman, serif)
        - Crisp pure black text (#111 or #000)
        - Exact single-page printable aspect ratio (Letter / A4)
      */}
      <div
        ref={printContainerRef}
        id="ats-resume-print-area"
        className={`ats-resume-paper w-full max-w-[850px] bg-white text-black ${paddingClass} shadow-2xl rounded-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 relative`}
        style={{
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
          lineHeight: spacingMode === "tight" ? "1.32" : spacingMode === "compact" ? "1.36" : "1.4",
          color: "#111827",
        }}
      >
        {/* ================= HEADER SECTION ================= */}
        <header className="mb-3">
          <h1
            className="text-[26px] sm:text-[30px] font-bold tracking-tight text-black leading-tight"
            style={{ fontWeight: 700 }}
          >
            {data.header.name}
          </h1>

          <div className="text-[15px] sm:text-[16px] text-black font-semibold mt-0.5">
            {data.header.title}
          </div>

          <div className="text-[12.5px] sm:text-[13px] text-black mt-1 leading-snug">
            <span>{data.header.phone}</span>
            <span className="mx-1.5 font-normal text-slate-500">|</span>
            <a
              href={`mailto:${data.header.email}`}
              className="text-black hover:underline"
            >
              {data.header.email}
            </a>
            <span className="mx-1.5 font-normal text-slate-500">|</span>
            <span>{data.header.location}</span>
          </div>

          <div className="text-[12.5px] sm:text-[13px] text-black mt-0.5 leading-snug">
            <span>Portfolio: </span>
            <a
              href={data.header.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#1d4ed8] hover:underline"
            >
              {data.header.portfolioDisplay}
            </a>
            <span className="mx-1.5 font-normal text-slate-500">|</span>
            <span>GitHub: </span>
            <a
              href={data.header.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#1d4ed8] hover:underline"
            >
              {data.header.githubDisplay}
            </a>
          </div>

          <div className="text-[12.5px] sm:text-[13px] text-black mt-0.5 leading-snug">
            <span>LinkedIn: </span>
            <a
              href={data.header.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#1d4ed8] hover:underline"
            >
              {data.header.linkedinDisplay}
            </a>
          </div>

          {/* Header Divider Line */}
          <hr className="border-t border-[#4b5563] mt-2 mb-2.5" />
        </header>

        {/* ================= CAREER OBJECTIVE ================= */}
        <section className={`${sectionMarginClass} text-[12.5px] sm:text-[13px] text-black leading-relaxed`}>
          <span className="font-bold text-black mr-1">Career Objective:</span>
          <span>{data.careerObjective}</span>
        </section>

        {/* ================= TECHNICAL SKILLS ================= */}
        <section className={`${sectionMarginClass} text-[12.5px] sm:text-[13px] leading-relaxed`}>
          <div className="font-bold text-black mb-0.5">Technical Skills:</div>
          <div className="space-y-0.5">
            {data.technicalSkills.map((cat, idx) => (
              <div key={idx}>
                <span className="font-bold text-black">{cat.category}: </span>
                <span className="text-black">{cat.skills}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= EXPERIENCE (Optional) ================= */}
        {data.experience && data.experience.enabled && (
          <section className={`${sectionMarginClass} text-[12.5px] sm:text-[13px] leading-relaxed`}>
            <div className="font-bold text-black text-[14px] sm:text-[15px] mb-0.5">
              Experience:
            </div>
            <div className="font-bold text-black">
              {data.experience.role} | {data.experience.company} ({data.experience.duration})
            </div>
            <p className="text-black mt-0.5 leading-relaxed">
              {data.experience.description}
            </p>
          </section>
        )}

        {/* ================= PROJECTS SECTION ================= */}
        <section className={sectionMarginClass}>
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] sm:text-[17px] font-bold text-black">Projects</h2>
          </div>
          <hr className="border-t border-[#4b5563] mt-0.5 mb-2" />

          <div className={projectSpacingClass}>
            {data.projects.map((proj, pIdx) => {
              return (
                <div key={pIdx} className="text-[12.5px] sm:text-[13px] leading-snug">
                  {/* Title & Links Row */}
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="font-bold text-black">{proj.title}</span>

                    {/* Links */}
                    <div className="flex items-center text-[12.5px] text-[#1d4ed8]">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          Live Link
                        </a>
                      )}
                      {proj.clientSiteUrl && (
                        <>
                          <span className="text-slate-400 mx-1">|</span>
                          <a
                            href={proj.clientSiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            Client Site
                          </a>
                        </>
                      )}
                      {proj.serverSiteUrl && (
                        <>
                          <span className="text-slate-400 mx-1">|</span>
                          <a
                            href={proj.serverSiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            Server Site
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Technologies Row */}
                  <div className="mt-0.5 text-black">
                    <span className="font-bold">Technologies: </span>
                    <span>{proj.technologies}</span>
                  </div>

                  {/* Bullet Points */}
                  <ul className="list-disc pl-5 mt-0.5 space-y-0.5 text-black">
                    {proj.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed pl-0.5">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= EDUCATION SECTION ================= */}
        <section className="mb-2 text-[12.5px] sm:text-[13px]">
          <div className="font-bold text-black text-[14px] sm:text-[15px] mb-0.5">
            Education
          </div>
          <div className="text-black">
            <span>{data.education.degree} </span>
            <span>{data.education.expectedYear} </span>
            <span>({data.education.location})</span>
          </div>
        </section>

        {/* ================= LANGUAGES SECTION ================= */}
        <section className="text-[12.5px] sm:text-[13px] text-black">
          <span className="font-bold text-black">Languages: </span>
          <span>{data.languages}</span>
        </section>
      </div>

      {/* Native Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0.3in 0.4in;
          }

          /* Hide all admin navigation and non-print items completely from flow */
          aside,
          header,
          nav,
          footer,
          .no-print {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: 100% !important;
            overflow: visible !important;
            background: #ffffff !important;
            color: #000000 !important;
          }

          /* Reset all parent wrappers */
          main,
          div,
          section {
            min-height: 0 !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Only show resume paper and its children */
          body * {
            visibility: hidden;
          }

          #ats-resume-print-area,
          #ats-resume-print-area * {
            visibility: visible;
          }

          #ats-resume-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important; /* CRITICAL: Prevents margin-doubling which pushed content to page 2! */
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
