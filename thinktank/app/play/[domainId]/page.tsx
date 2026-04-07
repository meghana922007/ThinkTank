"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Trophy, Clock, ChevronRight, Star, Loader2 } from 'lucide-react';

export default function PuzzleList() {
    const params = useParams();
    const domainId = params.domainId;

    // 1. Change state to hold REAL puzzles from DB
    const [puzzles, setPuzzles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Update the fetch inside your useEffect
        const fetchPuzzles = async () => {
            try {
                const res = await fetch('/api/puzzles');

                // If the API doesn't exist yet, this will catch the error
                if (!res.ok) {
                    throw new Error(`Server responded with ${res.status}`);
                }

                const data = await res.json();

                // Ensure domainId is compared correctly
                const filtered = data.filter((p: any) => p.domainId === domainId);
                setPuzzles(filtered);
            } catch (err) {
                console.error("Failed to load puzzles:", err);
                setPuzzles([]); // Clear puzzles on error
            } finally {
                setLoading(false);
            }
        };

        if (domainId) fetchPuzzles();
    }, [domainId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p className="font-mono uppercase tracking-widest text-sm">Syncing with Database...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-400">
                    Arena: {domainId?.toString().replace('-', ' ')}
                </h2>
            </div>

            {puzzles.length === 0 ? (
                <div className="bg-slate-900 border border-dashed border-slate-800 p-20 rounded-3xl text-center">
                    <p className="text-slate-500 font-medium">No puzzles found for this domain yet.</p>
                    <Link href="/admin" className="text-blue-500 hover:underline mt-2 inline-block">Add one in Admin Panel →</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {puzzles.map((puzzle: any) => (
                        <Link
                            key={puzzle.id}
                            href={`/play/${domainId}/${puzzle.id}`}
                            className="block group"
                        >
                            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between group-hover:border-blue-500/50 group-hover:bg-slate-800/50 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 
                    ${puzzle.difficulty === 'EASY' ? 'border-green-500/20 text-green-500' :
                                            puzzle.difficulty === 'MEDIUM' ? 'border-yellow-500/20 text-yellow-500' :
                                                'border-red-500/20 text-red-500'}`}>
                                        <Star size={24} fill="currentColor" opacity={0.2} />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{puzzle.title}</h3>
                                        <div className="flex gap-4 mt-1 text-sm text-slate-500 font-mono">
                                            <span className="flex items-center gap-1"><Trophy size={14} /> {puzzle.points} pts</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-black px-3 py-1 rounded-full border
                    ${puzzle.difficulty === 'EASY' ? 'border-green-900 text-green-500 bg-green-950/30' :
                                            puzzle.difficulty === 'MEDIUM' ? 'border-yellow-900 text-yellow-500 bg-yellow-950/30' :
                                                'border-red-900 text-red-500 bg-red-950/30'}`}>
                                        {puzzle.difficulty}
                                    </span>
                                    <ChevronRight className="text-slate-700 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}