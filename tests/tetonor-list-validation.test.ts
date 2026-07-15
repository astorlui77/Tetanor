import { describe, it, expect } from "vitest";
import { generateTetonorPuzzle } from "../lib/tetonor/generator";

describe("Tetonor List Validation", () => {
  it("should ensure all pair numbers are in the list", () => {
    // Generate multiple puzzles to test
    for (let i = 0; i < 20; i++) {
      const puzzle = generateTetonorPuzzle(5);
      
      // Use the complete list (including hidden numbers)
      const listNumbers = puzzle.completeList;
      
      // For each pair, verify both numbers are in the list
      puzzle.pairs.forEach((pair, index) => {
        const hasNum1 = listNumbers.includes(pair.num1);
        const hasNum2 = listNumbers.includes(pair.num2);
        
        expect(hasNum1, `Pair ${index + 1}: num1 (${pair.num1}) should be in list`).toBe(true);
        expect(hasNum2, `Pair ${index + 1}: num2 (${pair.num2}) should be in list`).toBe(true);
      });
    }
  });

  it("should not create puzzles with impossible results", () => {
    for (let i = 0; i < 20; i++) {
      const puzzle = generateTetonorPuzzle(5);
      
      // Get all numbers from complete list (including hidden)
      const listNumbers = puzzle.completeList;
      const maxListNumber = Math.max(...listNumbers);
      const maxPossibleSum = maxListNumber * 2;
      
      // Check grid results
      puzzle.grid.forEach((cell, index) => {
        // If a number is greater than max possible sum, it MUST be a product
        if (cell.resultValue > maxPossibleSum) {
          // Verify this is indeed a product from the pairs
          const isProduct = puzzle.pairs.some(p => p.product === cell.resultValue);
          expect(isProduct, `Cell ${index + 1}: ${cell.resultValue} > ${maxPossibleSum} but is not a product`).toBe(true);
          
          // Verify the factors are in the list
          const pair = puzzle.pairs.find(p => p.product === cell.resultValue);
          if (pair) {
            const allListNumbers = puzzle.completeList;
            const hasNum1 = allListNumbers.includes(pair.num1);
            const hasNum2 = allListNumbers.includes(pair.num2);
            
            expect(hasNum1, `Product ${cell.resultValue} = ${pair.num1} × ${pair.num2}, but ${pair.num1} not in list`).toBe(true);
            expect(hasNum2, `Product ${cell.resultValue} = ${pair.num1} × ${pair.num2}, but ${pair.num2} not in list`).toBe(true);
          }
        }
      });
    }
  });

  it("should have at most 16 unique numbers across all pairs", () => {
    for (let i = 0; i < 20; i++) {
      const puzzle = generateTetonorPuzzle(5);
      
      // Collect all unique numbers from pairs
      const uniqueNumbers = new Set<number>();
      puzzle.pairs.forEach(pair => {
        uniqueNumbers.add(pair.num1);
        uniqueNumbers.add(pair.num2);
      });
      
      expect(uniqueNumbers.size, `Should have at most 16 unique numbers, but got ${uniqueNumbers.size}`).toBeLessThanOrEqual(16);
    }
  });

  it("should have exactly 16 numbers in the list", () => {
    for (let i = 0; i < 20; i++) {
      const puzzle = generateTetonorPuzzle(5);
      expect(puzzle.list.length).toBe(16);
    }
  });

  it("should have list in ascending order", () => {
    for (let i = 0; i < 20; i++) {
      const puzzle = generateTetonorPuzzle(5);
      
      const listNumbers = puzzle.list.map(item => item.value).filter(v => v !== null) as number[];
      
      for (let j = 0; j < listNumbers.length - 1; j++) {
        expect(listNumbers[j], `List should be ascending: ${listNumbers[j]} should be <= ${listNumbers[j + 1]}`).toBeLessThanOrEqual(listNumbers[j + 1]);
      }
    }
  });
});
