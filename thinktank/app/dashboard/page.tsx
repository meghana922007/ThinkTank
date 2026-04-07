"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brain, ChevronRight, Zap } from 'lucide-react';
import ProfileHeader from '@/components/ProfileHeader';

export default function Dashboard() {
    const [domains, setDomains] = useState([]);

    useEffect(() => {
        fetch('/api/admin/domains')
            .then(res => {
                if (!res.ok) throw new Error("API not found or unauthorized");
                return res.json();
            })
            .then(data => setDomains(data))
            .catch(err => {
                console.error("Dashboard fetch error:", err);
                setDomains([]); // Set to empty array so it doesn't crash
            });
    }, []);

    return (
        
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-4xl font-black mb-10 tracking-tighter">CHOOSE YOUR ARENA</h2>
            <div className="w-full max-w-4xl mb-12">
                <ProfileHeader />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {domains.map((domain: any) => (
                    <Link
                        key={domain.id}
                        href={`/play/${domain.id}`}
                        className="group bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl hover:border-blue-500 transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
                                <Brain className="text-blue-400" size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{domain.name}</h3>
                                <p className="text-sm text-slate-400">{domain.description || "Challenge your brain."}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-700 group-hover:text-white" />
                    </Link>
                ))}
            </div>
        </div>
    );
}