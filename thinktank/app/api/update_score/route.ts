import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { userId, pointsEarned } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                profileScore: { increment: pointsEarned },
                gamesCompleted: { increment: 1 },
            },
        });

        let newRank = "Rookie";
        if (updatedUser.profileScore >= 5000) newRank = "Mastermind";
        else if (updatedUser.profileScore >= 1000) newRank = "Thinker";

        if (newRank !== updatedUser.rank) {
            await prisma.user.update({
                where: { id: userId },
                data: { rank: newRank },
            });
        }

        return NextResponse.json({ success: true, score: updatedUser.profileScore, rank: newRank });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update score" }, { status: 500 });
    }
}