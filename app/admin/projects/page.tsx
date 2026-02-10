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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import Image from "next/image";
import { addProject } from "@/app/Actions/Admin/AddProject";
import { updateProject } from "@/app/Actions/Admin/UpdateProject";

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
}

export default function ProjectsPage() {
    const router = useRouter();
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [viewProject, setViewProject] = useState<Project | null>(null);

    // Add Project State
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        tech: "",
        live: "",
        github: "",
        category: "custom",
        thumbnail: null as File | null,
        images: [] as File[],
        existingImages: [] as string[],
    });

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
            thumbnail: null,
            images: [],
            existingImages: project.images || [],
        });
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

                if (formData.thumbnail) {
                    data.append("thumbnail", formData.thumbnail);
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
                if (formData.thumbnail) {
                    data.append("thumbnail", formData.thumbnail);
                }

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
            thumbnail: null,
            images: [],
            existingImages: [],
        });
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

    const filteredProjects = projects.filter(
        (project) =>
            (project.title &&
                project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (project.description &&
                project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
                        Manage your portfolio projects
                    </p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all ${isDark
                        ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500"
                        : "bg-white border-gray-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                />
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
                        {searchTerm ? "No projects found" : "No projects yet"}
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

            {/* Add Project Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => setIsAdding(false)}
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
                            {editingId ? "Edit Project" : "Add New Project"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload - Only show if not editing, or allow replace (logic simplified for now) */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Project Thumbnail {editingId && "(Leave empty to keep current)"}
                                </label>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDark
                                        ? "border-slate-700 hover:border-indigo-500 bg-slate-800/50"
                                        : "border-gray-300 hover:border-indigo-500 bg-gray-50"
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
                                        {formData.thumbnail ? (
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                                <Image
                                                    src={URL.createObjectURL(formData.thumbnail)}
                                                    alt="Preview"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon
                                                    size={32}
                                                    className={
                                                        isDark ? "text-slate-500" : "text-slate-400"
                                                    }
                                                />
                                                <span
                                                    className={
                                                        isDark ? "text-slate-400" : "text-slate-600"
                                                    }
                                                >
                                                    {editingId ? "Click to change image" : "Click to upload image"}
                                                </span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Project Type
                                </label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${formData.category === 'custom'
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                        : isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="category"
                                            value="custom"
                                            checked={formData.category === 'custom'}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="hidden"
                                        />
                                        <span className="font-medium">Custom Code</span>
                                    </label>
                                    <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${formData.category === 'wix'
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                        : isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="category"
                                            value="wix"
                                            checked={formData.category === 'wix'}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="hidden"
                                        />
                                        <span className="font-medium">Wix/No-Code</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Project Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                        ? "bg-slate-800 border-slate-700 text-white"
                                        : "bg-white border-gray-200 text-slate-900"
                                        } focus:outline-none focus:border-indigo-500`}
                                    placeholder="e.g., E-commerce Dashboard"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.desc}
                                    onChange={(e) =>
                                        setFormData({ ...formData, desc: e.target.value })
                                    }
                                    rows={3}
                                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                        ? "bg-slate-800 border-slate-700 text-white"
                                        : "bg-white border-gray-200 text-slate-900"
                                        } focus:outline-none focus:border-indigo-500`}
                                    placeholder="Brief description of the project..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Tech Stack (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tech}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tech: e.target.value })
                                    }
                                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                        ? "bg-slate-800 border-slate-700 text-white"
                                        : "bg-white border-gray-200 text-slate-900"
                                        } focus:outline-none focus:border-indigo-500`}
                                    placeholder="e.g., React, Node.js, MongoDB"
                                    required
                                />
                            </div>

                            {/* Gallery Images */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Project Gallery (Additional Images)
                                </label>

                                <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-3">
                                    {/* Existing Images */}
                                    {formData.existingImages.map((img, idx) => (
                                        <div key={`exist-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                                            <Image src={img} alt="Existing" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New Image Previews */}
                                    {formData.images.map((file, idx) => (
                                        <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-indigo-500/50 bg-indigo-500/10">
                                            <Image src={URL.createObjectURL(file)} alt="New Preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(idx)}
                                                className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    <label
                                        htmlFor="gallery-upload"
                                        className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${isDark ? "border-slate-700 hover:border-indigo-500 bg-slate-800/50" : "border-gray-200 hover:border-indigo-500 bg-gray-50"
                                            }`}
                                    >
                                        <Plus size={20} className="text-slate-400" />
                                        <span className="text-[10px] text-slate-500 mt-1">Add More</span>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Live URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.live}
                                        onChange={(e) =>
                                            setFormData({ ...formData, live: e.target.value })
                                        }
                                        className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                            ? "bg-slate-800 border-slate-700 text-white"
                                            : "bg-white border-gray-200 text-slate-900"
                                            } focus:outline-none focus:border-indigo-500`}
                                        placeholder="https://..."
                                    />
                                </div>
                                {formData.category === 'custom' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.github}
                                            onChange={(e) =>
                                                setFormData({ ...formData, github: e.target.value })
                                            }
                                            className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${isDark
                                                ? "bg-slate-800 border-slate-700 text-white"
                                                : "bg-white border-gray-200 text-slate-900"
                                                } focus:outline-none focus:border-indigo-500`}
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAdding(false);
                                        resetForm();
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${isDark
                                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                        : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                                        }`}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            {editingId ? "Updating..." : "Adding..."}
                                        </>
                                    ) : (
                                        editingId ? "Update Project" : "Add Project"
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
