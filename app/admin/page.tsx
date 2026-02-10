"use client";

import React, { useEffect, useState } from "react";
import {
    FolderKanban,
    Award,
    MessageSquare,
    TrendingUp,
    Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
}

const StatCard = ({ title, value, icon, color, trend }: StatCardProps) => {
    const isDark = useSelector((state: RootState) => state.theme.isDark);

    return (
        <div
            className={`rounded-2xl p-6 ${isDark
                    ? "bg-slate-900 border border-slate-800"
                    : "bg-white border border-gray-200"
                } shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}
                >
                    {icon}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                        <TrendingUp size={16} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <h3
                className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"
                    }`}
            >
                {value}
            </h3>
            <p
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
                {title}
            </p>
        </div>
    );
};

export default function AdminDashboard() {
    const router = useRouter();
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        messages: 0,
        views: 1247,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [projectsRes, skillsRes, messagesRes] = await Promise.all([
                fetch("/api/projects"),
                fetch("/api/skills"),
                fetch("/api/messages"),
            ]);

            const [projects, skills, messages] = await Promise.all([
                projectsRes.json(),
                skillsRes.json(),
                messagesRes.json(),
            ]);

            setStats({
                projects: projects.length,
                skills: skills.length,
                messages: messages.length,
                views: 1247,
            });
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            title: "Add Project",
            icon: <FolderKanban size={20} />,
            href: "/admin/projects",
            color: "from-blue-500 to-cyan-500",
        },
        {
            title: "Add Skill",
            icon: <Award size={20} />,
            href: "/admin/skills",
            color: "from-purple-500 to-pink-500",
        },
        {
            title: "View Messages",
            icon: <MessageSquare size={20} />,
            href: "/admin/messages",
            color: "from-green-500 to-emerald-500",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1
                    className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"
                        }`}
                >
                    Welcome Back! 👋
                </h1>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                    Here's what's happening with your portfolio today.
                </p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Projects"
                        value={stats.projects}
                        icon={<FolderKanban className="text-blue-500" size={24} />}
                        color="from-blue-500 to-cyan-500"
                        trend="+12%"
                    />
                    <StatCard
                        title="Skills"
                        value={stats.skills}
                        icon={<Award className="text-purple-500" size={24} />}
                        color="from-purple-500 to-pink-500"
                    />
                    <StatCard
                        title="Messages"
                        value={stats.messages}
                        icon={<MessageSquare className="text-green-500" size={24} />}
                        color="from-green-500 to-emerald-500"
                        trend={stats.messages > 0 ? `+${stats.messages}` : undefined}
                    />
                    <StatCard
                        title="Portfolio Views"
                        value={stats.views}
                        icon={<Activity className="text-orange-500" size={24} />}
                        color="from-orange-500 to-red-500"
                        trend="+24%"
                    />
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h2
                    className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"
                        }`}
                >
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <button
                            key={action.title}
                            onClick={() => router.push(action.href)}
                            className={`p-6 rounded-2xl ${isDark
                                    ? "bg-slate-900 border border-slate-800 hover:border-slate-700"
                                    : "bg-white border border-gray-200 hover:border-gray-300"
                                } shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
                        >
                            <div
                                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} text-white mb-3 group-hover:scale-110 transition-transform`}
                            >
                                {action.icon}
                            </div>
                            <h3
                                className={`font-semibold ${isDark ? "text-white" : "text-slate-900"
                                    }`}
                            >
                                {action.title}
                            </h3>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2
                    className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"
                        }`}
                >
                    Recent Activity
                </h2>
                <div
                    className={`rounded-2xl p-6 ${isDark
                            ? "bg-slate-900 border border-slate-800"
                            : "bg-white border border-gray-200"
                        } shadow-lg`}
                >
                    <p
                        className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                    >
                        No recent activity to display
                    </p>
                </div>
            </div>
        </div>
    );
}
