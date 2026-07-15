import { generateTetonorPuzzle } from "../lib/tetonor/generator";

console.log("Generando puzzle...");
const puzzle = generateTetonorPuzzle(5);

console.log("\n=== INFORMACIÓN DEL PUZZLE ===");
console.log(`Lista completa length: ${puzzle.completeList.length}`);
console.log(`Lista (con ocultos) length: ${puzzle.list.length}`);
console.log(`Números ocultos: ${puzzle.hiddenCount}`);

console.log("\n=== LISTA COMPLETA ===");
console.log(puzzle.completeList);

console.log("\n=== LISTA (con ocultos) ===");
puzzle.list.forEach((item, i) => {
  console.log(`[${i}] value: ${item.value}, isFixed: ${item.isFixed}, isUsed: ${item.isUsed}`);
});
