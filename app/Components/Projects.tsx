"use client";

import { useSelector } from "react-redux";
import { Project } from "../types";
import { RootState } from "../lib/store";
import ProjectCard from "./ProjectCard";
import { Github } from "lucide-react";

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const customProjects = projects.filter(p => !p.category || p.category === 'custom');
  const wixProjects = projects.filter(p => p.category === 'wix');

  return (
    <section
      id="projects"
      className="container mx-auto py-16 px-4 sm:px-6 lg:px-20 mx-auto"
    >
      <h2 className="text-3xl font-bold mb-10 dark:text-white">My Projects</h2>

      {/* Custom Projects */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 dark:text-slate-200">
          <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
          Custom Development
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {customProjects.map((project) => (
            <ProjectCard key={project._id || project.title} project={project} />
          ))}
        </div>
        {customProjects.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 italic">No custom projects yet.</p>
        )}
      </div>

      {/* Wix Projects */}
      {wixProjects.length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 dark:text-slate-200">
            <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
            Wix & No-Code Solutions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wixProjects.map((project) => (
              <ProjectCard key={project._id || project.title} project={project} />
            ))}
          </div>
        </div>
      )}
      {/* Footer CTA */}
      <div className="mt-20 flex justify-center">
        <a
          href="https://github.com/alvinmonir411/"
          target="_blank"
          rel="noopener noreferrer"
          className={`
      group inline-flex items-center gap-3 px-8 py-3 
      text-lg font-semibold rounded-2xl border-2 
      transition-all duration-300 
      hover:scale-[1.04] active:scale-[0.98]
      text-blue-700 border-blue-600 
      hover:bg-blue-100/60 
      shadow-md shadow-blue-200/70
      dark:text-white dark:border-blue-500 
      dark:hover:bg-blue-900/40 
      dark:shadow-blue-900/40
    `}
        >
          <span className="tracking-wide">See All Projects on GitHub</span>
          <Github
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>
    </section>
  );
};

export default ProjectsSection;
