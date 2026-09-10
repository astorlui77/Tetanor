import { View, Text, useWindowDimensions } from "react-native";
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
  const { width: windowWidth } = useWindowDimensions();

  // Screen-aware responsive sizing
  const isSmall = windowWidth < 380;
  const isTablet = windowWidth >= 600;

  // Max board width for tablets / foldables unfolded
  const maxBoardWidth = 500;
  // Account for parent screen padding
  const screenPadding = isSmall ? 16 : isTablet ? 32 : 24;
  const availableWidth = Math.min(windowWidth - screenPadding, maxBoardWidth);

  // Card padding inside the grid container
  const cardPadding = isSmall ? 8 : 12;
  const colGap = isSmall ? 3 : 6;
  const rowGap = isSmall ? 6 : 8;

  // 4 columns, 3 gaps between them
  const innerGridWidth = availableWidth - cardPadding * 2;
  const cellWidth = Math.floor((innerGridWidth - colGap * 3) / 4);

  return (
    <View className="w-full items-center">
      <Text className="text-sm font-medium text-muted mb-2 text-center">
        Grilla de Resultados
      </Text>
      <View
        style={{
          width: availableWidth,
          padding: cardPadding,
          gap: rowGap,
        }}
        className="bg-surface rounded-2xl"
      >
        {[0, 1, 2, 3].map((row) => (
          <View
            key={row}
            style={{ gap: colGap }}
            className="flex-row justify-center items-center"
          >
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
                  cellWidth={cellWidth}
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
