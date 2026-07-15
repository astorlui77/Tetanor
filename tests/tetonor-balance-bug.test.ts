import { describe, it, expect } from "vitest";
import { generateTetonorPuzzle } from "../lib/tetonor/generator";

/**
 * Tests para verificar que el generador garantiza el balance 8 sumas + 8 productos
 * Bug reportado: algunos puzzles tenían resultados ambiguos (podían ser suma O producto)
 */
describe("Tetonor Generator - Balance 8+8", () => {
  it("debe garantizar que todos los productos sean > suma máxima posible", () => {
    // Generar 20 puzzles y verificar que todos cumplan la regla
    for (let i = 0; i < 20; i++) {
      const puzzle = generateTetonorPuzzle(5);
      
      // Extraer todos los números de la lista completa
      const allNumbers = puzzle.completeList.sort((a, b) => a - b);
      const uniqueNumbers = Array.from(new Set(allNumbers));
      
      // Calcular suma máxima posible considerando repeticiones
      const largestNum = uniqueNumbers[uniqueNumbers.length - 1];
      const largestCount = allNumbers.filter(n => n === largestNum).length;
      
      const maxSum = largestCount >= 2
        ? largestNum + largestNum
        : largestNum + uniqueNumbers[uniqueNumbers.length - 2];
      
      // Verificar que todos los productos sean > maxSum
      const products = puzzle.grid
        .filter(cell => cell.operationType === "product")
        .map(cell => cell.resultValue);
      
      products.forEach(product => {
        expect(product).toBeGreaterThan(maxSum);
      });
      
      // Verificar que haya exactamente 8 sumas y 8 productos
      const sums = puzzle.grid.filter(cell => cell.operationType === "sum");
      const prods = puzzle.grid.filter(cell => cell.operationType === "product");
      
      expect(sums.length).toBe(8);
      expect(prods.length).toBe(8);
    }
  });
  
  it("debe evitar resultados ambiguos como en el puzzle reportado", () => {
    // El puzzle reportado tenía:
    // Resultados: 43, 99, 714, 194, 680, 896, 65, 31, 54, 198, 672, 50, 60, 504, 306, 103
    // Lista visible: 2, 7, ?, 9, 14, ?, 20, 22, 28, 32, 34
    // Algunos resultados (43, 99, 65, 31, 54, 50, 60, 103) podían ser suma O producto
    
    // Generar 50 puzzles y verificar que ninguno tenga este problema
    for (let i = 0; i < 50; i++) {
      const puzzle = generateTetonorPuzzle(5);
      
      const allNumbers = puzzle.completeList.sort((a, b) => a - b);
      const uniqueNumbers = Array.from(new Set(allNumbers));
      
      const largestNum = uniqueNumbers[uniqueNumbers.length - 1];
      const largestCount = allNumbers.filter(n => n === largestNum).length;
      
      const maxSum = largestCount >= 2
        ? largestNum + largestNum
        : largestNum + uniqueNumbers[uniqueNumbers.length - 2];
      
      // Extraer sumas y productos
      const sums = puzzle.grid
        .filter(cell => cell.operationType === "sum")
        .map(cell => cell.resultValue);
      
      const products = puzzle.grid
        .filter(cell => cell.operationType === "product")
        .map(cell => cell.resultValue);
      
      // Verificar que no haya overlap: ninguna suma debe ser >= a ningún producto
      sums.forEach(sum => {
        expect(sum).toBeLessThanOrEqual(maxSum);
      });
      
      products.forEach(product => {
        expect(product).toBeGreaterThan(maxSum);
      });
      
      // Verificar que no haya ambigüedad: ningún resultado aparece como suma Y producto
      const sumSet = new Set(sums);
      const productSet = new Set(products);
      
      sums.forEach(sum => {
        expect(productSet.has(sum)).toBe(false);
      });
      
      products.forEach(product => {
        expect(sumSet.has(product)).toBe(false);
      });
    }
  });
  
  it("debe calcular correctamente maxSum cuando el número más grande se repite", () => {
    // Caso específico: si 34 aparece 2 veces, maxSum = 34 + 34 = 68
    // NO 34 + 32 = 66
    
    for (let i = 0; i < 30; i++) {
      const puzzle = generateTetonorPuzzle(5);
      
      const allNumbers = puzzle.completeList.sort((a, b) => a - b);
      const uniqueNumbers = Array.from(new Set(allNumbers));
      
      const largestNum = uniqueNumbers[uniqueNumbers.length - 1];
      const largestCount = allNumbers.filter(n => n === largestNum).length;
      
      if (largestCount >= 2) {
        // Si el más grande se repite, maxSum debe ser largestNum * 2
        const expectedMaxSum = largestNum + largestNum;
        
        const products = puzzle.grid
          .filter(cell => cell.operationType === "product")
          .map(cell => cell.resultValue);
        
        products.forEach(product => {
          expect(product).toBeGreaterThan(expectedMaxSum);
        });
      }
    }
  });
});
