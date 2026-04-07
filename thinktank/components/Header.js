"use client";
import { useProfile } from "@/context/ProfileContext";
import { Shield, Heart, Disc } from "lucide-react"; // Optional icons

export default function Header() {
    const { score, lives, rank } = useProfile();

    return (
        <header className="w-full bg-black/50 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="font-black tracking-tighter text-xl text-blue-500">THINKTANK_OS</div>

                <div className="flex items-center gap-6">
                    {/* Display Lives */}
                    <div className="flex items-center gap-2">
                        <Heart className="text-red-500 fill-red-500" size={16} />
                        <span className="font-mono text-white">{lives}</span>
                    </div>

                    {/* Display Score & Rank */}
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                            <Disc className="text-blue-400 animate-spin-slow" size={14} />
                            <span className="text-xs font-mono text-blue-400">XP:</span>
                            <span className="font-bold text-white">{score}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                            Clearance: {rank}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}