import { describe, it, expect } from "vitest";
import { generateTetonorPuzzle } from "../lib/tetonor/generator";

describe("Tetonor Puzzle Solvability", () => {
  it("should generate solvable puzzles - all numbers in pairs are in the list", () => {
    // Generar múltiples puzzles para verificar consistencia
    for (let i = 0; i < 10; i++) {
      const puzzle = generateTetonorPuzzle(5);
      
      // Obtener la lista completa (sin ocultar)
      const allListNumbers: number[] = [];
      puzzle.pairs.forEach(pair => {
        allListNumbers.push(pair.num1);
        allListNumbers.push(pair.num2);
      });
      
      // Contar ocurrencias en la lista generada
      const listCounts = new Map<number, number>();
      puzzle.list.forEach(item => {
        if (item.value !== null) {
          listCounts.set(item.value, (listCounts.get(item.value) || 0) + 1);
        }
      });
      
      // Verificar que cada número usado en los pares esté en la lista
      const pairNumberCounts = new Map<number, number>();
      puzzle.pairs.forEach(pair => {
        pairNumberCounts.set(pair.num1, (pairNumberCounts.get(pair.num1) || 0) + 1);
        pairNumberCounts.set(pair.num2, (pairNumberCounts.get(pair.num2) || 0) + 1);
      });
      
      // La lista completa debe tener 16 números
      expect(puzzle.list).toHaveLength(16);
      
      // Cada número de los pares debe estar en la lista (considerando números ocultos)
      pairNumberCounts.forEach((count, num) => {
        const inList = puzzle.list.filter(item => item.value === num).length;
        const hiddenCount = puzzle.list.filter(item => item.value === null).length;
        
        // El número debe estar visible O podría estar oculto
        expect(inList + hiddenCount).toBeGreaterThanOrEqual(count);
      });
    }
  });
  
  it("should have all grid numbers derivable from pairs", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    // Verificar que cada número en la grilla viene de un par
    puzzle.grid.forEach(cell => {
      const matchingPair = puzzle.pairs.find(pair => 
        (pair.sum === cell.resultValue && cell.operationType === "sum") ||
        (pair.product === cell.resultValue && cell.operationType === "product")
      );
      
      expect(matchingPair).toBeDefined();
      expect(cell.correctNum1).toBe(matchingPair!.num1);
      expect(cell.correctNum2).toBe(matchingPair!.num2);
    });
  });
  
  it("should have exactly 8 pairs with both sum and product in grid", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    expect(puzzle.pairs).toHaveLength(8);
    
    // Verificar que cada par tiene su suma Y producto en la grilla
    puzzle.pairs.forEach(pair => {
      const hasSum = puzzle.grid.some(cell => 
        cell.resultValue === pair.sum && cell.operationType === "sum"
      );
      const hasProduct = puzzle.grid.some(cell => 
        cell.resultValue === pair.product && cell.operationType === "product"
      );
      
      expect(hasSum).toBe(true);
      expect(hasProduct).toBe(true);
    });
  });
  
  it("should generate puzzles with number variety", () => {
    const puzzle = generateTetonorPuzzle(7);
    
    // Verificar que hay variedad en los números de la grilla
    const gridNumbers = puzzle.grid.map(cell => cell.resultValue);
    const minGrid = Math.min(...gridNumbers);
    const maxGrid = Math.max(...gridNumbers);
    
    // Debe haber un rango significativo
    expect(maxGrid - minGrid).toBeGreaterThan(20);
    
    // Debe haber al menos algunos números grandes (productos)
    const largeNumbers = gridNumbers.filter(n => n > 100);
    expect(largeNumbers.length).toBeGreaterThan(0);
  });
  
  it("should allow repeated numbers in list", () => {
    // Generar varios puzzles y verificar que algunos tienen repeticiones
    let hasRepetitions = false;
    
    for (let i = 0; i < 20; i++) {
      const puzzle = generateTetonorPuzzle(5);
      const visibleNumbers = puzzle.list.filter(item => item.value !== null).map(item => item.value!);
      const uniqueNumbers = new Set(visibleNumbers);
      
      if (visibleNumbers.length > uniqueNumbers.size) {
        hasRepetitions = true;
        break;
      }
    }
    
    expect(hasRepetitions).toBe(true);
  });
  
  it("should maintain ascending order in list", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    const visibleNumbers = puzzle.list
      .map((item, index) => ({ value: item.value, index }))
      .filter(item => item.value !== null);
    
    // Verificar orden ascendente
    for (let i = 1; i < visibleNumbers.length; i++) {
      expect(visibleNumbers[i].value!).toBeGreaterThanOrEqual(visibleNumbers[i - 1].value!);
    }
  });
  
  it("should hide correct number of items based on difficulty", () => {
    const easyPuzzle = generateTetonorPuzzle(3);
    const mediumPuzzle = generateTetonorPuzzle(5);
    const hardPuzzle = generateTetonorPuzzle(7);
    
    const easyHidden = easyPuzzle.list.filter(item => item.value === null).length;
    const mediumHidden = mediumPuzzle.list.filter(item => item.value === null).length;
    const hardHidden = hardPuzzle.list.filter(item => item.value === null).length;
    
    expect(easyHidden).toBe(3);
    expect(mediumHidden).toBe(5);
    expect(hardHidden).toBe(7);
  });
  
  it("should be solvable - complete solution test", () => {
    const puzzle = generateTetonorPuzzle(3);
    
    // Usar la lista completa del puzzle
    const completeList = puzzle.completeList;
    
    // Completar la lista del puzzle con los valores correctos
    puzzle.list.forEach((item, index) => {
      puzzle.list[index].value = completeList[index];
    });
    
    // Completar la grilla con las soluciones correctas
    puzzle.grid.forEach(cell => {
      cell.userNum1 = cell.correctNum1;
      cell.userNum2 = cell.correctNum2;
      cell.userOperation = cell.operationType;
    });
    
    // Verificar que cada número usado está en la lista
    puzzle.grid.forEach(cell => {
      const count1 = completeList.filter(n => n === cell.correctNum1).length;
      const count2 = completeList.filter(n => n === cell.correctNum2).length;
      
      expect(count1).toBeGreaterThan(0);
      expect(count2).toBeGreaterThan(0);
    });
  });
});
