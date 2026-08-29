"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Project } from "../types";
import ProjectCard from "../Components/ProjectCard";
import CanvasBackground from "../Components/CanvasBackground";
import NavBar from "../Components/Navber";
import {
  FolderGit2,
  Search,
  ArrowLeft,
  Pin,
  Sparkles,
  Github,
  Layers,
  Code2,
  Globe2,
} from "lucide-react";
import Link from "next/link";

export default function AllProjectsPage() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pinned" | "custom" | "wix">("all");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const pinnedProjects = projects.filter((p) =>
    Boolean(p.is_featured || p.isFeatured || p.isPinned)
  );
  const customProjects = projects.filter(
    (p) => !p.category || p.category === "custom"
  );
  const wixProjects = projects.filter((p) => p.category === "wix");

  const filteredProjects = projects.filter((p) => {
    // Tab filter
    if (activeTab === "pinned" && !p.is_featured && !p.isFeatured && !p.isPinned) {
      return false;
    }
    if (activeTab === "custom" && p.category === "wix") {
      return false;
    }
    if (activeTab === "wix" && p.category !== "wix") {
      return false;
    }

    // Search query filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const techString = Array.isArray(p.tech) ? p.tech.join(" ") : String(p.tech || "");
    return (
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      techString.toLowerCase().includes(term)
    );
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-500 relative ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <CanvasBackground />

      <main className="relative z-10 pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Back button */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              isDark
                ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-indigo-300 hover:bg-slate-50 shadow-sm"
            }`}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <a
            href="https://github.com/alvinmonir411"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 hover:underline"
          >
            <Github size={14} />
            <span>github.com/alvinmonir411</span>
          </a>
        </div>

        {/* Page Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDark
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
            }`}
          >
            <Layers size={14} />
            Complete Showcase
          </div>

          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            All <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Projects & Systems</span>
          </h1>

          <p
            className={`text-base sm:text-lg leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Explore my entire catalog of full-stack web applications, scalable client platforms, Wix solutions, and open-source contributions.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-6 mb-12">
          {/* Search Input */}
          <div className="max-w-xl mx-auto relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, technology (e.g. Next.js, MongoDB), or keyword..."
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                isDark
                  ? "bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 shadow-sm"
              }`}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              { id: "all" as const, label: "All Projects", count: projects.length, icon: null },
              { id: "pinned" as const, label: "Pinned on Home", count: pinnedProjects.length, icon: <Pin size={13} className="fill-amber-400 text-amber-400" /> },
              { id: "custom" as const, label: "Full-Stack & Custom", count: customProjects.length, icon: <Code2 size={13} /> },
              { id: "wix" as const, label: "Wix / No-Code", count: wixProjects.length, icon: <Globe2 size={13} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                      : isDark
                      ? "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                      : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-mono ${
                      isActive
                        ? "bg-white/25 text-white"
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
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-mono">Loading projects from Neon database...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id || project.title} project={project} />
            ))}
          </div>
        ) : (
          <div
            className={`p-16 text-center rounded-3xl border max-w-lg mx-auto ${
              isDark
                ? "bg-slate-900/50 border-slate-800 text-slate-400"
                : "bg-white border-slate-200 text-slate-600 shadow-sm"
            }`}
          >
            <FolderGit2 size={48} className="mx-auto text-indigo-400 mb-4 opacity-60" />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              No Projects Found
            </h3>
            <p className="text-sm">
              {searchTerm
                ? `No projects matched "${searchTerm}". Try a different keyword or category.`
                : "No projects in this category."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
