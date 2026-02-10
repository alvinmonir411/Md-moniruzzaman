"use client";

import React from "react";
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
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";

interface SidebarProps {
    children: React.ReactNode;
}

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Skills", href: "/admin/skills", icon: Award },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: SidebarProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isDark = useSelector((state: RootState) => state.theme.isDark);

    const handleLogout = () => {
        router.push("/");
    };

    return (
        <div
            className={`min-h-screen ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
                }`}
        >
            {/* Mobile Header */}
            <div
                className={`lg:hidden fixed top-0 left-0 right-0 z-40 ${isDark
                        ? "bg-slate-900 border-b border-slate-800"
                        : "bg-white border-b border-gray-200"
                    } px-4 py-4 flex items-center justify-between`}
            >
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`p-2 rounded-lg ${isDark
                            ? "hover:bg-slate-800 text-slate-300"
                            : "hover:bg-gray-100 text-slate-700"
                        }`}
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
                    } border-r transform transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    <p
                        className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                    >
                        Portfolio Management
                    </p>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
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
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                        : isDark
                                            ? "text-slate-300 hover:bg-slate-800"
                                            : "text-slate-700 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isDark
                                ? "text-red-400 hover:bg-red-900/20"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-20 lg:pt-0 min-h-screen">
                <div className="p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}
