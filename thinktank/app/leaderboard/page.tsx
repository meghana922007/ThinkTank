// thinktank/app/leaderboard/page.tsx
import { prisma } from "@/lib/prisma";
import { Trophy, Medal, User } from 'lucide-react';

export default async function Leaderboard() {
    // Fetch top 10 players from MySQL
    const players = await prisma.user.findMany({
        orderBy: { profileScore: 'desc' },
        take: 10,
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-black italic tracking-tighter mb-2">HALL OF FAME</h1>
                <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">The Top 10 ThinkTankers</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 border-b border-slate-700">
                        <tr>
                            <th className="p-6 text-xs uppercase font-black text-slate-500">Rank</th>
                            <th className="p-6 text-xs uppercase font-black text-slate-500">Player</th>
                            <th className="p-6 text-xs uppercase font-black text-slate-500 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {players.map((player, index) => (
                            <tr key={player.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-6 font-mono font-bold">
                                    {index === 0 ? <Trophy className="text-yellow-400" /> : index + 1}
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <p className="font-bold">{player.username}</p>
                                            <p className="text-xs text-slate-500 uppercase font-bold">{player.rank}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-right font-black text-blue-400 text-xl">
                                    {player.profileScore.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}