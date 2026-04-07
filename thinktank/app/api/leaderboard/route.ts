import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const topPlayers = await prisma.user.findMany({
            orderBy: {
                points: 'desc' // Highest score first
            },
            take: 10, // Only show top 10
            select: {
                id: true,
                name: true,
                points: true,
              //  rank: true,
            }
        });

        return NextResponse.json(topPlayers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}