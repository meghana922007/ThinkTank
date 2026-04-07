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
            if (!userId || userId === 'undefined') {
                console.warn("No active session. Skipping profile fetch.");
                return;
            }
            try {
                const res = await fetch(`/api/user?id=${userId}`);

                // 1. Check if the server actually responded with success
                if (!res.ok) {
                    if (res.status === 403) {
                        console.error("Access Denied: Check institutional email clearance.");
                    } else if (res.status === 404) {
                        console.warn("User profile not found in database.");
                    }
                    return;
                }
                
                // 2. Check if the response body is empty before parsing
                const text = await res.text();
                if (!text) {
                    console.error("API returned an empty body.");
                    return;
                }

                // 3. Now it is safe to parse
                const data = JSON.parse(text);
                if (data) {
                    const currentPoints = data.points ?? 0;
                    const currentLives = data.lives ?? 5;

                    setScore(data.points);
                    setLives(data.lives);

                    // ✅ Recalculate Rank since it's not in your DB schema
                    if (currentPoints >= 1000) setRank("Expert");
                    else if (currentPoints >= 500) setRank("Thinker");
                    else setRank("Rookie");
                }
            } catch (error) {
                console.error("Failed to sync with database:", error);
            }
        };
        fetchUserData();
    }, [userId]);

    // 3. Game Logic: Points & Ranking
    const addPoints = async (points) => {
        setScore((currentScore) => {
            const current = Number(currentScore) || 0;

            // 2. Convert the incoming points to a number (default to 0)
            // Note: we use 'points' because that is what is passed in the function header
            const toAdd = Number(points) || 0;

            return current + toAdd;
        });
        try {
            await fetch('/api/user/update-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    pointsToAdd: points
                }),
            });
        } catch (error) {
            console.error("Failed to save score to database:", error);
        }
    };

    // 4. Game Logic: Losing Lives
    const loseLife = () => {
        setLives((prevLives) => {
            const current = Number(prevLives) || 5;
            if (current <= 1) {
                alert("Game Over! You've run out of lives.");
                return 0;
            }
            return current - 1;
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