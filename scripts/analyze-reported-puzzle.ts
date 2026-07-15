/**
 * Analizar el puzzle reportado por el usuario para entender el problema
 */

// Puzzle reportado
const gridResults = [496, 70, 960, 42, 156, 72, 92, 855, 56, 528, 43, 272, 372, 68, 25, 672];
const visibleList = [8, 8, 12, null, null, 12, 12, null, 15, 31, 34];

console.log("=== ANÁLISIS DEL PUZZLE REPORTADO ===\n");

console.log("Resultados en la grilla:");
console.log(gridResults.join(", "));
console.log();

console.log("Lista visible:");
console.log(visibleList.filter(n => n !== null).join(", "));
console.log();

// Calcular suma máxima posible con números visibles
const knownNumbers = visibleList.filter(n => n !== null) as number[];
const sortedKnown = [...knownNumbers].sort((a, b) => a - b);
const largestKnown = sortedKnown[sortedKnown.length - 1];
const countLargest = knownNumbers.filter(n => n === largestKnown).length;

console.log(`Número más grande visible: ${largestKnown}`);
console.log(`Aparece ${countLargest} veces`);

const maxSumWithKnown = countLargest >= 2 
  ? largestKnown + largestKnown 
  : largestKnown + sortedKnown[sortedKnown.length - 2];

console.log(`Suma máxima con números visibles: ${maxSumWithKnown}`);
console.log();

// Clasificar resultados
const possibleSums = gridResults.filter(r => r <= maxSumWithKnown);
const possibleProducts = gridResults.filter(r => r > maxSumWithKnown);
const ambiguous = gridResults.filter(r => r > maxSumWithKnown && r < 200); // Heurística

console.log(`Resultados ≤ ${maxSumWithKnown} (posibles sumas): ${possibleSums.length}`);
console.log(possibleSums.join(", "));
console.log();

console.log(`Resultados > ${maxSumWithKnown} (posibles productos): ${possibleProducts.length}`);
console.log(possibleProducts.join(", "));
console.log();

console.log("Resultados ambiguos (podrían ser sumas O productos):");
console.log(ambiguous.join(", "));
console.log();

// Intentar reconstruir la lista completa
console.log("=== INTENTO DE RECONSTRUCCIÓN ===\n");

// Si la lista tiene 16 elementos y 5 están ocultos, faltan 5 números
const hiddenCount = 5;
console.log(`Números ocultos: ${hiddenCount}`);
console.log(`Total de números en la lista: 16`);
console.log();

// Analizar posibles pares
console.log("Análisis de posibles pares:");

// 70 = ? (¿35 + 35? ¿7 × 10?)
console.log("70: ¿35 + 35? ¿7 × 10? ¿14 × 5?");

// 72 = ? (¿36 + 36? ¿8 × 9? ¿12 × 6?)
console.log("72: ¿36 + 36? ¿8 × 9? ¿12 × 6?");

// 92 = ? (¿46 + 46? ¿4 × 23?)
console.log("92: ¿46 + 46? ¿4 × 23?");

// 68 = ? (¿34 + 34? ¿4 × 17? ¿2 × 34?)
console.log("68: ¿34 + 34? ¿4 × 17? ¿2 × 34?");

console.log();

// Verificar si 68 podría ser 34 + 34
if (knownNumbers.filter(n => n === 34).length >= 2) {
  console.log("⚠️ 34 aparece 2+ veces en la lista visible");
  console.log("⚠️ Entonces 68 = 34 + 34 es una SUMA válida");
  console.log("⚠️ Pero 68 está clasificado como PRODUCTO (> maxSum)");
  console.log();
}

console.log("=== CONCLUSIÓN ===");
console.log("El problema es que el generador NO está garantizando que todos los productos sean > suma máxima.");
console.log("Algunos resultados como 68, 70, 72, 92 son ambiguos.");
