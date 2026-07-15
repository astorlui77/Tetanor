import { describe, it, expect } from "vitest";
import { generateTetonorPuzzle, validateSolution } from "../lib/tetonor/generator";

describe("Tetonor Puzzle Generator", () => {
  it("should generate a puzzle with 16 grid cells", () => {
    const puzzle = generateTetonorPuzzle(5);
    expect(puzzle.grid).toHaveLength(16);
  });

  it("should generate exactly 8 pairs", () => {
    const puzzle = generateTetonorPuzzle(5);
    expect(puzzle.pairs).toHaveLength(8);
  });

  it("should have unique sums and products in the grid", () => {
    const puzzle = generateTetonorPuzzle(5);
    const results = puzzle.grid.map(cell => cell.resultValue);
    const uniqueResults = new Set(results);
    expect(uniqueResults.size).toBe(16);
  });

  it("should generate list in ascending order", () => {
    const puzzle = generateTetonorPuzzle(5);
    const listValues = puzzle.list
      .map(item => item.value)
      .filter((v): v is number => v !== null);
    
    for (let i = 1; i < listValues.length; i++) {
      expect(listValues[i]).toBeGreaterThanOrEqual(listValues[i - 1]);
    }
  });

  it("should have exactly 8 sum cells and 8 product cells", () => {
    const puzzle = generateTetonorPuzzle(5);
    const sumCells = puzzle.grid.filter(cell => cell.operationType === "sum");
    const productCells = puzzle.grid.filter(cell => cell.operationType === "product");
    
    expect(sumCells).toHaveLength(8);
    expect(productCells).toHaveLength(8);
  });

  it("should verify that each pair generates correct sum and product", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    puzzle.pairs.forEach(pair => {
      expect(pair.sum).toBe(pair.num1 + pair.num2);
      expect(pair.product).toBe(pair.num1 * pair.num2);
    });
  });

  it("should have all grid results matching pairs", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    const allResults = new Set<number>();
    puzzle.pairs.forEach(pair => {
      allResults.add(pair.sum);
      allResults.add(pair.product);
    });
    
    puzzle.grid.forEach(cell => {
      expect(allResults.has(cell.resultValue)).toBe(true);
    });
  });

  it("should hide correct number of list items based on difficulty", () => {
    const easyPuzzle = generateTetonorPuzzle(3);
    const mediumPuzzle = generateTetonorPuzzle(5);
    const hardPuzzle = generateTetonorPuzzle(7);
    
    const countHidden = (puzzle: typeof easyPuzzle) =>
      puzzle.list.filter(item => item.value === null).length;
    
    expect(countHidden(easyPuzzle)).toBe(3);
    expect(countHidden(mediumPuzzle)).toBe(5);
    expect(countHidden(hardPuzzle)).toBe(7);
  });
});

describe("Tetonor Validation", () => {
  it("should validate a correct solution", () => {
    const puzzle = generateTetonorPuzzle(3);
    
    // Completar la lista con valores correctos usando completeList
    puzzle.list.forEach((item, index) => {
      puzzle.list[index].value = puzzle.completeList[index];
    });
    
    // Completar la grilla con soluciones correctas
    puzzle.grid.forEach(cell => {
      cell.userNum1 = cell.correctNum1;
      cell.userNum2 = cell.correctNum2;
      cell.userOperation = cell.operationType;
    });
    
    const result = validateSolution(puzzle);
    if (!result.isValid) {
      console.log("Validation errors:", result.errors);
    }
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should detect incomplete list", () => {
    const puzzle = generateTetonorPuzzle(3);
    
    // Dejar algunos valores de la lista como null
    const result = validateSolution(puzzle);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should detect incorrect operations", () => {
    const puzzle = generateTetonorPuzzle(3);
    
    // Completar la lista
    puzzle.list.forEach((item, index) => {
      if (item.value === null) {
        const allNumbers = new Set<number>();
        puzzle.pairs.forEach(pair => {
          allNumbers.add(pair.num1);
          allNumbers.add(pair.num2);
        });
        const sortedNumbers = Array.from(allNumbers).sort((a, b) => a - b);
        puzzle.list[index].value = sortedNumbers[index];
      }
    });
    
    // Completar la grilla con operación incorrecta
    puzzle.grid[0].userNum1 = puzzle.grid[0].correctNum1;
    puzzle.grid[0].userNum2 = puzzle.grid[0].correctNum2;
    puzzle.grid[0].userOperation = puzzle.grid[0].operationType === "sum" ? "product" : "sum";
    
    const result = validateSolution(puzzle);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should detect numbers not in list", () => {
    const puzzle = generateTetonorPuzzle(3);
    
    // Completar la lista
    puzzle.list.forEach((item, index) => {
      if (item.value === null) {
        puzzle.list[index].value = 1;
      }
    });
    
    // Usar números que no están en la lista
    puzzle.grid[0].userNum1 = 999;
    puzzle.grid[0].userNum2 = 888;
    puzzle.grid[0].userOperation = "sum";
    
    const result = validateSolution(puzzle);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should detect wrong calculation", () => {
    const puzzle = generateTetonorPuzzle(3);
    
    // Completar la lista
    puzzle.list.forEach((item, index) => {
      if (item.value === null) {
        const allNumbers = new Set<number>();
        puzzle.pairs.forEach(pair => {
          allNumbers.add(pair.num1);
          allNumbers.add(pair.num2);
        });
        const sortedNumbers = Array.from(allNumbers).sort((a, b) => a - b);
        puzzle.list[index].value = sortedNumbers[index];
      }
    });
    
    // Poner números que no dan el resultado correcto
    const listValues = puzzle.list.map(item => item.value!);
    puzzle.grid[0].userNum1 = listValues[0];
    puzzle.grid[0].userNum2 = listValues[1];
    puzzle.grid[0].userOperation = "sum";
    
    // Si la suma no coincide con el resultado, debe dar error
    const calculatedSum = listValues[0] + listValues[1];
    if (calculatedSum !== puzzle.grid[0].resultValue) {
      const result = validateSolution(puzzle);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });
});
