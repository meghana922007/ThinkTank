import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
    try {
        const puzzles = await prisma.puzzle.findMany();
        return NextResponse.json(puzzles);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch puzzles" }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const puzzle = await prisma.puzzle.create({
            data: {
                question: body.question,
                answer: body.answer,
                hint: body.hint || "",
                difficulty: body.difficulty,
                points: Number(body.points),
                domainId: body.domainId,
                metadata: body.metadata, // This saves the JSON string of options
            },
        });
        return NextResponse.json(puzzle, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create puzzle" }, { status: 500 });
    }
}