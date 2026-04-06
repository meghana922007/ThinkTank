// thinktank/app/api/puzzles/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const puzzles = await prisma.puzzle.findMany({
            include: { domain: true } // This grabs the category name too
        });
        return NextResponse.json(puzzles);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch puzzles" }, { status: 500 });
    }
}