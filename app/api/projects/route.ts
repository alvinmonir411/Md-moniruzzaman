import { getAllTheProjects } from "@/app/Actions/Skill/GetSkills";

export async function GET() {
  const projects = await getAllTheProjects();
  return new Response(JSON.stringify(projects), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
