// thinktank/app/api/user/update/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, score, lives, rank } = body;

        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {
                profileScore: score,
                lives: lives,
                rank: rank,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
    }
}