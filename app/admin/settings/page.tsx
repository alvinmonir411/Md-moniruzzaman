"use client";

import React from "react";
import { User, Lock, Palette, Database, Download } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/lib/store";
import { toggleTheme } from "@/app/lib/features/theme/themeSlice";

export default function SettingsPage() {
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1
                    className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"
                        }`}
                >
                    Settings
                </h1>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                    Manage your dashboard preferences
                </p>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div
                    className={`rounded-2xl p-6 ${isDark
                            ? "bg-slate-900 border border-slate-800"
                            : "bg-white border border-gray-200"
                        } shadow-lg`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                            <User className="text-white" size={20} />
                        </div>
                        <h2
                            className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"
                                }`}
                        >
                            Profile
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                    }`}
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                defaultValue="Alvin Monir"
                                className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                        ? "bg-slate-800 border-slate-700 text-white"
                                        : "bg-white border-gray-200 text-slate-900"
                                    } focus:outline-none focus:border-indigo-500`}
                            />
                        </div>
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                    }`}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                defaultValue="alvin@example.com"
                                className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                        ? "bg-slate-800 border-slate-700 text-white"
                                        : "bg-white border-gray-200 text-slate-900"
                                    } focus:outline-none focus:border-indigo-500`}
                            />
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div
                    className={`rounded-2xl p-6 ${isDark
                            ? "bg-slate-900 border border-slate-800"
                            : "bg-white border border-gray-200"
                        } shadow-lg`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                            <Lock className="text-white" size={20} />
                        </div>
                        <h2
                            className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"
                                }`}
                        >
                            Security
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                    }`}
                            >
                                Current Secret Key
                            </label>
                            <input
                                type="password"
                                defaultValue="13663"
                                className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                        ? "bg-slate-800 border-slate-700 text-white"
                                        : "bg-white border-gray-200 text-slate-900"
                                    } focus:outline-none focus:border-indigo-500`}
                            />
                        </div>
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
                            Change Secret Key
                        </button>
                    </div>
                </div>

                {/* Appearance */}
                <div
                    className={`rounded-2xl p-6 ${isDark
                            ? "bg-slate-900 border border-slate-800"
                            : "bg-white border border-gray-200"
                        } shadow-lg`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                            <Palette className="text-white" size={20} />
                        </div>
                        <h2
                            className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"
                                }`}
                        >
                            Appearance
                        </h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <span
                            className={isDark ? "text-slate-300" : "text-slate-700"}
                        >
                            Dark Mode
                        </span>
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className={`relative w-14 h-8 rounded-full transition-colors ${isDark ? "bg-indigo-600" : "bg-gray-300"
                                }`}
                        >
                            <div
                                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${isDark ? "translate-x-7" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Data Management */}
                <div
                    className={`rounded-2xl p-6 ${isDark
                            ? "bg-slate-900 border border-slate-800"
                            : "bg-white border border-gray-200"
                        } shadow-lg`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                            <Database className="text-white" size={20} />
                        </div>
                        <h2
                            className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"
                                }`}
                        >
                            Data Management
                        </h2>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
                            <Download size={18} />
                            Export All Data
                        </button>
                        <p
                            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"
                                }`}
                        >
                            Download all your portfolio data as JSON
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
