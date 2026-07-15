import { describe, it, expect } from "vitest";

/**
 * Tests para verificar que los números repetidos se marquen correctamente
 * 
 * Escenario: Si hay dos números 14 en el banco (ambos visibles)
 * - Usar 14 una vez → solo 1 debe marcarse en rojo
 * - Usar 14 dos veces → ambos deben marcarse en rojo
 * - Usar 14 tres veces → ambos deben marcarse en rojo (no hay más)
 */

describe("Marcado de números repetidos", () => {
  it("debe marcar solo un número cuando se usa una vez", () => {
    // Simular: dos 14 en el banco, usar 14 una vez
    const completeList = [14, 14, 33];
    const list = [
      { value: 14, isFixed: true, isUsed: false },
      { value: 14, isFixed: true, isUsed: false },
      { value: 33, isFixed: true, isUsed: false },
    ];
    
    // Números usados en la grilla
    const usedNumbers = [14];
    
    // Contar cuántas veces se usa cada número
    const usedCount: Record<number, number> = {};
    usedNumbers.forEach(num => {
      usedCount[num] = (usedCount[num] || 0) + 1;
    });
    
    // Marcar números
    const markedCount: Record<number, number> = {};
    const newList = list.map((item, index) => {
      if (!item.isFixed) return { ...item, isUsed: false };
      
      const actualValue = completeList[index];
      if (!markedCount[actualValue]) {
        markedCount[actualValue] = 0;
      }
      
      const shouldMark = markedCount[actualValue] < (usedCount[actualValue] || 0);
      if (shouldMark) {
        markedCount[actualValue]++;
      }
      
      return { ...item, isUsed: shouldMark };
    });
    
    // Verificar: solo el primer 14 debe estar marcado
    expect(newList[0].isUsed).toBe(true);
    expect(newList[1].isUsed).toBe(false);
    expect(newList[2].isUsed).toBe(false);
  });

  it("debe marcar ambos números cuando se usan dos veces", () => {
    const completeList = [14, 14, 33];
    const list = [
      { value: 14, isFixed: true, isUsed: false },
      { value: 14, isFixed: true, isUsed: false },
      { value: 33, isFixed: true, isUsed: false },
    ];
    
    const usedNumbers = [14, 14];
    
    const usedCount: Record<number, number> = {};
    usedNumbers.forEach(num => {
      usedCount[num] = (usedCount[num] || 0) + 1;
    });
    
    const markedCount: Record<number, number> = {};
    const newList = list.map((item, index) => {
      if (!item.isFixed) return { ...item, isUsed: false };
      
      const actualValue = completeList[index];
      if (!markedCount[actualValue]) {
        markedCount[actualValue] = 0;
      }
      
      const shouldMark = markedCount[actualValue] < (usedCount[actualValue] || 0);
      if (shouldMark) {
        markedCount[actualValue]++;
      }
      
      return { ...item, isUsed: shouldMark };
    });
    
    // Verificar: ambos 14 deben estar marcados
    expect(newList[0].isUsed).toBe(true);
    expect(newList[1].isUsed).toBe(true);
    expect(newList[2].isUsed).toBe(false);
  });

  it("debe marcar solo la cantidad disponible cuando se usan más veces", () => {
    const completeList = [14, 14, 33];
    const list = [
      { value: 14, isFixed: true, isUsed: false },
      { value: 14, isFixed: true, isUsed: false },
      { value: 33, isFixed: true, isUsed: false },
    ];
    
    // Usar 14 tres veces (pero solo hay dos en el banco)
    const usedNumbers = [14, 14, 14];
    
    const usedCount: Record<number, number> = {};
    usedNumbers.forEach(num => {
      usedCount[num] = (usedCount[num] || 0) + 1;
    });
    
    const markedCount: Record<number, number> = {};
    const newList = list.map((item, index) => {
      if (!item.isFixed) return { ...item, isUsed: false };
      
      const actualValue = completeList[index];
      if (!markedCount[actualValue]) {
        markedCount[actualValue] = 0;
      }
      
      const shouldMark = markedCount[actualValue] < (usedCount[actualValue] || 0);
      if (shouldMark) {
        markedCount[actualValue]++;
      }
      
      return { ...item, isUsed: shouldMark };
    });
    
    // Verificar: ambos 14 deben estar marcados (no hay más)
    expect(newList[0].isUsed).toBe(true);
    expect(newList[1].isUsed).toBe(true);
    expect(newList[2].isUsed).toBe(false);
  });

  it("debe marcar correctamente con múltiples números repetidos", () => {
    const completeList = [5, 5, 14, 14, 33];
    const list = [
      { value: 5, isFixed: true, isUsed: false },
      { value: 5, isFixed: true, isUsed: false },
      { value: 14, isFixed: true, isUsed: false },
      { value: 14, isFixed: true, isUsed: false },
      { value: 33, isFixed: true, isUsed: false },
    ];
    
    // Usar: 5 una vez, 14 dos veces, 33 una vez
    const usedNumbers = [5, 14, 14, 33];
    
    const usedCount: Record<number, number> = {};
    usedNumbers.forEach(num => {
      usedCount[num] = (usedCount[num] || 0) + 1;
    });
    
    const markedCount: Record<number, number> = {};
    const newList = list.map((item, index) => {
      if (!item.isFixed) return { ...item, isUsed: false };
      
      const actualValue = completeList[index];
      if (!markedCount[actualValue]) {
        markedCount[actualValue] = 0;
      }
      
      const shouldMark = markedCount[actualValue] < (usedCount[actualValue] || 0);
      if (shouldMark) {
        markedCount[actualValue]++;
      }
      
      return { ...item, isUsed: shouldMark };
    });
    
    // Verificar: solo 1 de los 5, ambos 14, y el 33
    expect(newList[0].isUsed).toBe(true);  // primer 5
    expect(newList[1].isUsed).toBe(false); // segundo 5
    expect(newList[2].isUsed).toBe(true);  // primer 14
    expect(newList[3].isUsed).toBe(true);  // segundo 14
    expect(newList[4].isUsed).toBe(true);  // 33
  });
});
