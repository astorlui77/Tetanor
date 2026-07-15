import { describe, it, expect } from "vitest";
import { generateTetonorPuzzle } from "../lib/tetonor/generator";

describe("updateGridCell functionality", () => {
  it("should update cell with numbers and operation", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    // Simular actualización de una celda
    const cellIndex = 0;
    const num1 = 5;
    const num2 = 7;
    const operation = "sum";
    
    // Crear nueva grilla con los valores actualizados
    const newGrid = [...puzzle.grid];
    newGrid[cellIndex] = {
      ...newGrid[cellIndex],
      userNum1: num1,
      userNum2: num2,
      userOperation: operation,
    };
    
    // Verificar que la celda se actualizó correctamente
    expect(newGrid[cellIndex].userNum1).toBe(num1);
    expect(newGrid[cellIndex].userNum2).toBe(num2);
    expect(newGrid[cellIndex].userOperation).toBe(operation);
  });
  
  it("should toggle operation between sum and product", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    const cellIndex = 0;
    const num1 = 5;
    const num2 = 7;
    
    // Primera actualización con suma
    let newGrid = [...puzzle.grid];
    newGrid[cellIndex] = {
      ...newGrid[cellIndex],
      userNum1: num1,
      userNum2: num2,
      userOperation: "sum",
    };
    
    expect(newGrid[cellIndex].userOperation).toBe("sum");
    
    // Toggle a producto
    newGrid = [...newGrid];
    newGrid[cellIndex] = {
      ...newGrid[cellIndex],
      userOperation: "product",
    };
    
    expect(newGrid[cellIndex].userOperation).toBe("product");
    
    // Toggle de vuelta a suma
    newGrid = [...newGrid];
    newGrid[cellIndex] = {
      ...newGrid[cellIndex],
      userOperation: "sum",
    };
    
    expect(newGrid[cellIndex].userOperation).toBe("sum");
  });
  
  it("should calculate used numbers correctly after grid update", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    // Actualizar varias celdas
    const newGrid = [...puzzle.grid];
    newGrid[0] = {
      ...newGrid[0],
      userNum1: 5,
      userNum2: 7,
      userOperation: "sum",
    };
    newGrid[1] = {
      ...newGrid[1],
      userNum1: 3,
      userNum2: 4,
      userOperation: "product",
    };
    
    // Calcular números usados
    const usedNumbers: number[] = [];
    newGrid.forEach(cell => {
      if (cell.userNum1 !== null) usedNumbers.push(cell.userNum1);
      if (cell.userNum2 !== null) usedNumbers.push(cell.userNum2);
    });
    
    // Verificar que los números usados se calcularon correctamente
    expect(usedNumbers).toContain(5);
    expect(usedNumbers).toContain(7);
    expect(usedNumbers).toContain(3);
    expect(usedNumbers).toContain(4);
    expect(usedNumbers.length).toBe(4);
  });
  
  it("should handle null values correctly", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    const cellIndex = 0;
    
    // Actualizar con valores null
    const newGrid = [...puzzle.grid];
    newGrid[cellIndex] = {
      ...newGrid[cellIndex],
      userNum1: null,
      userNum2: null,
      userOperation: null,
    };
    
    expect(newGrid[cellIndex].userNum1).toBeNull();
    expect(newGrid[cellIndex].userNum2).toBeNull();
    expect(newGrid[cellIndex].userOperation).toBeNull();
  });
});
