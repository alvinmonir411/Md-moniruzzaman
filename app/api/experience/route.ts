import { NextRequest } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Experience");

        const experiences = await collection
            .find({})
            .sort({ startDate: -1 })
            .toArray();

        const serializableExperiences = experiences.map((exp) => ({
            ...exp,
            _id: exp._id.toString(),
            startDate: exp.startDate.toISOString(),
            endDate: exp.endDate ? exp.endDate.toISOString() : null,
        }));

        return new Response(JSON.stringify(serializableExperiences), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch experiences:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch experiences" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Experience");

        const newExperience = {
            company: body.company,
            position: body.position,
            description: body.description,
            startDate: new Date(body.startDate),
            endDate: body.endDate ? new Date(body.endDate) : null,
            isCurrent: body.isCurrent || false,
            technologies: body.technologies || [],
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newExperience);

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
        console.error("Failed to create experience:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create experience" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Experience");

        const { _id, startDate, endDate, ...updateData } = body;

        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    ...updateData,
                    startDate: new Date(startDate),
                    endDate: endDate ? new Date(endDate) : null,
                },
            }
        );

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: "Experience not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to update experience:", error);
        return new Response(
            JSON.stringify({ error: "Failed to update experience" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return new Response(
                JSON.stringify({ error: "Experience ID required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Experience");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: "Experience not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to delete experience:", error);
        return new Response(
            JSON.stringify({ error: "Failed to delete experience" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
