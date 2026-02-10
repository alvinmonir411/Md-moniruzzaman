"use client";

import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Project } from "../types";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  return (
    <div
      className={`rounded-3xl overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 border group ${isDark
        ? "bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-900/10 hover:shadow-indigo-900/20 hover:-translate-y-1 "
        : "bg-white border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        }`}
    >
      {/* `/projects/${project?._id} */}
      <Link href={`/projects/${project._id}`}>
        {/* Image */}
        <div className="relative mb-4">
          <img
            src={project.img}
            alt={project.title}
            className="w-full h-56 object-cover rounded-2xl"
          />

          {/* Subtle Overlay */}
          <div
            className={`absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-10 ${isDark ? "bg-indigo-400" : "bg-indigo-600"
              }`}
          ></div>
        </div>

        {/* Content */}
        <div>
          <h3
            className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"
              }`}
          >
            {project.title}
          </h3>

          <p
            className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"
              }`}
          >
            {project.description?.length
              ? project.description.length > 110
                ? project.description.slice(0, 110) + "..."
                : project.description
              : "No description provided."}
          </p>
        </div>
      </Link>
      {/* 🔥 Tech Stack Chips (String Input Support) */}
      {project.tech && typeof project.tech === "string" && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project?.tech
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
            .map((tech, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-semibold rounded-full border ${isDark
                  ? "bg-slate-800 border-slate-700 text-indigo-300"
                  : "bg-indigo-50 border-indigo-200 text-indigo-700"
                  }`}
              >
                {tech}
              </span>
            ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-6 py-3 rounded-xl font-bold text-lg flex-1 text-center flex items-center justify-center gap-2 transition-all ${isDark
              ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.45)]"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_10px_rgba(79,70,229,0.35)] hover:shadow-[0_0_18px_rgba(79,70,229,0.55)]"
              }`}
          >
            <ExternalLink size={18} /> Live Demo
          </a>
        )}

        {project.category !== 'wix' && project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-6 py-3 rounded-xl font-bold text-lg border-2 flex-1 text-center flex items-center justify-center gap-2 transition-all ${isDark
              ? "border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-200"
              : "border-gray-200 hover:border-indigo-600 hover:text-indigo-600 bg-white text-slate-900"
              }`}
          >
            <Github size={18} /> GitHub
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
