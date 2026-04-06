"use client";

import React from 'react';
import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { Trophy, Heart, Brain, User } from 'lucide-react';

export default function Navbar() {
    const { score, lives, rank } = useProfile();

    return (
        <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-700 shadow-xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Brain className="text-blue-400 group-hover:rotate-12 transition-transform" size={32} />
                    <span className="text-2xl font-bold tracking-tighter italic">THINKTANK</span>
                </Link>

                {/* Stats Center */}
                <div className="flex gap-8 items-center bg-slate-800/50 px-6 py-2 rounded-full border border-slate-700">
                    <div className="flex items-center gap-2">
                        <Trophy className="text-yellow-400" size={20} />
                        <span className="font-mono font-bold text-lg">{score}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Heart
                                key={i}
                                size={20}
                                className={i < lives ? "fill-red-500 text-red-500" : "text-slate-600 fill-slate-900"}
                            />
                        ))}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{rank}</p>
                        <p className="text-sm font-medium">Player_One</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center border-2 border-slate-700">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </nav>
    );
}