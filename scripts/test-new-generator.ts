import { generateTetonorPuzzle } from "../lib/tetonor/generator";

console.log("=== Probando el nuevo generador de Tetonor ===\n");

// Generar 3 puzzles con diferentes cantidades de números ocultos
for (const hiddenCount of [3, 5, 7]) {
  console.log(`\n--- Puzzle con ${hiddenCount} números ocultos ---`);
  
  const puzzle = generateTetonorPuzzle(hiddenCount);
  
  console.log("\nLista completa de números:");
  console.log(puzzle.completeList.join(", "));
  
  console.log("\nLista con números ocultos:");
  const listDisplay = puzzle.list.map(item => 
    item.value === null ? "___" : item.value.toString()
  ).join(", ");
  console.log(listDisplay);
  
  console.log("\nPares generados:");
  puzzle.pairs.forEach((pair, i) => {
    console.log(`  Par ${i + 1}: (${pair.num1}, ${pair.num2}) → suma=${pair.sum}, producto=${pair.product}`);
  });
  
  console.log("\nGrilla de resultados:");
  const gridValues = puzzle.grid.map(cell => cell.resultValue);
  for (let i = 0; i < 4; i++) {
    const row = gridValues.slice(i * 4, (i + 1) * 4);
    console.log(`  ${row.map(v => v.toString().padStart(4)).join(" ")}`);
  }
  
  console.log("\n" + "=".repeat(50));
}
