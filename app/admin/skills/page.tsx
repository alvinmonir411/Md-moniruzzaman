"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import { Skill } from "@/app/types";

const categories = ["Frontend", "Backend", "Tools & Others"];

export default function SkillsPage() {
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState({
        name: "",
        category: "Frontend",
        proficiency: 50,
    });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch("/api/skills");
            const data = await res.json();
            setSkills(data);
        } catch (error) {
            console.error("Failed to fetch skills:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async () => {
        try {
            const res = await fetch("/api/skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSkill),
            });

            if (res.ok) {
                await fetchSkills();
                setIsAddingSkill(false);
                setNewSkill({ name: "", category: "Frontend", proficiency: 50 });
            }
        } catch (error) {
            console.error("Failed to add skill:", error);
        }
    };

    const handleUpdateSkill = async () => {
        if (!editingSkill) return;

        try {
            const res = await fetch("/api/skills", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingSkill),
            });

            if (res.ok) {
                await fetchSkills();
                setEditingSkill(null);
            }
        } catch (error) {
            console.error("Failed to update skill:", error);
        }
    };

    const handleDeleteSkill = async (id: string) => {
        try {
            const res = await fetch(`/api/skills?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setSkills(skills.filter((s) => s._id !== id));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Failed to delete skill:", error);
        }
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
                        Skills
                    </h1>
                    <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                        Manage your technical skills
                    </p>
                </div>
                <button
                    onClick={() => setIsAddingSkill(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <Plus size={20} />
                    Add Skill
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
                /* Skills by Category */
                <>
                    {categories.map((category) => (
                        <div
                            key={category}
                            className={`rounded-2xl p-6 ${isDark
                                ? "bg-slate-900 border border-slate-800"
                                : "bg-white border border-gray-200"
                                } shadow-lg`}
                        >
                            <h2
                                className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"
                                    }`}
                            >
                                {category}
                            </h2>

                            <div className="space-y-3">
                                {skills
                                    .filter((skill) => skill.category === category)
                                    .map((skill) => (
                                        <div
                                            key={skill._id}
                                            className={`flex items-center gap-4 p-4 rounded-xl ${isDark
                                                ? "bg-slate-800 hover:bg-slate-700"
                                                : "bg-gray-50 hover:bg-gray-100"
                                                } transition-colors`}
                                        >
                                            <GripVertical
                                                size={20}
                                                className={
                                                    isDark ? "text-slate-600" : "text-slate-400"
                                                }
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span
                                                        className={`font-medium ${isDark ? "text-white" : "text-slate-900"
                                                            }`}
                                                    >
                                                        {skill.name}
                                                    </span>
                                                    <span
                                                        className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"
                                                            }`}
                                                    >
                                                        {skill.proficiency}%
                                                    </span>
                                                </div>
                                                <div
                                                    className={`h-2 rounded-full ${isDark ? "bg-slate-700" : "bg-gray-200"
                                                        } overflow-hidden`}
                                                >
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                                        style={{ width: `${skill.proficiency}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingSkill(skill)}
                                                    className={`p-2 rounded-lg transition-colors ${isDark
                                                        ? "hover:bg-blue-900/30 text-blue-400"
                                                        : "hover:bg-blue-50 text-blue-600"
                                                        }`}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(skill._id)}
                                                    className={`p-2 rounded-lg transition-colors ${isDark
                                                        ? "hover:bg-red-900/30 text-red-400"
                                                        : "hover:bg-red-50 text-red-600"
                                                        }`}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                {skills.filter((skill) => skill.category === category)
                                    .length === 0 && (
                                        <p
                                            className={`text-center py-8 ${isDark ? "text-slate-500" : "text-slate-400"
                                                }`}
                                        >
                                            No skills in this category yet
                                        </p>
                                    )}
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Add/Edit Skill Modal */}
            {(isAddingSkill || editingSkill) && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => {
                            setIsAddingSkill(false);
                            setEditingSkill(null);
                        }}
                    />
                    <div
                        className={`relative max-w-md w-full rounded-2xl p-6 ${isDark
                            ? "bg-slate-900 border border-slate-800"
                            : "bg-white border border-gray-200"
                            } shadow-2xl animate-scale-in`}
                    >
                        <h3
                            className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"
                                }`}
                        >
                            {editingSkill ? "Edit Skill" : "Add New Skill"}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                        }`}
                                >
                                    Skill Name
                                </label>
                                <input
                                    type="text"
                                    value={editingSkill ? editingSkill.name : newSkill.name}
                                    onChange={(e) =>
                                        editingSkill
                                            ? setEditingSkill({
                                                ...editingSkill,
                                                name: e.target.value,
                                            })
                                            : setNewSkill({ ...newSkill, name: e.target.value })
                                    }
                                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                        ? "bg-slate-800 border-slate-700 text-white"
                                        : "bg-white border-gray-200 text-slate-900"
                                        } focus:outline-none focus:border-indigo-500`}
                                    placeholder="e.g., React.js"
                                />
                            </div>

                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                        }`}
                                >
                                    Category
                                </label>
                                <select
                                    value={
                                        editingSkill ? editingSkill.category : newSkill.category
                                    }
                                    onChange={(e) =>
                                        editingSkill
                                            ? setEditingSkill({
                                                ...editingSkill,
                                                category: e.target.value,
                                            })
                                            : setNewSkill({ ...newSkill, category: e.target.value })
                                    }
                                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                        ? "bg-slate-800 border-slate-700 text-white"
                                        : "bg-white border-gray-200 text-slate-900"
                                        } focus:outline-none focus:border-indigo-500`}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"
                                        }`}
                                >
                                    Proficiency:{" "}
                                    {editingSkill
                                        ? editingSkill.proficiency
                                        : newSkill.proficiency}
                                    %
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={
                                        editingSkill
                                            ? editingSkill.proficiency
                                            : newSkill.proficiency
                                    }
                                    onChange={(e) =>
                                        editingSkill
                                            ? setEditingSkill({
                                                ...editingSkill,
                                                proficiency: parseInt(e.target.value),
                                            })
                                            : setNewSkill({
                                                ...newSkill,
                                                proficiency: parseInt(e.target.value),
                                            })
                                    }
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsAddingSkill(false);
                                    setEditingSkill(null);
                                }}
                                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${isDark
                                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingSkill ? handleUpdateSkill : handleAddSkill}
                                className="flex-1 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors"
                            >
                                {editingSkill ? "Update" : "Add"} Skill
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
                            Delete Skill?
                        </h3>
                        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                            Are you sure you want to delete this skill? This action cannot be
                            undone.
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
                                onClick={() => handleDeleteSkill(deleteId)}
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
