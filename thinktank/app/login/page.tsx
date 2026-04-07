"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            callbackUrl: "/play",
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials");
        } else {
            router.push("/play");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Agent Login</h1>
                <p className="text-slate-500 text-sm mb-8 font-mono">SECURE ACCESS REQUIRED</p>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl mb-6 text-xs">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email" placeholder="EMAIL ADDRESS"
                        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="PASSWORD"
                        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold p-4 rounded-xl transition-all uppercase tracking-widest">
                        Enter ThinkTank
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-500 text-xs font-mono">
                    NEED AN IDENTITY? <Link href="/register" className="text-blue-400 hover:underline">REGISTER NOW</Link>
                </p>
            </div>
        </div>
    );
}