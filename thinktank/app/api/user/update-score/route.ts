import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { userId, pointsToAdd } = await req.json();

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            points: { // ✅ Must be 'points'
                increment: pointsToAdd
            }
        },
    });

    return NextResponse.json(updatedUser);
}