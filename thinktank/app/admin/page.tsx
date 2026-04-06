"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Beaker, List, Grid3X3, Type, Lightbulb, PlusCircle } from 'lucide-react';

export default function AdminPanel() {
    // --- 1. STATE ---
    const [availableDomains, setAvailableDomains] = useState<{ id: string, name: string }[]>([]);
    const [domainName, setDomainName] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        question: '',
        answer: '',
        hint: '',
        difficulty: 'EASY',
        domainId: '',
        // Dynamic fields
        options: '',
        suspects: '',
        locations: '',
    });

    // --- 2. LOAD DATA ---
    const fetchDomains = async () => {
        const res = await fetch('/api/admin/domains');
        const data = await res.json();
        if (Array.isArray(data)) {
            setAvailableDomains(data);
            if (data.length > 0 && !formData.domainId) {
                setFormData(prev => ({ ...prev, domainId: data[0].id }));
            }
        }
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    // --- 3. DOMAIN HANDLER ---
    const handleCreateDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domainName) return;
        const res = await fetch('/api/admin/domains', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: domainName }),
        });
        if (res.ok) {
            alert("New Category Created!");
            setDomainName('');
            fetchDomains();
        }
    };

    // --- 4. PUZZLE SUBMIT HANDLER ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let metadataObj: any = {};

            // Logic for EASY (MCQ)
            if (formData.difficulty === 'EASY') {
                metadataObj = {
                    options: formData.options.split(',').map(opt => opt.trim()).filter(opt => opt !== "")
                };
            }
            // Logic for HARD (Murdle Grid)
            else if (formData.difficulty === 'HARD') {
                const sArr = formData.suspects.split(',').map(s => s.trim()).filter(s => s !== "");
                const lArr = formData.locations.split(',').map(l => l.trim()).filter(l => l !== "");

                // Auto-map solution: Suspect 0 = Location 0, Suspect 1 = Location 1, etc.
                const sol: Record<string, string> = {};
                sArr.forEach((suspect, sIdx) => {
                    lArr.forEach((loc, lIdx) => {
                        sol[`${suspect}-${loc}`] = sIdx === lIdx ? "CHECK" : "X";
                    });
                });

                metadataObj = { suspects: sArr, locations: lArr, solution: sol };
            }

            const finalPayload = {
                title: formData.title,
                question: formData.question,
                answer: formData.answer,
                hint: formData.hint,
                difficulty: formData.difficulty,
                points: formData.difficulty === 'EASY' ? 50 : formData.difficulty === 'MEDIUM' ? 150 : 300,
                domainId: formData.domainId,
                metadata: JSON.stringify(metadataObj)
            };

            const res = await fetch('/api/admin/puzzles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload),
            });

            if (res.ok) {
                alert("🚀 Puzzle Published Successfully!");
                setFormData({ ...formData, title: '', question: '', answer: '', hint: '', options: '', suspects: '', locations: '' });
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Failed to save"}`);
            }
        } catch (error) {
            alert("Check your comma-separated lists for formatting errors.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

            {/* PART A: DOMAIN CREATOR */}
            <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Layout className="text-blue-500" />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Step 1: Categories</h2>
                </div>
                <div className="flex gap-4">
                    <input
                        className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none focus:border-blue-500 transition-all"
                        placeholder="e.g. Logic, Math, Cryptography"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                    />
                    <button
                        onClick={handleCreateDomain}
                        className="bg-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-500 flex items-center gap-2"
                    >
                        <PlusCircle size={20} /> Add
                    </button>
                </div>
            </section>

            {/* PART B: PUZZLE FORGE */}
            <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <Beaker className="text-purple-500" />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Step 2: Forge a Puzzle</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Top Row: Title & Domain */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase">Puzzle Title</label>
                            <input className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mt-2 outline-none focus:border-purple-500"
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase">Category (Domain)</label>
                            <select className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mt-2 outline-none"
                                value={formData.domainId} onChange={e => setFormData({ ...formData, domainId: e.target.value })}>
                                {availableDomains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['EASY', 'MEDIUM', 'HARD'].map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setFormData({ ...formData, difficulty: level })}
                                className={`p-4 rounded-xl border-2 font-bold transition-all ${formData.difficulty === level
                                        ? 'border-purple-500 bg-purple-500/10 text-white'
                                        : 'border-slate-800 bg-slate-800/40 text-slate-500'
                                    }`}
                            >
                                {level} {level === 'EASY' ? '(MCQ)' : level === 'MEDIUM' ? '(FILL)' : '(GRID)'}
                            </button>
                        ))}
                    </div>

                    {/* Mystery/Question Area */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The Mystery Description</label>
                        <textarea className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mt-2 h-32 outline-none focus:border-purple-500"
                            value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} required />
                    </div>

                    {/* --- DYNAMIC MECHANIC INPUTS --- */}
                    {formData.difficulty === 'EASY' && (
                        <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl animate-in fade-in">
                            <label className="text-[10px] font-black uppercase text-green-500 flex items-center gap-2"><List size={14} /> Choices (Comma Separated)</label>
                            <input className="w-full bg-slate-800 p-4 rounded-xl mt-2 outline-none focus:border-green-500"
                                placeholder="Option A, Option B, Option C, Option D" value={formData.options}
                                onChange={e => setFormData({ ...formData, options: e.target.value })} />
                        </div>
                    )}

                    {formData.difficulty === 'HARD' && (
                        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-4 animate-in fade-in">
                            <label className="text-[10px] font-black uppercase text-red-500 flex items-center gap-2"><Grid3X3 size={14} /> Murdle Data (Comma Separated)</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input className="bg-slate-800 p-4 rounded-xl outline-none focus:border-red-500"
                                    placeholder="Suspects: Butler, Chef..." value={formData.suspects}
                                    onChange={e => setFormData({ ...formData, suspects: e.target.value })} />
                                <input className="bg-slate-800 p-4 rounded-xl outline-none focus:border-red-500"
                                    placeholder="Locations: Cellar, Attic..." value={formData.locations}
                                    onChange={e => setFormData({ ...formData, locations: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {/* Hint & Final Answer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                        <div>
                            <label className="text-[10px] font-black text-blue-400 uppercase flex items-center gap-2"><Lightbulb size={14} /> Unlockable Hint</label>
                            <input className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mt-2 outline-none italic"
                                value={formData.hint} onChange={e => setFormData({ ...formData, hint: e.target.value })} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-green-500 uppercase">Correct Answer String</label>
                            <input className="w-full bg-slate-950 border-2 border-slate-800 p-4 rounded-xl mt-2 outline-none focus:border-green-500 text-center font-black uppercase tracking-widest"
                                value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} required />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-5 rounded-2xl font-black text-xl shadow-xl shadow-purple-900/20 transition-all uppercase tracking-tighter">
                        Publish Challenge to ThinkTank
                    </button>
                </form>
            </section>
        </div>
    );
}