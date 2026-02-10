"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Briefcase, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import { Experience } from "@/app/types";

export default function ExperiencePage() {
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        technologies: [] as string[],
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await fetch("/api/experience");
            const data = await res.json();
            setExperiences(data);
        } catch (error) {
            console.error("Failed to fetch experiences:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const url = editingExp ? "/api/experience" : "/api/experience";
            const method = editingExp ? "PUT" : "POST";
            const body = editingExp
                ? { ...formData, _id: editingExp._id }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                await fetchExperiences();
                setIsAdding(false);
                setEditingExp(null);
                setFormData({
                    company: "",
                    position: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    isCurrent: false,
                    technologies: [],
                });
            }
        } catch (error) {
            console.error("Failed to save experience:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/experience?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setExperiences(experiences.filter((exp) => exp._id !== id));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Failed to delete experience:", error);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1
                        className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"
                            }`}
                    >
                        Experience
                    </h1>
                    <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                        Manage your work experience timeline
                    </p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <Plus size={20} />
                    Add Experience
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
                /* Timeline */
                <div className="relative">
                    {/* Timeline Line */}
                    <div
                        className={`absolute left-8 top-0 bottom-0 w-0.5 ${isDark ? "bg-slate-800" : "bg-gray-200"
                            }`}
                    />

                    {/* Experience Items */}
                    <div className="space-y-8">
                        {experiences.length === 0 ? (
                            <div
                                className={`rounded-2xl p-12 text-center ${isDark
                                        ? "bg-slate-900 border border-slate-800"
                                        : "bg-white border border-gray-200"
                                    }`}
                            >
                                <Briefcase
                                    size={64}
                                    className={`mx-auto mb-4 ${isDark ? "text-slate-700" : "text-slate-300"
                                        }`}
                                />
                                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                                    No experience entries yet
                                </p>
                            </div>
                        ) : (
                            experiences.map((exp) => (
                                <div key={exp._id} className="relative pl-20">
                                    {/* Timeline Dot */}
                                    <div
                                        className={`absolute left-6 top-6 w-5 h-5 rounded-full border-4 ${exp.isCurrent
                                                ? "bg-green-500 border-green-200"
                                                : isDark
                                                    ? "bg-indigo-500 border-slate-900"
                                                    : "bg-indigo-500 border-white"
                                            }`}
                                    />

                                    <div
                                        className={`rounded-2xl p-6 ${isDark
                                                ? "bg-slate-900 border border-slate-800"
                                                : "bg-white border border-gray-200"
                                            } shadow-lg hover:shadow-xl transition-all`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3
                                                    className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"
                                                        }`}
                                                >
                                                    {exp.position}
                                                </h3>
                                                <p
                                                    className={`font-medium ${isDark ? "text-indigo-400" : "text-indigo-600"
                                                        }`}
                                                >
                                                    {exp.company}
                                                </p>
                                                <div
                                                    className={`flex items-center gap-2 mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"
                                                        }`}
                                                >
                                                    <Calendar size={16} />
                                                    <span>
                                                        {formatDate(exp.startDate)} -{" "}
                                                        {exp.isCurrent
                                                            ? "Present"
                                                            : formatDate(exp.endDate!)}
                                                    </span>
                                                    {exp.isCurrent && (
                                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full text-xs font-medium">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingExp(exp);
                                                        setFormData({
                                                            company: exp.company,
                                                            position: exp.position,
                                                            description: exp.description,
                                                            startDate: exp.startDate.split("T")[0],
                                                            endDate: exp.endDate
                                                                ? exp.endDate.split("T")[0]
                                                                : "",
                                                            isCurrent: exp.isCurrent,
                                                            technologies: exp.technologies,
                                                        });
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors ${isDark
                                                            ? "hover:bg-blue-900/30 text-blue-400"
                                                            : "hover:bg-blue-50 text-blue-600"
                                                        }`}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(exp._id)}
                                                    className={`p-2 rounded-lg transition-colors ${isDark
                                                            ? "hover:bg-red-900/30 text-red-400"
                                                            : "hover:bg-red-50 text-red-600"
                                                        }`}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <p
                                            className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"
                                                }`}
                                        >
                                            {exp.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {exp.technologies.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                                                            ? "bg-indigo-900/30 text-indigo-300"
                                                            : "bg-indigo-100 text-indigo-700"
                                                        }`}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {(isAdding || editingExp) && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => {
                            setIsAdding(false);
                            setEditingExp(null);
                        }}
                    />
                    <div
                        className={`relative max-w-2xl w-full rounded-2xl p-6 my-8 ${isDark
                                ? "bg-slate-900 border border-slate-800"
                                : "bg-white border border-gray-200"
                            } shadow-2xl animate-scale-in`}
                    >
                        <h3
                            className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"
                                }`}
                        >
                            {editingExp ? "Edit Experience" : "Add New Experience"}
                        </h3>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                            }`}
                                    >
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) =>
                                            setFormData({ ...formData, company: e.target.value })
                                        }
                                        className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                                ? "bg-slate-800 border-slate-700 text-white"
                                                : "bg-white border-gray-200 text-slate-900"
                                            } focus:outline-none focus:border-indigo-500`}
                                        placeholder="e.g., Google"
                                    />
                                </div>
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                            }`}
                                    >
                                        Position
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) =>
                                            setFormData({ ...formData, position: e.target.value })
                                        }
                                        className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                                ? "bg-slate-800 border-slate-700 text-white"
                                                : "bg-white border-gray-200 text-slate-900"
                                            } focus:outline-none focus:border-indigo-500`}
                                        placeholder="e.g., Senior Developer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                        }`}
                                >
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={4}
                                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                            ? "bg-slate-800 border-slate-700 text-white"
                                            : "bg-white border-gray-200 text-slate-900"
                                        } focus:outline-none focus:border-indigo-500`}
                                    placeholder="Describe your role and responsibilities..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                            }`}
                                    >
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, startDate: e.target.value })
                                        }
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
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, endDate: e.target.value })
                                        }
                                        disabled={formData.isCurrent}
                                        className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                                ? "bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                                                : "bg-white border-gray-200 text-slate-900 disabled:opacity-50"
                                            } focus:outline-none focus:border-indigo-500`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isCurrent"
                                    checked={formData.isCurrent}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isCurrent: e.target.checked })
                                    }
                                    className="w-4 h-4 rounded"
                                />
                                <label
                                    htmlFor="isCurrent"
                                    className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"
                                        }`}
                                >
                                    I currently work here
                                </label>
                            </div>

                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                        }`}
                                >
                                    Technologies (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.technologies.join(", ")}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            technologies: e.target.value
                                                .split(",")
                                                .map((t) => t.trim()),
                                        })
                                    }
                                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                            ? "bg-slate-800 border-slate-700 text-white"
                                            : "bg-white border-gray-200 text-slate-900"
                                        } focus:outline-none focus:border-indigo-500`}
                                    placeholder="e.g., React, Node.js, MongoDB"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingExp(null);
                                }}
                                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${isDark
                                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                        : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors"
                            >
                                {editingExp ? "Update" : "Add"} Experience
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => setDeleteId(null)}
                    />
                    <div
                        className={`relative max-w-md w-full rounded-2xl p-6 ${isDark
                                ? "bg-slate-900 border border-slate-800"
                                : "bg-white border border-gray-200"
                            } shadow-2xl animate-scale-in`}
                    >
                        <h3
                            className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"
                                }`}
                        >
                            Delete Experience?
                        </h3>
                        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                            Are you sure you want to delete this experience? This action
                            cannot be undone.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setDeleteId(null)}
                                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${isDark
                                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                        : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 px-4 py-2 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
