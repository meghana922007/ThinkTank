import Link from "next/link";

export default function PlayDashboard() {
    const domains = [
        { id: "logic", name: "Logic Arena", color: "border-blue-500" },
        { id: "math", name: "Math Sanctum", color: "border-green-500" },
    ];

    return (
        <div className="max-w-4xl mx-auto p-10">
            <h1 className="text-4xl font-black mb-10 uppercase tracking-tighter">Select Domain</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {domains.map((domain) => (
                    <Link key={domain.id} href={`/play/${domain.id}`}>
                        <div className={`p-8 bg-slate-900 border-2 ${domain.color} rounded-3xl hover:scale-105 transition-all cursor-pointer`}>
                            <h2 className="text-2xl font-bold">{domain.name}</h2>
                            <p className="text-slate-500 font-mono text-xs mt-2">ACCESS PROTOCOL: {domain.id.toUpperCase()}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}