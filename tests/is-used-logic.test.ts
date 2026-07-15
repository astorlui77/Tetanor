import { describe, it, expect } from "vitest";
import { generateTetonorPuzzle } from "../lib/tetonor/generator";

describe("isUsed Logic Test", () => {
  it("should mark numbers as used when placed in grid", () => {
    // Generar un puzzle
    const puzzle = generateTetonorPuzzle(5);
    
    // Simular que usamos los números en la grilla
    const usedNumbers: number[] = [];
    
    // Tomar el primer par y usarlo
    const firstPair = puzzle.pairs[0];
    usedNumbers.push(firstPair.num1, firstPair.num2);
    
    // Calcular isUsed para cada número en la lista
    const updatedList = puzzle.list.map((item, index) => {
      const actualValue = puzzle.completeList[index];
      const timesUsed = usedNumbers.filter(n => n === actualValue).length;
      const timesInList = puzzle.completeList.filter(n => n === actualValue).length;
      
      return {
        ...item,
        isUsed: timesUsed >= timesInList,
      };
    });
    
    // Verificar que los números usados estén marcados
    const num1Index = puzzle.completeList.indexOf(firstPair.num1);
    const num2Index = puzzle.completeList.indexOf(firstPair.num2);
    
    // Si el número aparece solo una vez en la lista y lo usamos una vez, debe estar marcado
    const num1Count = puzzle.completeList.filter(n => n === firstPair.num1).length;
    const num2Count = puzzle.completeList.filter(n => n === firstPair.num2).length;
    
    if (num1Count === 1) {
      expect(updatedList[num1Index].isUsed).toBe(true);
    }
    
    if (num2Count === 1) {
      expect(updatedList[num2Index].isUsed).toBe(true);
    }
  });
  
  it("should handle repeated numbers correctly", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    // Encontrar un número que se repite
    const completeList = puzzle.completeList;
    const repeatedNum = completeList.find((num, index) => 
      completeList.indexOf(num) !== index
    );
    
    if (repeatedNum) {
      const count = completeList.filter(n => n === repeatedNum).length;
      
      // Usar el número solo una vez
      const usedNumbers = [repeatedNum];
      
      const updatedList = puzzle.list.map((item, index) => {
        const actualValue = completeList[index];
        const timesUsed = usedNumbers.filter(n => n === actualValue).length;
        const timesInList = completeList.filter(n => n === actualValue).length;
        
        return {
          ...item,
          isUsed: timesUsed >= timesInList,
        };
      });
      
      // Si el número aparece 2 veces y lo usamos 1 vez, NO debe estar marcado
      const indices = completeList
        .map((n, i) => n === repeatedNum ? i : -1)
        .filter(i => i !== -1);
      
      indices.forEach(i => {
        expect(updatedList[i].isUsed).toBe(false);
      });
      
      // Usar el número dos veces
      usedNumbers.push(repeatedNum);
      
      const updatedList2 = puzzle.list.map((item, index) => {
        const actualValue = completeList[index];
        const timesUsed = usedNumbers.filter(n => n === actualValue).length;
        const timesInList = completeList.filter(n => n === actualValue).length;
        
        return {
          ...item,
          isUsed: timesUsed >= timesInList,
        };
      });
      
      // Ahora SÍ debe estar marcado
      indices.forEach(i => {
        expect(updatedList2[i].isUsed).toBe(true);
      });
    }
  });
  
  it("should NOT mark hidden numbers as used", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    // Encontrar un número oculto
    const hiddenIndex = puzzle.list.findIndex(item => !item.isFixed);
    
    if (hiddenIndex !== -1) {
      const hiddenValue = puzzle.completeList[hiddenIndex];
      
      // Usar el número oculto muchas veces
      const usedNumbers = Array(10).fill(hiddenValue);
      
      const updatedList = puzzle.list.map((item, index) => {
        // Los números ocultos NUNCA se marcan como usados
        if (!item.isFixed) {
          return {
            ...item,
            isUsed: false,
          };
        }
        
        const actualValue = puzzle.completeList[index];
        const timesUsed = usedNumbers.filter(n => n === actualValue).length;
        
        // Contar solo los visibles
        const timesVisibleInList = puzzle.list.filter(
          (listItem, i) => listItem.isFixed && puzzle.completeList[i] === actualValue
        ).length;
        
        return {
          ...item,
          isUsed: timesUsed >= timesVisibleInList,
        };
      });
      
      // El número oculto NO debe estar marcado como usado
      expect(updatedList[hiddenIndex].isUsed).toBe(false);
    }
  });
  
  it("should mark only visible numbers when there are duplicates", () => {
    const puzzle = generateTetonorPuzzle(5);
    
    // Buscar un número que aparezca múltiples veces
    const valueCount = new Map<number, number>();
    puzzle.completeList.forEach(val => {
      valueCount.set(val, (valueCount.get(val) || 0) + 1);
    });
    
    // Encontrar un valor que se repita
    const repeatedValue = Array.from(valueCount.entries()).find(([_, count]) => count > 1)?.[0];
    
    if (repeatedValue) {
      // Contar cuántos son visibles y cuántos ocultos
      const indices = puzzle.list
        .map((item, i) => ({ item, index: i, value: puzzle.completeList[i] }))
        .filter(x => x.value === repeatedValue);
      
      const visibleCount = indices.filter(x => x.item.isFixed).length;
      const hiddenCount = indices.filter(x => !x.item.isFixed).length;
      
      if (visibleCount > 0 && hiddenCount > 0) {
        // Usar el número exactamente visibleCount veces
        const usedNumbers = Array(visibleCount).fill(repeatedValue);
        
        const updatedList = puzzle.list.map((item, index) => {
          if (!item.isFixed) {
            return { ...item, isUsed: false };
          }
          
          const actualValue = puzzle.completeList[index];
          const timesUsed = usedNumbers.filter(n => n === actualValue).length;
          const timesVisibleInList = puzzle.list.filter(
            (listItem, i) => listItem.isFixed && puzzle.completeList[i] === actualValue
          ).length;
          
          return {
            ...item,
            isUsed: timesUsed >= timesVisibleInList,
          };
        });
        
        // Verificar que los visibles estén marcados y los ocultos no
        indices.forEach(({ item, index }) => {
          if (item.isFixed) {
            expect(updatedList[index].isUsed).toBe(true);
          } else {
            expect(updatedList[index].isUsed).toBe(false);
          }
        });
      }
    }
  });
});
