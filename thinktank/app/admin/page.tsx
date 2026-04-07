"use client";
import { useState } from "react";

export default function AdminPage() {
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        question: "",
        answer: "",
        hint: "",
        points: 50,
        difficulty: "EASY",
        domainId: "logic", // Make sure this matches a real Domain ID in your DB
    });

    // Example Metadata for a HARD (Murdle) puzzle
    const [metadata, setMetadata] = useState({
        suspects: ["Chef", "Pilot"],
        locations: ["Kitchen", "Cockpit"],
        solution: { "Chef-Kitchen": "CHECK", "Pilot-Cockpit": "CHECK" }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/admin/puzzles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                metadata: JSON.stringify(metadata), // Convert object to string for DB
            }),
        });

        if (res.ok) alert("Puzzle Created! Now check /api/puzzles/" + formData.id);
        else alert("Error creating puzzle");
    };

    return (
        <div className="p-10 max-w-xl mx-auto bg-slate-900 text-white rounded-xl">
            <h1 className="text-2xl font-bold mb-6">Create New Case File</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs text-slate-400">PUZZLE ID (Slug)</label>
                    <input
                        className="w-full p-2 bg-slate-800 rounded border border-slate-700"
                        placeholder="e.g., logic-1"
                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs text-slate-400">QUESTION</label>
                    <textarea
                        className="w-full p-2 bg-slate-800 rounded border border-slate-700"
                        onChange={e => setFormData({ ...formData, question: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-slate-400">DIFFICULTY</label>
                        <select
                            className="w-full p-2 bg-slate-800 rounded"
                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                        >
                            <option value="EASY">EASY (MCQ)</option>
                            <option value="MEDIUM">MEDIUM (Input)</option>
                            <option value="HARD">HARD (Grid)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400">POINTS</label>
                        <input type="number" className="w-full p-2 bg-slate-800 rounded" onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })} />
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-500">
                    DEPLOY PUZZLE
                </button>
            </form>
        </div>
    );
}