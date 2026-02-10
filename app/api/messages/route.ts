import { NextRequest } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Messages");

        const messages = await collection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        const serializableMessages = messages.map((msg) => ({
            ...msg,
            _id: msg._id.toString(),
            createdAt: msg.createdAt.toISOString(),
        }));

        return new Response(JSON.stringify(serializableMessages), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch messages" }),
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
        const collection = db.collection("Messages");

        const newMessage = {
            name: body.name,
            email: body.email,
            subject: body.subject,
            message: body.message,
            isRead: false,
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newMessage);

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
        console.error("Failed to create message:", error);
        return new Response(JSON.stringify({ error: "Failed to create message" }), {
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
        const collection = db.collection("Messages");

        const { _id, ...updateData } = body;

        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: "Message not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to update message:", error);
        return new Response(JSON.stringify({ error: "Failed to update message" }), {
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
            return new Response(JSON.stringify({ error: "Message ID required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("Messages");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: "Message not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to delete message:", error);
        return new Response(JSON.stringify({ error: "Failed to delete message" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
