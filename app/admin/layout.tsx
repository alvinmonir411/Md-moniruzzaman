"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    Award,
    Briefcase,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    ExternalLink,
    Sparkles,
    Sun,
    Moon,
    Activity,
    Github,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/lib/store";
import { toggleTheme } from "@/app/lib/features/theme/themeSlice";
import Link from "next/link";

interface SidebarProps {
    children: React.ReactNode;
}

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Skills", href: "/admin/skills", icon: Award },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Settings & CV", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: SidebarProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const isDark = useSelector((state: RootState) => state.theme.isDark);

    // Sync html dark class
    useEffect(() => {
        if (typeof document !== "undefined") {
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, [isDark]);

    useEffect(() => {
        fetch("/api/messages")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const unread = data.filter((m: any) => !m.isRead).length;
                    setUnreadMessages(unread);
                }
            })
            .catch(() => {});
    }, [pathname]);

    const handleLogout = () => {
        router.push("/");
    };

    return (
        <div
            className={`min-h-screen flex ${
                isDark ? "bg-[#070B14] text-white" : "bg-slate-50 text-slate-900"
            } transition-colors duration-200`}
        >
            {/* Mobile Header Bar */}
            <div
                className={`lg:hidden fixed top-0 left-0 right-0 z-40 ${
                    isDark
                        ? "bg-[#0F172A] border-b border-slate-800 text-white"
                        : "bg-white border-b border-slate-200 text-slate-900"
                } backdrop-blur-md px-4 py-3 flex items-center justify-between`}
            >
                <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                        }}
                    />
                    <div>
                        <h1 className="text-sm font-black tracking-tight font-mono leading-none">
                            PixelNest<span className="text-indigo-400">.Studio</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-mono">Admin Command Center</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className={`p-2 rounded-xl border ${
                            isDark ? "border-slate-700 bg-slate-800 text-white" : "border-slate-200 bg-white text-slate-700"
                        }`}
                    >
                        {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-2 rounded-xl border ${
                            isDark
                                ? "border-slate-700 bg-slate-800 text-white"
                                : "border-slate-200 bg-white text-slate-700"
                        }`}
                    >
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Executive Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 ${
                    isDark
                        ? "bg-[#0C1222] border-r border-slate-800 text-white"
                        : "bg-white border-r border-slate-200 text-slate-900"
                } flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-50 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 shadow-2xl lg:shadow-none`}
            >
                {/* Top Section */}
                <div className="flex-1 overflow-y-auto">
                    {/* Brand Header */}
                    <div className="p-5 border-b border-slate-800/80">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 group"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/logo.png"
                                    alt="PixelNest Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                    }}
                                />
                            </div>
                            <div>
                                <h1 className={`text-base font-black font-mono tracking-tight leading-none ${isDark ? "text-white" : "text-slate-900"}`}>
                                    PixelNest<span className="text-indigo-400">.Studio</span>
                                </h1>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                        Admin Command Center
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Quick Live Site Button */}
                    <div className="px-4 pt-4">
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                isDark
                                    ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 hover:text-white"
                                    : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <Activity size={14} className="text-indigo-400" />
                                View Live Portfolio
                            </span>
                            <ExternalLink size={12} />
                        </a>
                    </div>

                    {/* Navigation Items */}
                    <div className="p-4 space-y-1.5">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                            Management Studio
                        </p>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        router.push(item.href);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                        isActive
                                            ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/30"
                                            : isDark
                                            ? "text-slate-200 hover:bg-slate-800/80 hover:text-white"
                                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={17} className={isActive ? "text-white" : isDark ? "text-slate-300" : "text-slate-500"} />
                                        <span>{item.name}</span>
                                    </div>

                                    {item.href === "/admin/messages" && unreadMessages > 0 && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                                            {unreadMessages}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom User Profile & Actions */}
                <div className={`p-4 border-t ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} space-y-3`}>
                    {/* Founder Mini Card */}
                    <div className="flex items-center gap-3 px-1">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                M
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                Moniruzzaman
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                                Founder & Lead Engineer
                            </p>
                        </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center gap-2 pt-1">
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                                isDark
                                    ? "border-slate-700 bg-slate-800 text-slate-200 hover:text-white"
                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            {isDark ? (
                                <>
                                    <Sun size={13} className="text-amber-400" />
                                    <span>Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <Moon size={13} className="text-indigo-600" />
                                    <span>Dark Mode</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                            title="Logout to Home"
                        >
                            <LogOut size={13} />
                            <span>Exit</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
                {/* Desktop Top Header Bar */}
                <header
                    className={`hidden lg:flex items-center justify-between px-8 py-3.5 border-b ${
                        isDark
                            ? "bg-[#0C1222]/90 border-slate-800 text-white"
                            : "bg-white/90 border-slate-200 text-slate-900"
                    } backdrop-blur-xl`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>System Online • Production Node</span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">• Neon PostgreSQL</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/alvinmonir411"
                            target="_blank"
                            rel="noreferrer"
                            className={`p-2 rounded-xl border transition-all ${
                                isDark
                                    ? "border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                            }`}
                            title="GitHub"
                        >
                            <Github size={15} />
                        </a>

                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 transition-all"
                        >
                            <span>Live Portfolio</span>
                            <ExternalLink size={12} />
                        </a>
                    </div>
                </header>

                {/* Page View Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto mt-14 lg:mt-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
