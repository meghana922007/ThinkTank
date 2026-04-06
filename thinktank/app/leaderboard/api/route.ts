import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const topUsers = await prisma.user.findMany({
            take: 10,
            orderBy: { profileScore: 'desc' },
            select: { username: true, profileScore: true, rank: true },
        });
        return NextResponse.json(topUsers);
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}