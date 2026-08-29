"use client";

import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Project } from "../types";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 border relative group overflow-hidden ${
        isDark
          ? "bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 shadow-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
          : "bg-white border-slate-200 hover:border-indigo-300 shadow-xl hover:shadow-2xl"
      } hover:-translate-y-1.5`}
    >
      {/* Spotlight Radial Glow following cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
          }}
        />
      )}

      <div>
        {/* Project Thumbnail with Zoom & Badges */}
        <Link
          href={`/projects/${project._id}`}
          scroll={false}
          className="block relative mb-5 rounded-2xl overflow-hidden group/img cursor-pointer"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
            <img
              src={project.img}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />
            
            {/* Category tag */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-900/85 backdrop-blur-md text-indigo-300 border border-indigo-500/30 shadow-md">
                {project.category === "wix" ? "Wix / No-Code" : "Custom Web App"}
              </span>
            </div>

            {/* Pinned / Featured tag */}
            {(project.is_featured || project.isFeatured) && (
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-md flex items-center gap-1">
                  <span>📌</span> Featured
                </span>
              </div>
            )}

            {/* Quick View Icon */}
            <div className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-indigo-600/90 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 translate-y-2 group-hover/img:translate-y-0 shadow-lg">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </Link>

        {/* Title and description */}
        <div className="space-y-2">
          <Link
            href={`/projects/${project._id}`}
            scroll={false}
            className="block group-hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {project.title}
            </h3>
          </Link>

          <p className={`text-sm leading-relaxed line-clamp-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {project.description || "High-performance responsive application built with modern architecture."}
          </p>
        </div>

        {/* Tech Stack Tags */}
        {project.tech && typeof project.tech === "string" && (
          <div className="flex flex-wrap gap-1.5 my-4">
            {project.tech
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
              .map((tech, index) => (
                <span
                  key={index}
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg border ${
                    isDark
                      ? "bg-slate-800/80 border-slate-700 text-indigo-300"
                      : "bg-indigo-50/80 border-indigo-100 text-indigo-700"
                  }`}
                >
                  {tech}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50 mt-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
          >
            <ExternalLink size={15} />
            <span>Live Demo</span>
          </a>
        )}

        {project.category !== "wix" && project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 transition-all ${
              isDark
                ? "border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-200"
                : "border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 shadow-sm"
            }`}
          >
            <Github size={15} />
            <span>Code</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
