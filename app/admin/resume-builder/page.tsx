"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import { ATSResumeData, SavedResume } from "@/app/types";
import {
  FULLSTACK_RESUME_TEMPLATE,
  WIX_FRONTEND_RESUME_TEMPLATE,
} from "@/app/lib/resumeTemplates";
import ATSResumeView from "@/app/Components/ATSResumeView";
import {
  Sparkles,
  Printer,
  Copy,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  FileText,
  Briefcase,
  Code2,
  Trash2,
  Layers,
  ArrowRight,
  Loader2,
  Sliders,
  ChevronDown,
  Eye,
  Plus,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ResumeBuilderPage() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  // Resume Data State
  const [resumeData, setResumeData] = useState<ATSResumeData>(FULLSTACK_RESUME_TEMPLATE);
  const [activePreset, setActivePreset] = useState<"fullstack" | "wix" | "custom">("fullstack");

  // Generator Form State
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [includeExperience, setIncludeExperience] = useState<boolean>(false);
  const [pageTarget, setPageTarget] = useState<"1" | "2">("1");

  // UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview");
  const [savedList, setSavedList] = useState<SavedResume[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  const fetchSavedResumes = async () => {
    try {
      setIsLoadingSaved(true);
      const res = await fetch("/api/resume/saved");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSavedList(data);
        }
      }
    } catch (e) {
      console.warn("Could not fetch saved resumes:", e);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  // Handle Preset Switching
  const handleSelectPreset = (preset: "fullstack" | "wix") => {
    setActivePreset(preset);
    if (preset === "fullstack") {
      setResumeData(FULLSTACK_RESUME_TEMPLATE);
      setIncludeExperience(false);
      setTargetRole("Full-Stack Developer");
    } else {
      setResumeData(WIX_FRONTEND_RESUME_TEMPLATE);
      setIncludeExperience(true);
      setTargetRole("Executive, Front End");
    }
    setStatusMessage({
      type: "info",
      text: `Loaded ${preset === "fullstack" ? "Full-Stack" : "Wix / Front-End"} master template format.`,
    });
  };

  // Handle AI Resume Generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please paste a Job Description first to tailor the resume.",
      });
      return;
    }

    try {
      setIsGenerating(true);
      setStatusMessage(null);

      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          targetRole: targetRole.trim() || undefined,
          includeExperience: includeExperience ? "true" : "false",
          pageTarget,
        }),
      });

      const data = await res.json();

      if (res.ok && data.resume) {
        setResumeData(data.resume);
        setActivePreset("custom");
        setActiveTab("preview");

        Swal.fire({
          icon: "success",
          title: "Resume Tailored Successfully!",
          text: `Selected top matching projects and optimized ATS keywords for "${data.resume.header.title}".`,
          toast: true,
          position: "top-end",
          timer: 3500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.error || "Failed to tailor resume with AI.");
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An unexpected error occurred while calling the AI model.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Save current resume to Neon PostgreSQL
  const handleSaveToDB = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/resume/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: resumeData.header.title,
          companyName: companyName.trim() || undefined,
          jobDescription: jobDescription.trim() || undefined,
          resumeData,
        }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Saved to Database!",
          text: "Resume saved successfully. You can load it anytime.",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
        fetchSavedResumes();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: e.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete saved resume
  const handleDeleteSaved = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Delete saved resume?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      await fetch(`/api/resume/saved?id=${id}`, { method: "DELETE" });
      fetchSavedResumes();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <FileText size={20} />
            </span>
            <h1 className="text-2xl font-black tracking-tight font-mono">
              AI ATS Resume Builder
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Paste any Job Description to automatically select the best matching projects from your portfolio,
            rewrite high-impact ATS bullet points, and generate an exact 1-page printable resume.
          </p>
        </div>

        {/* Master Format Preset Toggles */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 self-start md:self-auto">
          <button
            onClick={() => handleSelectPreset("fullstack")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePreset === "fullstack"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Full-Stack Preset
          </button>
          <button
            onClick={() => handleSelectPreset("wix")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePreset === "wix"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Wix / Front-End Preset
          </button>
        </div>
      </div>

      {/* Main Grid: Left Control Panel | Right Resume Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT FORM PANEL (5 cols) ================= */}
        <div className="xl:col-span-5 space-y-6">
          <div
            className={`p-6 rounded-3xl border transition-all ${
              isDark
                ? "bg-[#0C1222]/90 border-slate-800 shadow-xl shadow-black/20"
                : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-400 flex items-center gap-2">
                <Sparkles size={16} />
                <span>Job Description Tailoring</span>
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gemini AI Engine
              </span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Optional Company & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Target Role (Optional)
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Full-Stack Developer"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. TechCorp / Remote"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Page Length Target Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Page Length Budget <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPageTarget("1")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-start gap-2 cursor-pointer ${
                      pageTarget === "1"
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-sm"
                        : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <div>
                      <span className="block leading-tight">1 Page (Strict ATS)</span>
                      <span className="text-[10px] text-slate-500 font-normal leading-tight">
                        Compact, 2 projects, 0 overflow
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPageTarget("2")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-start gap-2 cursor-pointer ${
                      pageTarget === "2"
                        ? "border-purple-500 bg-purple-500/10 text-purple-400 shadow-sm"
                        : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
                    <div>
                      <span className="block leading-tight">2 Pages (Senior)</span>
                      <span className="text-[10px] text-slate-500 font-normal leading-tight">
                        3-4 projects + experience
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Job Description Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-400">
                    Paste Job Description (JD) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {jobDescription.length} characters
                  </span>
                </div>
                <textarea
                  required
                  rows={9}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job post requirements here (e.g. We are looking for a Full-Stack Developer proficient in React, Next.js, Node.js, PostgreSQL...)"
                  className="w-full p-3.5 text-xs font-mono rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all leading-relaxed"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeExperience}
                    onChange={(e) => setIncludeExperience(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Include SM Technology Experience</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setJobDescription("");
                    setTargetRole("");
                    setCompanyName("");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Clear Form
                </button>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    statusMessage.type === "error"
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      : statusMessage.type === "success"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  }`}
                >
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Analyzing JD & Tailoring Projects...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Tailored ATS Resume</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Action Tools */}
          <div
            className={`p-5 rounded-3xl border ${
              isDark ? "bg-[#0C1222]/80 border-slate-800" : "bg-white border-slate-200"
            } flex items-center justify-between gap-3`}
          >
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Save & Export
              </h3>
              <p className="text-[11px] text-slate-500">
                Store current resume version in PostgreSQL database
              </p>
            </div>

            <button
              onClick={handleSaveToDB}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Resume</span>
            </button>
          </div>

          {/* Saved Resumes History */}
          <div
            className={`p-5 rounded-3xl border ${
              isDark ? "bg-[#0C1222]/80 border-slate-800" : "bg-white border-slate-200"
            } space-y-3`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers size={14} />
                <span>Saved Resumes ({savedList.length})</span>
              </h3>
            </div>

            {isLoadingSaved ? (
              <div className="py-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin text-indigo-500" />
                <span>Loading saved versions...</span>
              </div>
            ) : savedList.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                No saved resumes yet. Click "Save Resume" to store tailored versions.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {savedList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-2 hover:border-indigo-500/50 transition-all"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">
                        {item.job_title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.company_name ? `${item.company_name} • ` : ""}
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setResumeData(item.resume_data);
                          setActivePreset("custom");
                          setActiveTab("preview");
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-600/10 text-indigo-500 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                        title="Load this resume"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PREVIEW & EDITOR PANEL (7 cols) ================= */}
        <div className="xl:col-span-7 space-y-4">
          {/* Tabs: Preview vs Quick Tweaker */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 max-w-md">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "preview"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Eye size={14} />
              <span>ATS Resume Preview</span>
            </button>
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "editor"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sliders size={14} />
              <span>Manual Text Tweaker</span>
            </button>
          </div>

          {/* VIEW: LIVE ATS PREVIEW */}
          {activeTab === "preview" && (
            <div className="w-full flex justify-center">
              <ATSResumeView
                data={resumeData}
                pageTarget={pageTarget}
                onPageTargetChange={setPageTarget}
                onUpdate={setResumeData}
              />
            </div>
          )}

          {/* VIEW: MANUAL TWEAKER FORM */}
          {activeTab === "editor" && (
            <div
              className={`p-6 rounded-3xl border ${
                isDark ? "bg-[#0C1222] border-slate-800" : "bg-white border-slate-200"
              } space-y-6`}
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Direct Field Tweaker
                </h3>
                <p className="text-xs text-slate-500">
                  You can directly edit any text before printing or saving.
                </p>
              </div>

              {/* Header Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={resumeData.header.title}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      header: { ...resumeData.header, title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* Career Objective */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Career Objective
                </label>
                <textarea
                  rows={3}
                  value={resumeData.careerObjective}
                  onChange={(e) =>
                    setResumeData({ ...resumeData, careerObjective: e.target.value })
                  }
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* Technical Skills */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400">
                  Technical Skills Categories
                </label>
                {resumeData.technicalSkills.map((cat, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={cat.category}
                      onChange={(e) => {
                        const updated = [...resumeData.technicalSkills];
                        updated[idx].category = e.target.value;
                        setResumeData({ ...resumeData, technicalSkills: updated });
                      }}
                      className="w-32 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      value={cat.skills}
                      onChange={(e) => {
                        const updated = [...resumeData.technicalSkills];
                        updated[idx].skills = e.target.value;
                        setResumeData({ ...resumeData, technicalSkills: updated });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-400">
                  Selected Projects ({resumeData.projects.length})
                </label>
                {resumeData.projects.map((proj, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-4 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/30"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Project {pIdx + 1} Title
                      </span>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[pIdx].title = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Technologies
                      </span>
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[pIdx].technologies = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        3 ATS Bullet Points
                      </span>
                      <div className="space-y-1.5 mt-1">
                        {proj.bullets.map((b, bIdx) => (
                          <textarea
                            key={bIdx}
                            rows={2}
                            value={b}
                            onChange={(e) => {
                              const updated = [...resumeData.projects];
                              updated[pIdx].bullets[bIdx] = e.target.value;
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 leading-relaxed"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Done Tweaking Button */}
              <button
                onClick={() => setActiveTab("preview")}
                className="w-full py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer"
              >
                Back to Live Preview & Print
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
