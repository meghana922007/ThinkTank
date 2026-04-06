"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
    // 1. Core Game State
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [rank, setRank] = useState("Rookie");
    const [userId, setUserId] = useState("user-123"); // Hardcoded for now until we build Login

    // 2. Sync with MySQL on Load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`/api/user?id=${userId}`);
                const data = await res.json();
                if (data) {
                    setScore(data.profileScore);
                    setLives(data.lives);
                    setRank(data.rank);
                }
            } catch (error) {
                console.error("Failed to sync with database:", error);
            }
        };
        fetchUserData();
    }, [userId]);

    // 3. Game Logic: Points & Ranking
    const addPoints = (points) => {
        setScore((prev) => {
            const newScore = prev + points;
            // Simple Rank Logic
            if (newScore >= 1000) setRank("Expert");
            else if (newScore >= 500) setRank("Thinker");
            return newScore;
        });
    };

    // 4. Game Logic: Losing Lives
    const loseLife = () => {
        setLives((prev) => {
            if (prev <= 1) {
                alert("Game Over! You've run out of lives.");
                return 0;
            }
            return prev - 1;
        });
    };

    // 5. Game Logic: Using Hints (Costs Points)
    const useHint = (cost) => {
        if (score >= cost) {
            setScore(prev => prev - cost);
            return true; // Success
        } else {
            alert("Not enough points for a hint!");
            return false; // Failure
        }
    };

    return (
        <ProfileContext.Provider value={{
            score,
            lives,
            rank,
            addPoints,
            loseLife,
            useHint
        }}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};