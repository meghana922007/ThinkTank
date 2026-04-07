"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { use } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { Lightbulb, CheckCircle2, XCircle, Send, ShieldAlert, Loader2 } from 'lucide-react';

export default function UnifiedPuzzlePlayer() {
    const params = useParams();
    const puzzleId = params?.puzzleId as string;
    const { score,addPoints, loseLife, useHint, lives,rank } = useProfile();

    const [puzzle, setPuzzle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const [showHint, setShowHint] = useState(false);
    const [gridState, setGridState] = useState<Record<string, string>>({});
    const [solvedCount, setSolvedCount] = useState(0);

    const handleHintClick = () => {
        const hintCost = 25; // Define the "Price" of the hint

        // useHint returns true if user has enough points, false if not
        const success = useHint(hintCost);

        if (success) {
            setShowHint(true);
        }
    };
    useEffect(() => {
        const fetchPuzzle = async () => {
            // 1. Double check that we actually have an ID before fetching
            if (!params?.puzzleId) return;

            setLoading(true);
            try {
                // 2. Fetch from the plural 'puzzles' endpoint
                const res = await fetch(`/api/puzzles/${params.puzzleId}`);

                // 3. If the server sends an error (404/500), don't try to parse it as JSON
                if (!res.ok) {
                    const text = await res.text();
                    console.error("Server responded with error HTML. Check your API folder structure.");
                    setPuzzle(null);
                    return;
                }

                const data = await res.json();

                // 4. Safely parse metadata if it exists as a string
                if (data && data.metadata) {
                    try {
                        const parsed = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : data.metadata;
                        // If it's an array, put it in options. If it's an object, spread it.
                        data.parsedMetadata = Array.isArray(parsed) ? { options: parsed } : parsed;
                    } catch (e) {
                        data.parsedMetadata = { options: [] };
                    }
                }

                setPuzzle(data);
            } catch (err) {
                console.error("Network or Parsing error:", err);
                setPuzzle(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPuzzle();
    }, [params?.puzzleId]); // Re-run whenever the ID in the URL changes

    const handleStandardSubmit = async (input: string) => {
        if (status === 'correct') return;

        if (input.toLowerCase().trim() === puzzle.answer.toLowerCase().trim()) {
            setStatus('correct');
            const pointsAwarded = Number(puzzle.points) || 100;
            // 1. Update the UI immediately (Local Level)
            // This comes from your Context (see Step 2)
            addPoints(pointsAwarded);

            // 2. Sync with Database (Persistent Level)
            try {
                await fetch("/api/user/update-score", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // Make sure the key matches what your API expects (points or profileScore)
                    body: JSON.stringify({
                        pointsToAdd: pointsAwarded
                    }),
                });
            } catch (err) {
                console.error("Failed to sync score to DB:", err);
            }
        } else {
            setStatus('wrong');
            loseLife(); // Trigger your life-loss logic
            // ADD THIS: Reset status after 2 seconds so they can try again
            setTimeout(() => 
                 setStatus('idle'), 1000);
        }
    };

    const handleGridClick = (suspect: string, loc: string) => {
        const cellId = `${suspect}-${loc}`;
        if (gridState[cellId] || status === 'correct') return;

        if (puzzle.solution[cellId] === "CHECK") {
            setGridState(prev => ({ ...prev, [cellId]: "✔️" }));
            const newCount = solvedCount + 1;
            setSolvedCount(newCount);
            const total = Object.values(puzzle.solution).filter(v => v === "CHECK").length;
            if (newCount === total) {
                setStatus('correct');
                addPoints(puzzle.points);
            }
        } else {
            setGridState(prev => ({ ...prev, [cellId]: "X" }));
            loseLife();
            setStatus('wrong');
            setTimeout(() => setStatus('idle'), 1000);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 font-mono">
            <Loader2 className="animate-spin mb-4" />
            <p>SYNCING WITH THINKTANK...</p>
        </div>
    );

    if (!puzzle) return <div className="p-20 text-center font-mono">CRITICAL ERROR: Case File Not Found. Check URL or API.</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            {/* 1. Added Go Back / Abort Button */}
            <div className="mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="text-slate-500 hover:text-white text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                    ← Terminate Session
                </button>
            </div>
            {/* --- PROFILE DASHBOARD --- */}
            <div className="mb-6 flex items-center justify-between bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Operative Rank</span>
                    <span className="text-sm font-bold text-blue-400 italic uppercase">{rank}</span>
                </div>

                <div className="flex gap-6 items-center">
                    {/* Lives Counter */}
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 uppercase font-black mb-1">Health</span>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-4 rounded-sm ${i < lives ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-800'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Live Score */}
                    <div className="text-right border-l border-slate-800 pl-6">
                        <span className="text-[10px] text-slate-500 uppercase font-black">Total Intel XP</span>
                        <div className="text-xl font-black text-white tabular-nums">
                            {(score ?? 0).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
            <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl transition-all ${status === 'wrong' ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}>

                {/* --- RANK PROGRESS DISPLAY --- */}
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
                            Current Clearance: <span className="text-blue-400">{rank}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                            {score} / {score < 500 ? '500' : score < 1000 ? '1000' : 'MAX'} XP
                        </span>
                    </div>

                    {/* Progress Bar to next Rank */}
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{
                                width: `${Math.min((score / (score < 500 ? 500 : 1000)) * 100, 100)}%`
                            }}
                        />
                    </div>
                </div>
                {/* Header */}
                <div className="flex justify-between items-center mb-8 uppercase text-[10px] font-black tracking-widest text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${puzzle.difficulty === 'HARD' ? 'bg-red-600' : 'bg-green-500'}`} />
                        {puzzle.difficulty} PROTOCOL
                    </div>
                    <div className="text-blue-400">{puzzle.points} XP</div>
                </div>

                <h2 className="text-2xl font-bold mb-8 leading-tight text-white">{puzzle.question}</h2>

                {/* --- EASY MODE: MULTIPLE CHOICE --- */}
                {puzzle.difficulty === "EASY" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {(() => {
                            try {
                                // Parse the metadata. If it's empty, use an empty array.
                                const options = JSON.parse(puzzle.metadata || "[]");

                                // If options is an object with an .options property, use that. 
                                // Otherwise, use the array itself.
                                const finalOptions = Array.isArray(options) ? options : (options.options || []);

                                return finalOptions.map((option: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => handleStandardSubmit(option)}
                                        disabled={status === 'correct'}
                                        className={`p-4 rounded-2xl border-2 font-bold transition-all text-left flex items-center justify-between group ${status === 'correct' && option.toLowerCase() === puzzle.answer.toLowerCase()
                                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                                : 'bg-slate-900 border-slate-800 hover:border-blue-500 hover:bg-slate-800 text-slate-300'
                                            }`}
                                    >
                                        <span>{option}</span>
                                        <div className="w-6 h-6 rounded-full border border-slate-700 group-hover:border-blue-500 flex items-center justify-center text-[10px]">
                                            {index + 1}
                                        </div>
                                    </button>
                                ));
                            } catch (e) {
                                return <p className="text-red-500 text-xs">Metadata Error: Check JSON format</p>;
                            }
                        })()}
                    </div>
                )}

                {/* Medium Mode (Input) - FIXED TEXT COLOR AND SUBMIT */}
                {/* Medium Mode (Manual Input) */}
                {puzzle.difficulty === 'MEDIUM' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-yellow-500 font-bold text-white placeholder:text-slate-700 transition-all"
                                placeholder="Enter your solution..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)} // Updates the "Memory" as they type
                                onKeyDown={(e) => e.key === 'Enter' && handleStandardSubmit(userInput)} // Allows pressing Enter to submit
                            />
                            <button
                                onClick={() => handleStandardSubmit(userInput)}
                                className="bg-yellow-600 p-4 rounded-xl hover:bg-yellow-500 text-white transition-all shadow-lg active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 italic font-mono uppercase tracking-widest">
                            Identity verification required. Type the key and press enter.
                        </p>
                    </div>
                )}
                {/* Hard Mode (Grid) */}
                {puzzle.difficulty === 'HARD' && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-2">
                            <thead>
                                <tr>
                                    <th></th>
                                    {puzzle.locations?.map((l: string) => <th key={l} className="text-[10px] text-slate-500 uppercase">{l}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {puzzle.suspects?.map((s: string) => (
                                    <tr key={s}>
                                        <td className="text-xs font-bold text-slate-400 uppercase pr-4">{s}</td>
                                        {puzzle.locations?.map((l: string) => {
                                            const id = `${s}-${l}`;
                                            return (
                                                <td key={id} onClick={() => handleGridClick(s, l)} className={`h-14 w-14 border-2 rounded-xl text-center cursor-pointer flex items-center justify-center text-xl ${gridState[id] === '✔️' ? 'bg-green-500/20 border-green-500 text-green-500' : gridState[id] === 'X' ? 'bg-red-500/10 border-red-900 text-red-800' : 'bg-slate-950 border-slate-800'}`}>
                                                    {gridState[id]}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center h-12">
                    {/* Hide hint button if already correct, show exit button instead */}
                    {status === 'correct' ? (
                        <button
                            onClick={() => window.history.back()}
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-tighter transition-all"
                        >
                            Return to Arena →
                        </button>
                    ) : (
                        <button onClick={() => { if (useHint(25)) setShowHint(true) }} className="text-xs font-bold text-slate-500 hover:text-yellow-500 flex items-center gap-2 uppercase tracking-tighter disabled:opacity-30">
                            <Lightbulb size={14} /> Analysis Hint (-25 XP)
                        </button>
                    )}

                    {status === 'correct' && <span className="text-green-500 font-black italic flex items-center gap-1 animate-pulse"><CheckCircle2 size={16} /> CASE CLOSED</span>}
                    {status === 'wrong' && <span className="text-red-500 font-black italic flex items-center gap-1"><XCircle size={16} /> MISMATCH</span>}
                </div>
                {showHint && <div className="mt-4 p-4 bg-blue-900/10 border border-blue-800/30 rounded-xl text-blue-300 text-xs italic">CLUE: {puzzle.hint}</div>}
            </div>
        </div>
    );
}