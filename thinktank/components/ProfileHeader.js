"use client";
import React, { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { User, Shield, Zap, Heart, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProfileHeader() {
    // 1. Destructure with fallbacks to prevent undefined errors
    const { score = 0, rank = "Rookie", lives = 5 } = useProfile();
    const [isOpen, setIsOpen] = useState(false);

    // 2. Updated Loading Check: Only show pulse if data is truly missing
    if (score === undefined && rank === undefined) {
        return <div className="animate-pulse bg-slate-900 h-16 rounded-2xl w-full max-w-4xl mx-auto mb-10 border border-slate-800" />;
    }

    return (
        <div className="max-w-4xl mx-auto mb-10 px-4">
            {/* The Main Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${isOpen
                        ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <User className={isOpen ? "text-white" : "text-blue-500"} size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Active Operative</p>
                        {/* You can replace AGENT_USER_01 with a dynamic name later */}
                        <p className="text-white font-bold tracking-tight uppercase">Agent_Guest</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right mr-4">
                        <p className="text-[10px] text-slate-500 uppercase font-black">Current Rank</p>
                        <p className="text-blue-400 font-bold italic uppercase">{rank || "Rookie"}</p>
                    </div>
                    {isOpen ? <ChevronUp className="text-white" /> : <ChevronDown className="text-slate-500" />}
                </div>
            </button>

            {/* The Detailed Profile */}
            {isOpen && (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-300">

                    {/* Score Card - Added Number() to force NaN check */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-2 text-blue-500">
                            <Zap size={16} />
                            <span className="text-[10px] font-black uppercase">Total Intel XP</span>
                        </div>
                        <p className="text-3xl font-black text-white">
                            {Number(score ?? 0).toLocaleString()}
                        </p>
                    </div>

                    {/* Rank Card - Added fallback text */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-2 text-yellow-500">
                            <Shield size={16} />
                            <span className="text-[10px] font-black uppercase">Clearance Level</span>
                        </div>
                        <p className="text-3xl font-black text-white uppercase italic">
                            {rank || "Rookie"}
                        </p>
                    </div>

                    {/* Health Card - Fixed 'lives' comparison logic */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-2 text-red-500">
                            <Heart size={16} />
                            <span className="text-[10px] font-black uppercase">System Integrity</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-4 w-full rounded-sm transition-colors duration-500 ${i < (lives ?? 0) ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 'bg-slate-800'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}