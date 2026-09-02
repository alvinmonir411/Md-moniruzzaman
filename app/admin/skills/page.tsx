"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Edit,
    Trash2,
    Award,
    Layers,
    Database,
    Wrench,
    Sparkles,
    RotateCcw,
    X,
    Check,
    Loader2,
    Sliders,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import { Skill } from "@/app/types";

const CATEGORIES = [
    { id: "frontend", label: "Frontend Engineering", icon: Layers, color: "from-cyan-500 to-blue-500" },
    { id: "backend", label: "Backend & Databases", icon: Database, color: "from-emerald-500 to-teal-500" },
    { id: "tools", label: "Tools, DevOps & Design", icon: Wrench, color: "from-purple-500 to-pink-500" },
];

const SUGGESTED_ICONS = ["⚛️", "🚀", "🟦", "💨", "🔴", "⚡", "🎨", "🟢", "🍃", "🔥", "🔗", "🐙", "🌐", "📐", "📬", "💻", "🛡️", "🐍", "☕", "📦"];

const LEVEL_TAGS = ["Master", "Expert", "Advanced", "Proficient", "Intermediate"];

export default function SkillsPage() {
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "frontend",
        proficiency: 85,
        icon: "⚡",
        description: "",
        tag: "Advanced",
        color: "from-indigo-500 to-purple-500",
    });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/skills");
            const data = await res.json();
            if (Array.isArray(data)) {
                setSkills(data);
            }
        } catch (error) {
            console.error("Failed to fetch skills:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeedSkills = async () => {
        if (!confirm("This will populate your database with 16 curated technical skills. Continue?")) return;
        try {
            setIsSeeding(true);
            const res = await fetch("/api/skills?seed=true", { method: "POST" });
            if (res.ok) {
                await fetchSkills();
            }
        } catch (error) {
            console.error("Failed to seed skills:", error);
        } finally {
            setIsSeeding(false);
        }
    };

    const openAddModal = () => {
        setEditingSkill(null);
        setFormData({
            name: "",
            category: "frontend",
            proficiency: 90,
            icon: "⚡",
            description: "",
            tag: "Advanced",
            color: "from-indigo-500 to-purple-500",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (skill: Skill) => {
        setEditingSkill(skill);
        setFormData({
            name: skill.name,
            category: (skill.category || "frontend").toLowerCase().includes("back")
                ? "backend"
                : (skill.category || "frontend").toLowerCase().includes("tool")
                ? "tools"
                : "frontend",
            proficiency: Number(skill.proficiency) || 85,
            icon: skill.icon || "⚡",
            description: skill.description || "",
            tag: skill.tag || "Advanced",
            color: skill.color || "from-indigo-500 to-purple-500",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            if (editingSkill) {
                // Update
                const res = await fetch("/api/skills", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        _id: editingSkill._id,
                        ...formData,
                    }),
                });
                if (res.ok) {
                    await fetchSkills();
                    setIsModalOpen(false);
                }
            } else {
                // Create
                const res = await fetch("/api/skills", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    await fetchSkills();
                    setIsModalOpen(false);
                }
            }
        } catch (error) {
            console.error("Failed to save skill:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setSkills((prev) => prev.filter((s) => s._id !== id));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Failed to delete skill:", error);
        }
    };

    // Filter helpers
    const getSkillsByCategory = (catId: string) => {
        return skills.filter((s) => {
            const c = (s.category || "").toLowerCase();
            if (catId === "frontend") return c.includes("front") || (!c.includes("back") && !c.includes("tool"));
            if (catId === "backend") return c.includes("back");
            if (catId === "tools") return c.includes("tool") || c.includes("devop") || c.includes("other");
            return false;
        });
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Award size={20} className="text-purple-400" />
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Technical Toolkit & Skills
                        </h1>
                    </div>
                    <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Manage verified technical stack shown on your portfolio landing page ({skills.length} skills total)
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    {skills.length === 0 && (
                        <button
                            onClick={handleSeedSkills}
                            disabled={isSeeding}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            {isSeeding ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                            <span>Seed 16 Default Skills</span>
                        </button>
                    )}

                    <button
                        onClick={openAddModal}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Add New Skill</span>
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
                    <p className="text-xs text-slate-400 mt-3">Loading skills from database...</p>
                </div>
            ) : skills.length === 0 ? (
                /* Empty state with instant 1-click restore */
                <div className="text-center py-16 border-2 border-dashed rounded-3xl border-slate-700/60 bg-slate-900/30 p-8">
                    <Award size={44} className="mx-auto text-purple-400 mb-3" />
                    <h3 className="text-lg font-bold text-white">Database is Currently Empty</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                        Your skills database has no entries. Click below to instantly populate your Neon DB with your 16 standard skills (React, Next.js, TypeScript, Tailwind, Node.js, etc.).
                    </p>
                    <button
                        onClick={handleSeedSkills}
                        disabled={isSeeding}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                    >
                        {isSeeding ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        <span>✨ Populate 16 Skills into Database</span>
                    </button>
                </div>
            ) : (
                /* Categories Grid */
                <div className="space-y-8">
                    {CATEGORIES.map((cat) => {
                        const categorySkills = getSkillsByCategory(cat.id);
                        const Icon = cat.icon;

                        return (
                            <div
                                key={cat.id}
                                className={`rounded-3xl p-6 border ${
                                    isDark ? "bg-[#0F172A] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                                } shadow-xl`}
                            >
                                <div className={`flex items-center justify-between mb-5 border-b ${isDark ? "border-slate-800" : "border-slate-200"} pb-3.5`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-md`}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                                {cat.label}
                                            </h2>
                                            <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                {categorySkills.length} competencies registered
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setEditingSkill(null);
                                            setFormData({
                                                name: "",
                                                category: cat.id,
                                                proficiency: 90,
                                                icon: "⚡",
                                                description: "",
                                                tag: "Advanced",
                                                color: "from-indigo-500 to-purple-500",
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                                    >
                                        <Plus size={13} />
                                        <span>Add to {cat.id}</span>
                                    </button>
                                </div>

                                {categorySkills.length === 0 ? (
                                    <p className={`text-xs py-4 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        No skills added to this category yet.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categorySkills.map((skill) => (
                                            <div
                                                key={skill._id}
                                                className={`p-4 rounded-2xl border transition-all duration-200 hover:border-indigo-500/50 hover:shadow-lg flex flex-col justify-between group ${
                                                    isDark ? "bg-[#161F37] border-slate-700/80 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shadow-sm">
                                                                {skill.icon || "⚡"}
                                                            </div>
                                                            <div>
                                                                <h3 className={`text-sm font-bold group-hover:text-indigo-400 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                                                                    {skill.name}
                                                                </h3>
                                                                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                                                                    {skill.tag || "Advanced"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => openEditModal(skill)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                                                                title="Edit Skill"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteId(skill._id)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                                title="Delete Skill"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {skill.description && (
                                                        <p className={`text-[11px] line-clamp-2 mt-2 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                                            {skill.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Proficiency Bar */}
                                                <div className={`mt-3 pt-2.5 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                                                    <div className={`flex items-center justify-between text-[11px] font-mono mb-1 font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                                        <span>Proficiency</span>
                                                        <span className="text-indigo-400 font-bold">{skill.proficiency}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 rounded-full bg-slate-700/40 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                                                            style={{ width: `${Math.min(100, Math.max(10, skill.proficiency))}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add / Edit Skill Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in">
                    <div
                        className="fixed inset-0 bg-black/75 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div
                        className={`relative max-w-lg w-full rounded-3xl p-6 ${
                            isDark ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        } shadow-2xl animate-scale-in z-10 space-y-5`}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Award size={18} className="text-indigo-400" />
                                <span>{editingSkill ? "Edit Skill" : "Add New Skill"}</span>
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Icon Picker */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                    Icon Emoji / Symbol
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
                                        placeholder="Type or click emoji below"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800">
                                    {SUGGESTED_ICONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: emoji })}
                                            className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-transform hover:scale-125 ${
                                                formData.icon === emoji ? "bg-indigo-600 shadow-md" : "hover:bg-slate-800"
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    Skill Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border-2 outline-none ${
                                        isDark ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500" : "bg-white border-slate-200 focus:border-indigo-500"
                                    }`}
                                    placeholder="e.g. Next.js 16, TypeScript, Docker"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                    Category
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat.id })}
                                            className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                                                formData.category === cat.id
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                                    : isDark
                                                    ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                                                    : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
                                            }`}
                                        >
                                            {cat.id === "frontend" ? "Frontend" : cat.id === "backend" ? "Backend" : "Tools"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Proficiency & Level Tag */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Proficiency
                                        </label>
                                        <span className="text-xs font-bold text-indigo-400">{formData.proficiency}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={10}
                                        max={100}
                                        value={formData.proficiency}
                                        onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                                        className="w-full accent-indigo-500 cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Level Tag
                                    </label>
                                    <select
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                                            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
                                        }`}
                                    >
                                        {LEVEL_TAGS.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none resize-none ${
                                        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
                                    }`}
                                    placeholder="Brief note about real-world usage..."
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-400"
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
                                    <span>{editingSkill ? "Update Skill" : "Save Skill"}</span>
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
                        <h3 className="text-base font-bold">Delete Technical Skill?</h3>
                        <p className="text-xs text-slate-400">
                            This skill will be removed from your database and your public portfolio toolkit.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-300"
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
