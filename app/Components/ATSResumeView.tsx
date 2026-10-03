"use client";

import React, { useRef } from "react";
import { ATSResumeData } from "@/app/types";
import { Printer, Copy, Check, Download, ExternalLink, Edit3, Eye } from "lucide-react";

interface ATSResumeViewProps {
  data: ATSResumeData;
  isEditable?: boolean;
  onUpdate?: (updated: ATSResumeData) => void;
}

export default function ATSResumeView({
  data,
  isEditable = false,
  onUpdate,
}: ATSResumeViewProps) {
  const [copied, setCopied] = React.useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Floating Control Bar (Hidden during print) */}
      <div className="no-print w-full max-w-[850px] mb-4 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
            ✓ 100% ATS-Compliant Layout
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Single Page • Standard Serif • Zero Graphic Bloat
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyAsPlainText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Copy ATS Plain Text for Job Portals"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? "Copied Plain Text!" : "Copy Plain Text"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            title="Print or Save as ATS PDF"
          >
            <Printer size={14} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* 
        ATS-FRIENDLY RESUME CONTAINER 
        Strict Standard:
        - White Background
        - Classic High-Legibility Serif Font (Georgia, Times New Roman, serif)
        - Crisp pure black text (#111 or #000)
        - Exact single-page printable aspect ratio (Letter / A4)
      */}
      <div
        ref={printContainerRef}
        id="ats-resume-print-area"
        className="ats-resume-paper w-full max-w-[850px] bg-white text-black p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0"
        style={{
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
          lineHeight: "1.4",
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
          <hr className="border-t border-[#4b5563] mt-2.5 mb-3" />
        </header>

        {/* ================= CAREER OBJECTIVE ================= */}
        <section className="mb-3.5 text-[12.5px] sm:text-[13px] text-black leading-relaxed">
          <span className="font-bold text-black mr-1">Career Objective:</span>
          <span>{data.careerObjective}</span>
        </section>

        {/* ================= TECHNICAL SKILLS ================= */}
        <section className="mb-3.5 text-[12.5px] sm:text-[13px] leading-relaxed">
          <div className="font-bold text-black mb-1">Technical Skills:</div>
          <div className="space-y-1">
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
          <section className="mb-3.5 text-[12.5px] sm:text-[13px] leading-relaxed">
            <div className="font-bold text-black text-[14px] sm:text-[15px] mb-1">
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
        <section className="mb-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] sm:text-[17px] font-bold text-black">Projects</h2>
          </div>
          <hr className="border-t border-[#4b5563] mt-1 mb-2.5" />

          <div className="space-y-3.5">
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
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-black">
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
        <section className="mb-3 text-[12.5px] sm:text-[13px]">
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
          /* Hide all surrounding portfolio / admin elements */
          body * {
            visibility: hidden;
          }
          #ats-resume-print-area,
          #ats-resume-print-area * {
            visibility: visible;
          }
          #ats-resume-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0.35in 0.45in !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: letter;
            margin: 0.35in 0.45in;
          }
        }
      `}</style>
    </div>
  );
}
