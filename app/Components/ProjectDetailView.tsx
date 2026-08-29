"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Project } from "../types";
import {
  ExternalLink,
  Github,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Code2,
  Sparkles,
  Clock,
  Lightbulb,
  Check,
  Share2,
  Maximize2,
  Minimize2,
  Pin,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

interface ProjectDetailViewProps {
  project: Project;
  isModal?: boolean;
}

const ProjectDetailView = ({ project, isModal = false }: ProjectDetailViewProps) => {
  const router = useRouter();
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isFullscreenImg, setIsFullscreenImg] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "challenges">("overview");

  // Collect all images (main + gallery)
  const allImages = [
    project.img,
    ...(Array.isArray(project.images) ? project.images : []),
  ].filter(Boolean) as string[];

  // Keyboard navigation for image slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allImages.length <= 1) return;
      if (e.key === "ArrowRight") {
        setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
      } else if (e.key === "ArrowLeft") {
        setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allImages.length]);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (allImages.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (allImages.length > 1) {
      setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + `/projects/${project._id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (isModal) {
      router.back();
    } else {
      router.push("/#projects");
    }
  };

  const techList: string[] = Array.isArray(project.tech)
    ? project.tech
    : project.tech
    ? project.tech.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const challengesText =
    project.ChallengesSolutions ||
    (project as any).challengesSolutions ||
    (project as any).challenges_solutions ||
    "Designed and architected using clean component hierarchy, optimized server-side rendering for sub-second page loads, and resilient API exception handling.";

  const estimateText =
    project.EstimateTime ||
    (project as any).estimateTime ||
    (project as any).estimate_time ||
    "Completed & Shipped";

  return (
    <div
      className={`w-full overflow-hidden transition-all duration-300 relative ${
        isModal
          ? isDark
            ? "bg-slate-950/95 text-slate-100 border border-slate-800/80 shadow-2xl backdrop-blur-2xl"
            : "bg-white/95 text-slate-900 border border-slate-200 shadow-2xl backdrop-blur-2xl"
          : "pt-24 pb-20 px-4 max-w-6xl mx-auto"
      }`}
    >
      {/* Non-modal back button */}
      {!isModal && (
        <button
          onClick={handleClose}
          className="mb-8 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Back to Portfolio</span>
        </button>
      )}

      {/* Modal Header Bar */}
      <div
        className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${
          isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/80"
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Pill */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              project.category === "wix"
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
            }`}
          >
            {project.category === "wix" ? "Wix Studio & No-Code" : "Custom Web Application"}
          </span>

          {/* Featured Badge */}
          {(project.is_featured || project.isFeatured || project.isPinned) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <Pin size={11} className="fill-amber-300" />
              <span>Featured</span>
            </span>
          )}

          {/* Date */}
          {project.createdAt && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 font-mono">
              <Calendar size={13} className="text-slate-500" />
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? "border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-indigo-500"
                : "border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-sm"
            }`}
            title="Share Project Link"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            <span className="hidden md:inline">{copied ? "Copied!" : "Share"}</span>
          </button>

          {/* Modal Close Button */}
          {isModal && (
            <button
              onClick={handleClose}
              className={`p-2 rounded-xl border transition-all duration-200 hover:rotate-90 cursor-pointer ${
                isDark
                  ? "border-slate-800 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700"
                  : "border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-sm"
              }`}
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 sm:p-8 space-y-8">
        {/* Title & Headline */}
        <div>
          <h1
            className={`text-2xl sm:text-4xl font-black tracking-tight mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {project.title}
          </h1>
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {project.description ||
              project.desc ||
              "An engineered digital solution featuring accessible interfaces, modern architecture, and high performance."}
          </p>
        </div>

        {/* 2-Column Grid: Left Gallery + Right Key Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Image Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className={`relative aspect-video rounded-2xl overflow-hidden border group shadow-lg ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
              }`}
            >
              {allImages.length > 0 ? (
                <div className="relative w-full h-full">
                  <Image
                    src={allImages[currentImgIndex]}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    priority
                    unoptimized
                  />
                  {/* Gradient Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                  <Code2 size={36} className="text-slate-600" />
                  <span className="text-xs font-mono">No Image Uploaded</span>
                </div>
              )}

              {/* Slider Controls */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-indigo-600 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-indigo-600 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Image Counter Badge */}
              {allImages.length > 0 && (
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/70 text-white backdrop-blur-md border border-white/20">
                  {currentImgIndex + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      currentImgIndex === idx
                        ? "border-indigo-500 shadow-md shadow-indigo-500/30 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Case Study Cards & Specs (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Tech Stack Pills */}
            <div
              className={`p-5 rounded-2xl border ${
                isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-indigo-400 mb-3">
                <Code2 size={15} />
                <span>Technologies & Frameworks</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {techList.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all ${
                      isDark
                        ? "bg-slate-800/80 border-slate-700/80 text-slate-200 hover:border-indigo-500/50"
                        : "bg-white border-slate-200 text-slate-800 hover:border-indigo-400 shadow-xs"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Challenges & Solution Card */}
            <div
              className={`p-5 rounded-2xl border ${
                isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-amber-400 mb-2">
                <Lightbulb size={15} />
                <span>Architecture & Solutions</span>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {challengesText}
              </p>
            </div>

            {/* Delivery Timeline Card */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Clock size={16} className="text-emerald-400" />
                <span className="font-mono uppercase font-semibold">Delivery Time:</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {estimateText}
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ExternalLink size={16} />
                  <span>Live Production Demo</span>
                </a>
              )}

              {project.category !== "wix" && project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-3.5 px-5 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-white hover:border-indigo-500 hover:bg-slate-750"
                      : "border-slate-200 bg-white text-slate-800 hover:border-indigo-600 hover:text-indigo-600 shadow-sm"
                  }`}
                >
                  <Github size={16} />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;
