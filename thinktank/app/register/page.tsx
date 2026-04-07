"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        // 1. CLIENT SIDE DOMAIN CHECK
        const emailCheck = formData.email.toLowerCase().trim();
        if (!emailCheck.endsWith("@nitw.ac.in") && !emailCheck.endsWith("@student.nitw.ac.in")) {
            setError("ENTRY DENIED: Use your official NITW institutional email.");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("NETWORK ERROR: ThinkTank uplink failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Initialize Identity</h1>
                <p className="text-slate-500 text-sm mb-6 font-mono uppercase">NITW AGENT REGISTRATION</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl mb-6 text-[10px] font-mono flex items-center gap-2">
                        <span className="animate-pulse">⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* --- NAME INPUT --- */}
                    <div>
                        <input
                            type="text"
                            placeholder="AGENT NAME"
                            required
                            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm transition-all"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* --- EMAIL INPUT --- */}
                    <div>
                        <input
                            type="email"
                            placeholder="INSTITUTIONAL EMAIL"
                            required
                            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm transition-all"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <p className="text-[9px] text-slate-600 mt-2 ml-1 font-mono uppercase tracking-widest">
                            Required: @nitw.ac.in or @student.nitw.ac.in
                        </p>
                    </div>

                    {/* --- PASSWORD INPUT --- */}
                    <div>
                        <input
                            type="password"
                            placeholder="SECURITY PASSWORD"
                            required
                            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm transition-all"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold p-4 rounded-xl transition-all uppercase tracking-widest text-sm flex justify-center items-center shadow-lg active:scale-95"
                    >
                        {isSubmitting ? "ENCRYPTING..." : "Establish Connection"}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-500 text-xs font-mono uppercase tracking-tighter">
                    ALREADY REGISTERED? <Link href="/login" className="text-blue-400 hover:underline ml-1">LOGIN HERE</Link>
                </p>
            </div>
        </div>
    );
}