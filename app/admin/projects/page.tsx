"use client";

import React, { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ExternalLink,
    Github,
    Image as ImageIcon,
    Loader2,
    X,
    ChevronLeft,
    ChevronRight,
    Pin,
    Sparkles,
    Globe,
    Code,
    UploadCloud,
    Link as LinkIcon,
    Layers,
    Check,
    Eye,
    Palette,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import Image from "next/image";
import { addProject } from "@/app/Actions/Admin/AddProject";
import { updateProject } from "@/app/Actions/Admin/UpdateProject";
import GitHubSyncModal, { GitHubRepoItem } from "@/app/Components/Admin/GitHubSyncModal";

const SUGGESTED_TECH = [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "Neon DB",
    "MongoDB",
    "Redux Toolkit",
    "Cloudinary",
    "Express.js",
    "REST API",
    "Prisma",
    "Firebase",
    "Wix",
];

interface Project {
    _id: string;
    img?: string;
    title: string;
    description?: string;
    tech: string | string[];
    liveUrl?: string;
    githubUrl?: string;
    category?: string;
    images?: string[];
    is_featured?: boolean;
    isFeatured?: boolean;
}

export default function ProjectsPage() {
    const router = useRouter();
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<"all" | "pinned" | "custom" | "wix">("all");
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [viewProject, setViewProject] = useState<Project | null>(null);

    // Add Project State
    const [isAdding, setIsAdding] = useState(false);
    const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [thumbnailMode, setThumbnailMode] = useState<"file" | "url">("file");
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        tech: "",
        live: "",
        github: "",
        category: "custom",
        is_featured: false,
        thumbnail: null as File | null,
        thumbnailUrl: "",
        images: [] as File[],
        existingImages: [] as string[],
    });

    const addTechPill = (tech: string) => {
        const currentList = formData.tech
            ? formData.tech.split(",").map((t) => t.trim()).filter(Boolean)
            : [];
        if (!currentList.includes(tech)) {
            const updated = [...currentList, tech].join(", ");
            setFormData({ ...formData, tech: updated });
        }
    };

    const handleCustomizeGitHubRepo = (repo: GitHubRepoItem) => {
        resetForm();
        setFormData({
            title: repo.title,
            desc: repo.description,
            tech: repo.tech,
            live: repo.liveUrl,
            github: repo.githubUrl,
            category: "custom",
            is_featured: false,
            thumbnail: null,
            thumbnailUrl: repo.defaultThumbnail || "",
            images: [],
            existingImages: [],
        });
        if (repo.defaultThumbnail) {
            setThumbnailMode("url");
        }
        setIsAdding(true);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePin = async (id: string, currentPinned: boolean) => {
        const newPinned = !currentPinned;
        // Optimistic UI update
        setProjects(prev =>
            prev.map(p =>
                p._id === id ? { ...p, is_featured: newPinned, isFeatured: newPinned } : p
            )
        );

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_featured: newPinned }),
            });

            if (!res.ok) {
                await fetchProjects();
            }
        } catch (error) {
            console.error("Failed to update pin status:", error);
            await fetchProjects();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, thumbnail: e.target.files[0] });
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFormData({ ...formData, images: [...formData.images, ...newFiles] });
        }
    };

    const removeNewImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const removeExistingImage = (index: number) => {
        const updated = [...formData.existingImages];
        updated.splice(index, 1);
        setFormData({ ...formData, existingImages: updated });
    };

    const handleEdit = (project: Project) => {
        console.log("Editing project:", project);
        setEditingId(project._id);
        const techStr = Array.isArray(project.tech)
            ? project.tech.join(", ")
            : (project.tech || "");

        setFormData({
            title: project.title || "",
            desc: project.description || "",
            tech: techStr,
            live: project.liveUrl || "",
            github: project.githubUrl || "",
            category: project.category || "custom",
            is_featured: Boolean(project.is_featured || project.isFeatured),
            thumbnail: null,
            thumbnailUrl: project.img || "",
            images: [],
            existingImages: project.images || [],
        });
        if (project.img) {
            setThumbnailMode("url");
        }
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingId) {
                // Update existing project using Server Action
                const data = new FormData();
                data.append("_id", editingId);
                data.append("title", formData.title);
                data.append("desc", formData.desc);
                data.append("tech", formData.tech);
                data.append("live", formData.live);
                data.append("github", formData.github);
                data.append("category", formData.category);
                data.append("is_featured", String(formData.is_featured));

                if (formData.thumbnail) {
                    data.append("thumbnail", formData.thumbnail);
                } else if (formData.thumbnailUrl) {
                    data.append("thumbnailUrl", formData.thumbnailUrl);
                }

                // Add existing images (list of kept URLs)
                data.append("existingImages", JSON.stringify(formData.existingImages));

                // Add new gallery images
                formData.images.forEach(file => {
                    data.append("images", file);
                });

                const result = await updateProject(data);

                if (result.success) {
                    await fetchProjects();
                    setIsAdding(false);
                    setEditingId(null);
                    resetForm();
                } else {
                    alert("Failed to update project: " + result.error);
                }
            } else {
                // Add new project
                const data = new FormData();
                data.append("title", formData.title);
                data.append("desc", formData.desc);
                data.append("tech", formData.tech);
                data.append("live", formData.live);
                data.append("github", formData.github);
                data.append("category", formData.category);
                data.append("is_featured", String(formData.is_featured));

                if (formData.thumbnail) {
                    data.append("thumbnail", formData.thumbnail);
                } else if (formData.thumbnailUrl) {
                    data.append("thumbnailUrl", formData.thumbnailUrl);
                }

                // Add existing images if any (e.g. from customize)
                data.append("existingImages", JSON.stringify(formData.existingImages));

                // Add gallery images
                formData.images.forEach(file => {
                    data.append("images", file);
                });

                const result = await addProject(data);

                if (result.success) {
                    await fetchProjects();
                    setIsAdding(false);
                    resetForm();
                } else {
                    alert("Failed to add project: " + result.error);
                }
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            desc: "",
            tech: "",
            live: "",
            github: "",
            category: "custom",
            is_featured: false,
            thumbnail: null,
            thumbnailUrl: "",
            images: [],
            existingImages: [],
        });
        setThumbnailMode("file");
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setProjects(projects.filter((p) => p._id !== id));
                setDeleteId(null);
                await fetchProjects();
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const filteredProjects = projects.filter((project) => {
        if (filterCategory === "pinned" && !project.is_featured && !project.isFeatured) {
            return false;
        }
        if (filterCategory === "custom" && project.category === "wix") {
            return false;
        }
        if (filterCategory === "wix" && project.category !== "wix") {
            return false;
        }
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
            (project.title && project.title.toLowerCase().includes(term)) ||
            (project.description && project.description.toLowerCase().includes(term))
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center gap-4 mb-6">
                <div>
                    <h1
                        className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"
                            }`}
                    >
                        Projects
                    </h1>
                    <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                        Manage your portfolio projects & pinned homepage highlights
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsGitHubSyncOpen(true)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium border-2 transition-all duration-200 shadow-md hover:scale-105 ${
                            isDark
                                ? "bg-slate-800/80 border-indigo-500/30 text-indigo-300 hover:bg-slate-800 hover:border-indigo-500/60"
                                : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                        }`}
                    >
                        <Github size={20} className="text-indigo-500" />
                        <span>Sync GitHub</span>
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsAdding(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <Plus size={20} />
                        Add Project
                    </button>
                </div>
            </div>

            {/* Search & Filter Tabs */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                <div className="relative flex-1">
                    <Search
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Search projects by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all ${isDark
                            ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500"
                            : "bg-white border-gray-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {[
                        { id: "all" as const, label: "All", count: projects.length },
                        { id: "pinned" as const, label: "📌 Pinned", count: projects.filter(p => p.is_featured || p.isFeatured).length },
                        { id: "custom" as const, label: "Custom Code", count: projects.filter(p => !p.category || p.category === "custom").length },
                        { id: "wix" as const, label: "Wix", count: projects.filter(p => p.category === "wix").length },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterCategory(tab.id)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                                filterCategory === tab.id
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                    : isDark
                                    ? "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
                                    : "bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                                filterCategory === tab.id ? "bg-white/20 text-white" : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div
                    className={`text-center py-12 rounded-2xl ${isDark
                        ? "bg-slate-900 border border-slate-800"
                        : "bg-white border border-gray-200"
                        }`}
                >
                    <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                        {searchTerm ? "No matching projects found" : "No projects in this category"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => setViewProject(project)}
                            className={`rounded-2xl overflow-hidden cursor-pointer ${isDark
                                ? "bg-slate-900 border border-slate-800"
                                : "bg-white border border-gray-200"
                                } shadow-lg hover:shadow-xl transition-all duration-300`}
                        >
                            {/* Project Image */}
                            <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 group">
                                {project.img ? (
                                    <Image
                                        src={project.img}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white/50">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                                {/* Category & Pinned Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-900/85 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
                                        {project.category === "wix" ? "Wix / No-Code" : "Custom Code"}
                                    </span>
                                    {Boolean(project.is_featured || project.isFeatured) && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/90 text-slate-950 flex items-center gap-1 shadow-md">
                                            <span>📌</span> Pinned
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Title */}
                                <h3
                                    className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"
                                        }`}
                                >
                                    {project.title}
                                </h3>

                                {/* Description */}
                                <p
                                    className={`text-sm mb-4 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"
                                        }`}
                                >
                                    {project.description || "No description"}
                                </p>

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {Array.isArray(project.tech) ? (
                                        <>
                                            {project.tech.slice(0, 3).map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                                                        ? "bg-indigo-900/30 text-indigo-300"
                                                        : "bg-indigo-100 text-indigo-700"
                                                        }`}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.tech.length > 3 && (
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                                                        ? "bg-slate-800 text-slate-400"
                                                        : "bg-gray-100 text-slate-600"
                                                        }`}
                                                >
                                                    +{project.tech.length - 3} more
                                                </span>
                                            )}
                                        </>
                                    ) : project.tech ? (
                                        String(project.tech)
                                            .split(",")
                                            .map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                                                        ? "bg-indigo-900/30 text-indigo-300"
                                                        : "bg-indigo-100 text-indigo-700"
                                                        }`}
                                                >
                                                    {tech.trim()}
                                                </span>
                                            ))
                                    ) : null}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Pin to Home Toggle Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const isPinned = Boolean(project.is_featured || project.isFeatured);
                                            handleTogglePin(project._id, isPinned);
                                        }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer relative z-10 ${
                                            Boolean(project.is_featured || project.isFeatured)
                                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:bg-amber-500/30"
                                                : isDark
                                                ? "bg-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 border border-slate-700 hover:bg-slate-750"
                                                : "bg-slate-100 text-slate-600 hover:text-amber-700 hover:border-amber-400 border border-slate-200 hover:bg-amber-50"
                                        }`}
                                        title={Boolean(project.is_featured || project.isFeatured) ? "Click to Unpin from Home Page" : "Click to Pin to Home Page"}
                                    >
                                        <Pin size={13} className={Boolean(project.is_featured || project.isFeatured) ? "fill-amber-400 text-amber-400 rotate-45" : ""} />
                                        <span>{Boolean(project.is_featured || project.isFeatured) ? "Pinned to Home" : "Pin to Home"}</span>
                                    </button>

                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className={`p-2 rounded-lg transition-colors relative z-10 ${isDark
                                                ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                                                : "hover:bg-gray-100 text-slate-600 hover:text-slate-900"
                                                }`}
                                            title="View Live"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className={`p-2 rounded-lg transition-colors relative z-10 ${isDark
                                                ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                                                : "hover:bg-gray-100 text-slate-600 hover:text-slate-900"
                                                }`}
                                            title="View GitHub"
                                        >
                                            <Github size={18} />
                                        </a>
                                    )}
                                    <div className="flex-1"></div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(project);
                                        }}
                                        className={`p-2 rounded-lg transition-colors relative z-10 cursor-pointer ${isDark
                                            ? "hover:bg-blue-900/30 text-blue-400"
                                            : "hover:bg-blue-50 text-blue-600"
                                            }`}
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteId(project._id);
                                        }}
                                        className={`p-2 rounded-lg transition-colors relative z-10 cursor-pointer ${isDark
                                            ? "hover:bg-red-900/30 text-red-400"
                                            : "hover:bg-red-50 text-red-600"
                                            }`}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Project Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/75 backdrop-blur-md"
                        onClick={() => {
                            setIsAdding(false);
                            resetForm();
                        }}
                    />
                    <div
                        className={`relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-3xl my-auto ${
                            isDark
                                ? "bg-slate-900/95 border border-slate-800 text-white"
                                : "bg-white/95 border border-slate-200 text-slate-900"
                        } shadow-2xl animate-scale-in overflow-hidden z-10`}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25">
                                    {editingId ? <Edit size={22} /> : <Sparkles size={22} />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">
                                        {editingId ? "Edit Project Details" : "Create New Project"}
                                    </h3>
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        Configure project visuals, metadata, tech stack, and deployment links.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    resetForm();
                                }}
                                className={`p-2 rounded-xl border transition-all ${
                                    isDark
                                        ? "border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white"
                                        : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form Scrollable Area */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* LEFT COLUMN: Visuals, Media & Live Preview */}
                                <div className="lg:col-span-5 space-y-5">
                                    {/* Main Project Thumbnail */}
                                    <div
                                        className={`p-4.5 rounded-2xl border ${
                                            isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50/70 border-slate-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                                                <ImageIcon size={14} /> Main Thumbnail
                                            </label>

                                            {/* Toggle between File Upload & Direct URL */}
                                            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-semibold">
                                                <button
                                                    type="button"
                                                    onClick={() => setThumbnailMode("file")}
                                                    className={`px-2.5 py-1 rounded-md transition-all ${
                                                        thumbnailMode === "file"
                                                            ? "bg-indigo-600 text-white shadow-sm"
                                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                                    }`}
                                                >
                                                    Upload File
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setThumbnailMode("url")}
                                                    className={`px-2.5 py-1 rounded-md transition-all ${
                                                        thumbnailMode === "url"
                                                            ? "bg-indigo-600 text-white shadow-sm"
                                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                                    }`}
                                                >
                                                    Image URL
                                                </button>
                                            </div>
                                        </div>

                                        {/* Thumbnail Preview / Drop Zone */}
                                        {formData.thumbnail ? (
                                            <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-indigo-500/40 bg-slate-950 group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={URL.createObjectURL(formData.thumbnail)}
                                                    alt="Thumbnail Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <label
                                                        htmlFor="thumbnail-upload"
                                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-md"
                                                    >
                                                        Change File
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, thumbnail: null })}
                                                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-md"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-black/70 text-emerald-400 backdrop-blur-md">
                                                    ✓ Local File Selected
                                                </span>
                                            </div>
                                        ) : formData.thumbnailUrl ? (
                                            <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-indigo-500/40 bg-slate-950 group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={formData.thumbnailUrl}
                                                    alt="Thumbnail URL Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            "https://placehold.co/600x400/1e293b/ffffff?text=Preview+Unavailable";
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, thumbnailUrl: "" })}
                                                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-md"
                                                    >
                                                        Remove URL
                                                    </button>
                                                </div>
                                                <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-black/70 text-indigo-300 backdrop-blur-md">
                                                    🌐 Remote / Screenshot URL
                                                </span>
                                            </div>
                                        ) : thumbnailMode === "file" ? (
                                            <div
                                                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                                                    isDark
                                                        ? "border-slate-700 hover:border-indigo-500 bg-slate-800/30 hover:bg-slate-800/60"
                                                        : "border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/20"
                                                }`}
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="thumbnail-upload"
                                                />
                                                <label
                                                    htmlFor="thumbnail-upload"
                                                    className="cursor-pointer flex flex-col items-center gap-2"
                                                >
                                                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                                                        <UploadCloud size={28} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold">
                                                            Click or drag an image here
                                                        </p>
                                                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                            PNG, JPG, WebP up to 10MB
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <LinkIcon
                                                        size={14}
                                                        className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                                                            isDark ? "text-slate-500" : "text-slate-400"
                                                        }`}
                                                    />
                                                    <input
                                                        type="url"
                                                        value={formData.thumbnailUrl}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, thumbnailUrl: e.target.value })
                                                        }
                                                        placeholder="Paste image / screenshot URL..."
                                                        className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border transition-all ${
                                                            isDark
                                                                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500"
                                                                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                                                        } outline-none`}
                                                    />
                                                </div>
                                                <p className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                    Cloudinary, GitHub OpenGraph, or direct image link.
                                                </p>
                                            </div>
                                        )}

                                        {/* Hidden file input for changing file */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="thumbnail-upload"
                                        />
                                    </div>

                                    {/* Gallery Images (Additional screenshots) */}
                                    <div
                                        className={`p-4.5 rounded-2xl border ${
                                            isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50/70 border-slate-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                                                <Layers size={14} /> Project Gallery
                                            </label>
                                            <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                {formData.existingImages.length + formData.images.length} images
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2.5">
                                            {/* Existing Gallery Images */}
                                            {formData.existingImages.map((imgUrl, idx) => (
                                                <div
                                                    key={`exist-${idx}`}
                                                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-sm"
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={imgUrl}
                                                        alt="Gallery Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src =
                                                                "https://placehold.co/200x200/1e293b/ffffff?text=Image";
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(idx)}
                                                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md hover:scale-110 transition-transform opacity-90 group-hover:opacity-100"
                                                    >
                                                        <X size={11} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* New Gallery Images */}
                                            {formData.images.map((file, idx) => (
                                                <div
                                                    key={`new-${idx}`}
                                                    className="group relative aspect-square rounded-xl overflow-hidden border border-indigo-500/50 bg-indigo-950/30 shadow-sm"
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="New Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(idx)}
                                                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md hover:scale-110 transition-transform opacity-90 group-hover:opacity-100"
                                                    >
                                                        <X size={11} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add More Button */}
                                            <label
                                                htmlFor="gallery-upload"
                                                className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                                                    isDark
                                                        ? "border-slate-700 hover:border-purple-500 bg-slate-800/30 hover:bg-slate-800"
                                                        : "border-slate-300 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/30"
                                                }`}
                                            >
                                                <Plus size={18} className="text-purple-400" />
                                                <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                                                    Add
                                                </span>
                                                <input
                                                    type="file"
                                                    id="gallery-upload"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleGalleryChange}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Live Portfolio Card Mockup Preview */}
                                    <div
                                        className={`p-4 rounded-2xl border ${
                                            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-100/80 border-slate-200"
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 mb-2.5 text-slate-400 text-xs font-semibold">
                                            <Eye size={13} /> Live Portfolio Mockup Preview
                                        </div>
                                        <div
                                            className={`rounded-xl overflow-hidden border transition-all ${
                                                isDark
                                                    ? "bg-slate-900 border-slate-800"
                                                    : "bg-white border-slate-200"
                                            } shadow-lg`}
                                        >
                                            <div className="relative h-28 bg-gradient-to-br from-indigo-600 to-purple-600 overflow-hidden">
                                                {formData.thumbnail ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={URL.createObjectURL(formData.thumbnail)}
                                                        alt="Mockup"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : formData.thumbnailUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={formData.thumbnailUrl}
                                                        alt="Mockup"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-white/40">
                                                        <ImageIcon size={32} />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 flex gap-1.5">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-indigo-300 backdrop-blur-md">
                                                        {formData.category === "wix" ? "Wix / No-Code" : "Custom Code"}
                                                    </span>
                                                    {formData.is_featured && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                                                            📌 Pinned
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h4 className="text-sm font-bold truncate">
                                                    {formData.title || "Project Title"}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                                    {formData.desc || "Brief project description will appear here."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Project Details, Meta & Controls */}
                                <div className="lg:col-span-7 space-y-4.5">
                                    {/* Project Type Category Tabs */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                            Project Category
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: "custom" })}
                                                className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                                                    formData.category === "custom"
                                                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold shadow-md shadow-indigo-500/10"
                                                        : isDark
                                                        ? "border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white"
                                                        : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900"
                                                }`}
                                            >
                                                <Code size={16} />
                                                <span className="text-xs">Custom Code (Next.js/React)</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: "wix" })}
                                                className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                                                    formData.category === "wix"
                                                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold shadow-md shadow-indigo-500/10"
                                                        : isDark
                                                        ? "border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white"
                                                        : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900"
                                                }`}
                                            >
                                                <Palette size={16} />
                                                <span className="text-xs">Wix / No-Code Platform</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pin to Home Page Highlight Banner */}
                                    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shadow-sm">
                                                <Pin size={16} className="fill-amber-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-amber-300">
                                                    Pin to Landing Page (Featured)
                                                </h4>
                                                <p className="text-[11px] text-slate-400">
                                                    Showcase this project directly on your homepage hero grid
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_featured}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, is_featured: e.target.checked })
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                        </label>
                                    </div>

                                    {/* Project Title */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Project Title <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className={`w-full px-4 py-2.5 text-sm rounded-xl border-2 transition-all outline-none ${
                                                isDark
                                                    ? "bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500"
                                                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                                            }`}
                                            placeholder="e.g., Murtec SaaS Platform"
                                            required
                                        />
                                    </div>

                                    {/* Project Description */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Description <span className="text-rose-500">*</span>
                                            </label>
                                            <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                {formData.desc.length} chars
                                            </span>
                                        </div>
                                        <textarea
                                            value={formData.desc}
                                            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                            rows={3}
                                            className={`w-full px-4 py-2.5 text-sm rounded-xl border-2 transition-all outline-none resize-none ${
                                                isDark
                                                    ? "bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500"
                                                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                                            }`}
                                            placeholder="Brief overview of the project architecture, features, and key accomplishments..."
                                            required
                                        />
                                    </div>

                                    {/* Tech Stack Input + Quick Add Pills */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Tech Stack <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tech}
                                            onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                                            className={`w-full px-4 py-2.5 text-sm rounded-xl border-2 transition-all outline-none ${
                                                isDark
                                                    ? "bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500"
                                                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                                            }`}
                                            placeholder="e.g., Next.js 16, React 19, TypeScript, Tailwind CSS"
                                            required
                                        />

                                        {/* Quick Add Suggestion Pills */}
                                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                            <span className="text-[11px] text-slate-500 mr-1 font-medium">Quick Add:</span>
                                            {SUGGESTED_TECH.map((tech) => {
                                                const isIncluded = formData.tech
                                                    .toLowerCase()
                                                    .includes(tech.toLowerCase());
                                                return (
                                                    <button
                                                        key={tech}
                                                        type="button"
                                                        onClick={() => addTechPill(tech)}
                                                        className={`px-2 py-0.5 text-[11px] font-medium rounded-md border transition-all cursor-pointer ${
                                                            isIncluded
                                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                                : isDark
                                                                ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white"
                                                                : "bg-slate-100 border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600"
                                                        }`}
                                                    >
                                                        + {tech}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* URLs Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                                    <Globe size={12} /> Live Website URL
                                                </label>
                                                {formData.live && (
                                                    <a
                                                        href={formData.live}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[11px] text-indigo-400 hover:underline flex items-center gap-0.5"
                                                    >
                                                        Test <ExternalLink size={10} />
                                                    </a>
                                                )}
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.live}
                                                onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                                                className={`w-full px-3.5 py-2 text-xs rounded-xl border-2 transition-all outline-none ${
                                                    isDark
                                                        ? "bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500"
                                                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                                                }`}
                                                placeholder="https://your-project.vercel.app"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                                    <Github size={12} /> GitHub Repository URL
                                                </label>
                                                {formData.github && (
                                                    <a
                                                        href={formData.github}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[11px] text-purple-400 hover:underline flex items-center gap-0.5"
                                                    >
                                                        Test <ExternalLink size={10} />
                                                    </a>
                                                )}
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.github}
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                className={`w-full px-3.5 py-2 text-xs rounded-xl border-2 transition-all outline-none ${
                                                    isDark
                                                        ? "bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500"
                                                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                                                }`}
                                                placeholder="https://github.com/alvinmonir411/..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Modal Footer */}
                            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAdding(false);
                                        resetForm();
                                    }}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                        isDark
                                            ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                                            : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-95 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            <span>{editingId ? "Updating Project..." : "Publishing..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            <span>{editingId ? "Update Project" : "Save & Publish Project"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
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
                            Delete Project?
                        </h3>
                        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                            Are you sure you want to delete this project? This action cannot
                            be undone.
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
                                onClick={() => {
                                    if (deleteId) handleDelete(deleteId);
                                }}
                                className="flex-1 px-4 py-2 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* View Project Modal */}
            {viewProject && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => setViewProject(null)}
                    />
                    <div
                        className={`relative max-w-4xl w-full rounded-2xl overflow-hidden ${isDark
                            ? "bg-slate-900 border border-slate-800"
                            : "bg-white border border-gray-200"
                            } shadow-2xl animate-scale-in`}
                    >
                        {/* Modal Header Image Slider */}
                        <AdminImageSlider project={viewProject} />

                        <button
                            onClick={() => setViewProject(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer z-[60]"
                        >
                            <X size={24} />
                        </button>

                        {/* Modal Content */}
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                            {viewProject.title}
                                        </h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${isDark
                                            ? "bg-slate-800 border-slate-700 text-slate-300"
                                            : "bg-gray-100 border-gray-200 text-slate-600"
                                            }`}>
                                            {viewProject.category === 'wix' ? 'Wix/No-Code' : 'Custom Code'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(viewProject.tech) ? (
                                            viewProject.tech.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${isDark
                                                        ? "bg-indigo-900/30 text-indigo-300"
                                                        : "bg-indigo-100 text-indigo-700"
                                                        }`}
                                                >
                                                    {tech}
                                                </span>
                                            ))
                                        ) : viewProject.tech ? (
                                            String(viewProject.tech).split(",").map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${isDark
                                                        ? "bg-indigo-900/30 text-indigo-300"
                                                        : "bg-indigo-100 text-indigo-700"
                                                        }`}
                                                >
                                                    {tech.trim()}
                                                </span>
                                            ))
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    {viewProject.liveUrl && (
                                        <a
                                            href={viewProject.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                        >
                                            <ExternalLink size={18} />
                                            Live Demo
                                        </a>
                                    )}
                                    {viewProject.githubUrl && (
                                        <a
                                            href={viewProject.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium border-2 transition-colors ${isDark
                                                ? "border-slate-700 text-white hover:bg-slate-800"
                                                : "border-gray-200 text-slate-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            <Github size={18} />
                                            Source Code
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className={`prose max-w-none ${isDark ? "prose-invert" : ""}`}>
                                <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                                    About Project
                                </h3>
                                <p className={`whitespace-pre-wrap leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                    {viewProject.description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* GitHub Sync & Selective Approval Modal */}
            <GitHubSyncModal
                isOpen={isGitHubSyncOpen}
                onClose={() => setIsGitHubSyncOpen(false)}
                isDark={isDark}
                onProjectImported={fetchProjects}
                onCustomizeRepo={handleCustomizeGitHubRepo}
            />
        </div>
    );
}

const AdminImageSlider = ({ project }: { project: Project }) => {
    const images = [project.img, ...(project.images || [])].filter(Boolean) as string[];
    const [index, setIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="relative h-64 md:h-80 bg-slate-800 flex items-center justify-center text-slate-500">
                <ImageIcon size={64} />
            </div>
        );
    }

    return (
        <div className="relative h-64 md:h-80 bg-black group">
            <Image
                src={images[index]}
                alt={project.title}
                fill
                className="object-contain"
            />

            {images.length > 1 && (
                <>
                    <button
                        onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => setIndex((i) => (i + 1) % images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                        <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-indigo-500' : 'bg-white/30'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
