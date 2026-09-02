"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Edit,
    Trash2,
    Briefcase,
    GraduationCap,
    Calendar,
    MapPin,
    CheckCircle2,
    Sparkles,
    RotateCcw,
    X,
    Check,
    Loader2,
    Building2,
    Activity,
    AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import { Experience } from "@/app/types";

const SUGGESTED_ICONS = ["💼", "🚀", "🎓", "🏫", "📘", "💻", "⚡", "🌐", "🛠️", "📊", "🏆", "🌟"];

export default function ExperiencePage() {
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"all" | "experience" | "education">("all");
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [confirmSeedModal, setConfirmSeedModal] = useState(false);

    // Toast notification state
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [formData, setFormData] = useState({
        type: "experience" as "experience" | "education",
        position: "",
        company: "",
        timeline: "",
        location: "",
        tag: "Live Experience",
        icon: "💼",
        isLive: false,
        details: "",
        highlightsText: "",
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/experience");
            const data = await res.json();
            if (Array.isArray(data)) {
                setExperiences(data);
            }
        } catch (error) {
            console.error("Failed to fetch experiences:", error);
            showToast("Failed to load experience records", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleExecuteSeed = async () => {
        setConfirmSeedModal(false);
        try {
            setIsSeeding(true);
            const res = await fetch("/api/experience?seed=true", { method: "POST" });
            if (res.ok) {
                await fetchExperiences();
                showToast("✨ Experience & Academic records populated successfully!");
            } else {
                showToast("Failed to populate records.", "error");
            }
        } catch (error) {
            console.error("Failed to seed experience:", error);
            showToast("Network error while seeding records", "error");
        } finally {
            setIsSeeding(false);
        }
    };

    const openAddModal = (type: "experience" | "education" = "experience") => {
        setEditingExp(null);
        setFormData({
            type,
            position: "",
            company: "",
            timeline: type === "experience" ? "2024 – Present" : "2022 – Expected 2026",
            location: "Rangpur, Bangladesh",
            tag: type === "experience" ? "Live Experience" : "Higher Education",
            icon: type === "experience" ? "💼" : "🎓",
            isLive: false,
            details: "",
            highlightsText: "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (exp: Experience) => {
        setEditingExp(exp);
        setFormData({
            type: exp.type || "experience",
            position: exp.position || exp.role || "",
            company: exp.company || "",
            timeline: exp.timeline || "",
            location: exp.location || "",
            tag: exp.tag || "Active",
            icon: exp.icon || (exp.type === "education" ? "🎓" : "💼"),
            isLive: Boolean(exp.isLive),
            details: exp.details || "",
            highlightsText: Array.isArray(exp.highlights) ? exp.highlights.join("\n") : "",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            const highlights = formData.highlightsText
                .split("\n")
                .map((h) => h.trim())
                .filter(Boolean);

            const payload = {
                type: formData.type,
                position: formData.position,
                company: formData.company,
                timeline: formData.timeline,
                location: formData.location,
                tag: formData.tag,
                icon: formData.icon,
                isLive: formData.isLive,
                details: formData.details,
                highlights,
            };

            if (editingExp) {
                // Update
                const res = await fetch("/api/experience", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        _id: editingExp._id,
                        ...payload,
                    }),
                });
                if (res.ok) {
                    await fetchExperiences();
                    setIsModalOpen(false);
                    showToast(`Updated "${formData.position}" successfully!`);
                } else {
                    showToast("Failed to update record", "error");
                }
            } else {
                // Create
                const res = await fetch("/api/experience", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    await fetchExperiences();
                    setIsModalOpen(false);
                    showToast(`Added "${formData.position}" successfully!`);
                } else {
                    showToast("Failed to create record", "error");
                }
            }
        } catch (error) {
            console.error("Failed to save experience:", error);
            showToast("Error saving record", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/experience?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setExperiences((prev) => prev.filter((exp) => exp._id !== id));
                setDeleteId(null);
                showToast("Record deleted successfully");
            } else {
                showToast("Failed to delete record", "error");
            }
        } catch (error) {
            console.error("Failed to delete experience:", error);
            showToast("Network error deleting record", "error");
        }
    };

    const workExperiences = experiences.filter((e) => e.type === "experience" || !e.type);
    const academicEducations = experiences.filter((e) => e.type === "education");

    const filteredList =
        activeTab === "all"
            ? experiences
            : activeTab === "experience"
            ? workExperiences
            : academicEducations;

    return (
        <div className="space-y-8 animate-fade-in pb-12 relative">
            {/* Floating In-App Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-[300] animate-bounce-in">
                    <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${
                            toast.type === "success"
                                ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
                                : "bg-rose-950/90 border-rose-500/50 text-rose-200"
                        }`}
                    >
                        {toast.type === "success" ? (
                            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle size={18} className="text-rose-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Briefcase size={20} className="text-indigo-400" />
                        <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            Experience & Education Timeline
                        </h1>
                    </div>
                    <p className={`text-xs sm:text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        Manage commercial career milestones and academic background ({experiences.length} total entries)
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => setConfirmSeedModal(true)}
                        disabled={isSeeding}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold border border-indigo-500/40 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        {isSeeding ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                        <span>Restore Default Records</span>
                    </button>

                    <button
                        onClick={() => openAddModal("experience")}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Add Entry</span>
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "all"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : isDark
                            ? "bg-slate-800 text-slate-300 hover:text-white"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    All Records ({experiences.length})
                </button>
                <button
                    onClick={() => setActiveTab("experience")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === "experience"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : isDark
                            ? "bg-slate-800 text-slate-300 hover:text-white"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    <Briefcase size={14} />
                    <span>Work Experience ({workExperiences.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab("education")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === "education"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : isDark
                            ? "bg-slate-800 text-slate-300 hover:text-white"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    <GraduationCap size={14} />
                    <span>Academic Education ({academicEducations.length})</span>
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
                    <p className={`text-xs mt-3 ${isDark ? "text-slate-300" : "text-slate-500"}`}>Loading timeline from database...</p>
                </div>
            ) : experiences.length === 0 ? (
                /* Empty state with instant restore */
                <div className={`text-center py-16 border-2 border-dashed rounded-3xl ${
                    isDark ? "border-slate-700 bg-slate-900/40 text-white" : "border-slate-200 bg-slate-50 text-slate-900"
                } p-8`}>
                    <Briefcase size={44} className="mx-auto text-indigo-400 mb-3" />
                    <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>No Experience Entries Yet</h3>
                    <p className={`text-xs max-w-md mx-auto mt-1 mb-5 ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                        Your database has no career records. Click below to populate your Neon DB with your verified work experiences (Wix Developer, Independent Full-Stack) and academic milestones (BSS, HSC, SSC).
                    </p>
                    <button
                        onClick={() => setConfirmSeedModal(true)}
                        disabled={isSeeding}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                    >
                        {isSeeding ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        <span>✨ Populate Verified Career & Education</span>
                    </button>
                </div>
            ) : (
                /* Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredList.map((exp) => (
                        <div
                            key={exp._id}
                            className={`p-6 rounded-3xl border transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl flex flex-col justify-between ${
                                isDark ? "bg-[#0F172A] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                            }`}
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-md">
                                            {exp.icon || (exp.type === "education" ? "🎓" : "💼")}
                                        </div>
                                        <div>
                                            <h3 className={`text-base font-bold line-clamp-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                                                {exp.position || exp.role}
                                            </h3>
                                            <p className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 mt-0.5">
                                                <Building2 size={13} /> {exp.company}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(exp)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                                            title="Edit"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(exp._id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Badges Row */}
                                <div className="flex flex-wrap items-center gap-2 mb-3.5">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
                                        exp.isLive
                                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                            : exp.type === "education"
                                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                                            : "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                                    }`}>
                                        {exp.tag || (exp.type === "education" ? "Academic" : "Experience")}
                                    </span>

                                    {exp.timeline && (
                                        <span className={`flex items-center gap-1 text-[11px] font-mono font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                            <Calendar size={12} className="text-indigo-400" /> {exp.timeline}
                                        </span>
                                    )}

                                    {exp.location && (
                                        <span className={`flex items-center gap-1 text-[11px] font-mono font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                            <MapPin size={12} /> {exp.location}
                                        </span>
                                    )}
                                </div>

                                {/* Details / Highlights */}
                                {exp.details && (
                                    <p className={`text-xs leading-relaxed mb-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                        {exp.details}
                                    </p>
                                )}

                                {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                                    <ul className="space-y-1.5 pt-1">
                                        {exp.highlights.map((h, i) => (
                                            <li key={i} className={`flex items-start gap-2 text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Seed Confirmation Modal */}
            {confirmSeedModal && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setConfirmSeedModal(false)} />
                    <div
                        className={`relative max-w-sm w-full rounded-3xl p-6 ${
                            isDark ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        } shadow-2xl animate-scale-in z-10 text-center space-y-4`}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="text-base font-bold">Populate Verified Timeline?</h3>
                        <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            This will populate your database with your verified commercial work experience (Wix Developer, Independent Full-Stack) and academic history (BSS, HSC, SSC).
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={() => setConfirmSeedModal(false)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-300 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExecuteSeed}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
                            >
                                Confirm & Populate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Experience Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in">
                    <div
                        className="fixed inset-0 bg-black/75 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div
                        className={`relative max-w-lg w-full rounded-3xl p-6 ${
                            isDark ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        } shadow-2xl animate-scale-in z-10 space-y-5 max-h-[90vh] overflow-y-auto`}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                {formData.type === "education" ? <GraduationCap size={18} className="text-purple-400" /> : <Briefcase size={18} className="text-indigo-400" />}
                                <span>{editingExp ? "Edit Timeline Entry" : "Add Timeline Entry"}</span>
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Type Switcher */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                    Entry Type
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: "experience", icon: "💼", tag: "Live Experience" })}
                                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                            formData.type === "experience"
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                                : isDark
                                                ? "bg-slate-800 border-slate-700 text-slate-400"
                                                : "bg-slate-100 border-slate-200 text-slate-700"
                                        }`}
                                    >
                                        <Briefcase size={14} />
                                        <span>Work Experience</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: "education", icon: "🎓", tag: "Higher Education" })}
                                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                            formData.type === "education"
                                                ? "bg-purple-600 text-white border-purple-600 shadow-md"
                                                : isDark
                                                ? "bg-slate-800 border-slate-700 text-slate-400"
                                                : "bg-slate-100 border-slate-200 text-slate-700"
                                        }`}
                                    >
                                        <GraduationCap size={14} />
                                        <span>Academic Education</span>
                                    </button>
                                </div>
                            </div>

                            {/* Icon Picker */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                    Icon / Emoji
                                </label>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-indigo-500 flex items-center justify-center text-xl">
                                        {formData.icon}
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none ${
                                            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
                                        }`}
                                        placeholder="Emoji icon"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800">
                                    {SUGGESTED_ICONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: emoji })}
                                            className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-transform hover:scale-125 cursor-pointer ${
                                                formData.icon === emoji ? "bg-indigo-600 shadow-md" : "hover:bg-slate-800"
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Position / Role */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    {formData.type === "education" ? "Degree / Certificate" : "Role / Job Position"} <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border-2 outline-none ${
                                        isDark ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500" : "bg-white border-slate-200 focus:border-indigo-500"
                                    }`}
                                    placeholder={formData.type === "education" ? "e.g. Bachelor of Social Science (BSS)" : "e.g. Wix Developer, Full-Stack Engineer"}
                                    required
                                />
                            </div>

                            {/* Company / Institution */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    {formData.type === "education" ? "College / Institution" : "Company / Organization"} <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border-2 outline-none ${
                                        isDark ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500" : "bg-white border-slate-200 focus:border-indigo-500"
                                    }`}
                                    placeholder={formData.type === "education" ? "e.g. Govt. Begum Rokeya College, Rangpur" : "e.g. SM Technology, Freelance"}
                                    required
                                />
                            </div>

                            {/* Timeline & Location */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Timeline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.timeline}
                                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                                            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
                                        }`}
                                        placeholder="e.g. 2024 – Present"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                                            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
                                        }`}
                                        placeholder="e.g. Rangpur / Remote"
                                    />
                                </div>
                            </div>

                            {/* Tag & Live Toggle */}
                            <div className="grid grid-cols-2 gap-3 items-center">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Badge / Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                                            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
                                        }`}
                                        placeholder="e.g. Live Experience, Science"
                                    />
                                </div>

                                {formData.type === "experience" && (
                                    <div className="pt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isLive}
                                                onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                                                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                                            />
                                            <span className="text-xs font-bold">Dynamic Live Timer</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Highlights or Details */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    {formData.type === "experience" ? "Key Highlights (1 per line)" : "Summary & Description"}
                                </label>
                                {formData.type === "experience" ? (
                                    <textarea
                                        value={formData.highlightsText}
                                        onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                                        rows={4}
                                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none resize-none ${
                                            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
                                        }`}
                                        placeholder="Active commercial experience in Wix engineering&#10;Engineered corporate websites with high SEO&#10;Collaborated with global clients"
                                    />
                                ) : (
                                    <textarea
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        rows={3}
                                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none resize-none ${
                                            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
                                        }`}
                                        placeholder="Focusing on analytical problem solving, social dynamics, communication, and software research."
                                    />
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-400 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-95 flex items-center gap-1.5 shadow-md shadow-indigo-500/25 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Check size={14} />
                                    )}
                                    <span>{editingExp ? "Update Entry" : "Save Entry"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in">
                    <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setDeleteId(null)} />
                    <div
                        className={`relative max-w-sm w-full rounded-3xl p-6 ${
                            isDark ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        } shadow-2xl animate-scale-in z-10 text-center space-y-4`}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-base font-bold">Delete Timeline Entry?</h3>
                        <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            This item will be removed from your database and your public portfolio timeline.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-300 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 cursor-pointer"
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
