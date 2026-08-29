import { NextRequest } from "next/server";
import sql, { initDatabase } from "@/app/lib/db";

const DEFAULT_PROFILE = {
  name: "Moniruzzaman",
  email: "alvinmonir411@gmail.com",
  phone: "+8801979915165",
  whatsapp: "+8801979915165",
  github: "https://github.com/alvinmonir411",
  linkedin: "https://www.linkedin.com/in/moniruzzaman13663/",
  location: "Dhaka & Rangpur, Bangladesh (UTC+6)",
  bio: "Engineering high-performance, scalable web apps with Next.js, React, and TypeScript. Turning complex challenges into elegant, accessible, and hyper-responsive digital experiences.",
  title: "Front-End & MERN Full-Stack Developer",
};

export async function GET() {
  try {
    await initDatabase();

    const rows = await sql`
      SELECT * FROM profile_settings WHERE id = 1 LIMIT 1;
    `;

    if (rows.length === 0) {
      // Seed default row
      await sql`
        INSERT INTO profile_settings (id, name, email, phone, whatsapp, github, linkedin, location, bio, title)
        VALUES (
          1,
          ${DEFAULT_PROFILE.name},
          ${DEFAULT_PROFILE.email},
          ${DEFAULT_PROFILE.phone},
          ${DEFAULT_PROFILE.whatsapp},
          ${DEFAULT_PROFILE.github},
          ${DEFAULT_PROFILE.linkedin},
          ${DEFAULT_PROFILE.location},
          ${DEFAULT_PROFILE.bio},
          ${DEFAULT_PROFILE.title}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
      return new Response(JSON.stringify(DEFAULT_PROFILE), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch profile settings:", error);
    return new Response(JSON.stringify(DEFAULT_PROFILE), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initDatabase();
    const body = await request.json();

    const name = body.name ?? DEFAULT_PROFILE.name;
    const email = body.email ?? DEFAULT_PROFILE.email;
    const phone = body.phone ?? DEFAULT_PROFILE.phone;
    const whatsapp = body.whatsapp ?? DEFAULT_PROFILE.whatsapp;
    const github = body.github ?? DEFAULT_PROFILE.github;
    const linkedin = body.linkedin ?? DEFAULT_PROFILE.linkedin;
    const location = body.location ?? DEFAULT_PROFILE.location;
    const bio = body.bio ?? DEFAULT_PROFILE.bio;
    const title = body.title ?? DEFAULT_PROFILE.title;

    await sql`
      INSERT INTO profile_settings (id, name, email, phone, whatsapp, github, linkedin, location, bio, title, updated_at)
      VALUES (1, ${name}, ${email}, ${phone}, ${whatsapp}, ${github}, ${linkedin}, ${location}, ${bio}, ${title}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        whatsapp = EXCLUDED.whatsapp,
        github = EXCLUDED.github,
        linkedin = EXCLUDED.linkedin,
        location = EXCLUDED.location,
        bio = EXCLUDED.bio,
        title = EXCLUDED.title,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Profile settings updated successfully!",
        data: { name, email, phone, whatsapp, github, linkedin, location, bio, title },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to update profile settings:", error);
    return new Response(JSON.stringify({ error: "Failed to update profile settings" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  return PUT(request);
}
