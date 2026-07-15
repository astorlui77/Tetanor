import type { TetonorPuzzle, NumberPair, GridCell, ListNumber } from "./types";

// Función auxiliar para generar número aleatorio en un rango
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función auxiliar para mezclar un array (Fisher-Yates shuffle)
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * PASO 1: Generar 8 pares aleatorios con restricción de resultados ≤ 999
 * Cada par (a, b) debe cumplir: suma ≤ 999 Y producto ≤ 999
 */
function generatePairs(): NumberPair[] | null {
  const maxAttempts = 100;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const pairs: NumberPair[] = [];
    const usedResults = new Set<number>();
    const pairStrings = new Set<string>();
    
    let pairAttempts = 0;
    while (pairs.length < 8 && pairAttempts < 1000) {
      pairAttempts++;
      
      // Generar dos números aleatorios
      // Usar un rango más amplio para permitir variedad
      const num1 = randomInt(1, 100);
      const num2 = randomInt(1, 100);
      
      const sum = num1 + num2;
      const product = num1 * num2;
      
      // Crear clave única para el par (ordenado)
      const pairKey = `${Math.min(num1, num2)},${Math.max(num1, num2)}`;
      
      // Verificar restricciones:
      // 1. Suma ≤ 999
      // 2. Producto ≤ 999
      // 3. Suma y producto diferentes
      // 4. Ambos resultados únicos
      // 5. Par no usado antes
      if (sum <= 999 &&
          product <= 999 &&
          sum !== product &&
          !usedResults.has(sum) &&
          !usedResults.has(product) &&
          !pairStrings.has(pairKey)) {
        pairs.push({
          num1: Math.min(num1, num2),
          num2: Math.max(num1, num2),
          sum,
          product,
        });
        pairStrings.add(pairKey);
        usedResults.add(sum);
        usedResults.add(product);
      }
    }
    
    // Verificar que la lista resultante tenga exactamente 16 elementos
    if (pairs.length === 8) {
      const numberCounts = new Map<number, number>();
      pairs.forEach(pair => {
        numberCounts.set(pair.num1, (numberCounts.get(pair.num1) || 0) + 1);
        numberCounts.set(pair.num2, (numberCounts.get(pair.num2) || 0) + 1);
      });
      
      let totalCount = 0;
      numberCounts.forEach(count => {
        totalCount += count;
      });
      
      // Solo continuar si el total es exactamente 16
      if (totalCount === 16) {
        // VALIDACIÓN ADICIONAL: Verificar que no haya ambigüedad
        // El límite superior absoluto de cualquier suma es largestNum * 2.
        // Al exigir que todos los productos sean mayores que la suma máxima posible (largestNum * 2),
        // garantizamos que incluso si el jugador solo conoce el número más grande,
        // no habrá ninguna ambigüedad: cualquier número <= largestNum * 2 es una suma,
        // y cualquier número > largestNum * 2 es un producto.
        const allNumbers = Array.from(numberCounts.keys()).sort((a, b) => a - b);
        const largestNum = allNumbers[allNumbers.length - 1];
        const maxSum = largestNum * 2;
        
        // Verificar que todos los productos sean > maxSum
        const allProductsValid = pairs.every(pair => pair.product > maxSum);
        
        if (allProductsValid) {
          return pairs;
        }
      }
    }
  }
  
  return null;
}

/**
 * PASO 3: Construir la lista de 16 números a partir de los pares
 */
function buildListFromPairs(pairs: NumberPair[]): number[] {
  const numberCounts = new Map<number, number>();
  
  // Contar cuántas CASILLAS del banco necesita cada número
  pairs.forEach(pair => {
    numberCounts.set(pair.num1, (numberCounts.get(pair.num1) || 0) + 1);
    numberCounts.set(pair.num2, (numberCounts.get(pair.num2) || 0) + 1);
  });
  
  // Construir la lista con EXACTAMENTE las repeticiones necesarias
  const list: number[] = [];
  numberCounts.forEach((count, num) => {
    for (let i = 0; i < count; i++) {
      list.push(num);
    }
  });
  
  // La lista DEBE tener exactamente 16 elementos
  if (list.length !== 16) {
    throw new Error(`La lista debe tener 16 elementos, pero tiene ${list.length}`);
  }
  
  // Ordenar la lista ascendentemente
  return list.sort((a, b) => a - b);
}

/**
 * PASO 4: Crear la grilla de 16 celdas a partir de los 8 pares
 */
function createGridFromPairs(pairs: NumberPair[]): GridCell[] {
  const grid: GridCell[] = [];
  
  // Cada par genera 2 celdas: una suma y un producto
  pairs.forEach(pair => {
    // Celda de suma
    grid.push({
      resultValue: pair.sum,
      correctNum1: pair.num1,
      correctNum2: pair.num2,
      operationType: "sum",
      userNum1: null,
      userNum2: null,
      userOperation: null,
    });
    
    // Celda de producto
    grid.push({
      resultValue: pair.product,
      correctNum1: pair.num1,
      correctNum2: pair.num2,
      operationType: "product",
      userNum1: null,
      userNum2: null,
      userOperation: null,
    });
  });
  
  // Mezclar la grilla para que no sea predecible
  return shuffle(grid);
}

/**
 * PASO 5: Ocultar números en la lista según la cantidad especificada
 */
function createListWithHiddenNumbers(completeList: number[], hiddenCount: number): ListNumber[] {
  const list: ListNumber[] = completeList.map(value => ({ 
    value, 
    isFixed: true, // Por defecto todos son fijos (visibles)
    isUsed: false // Inicialmente ningún número está usado
  }));
  
  // Seleccionar índices aleatorios para ocultar, pero NUNCA ocultar el último elemento (índice 15)
  // que es el número más grande del banco, para evitar que las sumas con números grandes
  // parezcan productos imposibles de factorizar para el jugador.
  const indices = Array.from({ length: 15 }, (_, i) => i); // De 0 a 14
  const shuffledIndices = shuffle(indices);
  
  for (let i = 0; i < Math.min(hiddenCount, 15); i++) {
    list[shuffledIndices[i]].value = null;
    list[shuffledIndices[i]].isFixed = false; // Los ocultos son editables
  }
  
  return list;
}

/**
 * Genera un puzzle de Tetonor completo
 * @param hiddenCount Cantidad de números a ocultar en la lista (3, 5, 7, 9)
 */
export function generateTetonorPuzzle(hiddenCount: number = 5): TetonorPuzzle {
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // PASO 1: Generar 8 pares aleatorios con resultados ≤ 999
    const pairs = generatePairs();
    if (!pairs) continue;
    
    // PASO 2: Construir lista de 16 números a partir de los pares
    const completeList = buildListFromPairs(pairs);
    
    // PASO 3: Crear grilla de 16 celdas (8 sumas + 8 productos)
    const grid = createGridFromPairs(pairs);
    
    // PASO 4: Ocultar números según cantidad especificada
    const list = createListWithHiddenNumbers(completeList, hiddenCount);
    
    return {
      grid,
      list,
      completeList,
      pairs,
      hiddenCount,
    };
  }
  
  // Si después de muchos intentos no se pudo, lanzar error
  throw new Error("No se pudo generar un puzzle válido después de múltiples intentos");
}

/**
 * Valida la solución del usuario según las reglas oficiales
 */
export function validateSolution(puzzle: TetonorPuzzle): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Extraer todos los números de la lista
  const listNumbers = puzzle.list.map(item => item.value).filter(v => v !== null) as number[];
  
  // Verificar que la lista tenga exactamente 16 números
  if (listNumbers.length !== 16) {
    errors.push("La lista debe tener exactamente 16 números");
    return { isValid: false, errors };
  }
  
  // Verificar que la lista esté en orden ascendente
  for (let i = 0; i < listNumbers.length - 1; i++) {
    if (listNumbers[i] > listNumbers[i + 1]) {
      errors.push("Los números de la lista deben estar en orden ascendente");
      break;
    }
  }
  
  // Verificar cada celda de la grilla y construir mapa de pares
  const foundPairs = new Map<string, { num1: number; num2: number; operations: Set<string> }>();
  
  for (let i = 0; i < puzzle.grid.length; i++) {
    const cell = puzzle.grid[i];
    
    const num1 = cell.userNum1;
    const num2 = cell.userNum2;
    const operation = cell.userOperation;
    
    if (num1 === null || num2 === null || operation === null) {
      errors.push(`Celda ${i + 1}: Faltan números u operación`);
      continue;
    }
    
    // Verificar que la operación sea correcta
    const expectedResult = operation === "sum" ? num1 + num2 : num1 * num2;
    if (expectedResult !== cell.resultValue) {
      const opSymbol = operation === "sum" ? "+" : "×";
      errors.push(
        `Celda ${i + 1}: ${num1} ${opSymbol} ${num2} = ${expectedResult}, pero el resultado es ${cell.resultValue}`
      );
    }
    
    // Registrar el par y su operación
    const pairKey = `${Math.min(num1, num2)},${Math.max(num1, num2)}`;
    if (!foundPairs.has(pairKey)) {
      foundPairs.set(pairKey, { num1, num2, operations: new Set([operation]) });
    } else {
      const existing = foundPairs.get(pairKey)!;
      existing.operations.add(operation);
    }
  }
  
  // VALIDACIÓN POR PARES (paradigma correcto)
  const availableNumbers = [...listNumbers];
  
  foundPairs.forEach((data, pairKey) => {
    const [num1, num2] = pairKey.split(",").map(Number);
    
    // Intentar consumir num1 del banco
    const idx1 = availableNumbers.indexOf(num1);
    if (idx1 === -1) {
      errors.push(`El par (${num1}, ${num2}) necesita ${num1}, pero no está disponible en el banco`);
    } else {
      availableNumbers.splice(idx1, 1);
    }
    
    // Intentar consumir num2 del banco
    const idx2 = availableNumbers.indexOf(num2);
    if (idx2 === -1) {
      errors.push(`El par (${num1}, ${num2}) necesita ${num2}, pero no está disponible en el banco`);
    } else {
      availableNumbers.splice(idx2, 1);
    }
  });
  
  // Verificar que haya exactamente 8 pares únicos
  if (foundPairs.size !== 8) {
    errors.push(`Debe haber exactamente 8 pares únicos, pero se encontraron ${foundPairs.size}`);
  }
  
  // Verificar uso doble obligatorio
  foundPairs.forEach((data, pairKey) => {
    if (data.operations.size !== 2) {
      const [num1, num2] = pairKey.split(",").map(Number);
      errors.push(
        `El par (${num1}, ${num2}) debe tener tanto su suma como su producto en la grilla`
      );
    }
  });
  
  // Contar sumas y productos
  let sumCount = 0;
  let productCount = 0;
  puzzle.grid.forEach(cell => {
    if (cell.userOperation === "sum") sumCount++;
    if (cell.userOperation === "product") productCount++;
  });
  
  if (sumCount !== 8) {
    errors.push(`Debe haber exactamente 8 sumas, pero se encontraron ${sumCount}`);
  }
  
  if (productCount !== 8) {
    errors.push(`Debe haber exactamente 8 productos, pero se encontraron ${productCount}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
