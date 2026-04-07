// app/api/admin/domains/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const domains = await prisma.domain.findMany();
        return NextResponse.json(domains);
    } catch (error) {
        return NextResponse.json([], { status: 500 });
    }
}