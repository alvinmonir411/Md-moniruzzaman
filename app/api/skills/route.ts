import { NextRequest } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Skills");

        const skills = await collection.find({}).sort({ order: 1 }).toArray();

        const serializableSkills = skills.map((skill) => ({
            ...skill,
            _id: skill._id.toString(),
        }));

        return new Response(JSON.stringify(serializableSkills), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch skills:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch skills" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Skills");

        const newSkill = {
            name: body.name,
            category: body.category,
            proficiency: body.proficiency,
            icon: body.icon || "",
            order: body.order || 0,
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newSkill);

        return new Response(
            JSON.stringify({
                success: true,
                _id: result.insertedId.toString(),
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Failed to create skill:", error);
        return new Response(JSON.stringify({ error: "Failed to create skill" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Skills");

        const { _id, ...updateData } = body;

        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: "Skill not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to update skill:", error);
        return new Response(JSON.stringify({ error: "Failed to update skill" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return new Response(JSON.stringify({ error: "Skill ID required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Skills");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: "Skill not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to delete skill:", error);
        return new Response(JSON.stringify({ error: "Failed to delete skill" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
