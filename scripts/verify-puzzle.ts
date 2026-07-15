/**
 * Script para verificar manualmente que un puzzle generado sea válido y resoluble
 */

import { generateTetonorPuzzle, validateSolution } from "../lib/tetonor/generator";

console.log("=== VERIFICACIÓN DE PUZZLE TETONOR ===\n");

// Generar un puzzle de dificultad media
const puzzle = generateTetonorPuzzle(5);

console.log("1. PARES GENERADOS:");
console.log("-------------------");
puzzle.pairs.forEach((pair, index) => {
  console.log(`Par ${index + 1}: ${pair.num1} y ${pair.num2}`);
  console.log(`  Suma: ${pair.num1} + ${pair.num2} = ${pair.sum}`);
  console.log(`  Producto: ${pair.num1} × ${pair.num2} = ${pair.product}`);
});

console.log("\n2. LISTA DE NÚMEROS:");
console.log("--------------------");
const listDisplay = puzzle.list.map((item, index) => {
  if (item.value === null) {
    return `[${index}]: ?`;
  }
  return `[${index}]: ${item.value}`;
}).join(", ");
console.log(listDisplay);

console.log("\n3. GRILLA (4x4):");
console.log("----------------");
for (let row = 0; row < 4; row++) {
  const rowCells = [];
  for (let col = 0; col < 4; col++) {
    const index = row * 4 + col;
    const cell = puzzle.grid[index];
    const op = cell.operationType === "sum" ? "+" : "×";
    rowCells.push(`${cell.resultValue}(${op})`);
  }
  console.log(rowCells.join("  |  "));
}

console.log("\n4. VERIFICACIÓN DE CONSISTENCIA:");
console.log("---------------------------------");

// Verificar que todos los resultados en la grilla provengan de los pares
const allResults = new Set<number>();
puzzle.pairs.forEach(pair => {
  allResults.add(pair.sum);
  allResults.add(pair.product);
});

let allValid = true;
puzzle.grid.forEach((cell, index) => {
  if (!allResults.has(cell.resultValue)) {
    console.log(`❌ ERROR: Celda ${index} tiene valor ${cell.resultValue} que no proviene de ningún par`);
    allValid = false;
  }
});

if (allValid) {
  console.log("✅ Todos los valores de la grilla provienen de los pares generados");
}

// Verificar que cada par tenga su suma y producto en la grilla
const gridResults = puzzle.grid.map(cell => ({
  value: cell.resultValue,
  type: cell.operationType,
}));

puzzle.pairs.forEach((pair, index) => {
  const hasSum = gridResults.some(r => r.value === pair.sum && r.type === "sum");
  const hasProduct = gridResults.some(r => r.value === pair.product && r.type === "product");
  
  if (!hasSum) {
    console.log(`❌ ERROR: Par ${index + 1} (${pair.num1}, ${pair.num2}) no tiene su suma (${pair.sum}) en la grilla`);
    allValid = false;
  }
  if (!hasProduct) {
    console.log(`❌ ERROR: Par ${index + 1} (${pair.num1}, ${pair.num2}) no tiene su producto (${pair.product}) en la grilla`);
    allValid = false;
  }
});

if (allValid) {
  console.log("✅ Cada par tiene su suma y producto en la grilla");
}

console.log("\n5. SOLUCIÓN AUTOMÁTICA:");
console.log("-----------------------");

// Completar la lista con los valores correctos
const allNumbers = new Set<number>();
puzzle.pairs.forEach(pair => {
  allNumbers.add(pair.num1);
  allNumbers.add(pair.num2);
});
const sortedNumbers = Array.from(allNumbers).sort((a, b) => a - b);

puzzle.list.forEach((item, index) => {
  if (item.value === null) {
    puzzle.list[index].value = sortedNumbers[index];
  }
});

console.log("Lista completa:", puzzle.list.map(item => item.value).join(", "));

// Completar la grilla con las soluciones correctas
puzzle.grid.forEach(cell => {
  cell.userNum1 = cell.correctNum1;
  cell.userNum2 = cell.correctNum2;
  cell.userOperation = cell.operationType;
});

console.log("\nSoluciones de la grilla:");
for (let row = 0; row < 4; row++) {
  const rowSolutions = [];
  for (let col = 0; col < 4; col++) {
    const index = row * 4 + col;
    const cell = puzzle.grid[index];
    const op = cell.userOperation === "sum" ? "+" : "×";
    rowSolutions.push(`${cell.resultValue} = ${cell.userNum1} ${op} ${cell.userNum2}`);
  }
  console.log(rowSolutions.join("  |  "));
}

console.log("\n6. VALIDACIÓN:");
console.log("--------------");
const result = validateSolution(puzzle);

if (result.isValid) {
  console.log("✅ ¡La solución es VÁLIDA!");
} else {
  console.log("❌ La solución tiene errores:");
  result.errors.forEach(error => console.log(`  - ${error}`));
}

console.log("\n=== FIN DE VERIFICACIÓN ===");
