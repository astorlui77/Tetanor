import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STATS_KEY = "@tetonor_stats";

export interface GameStats {
  easy: {
    bestTime: number | null;
    gamesPlayed: number;
    totalTime: number;
  };
  medium: {
    bestTime: number | null;
    gamesPlayed: number;
    totalTime: number;
  };
  hard: {
    bestTime: number | null;
    gamesPlayed: number;
    totalTime: number;
  };
}

const DEFAULT_STATS: GameStats = {
  easy: { bestTime: null, gamesPlayed: 0, totalTime: 0 },
  medium: { bestTime: null, gamesPlayed: 0, totalTime: 0 },
  hard: { bestTime: null, gamesPlayed: 0, totalTime: 0 },
};

export function useStats() {
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar estadísticas al montar
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const stored = await AsyncStorage.getItem(STATS_KEY);
      if (stored) {
        setStats(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStats = async (newStats: GameStats) => {
    try {
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error("Error saving stats:", error);
    }
  };

  const recordGame = async (
    difficulty: "easy" | "medium" | "hard",
    timeInSeconds: number
  ) => {
    const newStats = { ...stats };
    const diffStats = newStats[difficulty];

    // Actualizar mejor tiempo
    if (diffStats.bestTime === null || timeInSeconds < diffStats.bestTime) {
      diffStats.bestTime = timeInSeconds;
    }

    // Actualizar contadores
    diffStats.gamesPlayed += 1;
    diffStats.totalTime += timeInSeconds;

    await saveStats(newStats);

    // Retornar si es un nuevo récord
    return diffStats.bestTime === timeInSeconds && diffStats.gamesPlayed > 1;
  };

  const getAverageTime = (difficulty: "easy" | "medium" | "hard"): number | null => {
    const diffStats = stats[difficulty];
    if (diffStats.gamesPlayed === 0) return null;
    return Math.floor(diffStats.totalTime / diffStats.gamesPlayed);
  };

  const resetStats = async () => {
    await saveStats(DEFAULT_STATS);
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    stats,
    isLoading,
    recordGame,
    getAverageTime,
    resetStats,
    formatTime,
  };
}
