"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  GitBranch,
  Star,
  GitCommit,
  ExternalLink,
  Code2,
  Activity,
  FolderGit2,
  RefreshCw,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

interface TopLanguage {
  name: string;
  count: number;
}

interface ActivityItem {
  id: string;
  type: string;
  action: string;
  repo: string;
  fullRepo: string;
  repoUrl: string;
  commitMessage: string;
  createdAt: string;
}

interface TopRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
}

interface GitHubData {
  username: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: TopLanguage[];
  recentActivities: ActivityItem[];
  topRepos: TopRepo[];
  syncedAt: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  HTML: "#e34f26",
  CSS: "#1572b6",
  Python: "#3776ab",
  Other: "#a855f7",
};

export default function GitHubStats() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/github");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch GitHub data:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalLangCount = data?.topLanguages?.reduce((acc, l) => acc + l.count, 0) || 1;

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffSeconds < 60) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 30) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return "recently";
    }
  };

  return (
    <section id="github" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDark
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "bg-purple-50 text-purple-700 border border-purple-100"
            }`}
          >
            <Github size={14} />
            Live GitHub Ecosystem
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Open Source & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Live Activity</span>
          </h2>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Direct real-time synchronization with GitHub. Tracking repository commits, active builds, and codebase metrics.
          </p>

          {/* Sync Status Badge */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Synced with @alvinmonir411</span>
            </div>
            <button
              onClick={fetchStats}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 transition"
              title="Refresh Live Data"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin text-indigo-400" : ""} />
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {/* Card 1: Public Repos */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 shadow-xl"
                : "bg-white border-slate-200 hover:border-indigo-300 shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <FolderGit2 size={20} />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-1">
              {loading ? "--" : `${data?.publicRepos || 75}+`}
            </div>
            <div className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              Public Repositories
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Live open-source codebases</p>
          </div>

          {/* Card 2: Total Stars */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-amber-500/50 shadow-xl"
                : "bg-white border-slate-200 hover:border-amber-300 shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Star size={20} />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-1">
              {loading ? "--" : `${data?.totalStars || 12}★`}
            </div>
            <div className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              Repository Stars
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Community recognition</p>
          </div>

          {/* Card 3: Forks / Collabs */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-purple-500/50 shadow-xl"
                : "bg-white border-slate-200 hover:border-purple-300 shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <GitBranch size={20} />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
              100%
            </div>
            <div className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              Commit Delivery
            </div>
            <p className="text-xs text-slate-500 mt-0.5">High consistency</p>
          </div>

          {/* Card 4: Top Language */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 shadow-xl"
                : "bg-white border-slate-200 hover:border-emerald-300 shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Code2 size={20} />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-1">
              TypeScript
            </div>
            <div className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              Primary Language
            </div>
            <p className="text-xs text-slate-500 mt-0.5">& Modern JavaScript</p>
          </div>
        </div>

        {/* 2-Column Bento: Languages & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left: Language Distribution (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className={`p-8 rounded-3xl border ${
                isDark ? "bg-slate-900/80 border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Code2 size={20} className="text-indigo-400" />
                Language Composition
              </h3>

              {/* Progress Bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-800/40 mb-6">
                {data?.topLanguages?.map((lang, idx) => {
                  const percentage = Math.round((lang.count / totalLangCount) * 100);
                  const color = LANGUAGE_COLORS[lang.name] || "#6366f1";
                  return (
                    <div
                      key={idx}
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                      title={`${lang.name}: ${percentage}%`}
                      className="h-full transition-all duration-500"
                    />
                  );
                })}
              </div>

              {/* Language Badges */}
              <div className="space-y-3">
                {data?.topLanguages?.map((lang, idx) => {
                  const percentage = Math.round((lang.count / totalLangCount) * 100);
                  const color = LANGUAGE_COLORS[lang.name] || "#6366f1";
                  return (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                          {lang.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-mono">{lang.count} repos</span>
                        <span className="text-xs font-mono font-bold text-indigo-400">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GitHub Card Link */}
            <div
              className={`p-6 rounded-3xl border flex items-center justify-between ${
                isDark ? "bg-slate-900/60 border-slate-800" : "bg-indigo-50/50 border-indigo-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Github size={22} />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                    github.com/alvinmonir411
                  </h4>
                  <p className="text-xs text-slate-500">Explore full repositories & source code</p>
                </div>
              </div>

              <a
                href={data?.profileUrl || "https://github.com/alvinmonir411"}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Right: Live Activity Stream (7 cols) */}
          <div className="lg:col-span-7">
            <div
              className={`p-8 rounded-3xl border ${
                isDark ? "bg-slate-900/80 border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <Activity size={20} className="text-emerald-400" />
                  Recent GitHub Pushes & Commits
                </h3>
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">Live Stream</span>
              </div>

              {loading ? (
                <div className="space-y-4 py-8 text-center text-slate-500 text-sm">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
                  <p>Syncing live commits...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.recentActivities?.slice(0, 5).map((act, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
                        isDark
                          ? "bg-slate-800/40 border-slate-800 hover:border-slate-700"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <GitCommit size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-slate-400 font-mono">{act.action}</span>
                              <a
                                href={act.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-indigo-400 hover:underline font-mono"
                              >
                                {act.repo}
                              </a>
                            </div>
                            <p className={`text-xs mt-1 font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              {act.commitMessage}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-slate-500 flex-shrink-0">
                          {formatRelativeTime(act.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Fallback if no recent events returned */}
                  {(!data?.recentActivities || data.recentActivities.length === 0) && (
                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-800/20 text-center text-xs text-slate-400 font-mono">
                      Continuous open-source contributions synced on @alvinmonir411
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
