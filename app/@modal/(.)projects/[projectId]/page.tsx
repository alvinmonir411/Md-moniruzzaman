"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectDetailView from "@/app/Components/ProjectDetailView";
import { Project } from "@/app/types";
import { Loader2 } from "lucide-react";

export default function ProjectModalPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${params.projectId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProject(data);
                } else {
                    router.back();
                }
            } catch (error) {
                console.error("Failed to fetch project:", error);
                router.back();
            } finally {
                setLoading(false);
            }
        };

        if (params.projectId) {
            fetchProject();
        }
    }, [params.projectId, router]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="absolute inset-0"
                onClick={() => router.back()}
            />
            <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="animate-spin text-white" size={48} />
                    </div>
                ) : project ? (
                    <ProjectDetailView project={project} isModal={true} />
                ) : null}
            </div>
        </div>
    );
}
