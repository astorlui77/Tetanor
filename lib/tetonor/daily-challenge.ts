import type { TetonorPuzzle } from "./types";
import { generateTetonorPuzzle } from "./generator";

/**
 * Genera un puzzle único para el día actual
 * Usa la fecha como seed para que todos los usuarios tengan el mismo puzzle
 */
export function generateDailyChallenge(): TetonorPuzzle {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  
  // Usar la fecha como seed para el generador aleatorio
  const seed = hashString(dateString);
  
  // Guardar el estado original de Math.random
  const originalRandom = Math.random;
  
  // Crear un generador aleatorio seeded
  let state = seed;
  Math.random = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
  
  // Generar el puzzle con 5 números ocultos (dificultad media)
  const puzzle = generateTetonorPuzzle(5);
  
  // Restaurar Math.random original
  Math.random = originalRandom;
  
  return puzzle;
}

/**
 * Obtiene la fecha del desafío actual en formato YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

/**
 * Calcula cuánto tiempo falta para el próximo desafío
 */
export function getTimeUntilNextChallenge(): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
}

/**
 * Función hash simple para convertir string a número
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
