"use client";
import { useState, useEffect } from "react";
// ❌ REMOVED: import { NextResponse } from "next/server"; (Not for client files)
// ❌ REMOVED: import { prisma } from "@/lib/prisma"; (Not for client files)

export default function PuzzleAdmin() {
    const [domains, setDomains] = useState([]);
    const [status, setStatus] = useState("");
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        hint: "",
        difficulty: "EASY",
        domainId: "",
        points: 100,
        options: "",
    });

    useEffect(() => {
        // This hits the API route we talked about earlier
        fetch("/api/admin/domains")
            .then((res) => res.json())
            .then(setDomains)
            .catch(err => console.error("Could not load domains", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("UPLOADING...");

        // Process MCQ options if Easy mode
        const metadata = formData.difficulty === "EASY"
            ? JSON.stringify({ options: formData.options.split(",").map(o => o.trim()) })
            : null;

        const res = await fetch("/api/puzzles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, metadata }),
        });

        if (res.ok) {
            setStatus("SUCCESS: INTEL ARCHIVED");
            // Clear inputs for the next puzzle
            setFormData({ ...formData, question: "", answer: "", hint: "", options: "" });
        } else {
            setStatus("ERROR: UPLOAD FAILED");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-10 font-mono">
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <h1 className="text-2xl font-black mb-6 uppercase tracking-tighter text-blue-500">Puzzle Creator</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            required
                            className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500"
                            value={formData.domainId}
                            onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                        >
                            <option value="">Target Domain...</option>
                            {domains.map((d: any) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>

                        <select
                            className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500"
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        >
                            <option value="EASY">EASY (MCQ)</option>
                            <option value="MEDIUM">MEDIUM (INPUT)</option>
                            <option value="HARD">HARD (GRID)</option>
                        </select>
                    </div>

                    <textarea
                        placeholder="Question Content" required
                        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl h-24 outline-none focus:border-blue-500 text-white"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    />

                    {/* ✅ ADDED: Hint Input field */}
                    <input
                        placeholder="Analysis Hint (What the user sees when they pay XP)"
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-yellow-600 text-yellow-100/80"
                        value={formData.hint}
                        onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Correct Answer" required
                            className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500"
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        />
                        <input
                            type="number" placeholder="XP"
                            className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500"
                            value={formData.points}
                            onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                        />
                    </div>

                    {formData.difficulty === "EASY" && (
                        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-2">
                            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Options (Comma Separated)</label>
                            <input
                                placeholder="Choice 1, Choice 2, Choice 3..."
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500"
                                value={formData.options}
                                onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                            />
                        </div>
                    )}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-black p-4 rounded-xl transition-all shadow-lg uppercase tracking-widest mt-4">
                        DEPLOY TO DATABASE
                    </button>

                    <p className="text-center text-[10px] font-mono text-slate-500 tracking-widest">{status}</p>
                </form>
            </div>
        </div>
    );
}