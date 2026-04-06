import Link from 'next/link';
import { Rocket, Target, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
          READY TO PLAY?
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto">
          Master analytical, verbal, and technical challenges. Earn points, level up, and dominate the leaderboard.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2">
            <Rocket size={24} /> ENTER ARENA
          </Link>
          <Link href="/leaderboard" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all border border-slate-700 flex items-center gap-2">
            <Target size={24} /> LEADERBOARD
          </Link>
        </div>
      </div>

      {/* Quick Stats/Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl">
        <FeatureCard icon={<Zap className="text-yellow-400" />} title="Fast-Paced" desc="Timed puzzles that test your speed." />
        <FeatureCard icon={<Rocket className="text-purple-400" />} title="Dynamic Difficulty" desc="Easy to Hard domains to master." />
        <FeatureCard icon={<Target className="text-red-400" />} title="Competitive" desc="Climb the ranks and earn your title." />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}