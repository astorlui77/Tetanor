import type { TetonorPuzzle } from "./types";

export type HintLevel = 1 | 2 | 3;

interface HintResult {
  level: HintLevel;
  message: string;
  highlightNumbers?: number[]; // Números de la lista a resaltar
  highlightCells?: number[]; // Índices de celdas de la grilla a resaltar
  revealedPair?: { num1: number; num2: number; sum: number; product: number };
}

/**
 * Genera una pista progresiva según el nivel solicitado
 */
export function generateProgressiveHint(
  puzzle: TetonorPuzzle,
  level: HintLevel
): HintResult {
  // Encontrar una celda sin completar
  const incompleteCells = puzzle.grid
    .map((cell, index) => ({ cell, index }))
    .filter(({ cell }) => 
      cell.userNum1 === null || 
      cell.userNum2 === null || 
      cell.userOperation === null
    );

  if (incompleteCells.length === 0) {
    return {
      level,
      message: "¡Ya completaste todas las celdas! Ahora verifica tu solución.",
    };
  }

  // Tomar la primera celda incompleta
  const { cell: targetCell, index: targetIndex } = incompleteCells[0];
  const targetValue = targetCell.resultValue;

  // Encontrar el par correcto para esta celda
  const correctPair = puzzle.pairs.find(
    pair => pair.sum === targetValue || pair.product === targetValue
  );

  if (!correctPair) {
    return {
      level,
      message: "No se pudo generar una pista para esta celda.",
    };
  }

  const isSum = correctPair.sum === targetValue;
  const operation = isSum ? "suma" : "producto";
  const otherValue = isSum ? correctPair.product : correctPair.sum;

  switch (level) {
    case 1:
      // Nivel 1: Sugerir qué números buscar
      return {
        level: 1,
        message: `Pista básica: Para el número ${targetValue}, busca dos números en la lista que al ${isSum ? "sumarlos" : "multiplicarlos"} den ese resultado. Recuerda que ese par también debe tener su ${isSum ? "producto" : "suma"} (${otherValue}) en otra celda de la grilla.`,
        highlightCells: [targetIndex],
      };

    case 2:
      // Nivel 2: Sugerir números específicos y celdas relacionadas
      const relatedCellIndex = puzzle.grid.findIndex(
        cell => cell.resultValue === otherValue
      );
      
      return {
        level: 2,
        message: `Pista intermedia: El número ${targetValue} se forma con ${correctPair.num1} ${isSum ? "+" : "×"} ${correctPair.num2}. Verifica que estos números estén en la lista y que ${correctPair.num1} ${isSum ? "×" : "+"} ${correctPair.num2} = ${otherValue} también esté en la grilla.`,
        highlightNumbers: [correctPair.num1, correctPair.num2],
        highlightCells: relatedCellIndex >= 0 ? [targetIndex, relatedCellIndex] : [targetIndex],
      };

    case 3:
      // Nivel 3: Revelar el par completo
      return {
        level: 3,
        message: `Solución completa: El par (${correctPair.num1}, ${correctPair.num2}) genera:\n• ${correctPair.num1} + ${correctPair.num2} = ${correctPair.sum}\n• ${correctPair.num1} × ${correctPair.num2} = ${correctPair.product}\n\nAmbos resultados están en la grilla. Usa este par para completar la celda con ${targetValue}.`,
        highlightNumbers: [correctPair.num1, correctPair.num2],
        revealedPair: {
          num1: correctPair.num1,
          num2: correctPair.num2,
          sum: correctPair.sum,
          product: correctPair.product,
        },
      };

    default:
      return {
        level: 1,
        message: "Pista no disponible.",
      };
  }
}

/**
 * Analiza el puzzle y sugiere la mejor estrategia inicial
 */
export function suggestStrategy(puzzle: TetonorPuzzle): string {
  const visibleNumbers = puzzle.list
    .filter(item => item.value !== null)
    .map(item => item.value!);

  if (visibleNumbers.length === 0) {
    return "Comienza completando algunos números de la lista analizando las celdas de la grilla.";
  }

  const maxVisible = Math.max(...visibleNumbers);
  const maxPossibleSum = maxVisible * 2;

  // Buscar números en la grilla mayores que la suma máxima posible
  const definiteProducts = puzzle.grid.filter(
    cell => cell.resultValue > maxPossibleSum
  );

  if (definiteProducts.length > 0) {
    return `Estrategia recomendada: El número más grande visible en la lista es ${maxVisible}. La suma máxima posible es ${maxVisible} + ${maxVisible} = ${maxPossibleSum}. Hay ${definiteProducts.length} número(s) en la grilla mayores que ${maxPossibleSum}, por lo que definitivamente son productos. Comienza por ellos.`;
  }

  // Buscar números primos
  const primes = puzzle.grid.filter(cell => isPrime(cell.resultValue));
  
  if (primes.length > 0) {
    const primeValue = primes[0].resultValue;
    return `Estrategia recomendada: El número ${primeValue} es primo. Si es un producto, solo puede ser 1 × ${primeValue}. Para que funcione, también debe existir 1 + ${primeValue} = ${primeValue + 1} en la grilla. Verifica si lo ves.`;
  }

  return "Estrategia recomendada: Busca números pequeños en la grilla que tengan pocas factorizaciones posibles. Verifica cuál de esas factorizaciones tiene su par completo (suma Y producto) en la grilla.";
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  
  return true;
}
