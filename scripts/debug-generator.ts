import { generateTetonorPuzzle } from "../lib/tetonor/generator";

const puzzle = generateTetonorPuzzle(5);

console.log("=== PAIRS ===");
puzzle.pairs.forEach((pair, i) => {
  console.log(`Pair ${i + 1}: (${pair.num1}, ${pair.num2}) → sum=${pair.sum}, product=${pair.product}`);
});

console.log("\n=== UNIQUE NUMBERS FROM PAIRS ===");
const uniqueFromPairs = new Set<number>();
puzzle.pairs.forEach(pair => {
  uniqueFromPairs.add(pair.num1);
  uniqueFromPairs.add(pair.num2);
});
console.log(`Count: ${uniqueFromPairs.size}`);
console.log(`Numbers: ${Array.from(uniqueFromPairs).sort((a, b) => a - b).join(", ")}`);

console.log("\n=== LIST ===");
const listNumbers = puzzle.list.map(item => item.value);
console.log(`Count: ${listNumbers.length}`);
console.log(`Numbers: ${listNumbers.join(", ")}`);

console.log("\n=== MISSING NUMBERS ===");
const missingNumbers: number[] = [];
uniqueFromPairs.forEach(num => {
  if (!listNumbers.includes(num)) {
    missingNumbers.push(num);
  }
});
console.log(`Missing: ${missingNumbers.join(", ") || "None"}`);
