"use client";
import { useProfile } from "@/context/ProfileContext";
import { Trophy, Target, Zap } from "lucide-react";

export default function ProfilePage() {
    const { score, rank } = useProfile();

    return (
        <div className="max-w-4xl mx-auto p-10">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[40px] p-12 text-white shadow-2xl mb-10">
                <p className="text-blue-200 font-bold uppercase tracking-widest text-sm mb-2">Personal Dashboard</p>
                <h1 className="text-5xl font-black mb-8 tracking-tighter">Welcome back, Thinker.</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <Zap className="mb-4 text-yellow-400" fill="currentColor" />
                        <p className="text-blue-100 text-xs font-bold uppercase">Total Points</p>
                        <p className="text-4xl font-black">{score}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <Trophy className="mb-4 text-yellow-400" />
                        <p className="text-blue-100 text-xs font-bold uppercase">Current Rank</p>
                        <p className="text-4xl font-black">{rank}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}