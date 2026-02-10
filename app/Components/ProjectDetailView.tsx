"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Project } from "../types";
import {
    ExternalLink,
    Github,
    X,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Code2,
    Layout,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

interface ProjectDetailViewProps {
    project: Project;
    isModal?: boolean;
}

const ProjectDetailView = ({ project, isModal = false }: ProjectDetailViewProps) => {
    const router = useRouter();
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // Combine main image and gallery images
    const allImages = [project.img, ...(project.images || [])].filter(Boolean) as string[];

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const handleClose = () => {
        if (isModal) {
            router.back();
        } else {
            router.push("/#projects");
        }
    };

    return (
        <div className={`w-full max-w-6xl mx-auto overflow-hidden ${isModal
            ? `${isDark ? "bg-slate-900" : "bg-white"} rounded-3xl shadow-2xl`
            : "pt-24 pb-20 px-4"
            }`}>
            {!isModal && (
                <button
                    onClick={handleClose}
                    className="mb-8 flex items-center gap-2 text-indigo-500 hover:text-indigo-600 font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Portfolio
                </button>
            )}

            <div className={`flex flex-col lg:flex-row gap-8 ${isModal ? "p-4 md:p-8" : ""}`}>
                {/* Left: Gallery Section */}
                <div className="lg:w-3/5 space-y-4">
                    <div className="relative aspect-video bg-black/5 rounded-2xl overflow-hidden group">
                        {allImages.length > 0 ? (
                            <Image
                                src={allImages[currentImgIndex]}
                                alt={project.title}
                                fill
                                className="object-contain"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                No Images Available
                            </div>
                        )}

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImgIndex(idx)}
                                    className={`relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all ${currentImgIndex === idx ? "border-indigo-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${project.title} thumb ${idx}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Info Section */}
                <div className="lg:w-2/5 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${isDark ? "bg-indigo-950/30 border-indigo-800 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-600"
                                }`}>
                                {project.category === 'wix' ? 'Wix / No-Code' : 'Custom Development'}
                            </span>
                            {project.createdAt && (
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <Calendar size={14} />
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <h1 className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                            {project.title}
                        </h1>
                        <p className={`text-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            {project.description || "A comprehensive project showcasing advanced development techniques and modern UI design."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className={`font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                            <Code2 size={20} className="text-indigo-500" />
                            Technologies Used
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(project.tech) ? (
                                project.tech.map((tech, idx) => (
                                    <span key={idx} className={`px-3 py-1.5 rounded-xl text-sm font-medium ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                                        }`}>
                                        {tech}
                                    </span>
                                ))
                            ) : project.tech ? (
                                project.tech.split(',').map((tech, idx) => (
                                    <span key={idx} className={`px-3 py-1.5 rounded-xl text-sm font-medium ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                                        }`}>
                                        {tech.trim()}
                                    </span>
                                ))
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                                <ExternalLink size={20} />
                                Live Demo
                            </a>
                        )}
                        {project.category !== 'wix' && project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold border-2 transition-all active:scale-95 ${isDark
                                    ? "border-slate-700 text-white hover:bg-slate-800"
                                    : "border-slate-200 text-slate-800 hover:border-indigo-500 hover:text-indigo-600"
                                    }`}
                            >
                                <Github size={20} />
                                GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {isModal && (
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-all active:scale-90"
                >
                    <X size={24} />
                </button>
            )}
        </div>
    );
};

export default ProjectDetailView;
