import { NextRequest } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("ProtfolioData");

        const project = await collection.findOne({ _id: new ObjectId(params.id) });

        if (!project) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(
            JSON.stringify({
                ...project,
                _id: project._id.toString(),
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch project" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("ProtfolioData");

        const { _id, ...updateData } = body;

        const result = await collection.updateOne(
            { _id: new ObjectId(params.id) },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to update project:", error);
        return new Response(JSON.stringify({ error: "Failed to update project" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("ProtfolioData");

        const result = await collection.deleteOne({
            _id: new ObjectId(params.id),
        });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to delete project:", error);
        return new Response(JSON.stringify({ error: "Failed to delete project" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
