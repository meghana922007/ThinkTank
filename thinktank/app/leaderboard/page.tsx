"use client";
import React from 'react';
import { Trophy, Medal, Crown, ArrowLeft, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
    // --- MANUAL DATA (Replace this later with your API) ---
    const manualPlayers = [
        { id: "1", name: "CYBER_GHOST", profileScore: 4550, rank: "Expert" },
        { id: "2", name: "NULL_POINTER", profileScore: 3200, rank: "Expert" },
        { id: "3", name: "LOGIC_BOMB", profileScore: 2850, rank: "Thinker" },
        { id: "4", name: "BIT_CRUSHER", profileScore: 1900, rank: "Thinker" },
        { id: "5", name: "RECURSIVE_DEV", profileScore: 850, rank: "Rookie" },
        { id: "6", name: "HELLO_WORLD", profileScore: 120, rank: "Rookie" },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-6 font-mono">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-12 border-b border-slate-800 pb-8">
                    <Link href="/" className="text-slate-500 hover:text-blue-400 flex items-center gap-2 text-xs uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Back to Base
                    </Link>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-blue-500 mb-1">
                            <Terminal size={18} />
                            <h1 className="text-4xl font-black italic tracking-tighter">HALL_OF_FAME</h1>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Top 1% System Operatives</p>
                    </div>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-4">
                    {manualPlayers.map((player, index) => (
                        <div
                            key={player.id}
                            className={`flex items-center justify-between p-5 rounded-2xl border transition-all hover:scale-[1.01] ${index === 0
                                    ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-6">
                                {/* Rank Number / Icon */}
                                <div className="w-10 text-center font-black text-2xl italic">
                                    {index === 0 ? <Crown className="text-yellow-400 mx-auto drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> :
                                        index === 1 ? <Medal className="text-slate-300 mx-auto" /> :
                                            index === 2 ? <Medal className="text-orange-500 mx-auto" /> :
                                                <span className="text-slate-600 text-lg">#{index + 1}</span>}
                                </div>

                                {/* Player Info */}
                                <div>
                                    <p className={`font-bold text-lg tracking-tight uppercase ${index === 0 ? 'text-blue-400' : 'text-white'}`}>
                                        {player.name}
                                    </p>
                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                                        Status: <span className={player.rank === "Expert" ? "text-purple-400" : "text-blue-500"}>{player.rank}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="text-right">
                                <p className="text-[10px] text-slate-600 uppercase font-black tracking-tighter">Total XP</p>
                                <p className={`text-2xl font-black tabular-nums ${index === 0 ? 'text-blue-400' : 'text-slate-200'}`}>
                                    {player.profileScore.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Manual notice */}
                <div className="mt-12 p-4 border border-slate-800/50 rounded-xl bg-slate-900/20 text-center">
                    <p className="text-[9px] text-slate-600 uppercase tracking-[0.5em]">
                        Offline Mode: Showing Cached Local Rankings
                    </p>
                </div>
            </div>
        </div>
    );
}