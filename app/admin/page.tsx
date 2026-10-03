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
    Compass,
    Smartphone,
    Monitor,
    Tablet,
    RotateCw,
    Share2,
    MapPin,
    Eye,
    Users,
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

interface TrafficSource {
    source: string;
    count: number;
    percentage: number;
}

interface DeviceStat {
    device: string;
    count: number;
    percentage: number;
}

interface CountryStat {
    country: string;
    count: number;
    percentage: number;
}

interface RecentVisit {
    id: number;
    source: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    path?: string;
    created_at?: string;
}

interface TrafficAnalytics {
    totalVisits: number;
    sources: TrafficSource[];
    devices: DeviceStat[];
    countries: CountryStat[];
    recentVisits: RecentVisit[];
}

function getSourceConfig(source: string) {
    const s = (source || "").toLowerCase();
    if (s.includes("facebook")) {
        return {
            color: "text-blue-500",
            bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
            barColor: "bg-blue-500",
            name: "Facebook",
            icon: (
                <svg className="w-4 h-4 fill-current text-blue-500 shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            ),
        };
    }
    if (s.includes("google")) {
        return {
            color: "text-rose-500",
            bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
            barColor: "bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500",
            name: "Google Search",
            icon: (
                <svg className="w-4 h-4 fill-current text-rose-500 shrink-0" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V14.4h6.887C18.2 17.65 15.647 20 12.24 20c-4.418 0-8-3.582-8-8s3.582-8 8-8c2.082 0 3.974.793 5.412 2.087l3.05-3.05C18.73 1.353 15.66 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c7.05 0 11.76-4.96 11.76-11.96 0-.82-.07-1.61-.2-2.235H12.24z"/>
                </svg>
            ),
        };
    }
    if (s.includes("linkedin")) {
        return {
            color: "text-sky-500",
            bg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
            barColor: "bg-sky-500",
            name: "LinkedIn",
            icon: (
                <svg className="w-4 h-4 fill-current text-sky-500 shrink-0" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            ),
        };
    }
    if (s.includes("github")) {
        return {
            color: "text-purple-400",
            bg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
            barColor: "bg-purple-500",
            name: "GitHub",
            icon: <Github size={16} className="text-purple-400 shrink-0" />,
        };
    }
    if (s.includes("whatsapp")) {
        return {
            color: "text-emerald-500",
            bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
            barColor: "bg-emerald-500",
            name: "WhatsApp",
            icon: (
                <svg className="w-4 h-4 fill-current text-emerald-500 shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
            ),
        };
    }
    if (s.includes("direct")) {
        return {
            color: "text-indigo-400",
            bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
            barColor: "bg-indigo-500",
            name: "Direct / Bookmarks",
            icon: <Compass size={16} className="text-indigo-400 shrink-0" />,
        };
    }
    return {
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        barColor: "bg-amber-500",
        name: source || "External Link",
        icon: <Share2 size={16} className="text-amber-400 shrink-0" />,
    };
}

function getDeviceIcon(device: string) {
    const d = (device || "").toLowerCase();
    if (d.includes("mobile")) return <Smartphone size={14} className="text-pink-400 shrink-0" />;
    if (d.includes("tablet")) return <Tablet size={14} className="text-amber-400 shrink-0" />;
    return <Monitor size={14} className="text-indigo-400 shrink-0" />;
}

function formatVisitTime(dateString?: string): string {
    if (!dateString) return "just now";
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return "Just now";
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour}h ago`;
        const diffDays = Math.floor(diffHour / 24);
        return `${diffDays}d ago`;
    } catch {
        return "recently";
    }
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
    const [traffic, setTraffic] = useState<TrafficAnalytics>({
        totalVisits: 0,
        sources: [],
        devices: [],
        countries: [],
        recentVisits: [],
    });
    const [refreshingTraffic, setRefreshingTraffic] = useState(false);
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

            if (viewsData) {
                setTraffic({
                    totalVisits: typeof viewsData.totalVisits === "number" ? viewsData.totalVisits : (viewsData.views || 0),
                    sources: Array.isArray(viewsData.sources) ? viewsData.sources : [],
                    devices: Array.isArray(viewsData.devices) ? viewsData.devices : [],
                    countries: Array.isArray(viewsData.countries) ? viewsData.countries : [],
                    recentVisits: Array.isArray(viewsData.recentVisits) ? viewsData.recentVisits : [],
                });
            }

            setRecentProjects(projectList.slice(0, 4));
            setRecentMessages(messageList.slice(0, 3));
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshTrafficData = async () => {
        setRefreshingTraffic(true);
        try {
            const res = await fetch("/api/views");
            const data = await res.json();
            if (data) {
                setStats((prev) => ({
                    ...prev,
                    views: typeof data.views === "number" ? data.views : prev.views,
                }));
                setTraffic({
                    totalVisits: typeof data.totalVisits === "number" ? data.totalVisits : (data.views || 0),
                    sources: Array.isArray(data.sources) ? data.sources : [],
                    devices: Array.isArray(data.devices) ? data.devices : [],
                    countries: Array.isArray(data.countries) ? data.countries : [],
                    recentVisits: Array.isArray(data.recentVisits) ? data.recentVisits : [],
                });
            }
        } catch (err) {
            console.error("Failed to refresh traffic analytics:", err);
        } finally {
            setRefreshingTraffic(false);
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
                            <span>Moniruzzaman Command Center</span>
                        </div>
                        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Moniruzzaman!</span> 👋
                        </h1>
                        <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? "text-slate-200" : "text-slate-600"}`}>
                            Your portfolio is live at{" "}
                            <a
                                href="https://moniruzzaman-dev.vercel.app"
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 underline font-bold font-mono inline-flex items-center gap-1"
                            >
                                moniruzzaman-dev.vercel.app <ArrowUpRight size={13} />
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

            {/* Visitor Traffic & Referral Attribution Section */}
            <div
                className={`rounded-3xl p-6 sm:p-7 border ${
                    isDark
                        ? "bg-[#0F172A] border-slate-800 text-white"
                        : "bg-white border-slate-200 text-slate-900"
                } shadow-2xl relative overflow-hidden`}
            >
                {/* Subtle decorative glow */}
                <div className="pointer-events-none absolute -top-24 right-1/4 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Real-Time Traffic Attribution</span>
                        </div>
                        <h2 className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                            <Compass className="text-indigo-400" size={24} />
                            <span>Audience & Referral Intelligence</span>
                        </h2>
                        <p className={`text-xs mt-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            Know exactly where your visitors come from (Facebook, Google, LinkedIn, WhatsApp, GitHub or Direct links) and what devices they use.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                            isDark ? "border-slate-800 bg-slate-900/80 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}>
                            <span className="text-indigo-400 font-extrabold">{stats.views}</span> total views
                        </div>
                        <button
                            onClick={refreshTrafficData}
                            disabled={refreshingTraffic}
                            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                isDark
                                    ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700 hover:border-slate-600"
                                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                            }`}
                            title="Refresh Traffic Data"
                        >
                            <RotateCw size={13} className={refreshingTraffic ? "animate-spin text-indigo-400" : "text-indigo-400"} />
                            <span>{refreshingTraffic ? "Refreshing..." : "Refresh"}</span>
                        </button>
                    </div>
                </div>

                {/* 3-Column Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                    {/* Col 1: Traffic Sources (5 cols) */}
                    <div className={`lg:col-span-5 rounded-2xl p-5 border ${
                        isDark ? "bg-[#161F37] border-slate-700/80" : "bg-slate-50 border-slate-200"
                    } flex flex-col justify-between`}>
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                                    <Share2 size={16} className="text-indigo-400" />
                                    <span>Referral Channels (Where Views Come From)</span>
                                </h3>
                                <span className="text-[10px] font-mono text-slate-400">Share / Link Source</span>
                            </div>

                            {traffic.sources.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Compass size={28} className="mx-auto text-slate-500 mb-2" />
                                    <p className="text-xs text-slate-400 font-medium">Tracking initialized</p>
                                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                                        Share your link on Facebook, LinkedIn, WhatsApp or resume to see real-time attribution breakdown.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3.5">
                                    {traffic.sources.map((item) => {
                                        const config = getSourceConfig(item.source);
                                        return (
                                            <div key={item.source} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 font-bold">
                                                        {config.icon}
                                                        <span className={isDark ? "text-slate-100" : "text-slate-800"}>
                                                            {item.source}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 font-mono">
                                                        <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                                            {item.count} <span className="text-[10px] text-slate-400 font-normal">views</span>
                                                        </span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${config.bg}`}>
                                                            {item.percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-700/40 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${config.barColor} transition-all duration-700`}
                                                        style={{ width: `${Math.max(item.percentage, 4)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className={`mt-5 pt-3 border-t text-[11px] flex items-center justify-between ${
                            isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"
                        }`}>
                            <span>Auto-categorizes FB, LinkedIn, Google & WhatsApp</span>
                            <span className="text-emerald-400 font-semibold font-mono">100% Privacy-Safe</span>
                        </div>
                    </div>

                    {/* Col 2: Devices & Demographics (3 cols) */}
                    <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
                        {/* Device breakdown */}
                        <div className={`rounded-2xl p-4 border ${
                            isDark ? "bg-[#161F37] border-slate-700/80" : "bg-slate-50 border-slate-200"
                        }`}>
                            <h4 className={`text-xs font-bold flex items-center gap-2 mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                                <Monitor size={14} className="text-cyan-400" />
                                <span>Device Distribution</span>
                            </h4>
                            {traffic.devices.length === 0 ? (
                                <p className="text-[11px] text-slate-400 py-3 text-center">No device data yet</p>
                            ) : (
                                <div className="space-y-2.5">
                                    {traffic.devices.map((d) => (
                                        <div key={d.device} className="space-y-1">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    {getDeviceIcon(d.device)}
                                                    <span className={isDark ? "text-slate-200" : "text-slate-700"}>{d.device}</span>
                                                </div>
                                                <span className="font-mono text-slate-400 font-bold">{d.percentage}% ({d.count})</span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full bg-slate-700/40 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-700"
                                                    style={{ width: `${Math.max(d.percentage, 5)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Country breakdown */}
                        <div className={`rounded-2xl p-4 border ${
                            isDark ? "bg-[#161F37] border-slate-700/80" : "bg-slate-50 border-slate-200"
                        }`}>
                            <h4 className={`text-xs font-bold flex items-center gap-2 mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                                <MapPin size={14} className="text-rose-400" />
                                <span>Top Visitor Countries</span>
                            </h4>
                            {traffic.countries.length === 0 ? (
                                <p className="text-[11px] text-slate-400 py-3 text-center">Auto-detected on Vercel Edge</p>
                            ) : (
                                <div className="space-y-2">
                                    {traffic.countries.map((c) => (
                                        <div key={c.country} className="flex items-center justify-between text-[11px]">
                                            <span className={`truncate max-w-[120px] font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                                                🌍 {c.country}
                                            </span>
                                            <span className="font-mono text-xs font-bold text-indigo-400">{c.count} views</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Col 3: Real-Time Activity Log (4 cols) */}
                    <div className={`lg:col-span-4 rounded-2xl p-5 border ${
                        isDark ? "bg-[#161F37] border-slate-700/80" : "bg-slate-50 border-slate-200"
                    } flex flex-col justify-between`}>
                        <div>
                            <div className="flex items-center justify-between mb-3.5">
                                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                                    <Activity size={16} className="text-emerald-400" />
                                    <span>Live Visitor Stream</span>
                                </h3>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                                    Recent 10
                                </span>
                            </div>

                            {traffic.recentVisits.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Users size={24} className="mx-auto text-slate-500 mb-2" />
                                    <p className="text-xs text-slate-400">Waiting for live visitors</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Visits to moniruzzaman-dev.vercel.app will show here.</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                                    {traffic.recentVisits.map((v) => {
                                        const conf = getSourceConfig(v.source);
                                        const locationStr = [v.city, v.country].filter(Boolean).join(", ");
                                        return (
                                            <div
                                                key={v.id}
                                                className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${
                                                    isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <div className="shrink-0">{conf.icon}</div>
                                                    <div className="truncate">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={`font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                                                {v.source}
                                                            </span>
                                                            <span className="text-[9px] text-slate-400 font-mono">
                                                                • {v.device || "Desktop"}
                                                            </span>
                                                        </div>
                                                        {locationStr && (
                                                            <p className="text-[10px] text-slate-400 truncate">
                                                                📍 {locationStr}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <span className="text-[10px] font-mono text-slate-400">
                                                        {formatVisitTime(v.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className={`mt-4 pt-2.5 border-t text-[10px] font-mono text-center ${
                            isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"
                        }`}>
                            Auto-synced with PostgreSQL via Neon
                        </div>
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
                            <span>Moniruzzaman Cloud Infrastructure</span>
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
                                onClick={() => router.push("/admin/resume-builder")}
                                className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                                    isDark
                                        ? "border-rose-500/40 bg-rose-950/30 hover:bg-rose-900/50"
                                        : "border-rose-200 bg-rose-50/70 hover:bg-rose-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
                                        <Sparkles size={16} />
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                                AI ATS Resume Builder
                                            </h4>
                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500 text-white font-mono">
                                                1-Page ATS
                                            </span>
                                        </div>
                                        <p className={`text-[10px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>Tailor resume to any Job Description</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={14} className="text-rose-400 group-hover:translate-x-0.5 transition-transform" />
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
