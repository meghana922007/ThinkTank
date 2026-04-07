import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Try to get real data
        const domains = await prisma.domain.findMany();

        // 2. Return the data as JSON
        return NextResponse.json(domains);
    } catch (error) {
        console.error("API ERROR:", error);

        // 3. If the Database fails, return an empty list so the Admin page doesn't crash
        return NextResponse.json([
            { id: "temp-1", name: "Check Database Connection" }
        ]);
    }
}