import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Extract the raw values first
        const { name, password } = body;
        // 2. Clean the email separately so it doesn't get overwritten
        const email = body.email ? body.email.toLowerCase().trim() : "";

        // 1. Basic Field Validation
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. DOMAIN VERIFICATION (NITW Security)
        const isStudent = email.endsWith("@student.nitw.ac.in");
        const isFaculty = email.endsWith("@nitw.ac.in") && !isStudent;

        if (!isStudent && !isFaculty) {
            return NextResponse.json(
                { error: "Access Denied: Please use your official @nitw.ac.in or @student.nitw.ac.in email." },
                { status: 403 }
            );
        }

        const userRole = isFaculty ? "FACULTY" : "STUDENT";

        // 3. Duplicate Check
        const existingUser = await prisma.user.findUnique({
            where: { email } // This now uses the clean, lowercase email
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // 4. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create User
        await prisma.user.create({
            data: {
                name,
                email, // Saves the clean version
                password: hashedPassword,
                points: 0,
                lives: 5,
            }
        });

        return NextResponse.json({ message: `Welcome, ${userRole}! Registration successful.` }, { status: 201 });

    } catch (error: any) {
        console.error("REGISTRATION_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}