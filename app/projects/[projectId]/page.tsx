"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectDetailView from "@/app/Components/ProjectDetailView";
import { Project } from "@/app/types";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";

const ProjectPage = () => {
  const params = useParams();
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.projectId) {
      fetchProject();
    }
  }, [params.projectId]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
        <p className="text-2xl font-bold">Project Not Found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <ProjectDetailView project={project} isModal={false} />
    </div>
  );
};

export default ProjectPage;
