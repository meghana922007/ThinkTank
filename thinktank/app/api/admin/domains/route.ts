// thinktank/app/api/admin/domains/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, description } = await request.json();

        // Create a URL-friendly ID (e.g., "Math Logic" becomes "math-logic")
        const id = name.toLowerCase().replace(/\s+/g, '-');

        const newDomain = await prisma.domain.create({
            data: { id, name, description },
        });

        return NextResponse.json(newDomain);
    } catch (error) {
        return NextResponse.json({ error: "Domain already exists or DB error" }, { status: 500 });
    }
}

export async function GET() {
    const domains = await prisma.domain.findMany();
    return NextResponse.json(domains);
}