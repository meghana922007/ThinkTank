import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Verify this points to your Prisma client

export async function GET(
    request: Request,
    { params }: { params: { puzzleId: string } }
) {
    try {
        const id = params.puzzleId;

        const puzzle = await prisma.puzzle.findUnique({
            where: { id: id },
            // Include the domain if you want to show category names
            include: { domain: true }
        });

        if (!puzzle) {
            console.log(`❌ Puzzle with ID ${id} not found in DB`);
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(puzzle);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}