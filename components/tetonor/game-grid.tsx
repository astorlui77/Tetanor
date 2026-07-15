import { View, Text } from "react-native";
import { ResultCell } from "./result-cell";
import type { GridCell, OperationType } from "@/lib/tetonor/types";

interface GameGridProps {
  grid: GridCell[];
  cellErrors?: boolean[];
  onCellUpdate: (
    cellIndex: number,
    num1: number | null,
    num2: number | null,
    operation: OperationType | null
  ) => void;
}

export function GameGrid({ grid, cellErrors = [], onCellUpdate }: GameGridProps) {
  return (
    <View className="w-full">
      <Text className="text-sm font-medium text-muted mb-3 text-center">
        Grilla de Resultados
      </Text>
      <View className="bg-surface rounded-2xl p-4 gap-4">
        {[0, 1, 2, 3].map((row) => (
          <View key={row} className="flex-row gap-3 justify-center">
            {[0, 1, 2, 3].map((col) => {
              const index = row * 4 + col;
              const cell = grid[index];

              return (
                <ResultCell
                  key={index}
                  resultValue={cell.resultValue}
                  userNum1={cell.userNum1}
                  userNum2={cell.userNum2}
                  userOperation={cell.userOperation}
                  hasError={cellErrors[index]}
                  onUpdate={(num1, num2, operation) =>
                    onCellUpdate(index, num1, num2, operation)
                  }
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
