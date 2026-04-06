"use client";

import React, { useState, useEffect } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { Lightbulb, CheckCircle2, XCircle, Send, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function UnifiedPuzzlePlayer() {
    const { addPoints, loseLife, useHint, lives } = useProfile();

    // --- Game State ---
    const [puzzle, setPuzzle] = useState<any>(null);
    const [userInput, setUserInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const [showHint, setShowHint] = useState(false);

    // --- Murdle Specific State ---
    const [gridState, setGridState] = useState<Record<string, string>>({});
    const [solvedCount, setSolvedCount] = useState(0);

    // 1. Load Puzzle Data (Mocking the fetch for now)
    useEffect(() => {
        // In a real app: const res = await fetch(`/api/puzzles/${id}`);
        const mockData = {
            id: "p123",
            difficulty: 'HARD', // Change to 'EASY' or 'MEDIUM' to test other modes
            question: "The Librarian was seen with a heavy object. The Chef hates the heat of the kitchen. Who was where?",
            answer: "Librarian", // For the final accusation
            points: 300,
            hint: "The Chef is NOT in the kitchen.",
            // Murdle Metadata
            suspects: ["Librarian", "Chef"],
            locations: ["Library", "Kitchen"],
            solution: {
                "Librarian-Library": "CHECK",
                "Librarian-Kitchen": "X",
                "Chef-Library": "X",
                "Chef-Kitchen": "CHECK"
            }
        };
        setPuzzle(mockData);
    }, []);

    // --- Logic for EASY & MEDIUM ---
    const handleStandardSubmit = (input: string) => {
        if (input.toLowerCase().trim() === puzzle.answer.toLowerCase()) {
            setStatus('correct');
            addPoints(puzzle.points);
        } else {
            setStatus('wrong');
            loseLife();
            setTimeout(() => setStatus('idle'), 2000);
        }
    };

    // --- Logic for HARD (Murdle Lethal Grid) ---
    const handleGridClick = (suspect: string, loc: string) => {
        const cellId = `${suspect}-${loc}`;
        if (gridState[cellId] || status === 'correct') return;

        if (puzzle.solution[cellId] === "CHECK") {
            setGridState(prev => ({ ...prev, [cellId]: "✔️" }));
            setSolvedCount(prev => prev + 1);

            // Check if all correct pairs found
            const totalChecks = Object.values(puzzle.solution).filter(v => v === "CHECK").length;
            if (solvedCount + 1 === totalChecks) {
                setStatus('correct');
                addPoints(puzzle.points);
            }
        } else {
            setGridState(prev => ({ ...prev, [cellId]: "X" }));
            loseLife();
            // Visual shake effect can be added via CSS class
        }
    };

    if (!puzzle) return <div className="p-20 text-center font-mono">LOADING CASE FILE...</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                {/* Difficulty Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${puzzle.difficulty === 'EASY' ? 'bg-green-500' :
                                puzzle.difficulty === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-600'
                            }`} />
                        <span className="text-xs font-black tracking-widest uppercase text-slate-500">
                            {puzzle.difficulty} LEVEL PROTOCOL
                        </span>
                    </div>
                    <span className="font-mono text-blue-400 font-bold">{puzzle.points} XP</span>
                </div>

                <h2 className="text-2xl font-bold mb-8 leading-tight">{puzzle.question}</h2>

                {/* --- DYNAMIC RENDERER --- */}

                {/* EASY MODE: MCQ */}
                {puzzle.difficulty === 'EASY' && (
                    <div className="space-y-3">
                        {["Choice A", "Choice B", "Choice C", "Choice D"].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleStandardSubmit(opt)}
                                className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950 hover:border-blue-500 transition-all"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                {/* MEDIUM MODE: FILL IN BLANK */}
                {puzzle.difficulty === 'MEDIUM' && (
                    <div className="flex gap-2">
                        <input
                            className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-yellow-500 font-bold"
                            placeholder="Type your findings..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button onClick={() => handleStandardSubmit(userInput)} className="bg-yellow-600 p-4 rounded-xl hover:bg-yellow-500">
                            <Send size={20} />
                        </button>
                    </div>
                )}

                {/* HARD MODE: LETHAL MURDLE GRID */}
                {puzzle.difficulty === 'HARD' && (
                    <div className="space-y-6">
                        <div className="bg-red-950/10 border border-red-900/30 p-4 rounded-xl flex items-start gap-3">
                            <ShieldAlert className="text-red-600 shrink-0" size={20} />
                            <p className="text-xs text-red-200/70 font-mono">
                                DEDUCTION ENGINE ACTIVE: Each incorrect click triggers a life penalty.
                                Find all <span className="text-green-500 font-bold">✔️</span> connections to solve the case.
                            </p>
                        </div>

                        <table className="w-full border-separate border-spacing-2">
                            <thead>
                                <tr>
                                    <th className="p-2"></th>
                                    {puzzle.locations.map((loc: string) => (
                                        <th key={loc} className="p-2 text-[10px] uppercase text-slate-500 tracking-widest">{loc}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {puzzle.suspects.map((suspect: string) => (
                                    <tr key={suspect}>
                                        <td className="p-2 text-xs font-black text-slate-400 uppercase">{suspect}</td>
                                        {puzzle.locations.map((loc: string) => {
                                            const id = `${suspect}-${loc}`;
                                            return (
                                                <td
                                                    key={id}
                                                    onClick={() => handleGridClick(suspect, loc)}
                                                    className={`h-16 border-2 rounded-xl text-center cursor-pointer transition-all flex items-center justify-center text-xl
                            ${gridState[id] === '✔️' ? 'bg-green-500/20 border-green-500 text-green-500' :
                                                            gridState[id] === 'X' ? 'bg-red-500/10 border-red-900 text-red-800' :
                                                                'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                                                >
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

                {/* --- COMMON FOOTER (Hints & Status) --- */}
                <div className="mt-10 pt-6 border-t border-slate-800">
                    <div className="flex justify-between items-center">
                        <button
                            disabled={lives <= 0 || status === 'correct'}
                            onClick={() => { if (useHint(25)) setShowHint(true) }}
                            className="text-slate-500 hover:text-yellow-500 flex items-center gap-2 text-xs font-bold uppercase tracking-tighter transition-colors"
                        >
                            <Lightbulb size={14} /> Analysis Hint (-25 XP)
                        </button>

                        {status === 'correct' && (
                            <div className="flex items-center gap-2 text-green-500 font-black italic animate-bounce">
                                <CheckCircle2 size={20} /> MISSION ACCOMPLISHED
                            </div>
                        )}
                        {status === 'wrong' && (
                            <div className="flex items-center gap-2 text-red-500 font-black italic">
                                <XCircle size={20} /> DATA MISMATCH
                            </div>
                        )}
                    </div>

                    {showHint && (
                        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-blue-200 text-xs italic leading-relaxed">
                            LOGFILE CLUE: {puzzle.hint}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}