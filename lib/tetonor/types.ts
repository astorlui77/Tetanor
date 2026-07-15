/**
 * Tipos para el juego Tetonor - Versión Corregida
 */

export type OperationType = "sum" | "product";

/**
 * Par de números que genera una suma y un producto
 */
export interface NumberPair {
  num1: number;
  num2: number;
  sum: number;
  product: number;
}

/**
 * Celda de la grilla con el número resultado y las 3 sub-celdas para la solución
 */
export interface GridCell {
  resultValue: number; // El número grande que se muestra (suma o producto)
  operationType: OperationType; // Si es suma o producto
  correctNum1: number; // Primer número correcto de la lista
  correctNum2: number; // Segundo número correcto de la lista
  // Valores ingresados por el usuario en las 3 celdas debajo:
  userNum1: number | null; // Primera celda pequeña
  userNum2: number | null; // Segunda celda pequeña  
  userOperation: OperationType | null; // Tercera celda: + o ×
}

/**
 * Número en la lista
 */
export interface ListNumber {
  value: number | null; // null si está vacío
  isFixed: boolean; // Si es un número fijo o debe ser completado
  isUsed: boolean; // Si el número ya fue usado en la grilla
}

/**
 * Puzzle completo de Tetonor
 */
export interface TetonorPuzzle {
  grid: GridCell[]; // 16 celdas (4x4)
  list: ListNumber[]; // 16 números en orden ascendente (algunos ocultos)
  completeList: number[]; // Lista completa sin ocultar (para validación)
  pairs: NumberPair[]; // 8 pares de números
  hiddenCount: number; // Cantidad de números ocultos (dificultad)
}

/**
 * Estado del juego
 */
export interface GameState {
  puzzle: TetonorPuzzle;
  startTime: number;
  endTime: number | null;
  isComplete: boolean;
  isCorrect: boolean;
}

/**
 * Estadísticas del usuario
 */
export interface GameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  bestTime: number | null;
  averageTime: number | null;
  currentStreak: number;
  longestStreak: number;
}
