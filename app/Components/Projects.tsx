"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Project } from "../types";
import { RootState } from "../lib/store";
import ProjectCard from "./ProjectCard";
import { Github, Pin, ArrowRight, LayoutGrid, Sparkles, Briefcase } from "lucide-react";
import Link from "next/link";
import { NICHE_LIST, getProjectNicheId } from "../lib/projectNiches";

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects = [] }) => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [filter, setFilter] = useState<"all" | "custom" | "wix">("all");
  const [nicheFilter, setNicheFilter] = useState<string>("all");

  // ONLY SHOW PINNED / FEATURED PROJECTS ON HOME PAGE
  const pinnedProjects = projects.filter(
    (p) => Boolean(p.is_featured || p.isFeatured || p.isPinned)
  );

  // If no projects are explicitly pinned yet, fallback to top 3
  const homeProjects =
    pinnedProjects.length > 0 ? pinnedProjects : projects.slice(0, 3);

  const customProjects = homeProjects.filter(
    (p) => !p.category || p.category === "custom"
  );
  const wixProjects = homeProjects.filter((p) => p.category === "wix");

  // Apply both Platform and Niche filters
  const displayedProjects = homeProjects.filter((p) => {
    if (filter === "custom" && p.category === "wix") return false;
    if (filter === "wix" && p.category !== "wix") return false;

    if (nicheFilter !== "all") {
      if (getProjectNicheId(p) !== nicheFilter) return false;
    }

    return true;
  });

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDark
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-amber-50 text-amber-700 border border-amber-100"
            }`}
          >
            <Pin size={14} className="fill-amber-400" />
            Featured Creations
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Flagship <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-400 to-pink-500">Creations</span>
          </h2>

          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Handpicked full-stack systems and production web platforms. Hover over any card to preview the full webpage scroll.
          </p>

          {/* Primary Platform Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { id: "all" as const, label: "All Featured", count: homeProjects.length },
              { id: "custom" as const, label: "Full-Stack & Custom", count: customProjects.length },
              { id: "wix" as const, label: "Wix & No-Code", count: wixProjects.length },
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.45)] scale-105"
                      : isDark
                      ? "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isDark
                        ? "bg-slate-800 text-slate-400"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Niche Filter Pills */}
          <div className="mt-5 flex flex-wrap justify-center items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
              <Briefcase size={12} className="text-indigo-400" /> Niche:
            </span>
            {NICHE_LIST.map((niche) => {
              const isSelected = nicheFilter === niche.id;
              const count =
                niche.id === "all"
                  ? homeProjects.length
                  : homeProjects.filter((p) => getProjectNicheId(p) === niche.id).length;

              if (niche.id !== "all" && count === 0) return null;

              return (
                <button
                  key={niche.id}
                  onClick={() => setNicheFilter(niche.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 scale-105"
                      : isDark
                      ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs"
                  }`}
                >
                  <span>{niche.shortLabel || niche.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : isDark
                        ? "bg-slate-800 text-slate-500"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project) => (
              <ProjectCard key={project._id || project.title} project={project} />
            ))}
          </div>
        ) : (
          <div
            className={`p-12 text-center rounded-3xl border ${
              isDark ? "bg-slate-900/40 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-600"
            }`}
          >
            <p className="text-lg font-medium">No projects found for the selected category & niche.</p>
            <button
              onClick={() => {
                setFilter("all");
                setNicheFilter("all");
              }}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Action Banners */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base transition-all duration-300 shadow-[0_0_25px_rgba(99,102,241,0.45)] hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] hover:scale-105 active:scale-95 group"
          >
            <LayoutGrid size={20} />
            <span>Explore All Projects ({projects.length})</span>
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <a
            href="https://github.com/alvinmonir411"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 border-2 hover:scale-105 active:scale-95 ${
              isDark
                ? "bg-slate-900/80 border-slate-700 text-slate-200 hover:border-indigo-500 hover:text-white"
                : "bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 shadow-sm"
            }`}
          >
            <Github size={20} />
            <span>Explore on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
