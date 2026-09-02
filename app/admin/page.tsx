"use client";

import React, { useEffect, useState } from "react";
import {
    FolderKanban,
    Award,
    MessageSquare,
    TrendingUp,
    Activity,
    FileText,
    Sparkles,
    Github,
    ExternalLink,
    ArrowUpRight,
    CheckCircle2,
    Database,
    Cloud,
    Bot,
    Plus,
    Clock,
    User,
    Mail,
    Pin,
    Globe,
    Code,
    Layers,
    Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Project } from "../types";
import Link from "next/link";

interface MessageItem {
    _id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    isRead?: boolean;
    createdAt?: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const isDark = useSelector((state: RootState) => state.theme.isDark);

    const [stats, setStats] = useState({
        projects: 0,
        customProjects: 0,
        wixProjects: 0,
        skills: 0,
        messages: 0,
        unreadMessages: 0,
        views: 0,
    });
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [recentMessages, setRecentMessages] = useState<MessageItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [projectsRes, skillsRes, messagesRes, viewsRes] = await Promise.all([
                fetch("/api/projects"),
                fetch("/api/skills"),
                fetch("/api/messages"),
                fetch("/api/views"),
            ]);

            const [projects, skills, messages, viewsData] = await Promise.all([
                projectsRes.json(),
                skillsRes.json(),
                messagesRes.json(),
                viewsRes.json(),
            ]);

            const projectList: Project[] = Array.isArray(projects) ? projects : [];
            const messageList: MessageItem[] = Array.isArray(messages) ? messages : [];
            const skillsList = Array.isArray(skills) ? skills : [];

            const customCount = projectList.filter((p) => p.category !== "wix").length;
            const wixCount = projectList.filter((p) => p.category === "wix").length;
            const unreadCount = messageList.filter((m) => !m.isRead).length;

            setStats({
                projects: projectList.length,
                customProjects: customCount,
                wixProjects: wixCount,
                skills: skillsList.length,
                messages: messageList.length,
                unreadMessages: unreadCount,
                views: typeof viewsData?.views === "number" ? viewsData.views : 16,
            });

            setRecentProjects(projectList.slice(0, 4));
            setRecentMessages(messageList.slice(0, 3));
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Top Welcome Hero Banner */}
            <div className={`relative overflow-hidden rounded-3xl border ${
                isDark 
                    ? "border-indigo-500/30 bg-gradient-to-br from-[#0F172A] via-[#161F38] to-[#0A0E1A] text-white" 
                    : "border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900"
            } p-6 sm:p-8 shadow-2xl`}>
                {/* Background ambient glow circles */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-indigo-500/15 border border-indigo-500/40 text-indigo-400">
                            <Sparkles size={13} className="text-amber-400" />
                            <span>PixelNest Studio Command Center</span>
                        </div>
                        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Moniruzzaman!</span> 👋
                        </h1>
                        <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? "text-slate-200" : "text-slate-600"}`}>
                            Your agency portfolio is live at{" "}
                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 underline font-bold font-mono inline-flex items-center gap-1"
                            >
                                pexelneststudio.vercel.app <ArrowUpRight size={13} />
                            </a>
                            . Real-time visitor traffic, GitHub repositories, and client inquiries are all synced.
                        </p>
                    </div>

                    {/* Quick Hero Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => router.push("/admin/projects")}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/30 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <Plus size={15} />
                            <span>New Project</span>
                        </button>
                        <button
                            onClick={() => router.push("/admin/projects")}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                                isDark
                                    ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                            }`}
                        >
                            <Github size={15} className="text-purple-400" />
                            <span>Sync GitHub</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4 Premium Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Projects KPI */}
                <div
                    onClick={() => router.push("/admin/projects")}
                    className={`rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${
                        isDark
                            ? "bg-[#0F172A] border-slate-800 text-white hover:border-indigo-500/50"
                            : "bg-white border-slate-200 text-slate-900 hover:border-indigo-300"
                    } shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <FolderKanban size={20} />
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                            Live Showcase
                        </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <h3 className={`text-3xl font-black font-mono tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            {loading ? "..." : stats.projects}
                        </h3>
                        <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>Projects Published</span>
                    </div>
                    <div className={`mt-3 pt-3 border-t ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-600"} flex items-center justify-between text-[11px]`}>
                        <span>{stats.customProjects} Custom Code</span>
                        <span>•</span>
                        <span>{stats.wixProjects} Wix / No-Code</span>
                    </div>
                </div>

                {/* 2. Skills KPI */}
                <div
                    onClick={() => router.push("/admin/skills")}
                    className={`rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${
                        isDark
                            ? "bg-[#0F172A] border-slate-800 text-white hover:border-purple-500/50"
                            : "bg-white border-slate-200 text-slate-900 hover:border-purple-300"
                    } shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform">
                            <Award size={20} />
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                            Tech Stack
                        </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <h3 className={`text-3xl font-black font-mono tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            {loading ? "..." : stats.skills}
                        </h3>
                        <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>Core Skills</span>
                    </div>
                    <div className={`mt-3 pt-3 border-t ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-600"} flex items-center justify-between text-[11px]`}>
                        <span>Next.js, React, Node.js</span>
                        <ArrowUpRight size={12} className="text-purple-400" />
                    </div>
                </div>

                {/* 3. Messages KPI */}
                <div
                    onClick={() => router.push("/admin/messages")}
                    className={`rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${
                        isDark
                            ? "bg-[#0F172A] border-slate-800 text-white hover:border-emerald-500/50"
                            : "bg-white border-slate-200 text-slate-900 hover:border-emerald-300"
                    } shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                            <MessageSquare size={20} />
                        </div>
                        {stats.unreadMessages > 0 ? (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 animate-pulse">
                                {stats.unreadMessages} New
                            </span>
                        ) : (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                All Caught Up
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline justify-between">
                        <h3 className={`text-3xl font-black font-mono tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            {loading ? "..." : stats.messages}
                        </h3>
                        <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>Inquiries</span>
                    </div>
                    <div className={`mt-3 pt-3 border-t ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-600"} flex items-center justify-between text-[11px]`}>
                        <span>Client Messages</span>
                        <ArrowUpRight size={12} className="text-emerald-400" />
                    </div>
                </div>

                {/* 4. Traffic Views KPI */}
                <div
                    className={`rounded-2xl p-5 border transition-all duration-300 ${
                        isDark
                            ? "bg-[#0F172A] border-slate-800 text-white hover:border-amber-500/50"
                            : "bg-white border-slate-200 text-slate-900 hover:border-amber-300"
                    } shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
                            <Activity size={20} />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Live Pulse</span>
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <h3 className={`text-3xl font-black font-mono tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            {loading ? "..." : stats.views}
                        </h3>
                        <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>Site Views</span>
                    </div>
                    <div className={`mt-3 pt-3 border-t ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-600"} flex items-center justify-between text-[11px]`}>
                        <span>Unique Visitor Hits</span>
                        <TrendingUp size={13} className="text-emerald-400" />
                    </div>
                </div>
            </div>

            {/* Main 2-Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Recent Projects & Cloud Infrastructure (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Recent Projects Showcase */}
                    <div
                        className={`rounded-3xl p-6 border ${
                            isDark ? "bg-[#0F172A] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        } shadow-xl`}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                                    <FolderKanban size={18} className="text-indigo-400" />
                                    <span>Active Portfolio Projects</span>
                                </h2>
                                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                                    Latest projects published on your live portfolio
                                </p>
                            </div>

                            <Link
                                href="/admin/projects"
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                            >
                                <span>View All</span>
                                <ArrowUpRight size={13} />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="py-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
                            </div>
                        ) : recentProjects.length === 0 ? (
                            <div className={`text-center py-10 border-2 border-dashed rounded-2xl ${isDark ? "border-slate-700 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}>
                                <FolderKanban size={36} className="mx-auto text-slate-400 mb-2" />
                                <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>No Projects Published Yet</h4>
                                <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                                    Sync your public repositories from GitHub or create your first project.
                                </p>
                                <button
                                    onClick={() => router.push("/admin/projects")}
                                    className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                                >
                                    + Add First Project
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {recentProjects.map((project) => (
                                    <div
                                        key={project._id}
                                        onClick={() => router.push("/admin/projects")}
                                        className={`rounded-2xl border p-4 transition-all hover:border-indigo-500/50 hover:shadow-lg cursor-pointer group flex flex-col justify-between ${
                                            isDark ? "bg-[#161F37] border-slate-700/80 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                        }`}
                                    >
                                        <div>
                                            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-slate-950">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={project.img}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            "https://placehold.co/600x400/1e293b/ffffff?text=Project+Thumbnail";
                                                    }}
                                                />
                                                <div className="absolute top-2 left-2 flex gap-1">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/80 text-indigo-300 backdrop-blur-md border border-white/10">
                                                        {project.category === "wix" ? "Wix" : "Custom Code"}
                                                    </span>
                                                    {project.is_featured && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                                                            📌 Pinned
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className={`text-sm font-bold line-clamp-1 group-hover:text-indigo-400 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                                                {project.title}
                                            </h3>
                                            <p className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className={`mt-3 pt-2.5 border-t ${isDark ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-500"} flex items-center justify-between text-[11px]`}>
                                            <span className="truncate max-w-[150px] font-mono font-medium">{project.tech}</span>
                                            <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                                                Manage <ArrowUpRight size={10} />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cloud Infrastructure & System Status */}
                    <div
                        className={`rounded-3xl p-6 border ${
                            isDark ? "bg-[#0F172A] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        } shadow-xl`}
                    >
                        <h2 className={`text-base font-bold tracking-tight flex items-center gap-2 mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                            <Activity size={18} className="text-emerald-400" />
                            <span>PixelNest Cloud Infrastructure</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                            {/* 1. Neon DB */}
                            <div className={`p-3.5 rounded-2xl border ${isDark ? "border-emerald-500/30 bg-emerald-950/20" : "border-emerald-200 bg-emerald-50/50"} flex flex-col justify-between`}>
                                <div className="flex items-center justify-between mb-2">
                                    <Database size={18} className="text-emerald-400" />
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Neon PostgreSQL</h4>
                                    <p className="text-[10px] text-emerald-400 font-mono font-semibold mt-0.5">🟢 Connected & Active</p>
                                </div>
                            </div>

                            {/* 2. Cloudinary */}
                            <div className={`p-3.5 rounded-2xl border ${isDark ? "border-indigo-500/30 bg-indigo-950/20" : "border-indigo-200 bg-indigo-50/50"} flex flex-col justify-between`}>
                                <div className="flex items-center justify-between mb-2">
                                    <Cloud size={18} className="text-indigo-400" />
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Cloudinary CDN</h4>
                                    <p className="text-[10px] text-indigo-400 font-mono font-semibold mt-0.5">🟢 Media Storage Live</p>
                                </div>
                            </div>

                            {/* 3. Gemini AI */}
                            <div className={`p-3.5 rounded-2xl border ${isDark ? "border-purple-500/30 bg-purple-950/20" : "border-purple-200 bg-purple-50/50"} flex flex-col justify-between`}>
                                <div className="flex items-center justify-between mb-2">
                                    <Bot size={18} className="text-purple-400" />
                                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Google Gemini AI</h4>
                                    <p className="text-[10px] text-purple-400 font-mono font-semibold mt-0.5">🟢 Auto-Writer Ready</p>
                                </div>
                            </div>

                            {/* 4. Vercel Deployment */}
                            <div className={`p-3.5 rounded-2xl border ${isDark ? "border-amber-500/30 bg-amber-950/20" : "border-amber-200 bg-amber-50/50"} flex flex-col justify-between`}>
                                <div className="flex items-center justify-between mb-2">
                                    <Globe size={18} className="text-amber-400" />
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Vercel Edge Node</h4>
                                    <p className="text-[10px] text-amber-400 font-mono font-semibold mt-0.5">🟢 SSL & HTTPS Live</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Quick Studio Actions & Recent Inquiries (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Quick Studio Actions */}
                    <div
                        className={`rounded-3xl p-6 border ${
                            isDark ? "bg-[#0F172A] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        } shadow-xl space-y-4`}
                    >
                        <h2 className={`text-base font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                            <Sparkles size={16} className="text-amber-400" />
                            <span>Quick Actions</span>
                        </h2>

                        <div className="space-y-2.5">
                            <button
                                onClick={() => router.push("/admin/projects")}
                                className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                                    isDark
                                        ? "border-indigo-500/40 bg-indigo-950/30 hover:bg-indigo-900/50"
                                        : "border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
                                        <Plus size={16} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                            Create Project (with AI)
                                        </h4>
                                        <p className={`text-[10px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>1-click auto-writing copy</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={14} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            <button
                                onClick={() => router.push("/admin/projects")}
                                className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                                    isDark
                                        ? "border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/50"
                                        : "border-purple-200 bg-purple-50/70 hover:bg-purple-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
                                        <Github size={16} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                            Sync from GitHub
                                        </h4>
                                        <p className={`text-[10px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>Scan & import repos</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={14} className="text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            <button
                                onClick={() => router.push("/admin/skills")}
                                className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                                    isDark
                                        ? "border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/50"
                                        : "border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md">
                                        <Award size={16} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                            Manage Skills
                                        </h4>
                                        <p className={`text-[10px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>Add or edit tech competencies</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={14} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            <button
                                onClick={() => router.push("/admin/experience")}
                                className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                                    isDark
                                        ? "border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/50"
                                        : "border-amber-200 bg-amber-50/70 hover:bg-amber-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-amber-600 text-white shadow-md">
                                        <Briefcase size={16} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                            Add Experience
                                        </h4>
                                        <p className={`text-[10px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>Career timeline & roles</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={14} className="text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            <button
                                onClick={() => router.push("/admin/settings")}
                                className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                                    isDark
                                        ? "border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/50"
                                        : "border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-cyan-600 text-white shadow-md">
                                        <FileText size={16} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                            Upload Resume / CV
                                        </h4>
                                        <p className={`text-[10px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>Update resume.pdf</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={14} className="text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Recent Client Messages Feed */}
                    <div
                        className={`rounded-3xl p-6 border ${
                            isDark ? "bg-[#0F172A] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        } shadow-xl`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-base font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                                <MessageSquare size={16} className="text-indigo-400" />
                                <span>Recent Inquiries</span>
                            </h2>
                            <Link
                                href="/admin/messages"
                                className="text-xs font-bold text-indigo-400 hover:underline"
                            >
                                Inbox
                            </Link>
                        </div>

                        {loading ? (
                            <div className={`py-6 text-center text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading messages...</div>
                        ) : recentMessages.length === 0 ? (
                            <div className="text-center py-6">
                                <CheckCircle2 size={24} className="mx-auto text-emerald-400 mb-1.5" />
                                <p className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}>No new messages</p>
                                <p className={`text-[10px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>Contact form inquiries will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentMessages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        onClick={() => router.push("/admin/messages")}
                                        className={`p-3 rounded-2xl border transition-all cursor-pointer hover:border-indigo-500/50 ${
                                            !msg.isRead
                                                ? "border-indigo-500/40 bg-indigo-950/30"
                                                : isDark
                                                ? "border-slate-700 bg-slate-800/60"
                                                : "border-slate-200 bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                                {msg.name}
                                            </span>
                                            {!msg.isRead && (
                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500 text-white">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-[11px] line-clamp-1 ${isDark ? "text-slate-200" : "text-slate-600"}`}>{msg.message}</p>
                                        <span className={`text-[10px] font-mono mt-1 block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                            {msg.email}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
