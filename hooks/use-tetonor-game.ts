import { useState, useCallback, useEffect } from "react";
import type { GameState, TetonorPuzzle, OperationType } from "@/lib/tetonor/types";
import { generateTetonorPuzzle, validateSolution } from "@/lib/tetonor/generator";

export function useTetonorGame(hiddenCount: number = 5) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0); // Tiempo acumulado antes de pausar

  // Iniciar un nuevo juego
  const startNewGame = useCallback(() => {
    const puzzle = generateTetonorPuzzle(hiddenCount);
    
    const newGameState: GameState = {
      puzzle,
      startTime: Date.now(),
      endTime: null,
      isComplete: false,
      isCorrect: false,
    };
    
    setGameState(newGameState);
    setElapsedTime(0);
  }, [hiddenCount]);

  // Actualizar un valor en la lista
  const updateListValue = useCallback((index: number, value: number | null) => {
    setGameState(prevState => {
      if (!prevState) return prevState;
      
      const newList = [...prevState.puzzle.list];
      newList[index] = { ...newList[index], value };
      
      return {
        ...prevState,
        puzzle: {
          ...prevState.puzzle,
          list: newList,
        },
      };
    });
  }, []);

  // Actualizar los valores de una celda de la grilla (los dos números y la operación)
  const updateGridCell = useCallback(
    (cellIndex: number, num1: number | null, num2: number | null, operation: OperationType | null) => {
      setGameState(prevState => {
        if (!prevState) return prevState;
        
        // Crear nueva grilla con los valores actualizados
        const newGrid = [...prevState.puzzle.grid];
        newGrid[cellIndex] = {
          ...newGrid[cellIndex],
          userNum1: num1,
          userNum2: num2,
          userOperation: operation,
        };
        
        // Calcular qué números están siendo usados en la grilla
        const usedNumbers: number[] = [];
        newGrid.forEach(cell => {
          if (cell.userNum1 !== null) usedNumbers.push(cell.userNum1);
          if (cell.userNum2 !== null) usedNumbers.push(cell.userNum2);
        });
        
        // Actualizar isUsed en la lista
        // Para números repetidos, marcar solo la cantidad exacta que se usa
        const usedCount: Record<number, number> = {}; // Cuántas veces se usa cada número
        const markedCount: Record<number, number> = {}; // Cuántos ya marcamos
        
        // Contar cuántas veces se usa cada número en la grilla
        usedNumbers.forEach(num => {
          usedCount[num] = (usedCount[num] || 0) + 1;
        });
        
        const newList = prevState.puzzle.list.map((item, index) => {
          // Los números ocultos (isFixed=false) NUNCA se marcan como usados
          // Esto evita revelar su valor al jugador
          if (!item.isFixed) {
            return {
              ...item,
              isUsed: false,
            };
          }
          
          // Para números visibles, obtener el valor real
          const actualValue = prevState.puzzle.completeList[index];
          
          // Inicializar contador si no existe
          if (!markedCount[actualValue]) {
            markedCount[actualValue] = 0;
          }
          
          // Marcar solo si aún no hemos marcado suficientes de este número
          const shouldMark = markedCount[actualValue] < (usedCount[actualValue] || 0);
          
          if (shouldMark) {
            markedCount[actualValue]++;
          }
          
          return {
            ...item,
            isUsed: shouldMark,
          };
        });
        
        return {
          ...prevState,
          puzzle: {
            ...prevState.puzzle,
            grid: newGrid,
            list: newList,
          },
        };
      });
    },
    []
  );

  // Verificar la solución
  const checkSolution = useCallback(() => {
    if (!gameState) return { isValid: false, errors: ["No hay juego activo"], cellErrors: [] };
    
    const result = validateSolution(gameState.puzzle);
    
    if (result.isValid) {
      setGameState(prevState => {
        if (!prevState) return prevState;
        
        return {
          ...prevState,
          endTime: Date.now(),
          isComplete: true,
          isCorrect: true,
        };
      });
    }
    
    return result;
  }, [gameState]);

  // Obtener una pista
  const getHint = useCallback(() => {
    if (!gameState) return null;
    // Las pistas ahora se manejan con el sistema de pistas progresivas
    return null;
  }, [gameState]);

  // Reiniciar el juego actual
  const resetGame = useCallback(() => {
    setGameState(prevState => {
      if (!prevState) return prevState;
      
      // Resetear todas las entradas del usuario en la grilla
      const resetGrid = prevState.puzzle.grid.map(cell => ({
        ...cell,
        userNum1: null,
        userNum2: null,
        userOperation: null,
      }));
      
      // Resetear los valores ingresados en números ocultos de la lista
      const resetList = prevState.puzzle.list.map(item => ({
        ...item,
        value: item.isFixed ? item.value : null,
        isUsed: false,
      }));
      
      return {
        ...prevState,
        puzzle: {
          ...prevState.puzzle,
          grid: resetGrid,
          list: resetList,
        },
        startTime: Date.now(),
        endTime: null,
        isComplete: false,
        isCorrect: false,
      };
    });
    setElapsedTime(0);
    setIsPaused(false);
  }, [gameState]);

  // Pausar/reanudar el juego
  const togglePause = useCallback(() => {
    if (!gameState || gameState.isComplete) return;
    
    if (isPaused) {
      // Reanudar: ajustar startTime para que el tiempo pausado no cuente
      const pauseDuration = Date.now() - pausedTime;
      setGameState({
        ...gameState,
        startTime: gameState.startTime + pauseDuration,
      });
    } else {
      // Pausar: guardar el tiempo actual
      setPausedTime(Date.now());
    }
    
    setIsPaused(!isPaused);
  }, [gameState, isPaused, pausedTime]);

  // Actualizar el tiempo transcurrido
  useEffect(() => {
    if (!gameState || gameState.isComplete || isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameState.startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isPaused])

  // Calcular el tiempo total cuando el juego termina
  const totalTime = gameState?.endTime
    ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
    : elapsedTime;

  return {
    gameState,
    elapsedTime: totalTime,
    isPaused,
    startNewGame,
    updateListValue,
    updateGridCell,
    checkSolution,
    getHint,
    resetGame,
    togglePause,
  };
}
