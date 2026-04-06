// thinktank/app/api/admin/puzzles/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, question, answer, hint, difficulty, points, domainId } = body;

        const newPuzzle = await prisma.puzzle.create({
            data: {
                title,
                question,
                answer,
                hint,
                difficulty,
                points: parseInt(points),
                domainId,
            },
        });

        return NextResponse.json(newPuzzle);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create puzzle" }, { status: 500 });
    }
}