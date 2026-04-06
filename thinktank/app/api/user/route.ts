// thinktank/app/api/user/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        // Look for the user in MySQL
        let user = await prisma.user.findUnique({
            where: { id: id },
        });

        // If user doesn't exist yet, create a default one so the game doesn't crash
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: id,
                    username: "Player_One",
                    profileScore: 0,
                    lives: 5,
                    rank: "Rookie",
                },
            });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}