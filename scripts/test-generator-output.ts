import { generateTetonorPuzzle } from "../lib/tetonor/generator";

console.log("=== GENERANDO 10 PUZZLES PARA ANÁLISIS ===\n");

for (let i = 1; i <= 10; i++) {
  console.log(`\n--- PUZZLE ${i} ---`);
  
  try {
    const puzzle = generateTetonorPuzzle(5);
    
    // Extraer información
    const completeList = puzzle.completeList.sort((a, b) => a - b);
    const uniqueNumbers = Array.from(new Set(completeList));
    
    const largestNum = uniqueNumbers[uniqueNumbers.length - 1];
    const largestCount = completeList.filter(n => n === largestNum).length;
    
    const maxSum = largestCount >= 2
      ? largestNum + largestNum
      : largestNum + uniqueNumbers[uniqueNumbers.length - 2];
    
    // Extraer sumas y productos
    const sums = puzzle.grid
      .filter(cell => cell.operationType === "sum")
      .map(cell => cell.resultValue)
      .sort((a, b) => a - b);
    
    const products = puzzle.grid
      .filter(cell => cell.operationType === "product")
      .map(cell => cell.resultValue)
      .sort((a, b) => a - b);
    
    console.log(`Lista completa: ${completeList.join(", ")}`);
    console.log(`Número más grande: ${largestNum} (aparece ${largestCount} veces)`);
    console.log(`maxSum calculado: ${maxSum}`);
    console.log();
    
    console.log(`Sumas (${sums.length}): ${sums.join(", ")}`);
    console.log(`Productos (${products.length}): ${products.join(", ")}`);
    console.log();
    
    // Verificar que todos los productos > maxSum
    const invalidProducts = products.filter(p => p <= maxSum);
    if (invalidProducts.length > 0) {
      console.log(`⚠️ ERROR: ${invalidProducts.length} productos ≤ maxSum:`);
      console.log(`   ${invalidProducts.join(", ")}`);
    } else {
      console.log(`✅ Todos los productos > maxSum`);
    }
    
    // Verificar que todas las sumas ≤ maxSum
    const invalidSums = sums.filter(s => s > maxSum);
    if (invalidSums.length > 0) {
      console.log(`⚠️ ERROR: ${invalidSums.length} sumas > maxSum:`);
      console.log(`   ${invalidSums.join(", ")}`);
    } else {
      console.log(`✅ Todas las sumas ≤ maxSum`);
    }
    
    // Verificar balance
    if (sums.length !== 8 || products.length !== 8) {
      console.log(`⚠️ ERROR: Balance incorrecto (${sums.length} sumas, ${products.length} productos)`);
    } else {
      console.log(`✅ Balance correcto (8 sumas, 8 productos)`);
    }
    
  } catch (error) {
    console.log(`❌ Error generando puzzle: ${error}`);
  }
}

console.log("\n=== FIN DEL ANÁLISIS ===");
