import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    // Note: params is treated as a Promise in Next.js 15
    { params }: { params: Promise<{ puzzleId: string }> }
) {
    try {
        // 1. UNWRAP the params first
        const { puzzleId } = await params;

        // 2. Now use the unwrapped puzzleId
        const puzzle = await prisma.puzzle.findUnique({
            where: {
                id: puzzleId
            },
        });

        if (!puzzle) {
            return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
        }

        return NextResponse.json(puzzle);
    } catch (error) {
        console.error("DEBUG: Single Puzzle Fetch Error:", error);
        return NextResponse.json({ error: "Database failure" }, { status: 500 });
    }
}