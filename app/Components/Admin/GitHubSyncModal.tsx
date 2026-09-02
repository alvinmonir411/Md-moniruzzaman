"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  X,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles,
  Sliders,
  Star,
  GitFork,
  Loader2,
  Globe,
  AlertCircle,
  Check,
} from "lucide-react";
import Image from "next/image";

export interface GitHubRepoItem {
  id: number;
  name: string;
  title: string;
  description: string;
  tech: string;
  techArray: string[];
  githubUrl: string;
  liveUrl: string;
  hasLiveUrl: boolean;
  stars: number;
  forks: number;
  updatedAt: string;
  screenshotUrl: string | null;
  socialPreviewUrl: string;
  defaultThumbnail: string;
  isAlreadyImported: boolean;
  importedProjectId: string | null;
}

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onProjectImported: () => void;
  onCustomizeRepo: (repo: GitHubRepoItem) => void;
}

export default function GitHubSyncModal({
  isOpen,
  onClose,
  isDark,
  onProjectImported,
  onCustomizeRepo,
}: GitHubSyncModalProps) {
  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unimported" | "imported">("all");
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchGitHubRepos();
    }
  }, [isOpen]);

  const fetchGitHubRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/github-sync");
      const data = await res.json();
      if (data.success && Array.isArray(data.repositories)) {
        setRepos(data.repositories);
      } else {
        setError(data.error || "Failed to load GitHub repositories.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to communicate with GitHub API.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (repo: GitHubRepoItem) => {
    setApprovingId(repo.id);
    try {
      const res = await fetch("/api/admin/github-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: repo.title,
          description: repo.description,
          tech: repo.tech,
          img: repo.defaultThumbnail,
          liveUrl: repo.liveUrl,
          githubUrl: repo.githubUrl,
          category: "custom",
          isFeatured: false,
          uploadToCloudinary: true,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Mark as imported in local state
        setRepos((prev) =>
          prev.map((r) => (r.id === repo.id ? { ...r, isAlreadyImported: true } : r))
        );
        setSuccessMessage(`"${repo.title}" approved and added to portfolio!`);
        onProjectImported();
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        alert(data.error || "Failed to import project");
      }
    } catch (err: any) {
      alert("Error approving project: " + err.message);
    } finally {
      setApprovingId(null);
    }
  };

  if (!isOpen) return null;

  const unimportedCount = repos.filter((r) => !r.isAlreadyImported).length;
  const importedCount = repos.filter((r) => r.isAlreadyImported).length;

  const filteredRepos = repos.filter((repo) => {
    if (activeFilter === "unimported" && repo.isAlreadyImported) return false;
    if (activeFilter === "imported" && !repo.isAlreadyImported) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      repo.title.toLowerCase().includes(query) ||
      repo.name.toLowerCase().includes(query) ||
      repo.description.toLowerCase().includes(query) ||
      repo.tech.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border transition-all ${
          isDark
            ? "bg-slate-900/95 border-slate-800 text-white"
            : "bg-white/95 border-slate-200 text-slate-900"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/50 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Github size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Sync & Import from GitHub</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  @alvinmonir411
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Selectively review, approve, and add your best GitHub repositories to your portfolio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchGitHubRepos}
              disabled={loading}
              title="Refresh repositories"
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? "border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
                  : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-indigo-400" : ""} />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? "border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white"
                  : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400/80 hover:text-emerald-400 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80">
          <div className="relative flex-1">
            <Search
              size={18}
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search GitHub repositories by name, description, tech..."
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border transition-all outline-none ${
                isDark
                  ? "bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All ({repos.length})
            </button>
            <button
              onClick={() => setActiveFilter("unimported")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === "unimported"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Ready to Import ({unimportedCount})
            </button>
            <button
              onClick={() => setActiveFilter("imported")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === "imported"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              In Portfolio ({importedCount})
            </button>
          </div>
        </div>

        {/* Repositories List Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 size={36} className="animate-spin text-indigo-500" />
              <p className="text-sm font-medium">Scanning GitHub repositories & generating previews...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <AlertCircle size={36} className="text-rose-500" />
              <p className="text-sm text-rose-400">{error}</p>
              <button
                onClick={fetchGitHubRepos}
                className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all"
              >
                Try Again
              </button>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
              <Sparkles size={32} className="text-indigo-400" />
              <p className="text-sm font-medium">No matching repositories found.</p>
              <p className="text-xs">Try adjusting your search query or filter tab.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRepos.map((repo) => {
                const isApproving = approvingId === repo.id;

                return (
                  <div
                    key={repo.id}
                    className={`group relative rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                      repo.isAlreadyImported
                        ? isDark
                          ? "bg-slate-800/30 border-slate-800 opacity-80"
                          : "bg-slate-50/70 border-slate-200/80"
                        : isDark
                        ? "bg-slate-800/60 border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800/90"
                        : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-indigo-500/5"
                    }`}
                  >
                    {/* Top Section */}
                    <div>
                      {/* Thumbnail Preview */}
                      <div className="relative w-full h-36 mb-3.5 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={repo.defaultThumbnail}
                          alt={repo.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback to social preview if live screenshot fails
                            (e.target as HTMLImageElement).src = repo.socialPreviewUrl;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        {/* Top badges on thumbnail */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-full backdrop-blur-md border ${
                              repo.isAlreadyImported
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-indigo-500/30 text-indigo-200 border-indigo-500/40"
                            }`}
                          >
                            {repo.isAlreadyImported ? "✓ In Portfolio" : "Ready to Import"}
                          </span>

                          <div className="flex items-center gap-2">
                            {repo.hasLiveUrl && (
                              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                                <Globe size={10} /> Live Demo
                              </span>
                            )}
                            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/60 text-amber-300 border border-white/10 backdrop-blur-md">
                              <Star size={10} className="fill-amber-300" /> {repo.stars}
                            </span>
                          </div>
                        </div>

                        {/* Repo Name over image */}
                        <div className="absolute bottom-2.5 left-3 right-3">
                          <h3 className="text-base font-bold text-white tracking-tight drop-shadow truncate">
                            {repo.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className={`text-xs leading-relaxed line-clamp-2 mb-3 ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {repo.description}
                      </p>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {repo.techArray.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${
                              isDark
                                ? "bg-slate-700/50 text-slate-300 border-slate-600/50"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={repo.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="View on GitHub"
                          className={`p-2 rounded-lg border transition-all ${
                            isDark
                              ? "border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
                              : "border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Github size={14} />
                        </a>
                        {repo.hasLiveUrl && (
                          <a
                            href={repo.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Open Live URL"
                            className={`p-2 rounded-lg border transition-all ${
                              isDark
                                ? "border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
                                : "border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onClose();
                            onCustomizeRepo(repo);
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                            isDark
                              ? "border-slate-700 hover:border-slate-600 text-slate-300 hover:bg-slate-800"
                              : "border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <Sliders size={13} />
                          Customize
                        </button>

                        <button
                          onClick={() => handleApprove(repo)}
                          disabled={isApproving}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl text-white transition-all flex items-center gap-1.5 shadow-md ${
                            repo.isAlreadyImported
                              ? "bg-slate-700 hover:bg-slate-600 opacity-80"
                              : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20"
                          }`}
                        >
                          {isApproving ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              Adding...
                            </>
                          ) : repo.isAlreadyImported ? (
                            <>
                              <Check size={13} />
                              Re-add
                            </>
                          ) : (
                            <>
                              <Sparkles size={13} />
                              Approve & Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-3.5 bg-slate-100/60 dark:bg-slate-800/40 border-t border-slate-200/50 dark:border-slate-800/80 rounded-b-2xl flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>💡 Only repositories you click <strong>"Approve & Add"</strong> will be published to your portfolio.</span>
          <button
            onClick={onClose}
            className="font-medium hover:text-slate-900 dark:hover:text-white"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
