"use server";
import clientPromise from "@/app/lib/mongodb";
export async function getAllTheProjects() {
  try {
    const client = await clientPromise;
    const db = client.db("juwelary");
    const projectsCollection = db.collection("ProtfolioData");

    const projects = await projectsCollection
      .find({})
      .sort({ _id: -1 })
      .toArray();

    const serializableProjects = projects.map((project) => ({
      ...project,

      _id: project._id.toString(),

      ...(project.createdAt && { createdAt: project.createdAt.toISOString() }),
    }));
    return serializableProjects;
  } catch (error) {
    console.error("❌ Failed to fetch projects from DB:", error);
    return [];
  }
}
