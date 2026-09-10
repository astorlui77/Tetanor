import { View, Text, TextInput, useWindowDimensions } from "react-native";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ListNumber } from "@/lib/tetonor/types";

interface NumberListProps {
  list: ListNumber[];
  onValueChange: (index: number, value: number | null) => void;
}

export function NumberList({ list, onValueChange }: NumberListProps) {
  const { width } = useWindowDimensions();
  const isSmall = width < 380;
  const isTablet = width >= 600;

  const cellSize = isSmall ? 36 : isTablet ? 46 : 40;
  const cellGap = isSmall ? 4 : 6;

  return (
    <View className="w-full items-center">
      <Text className="text-sm font-medium text-muted mb-2 text-center">
        Lista de Números (orden ascendente)
      </Text>
      <View
        style={{ maxWidth: 500 }}
        className="w-full bg-surface rounded-2xl p-2.5 sm:p-3"
      >
        <View style={{ gap: cellGap }} className="flex-row flex-wrap justify-center">
          {list.map((item, index) => (
            <ListNumberCell
              key={index}
              value={item.value}
              isFixed={item.isFixed}
              isUsed={item.isUsed}
              size={cellSize}
              onValueChange={(value) => onValueChange(index, value)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

interface ListNumberCellProps {
  value: number | null;
  isFixed: boolean;
  isUsed: boolean;
  size?: number;
  onValueChange: (value: number | null) => void;
}

function ListNumberCell({ value, isFixed, isUsed, size = 40, onValueChange }: ListNumberCellProps) {
  const [inputValue, setInputValue] = useState(value?.toString() ?? "");

  // Sincronizar estado local con props cuando cambien (ej: al reiniciar o nuevo juego)
  useEffect(() => {
    setInputValue(value?.toString() ?? "");
  }, [value]);

  const handleChange = (text: string) => {
    setInputValue(text);
    
    if (text === "") {
      onValueChange(null);
    } else {
      const num = parseInt(text, 10);
      if (!isNaN(num) && num >= 0) {
        onValueChange(num);
      }
    }
  };

  const fontSize = size < 38 ? 12 : 14;

  // Números fijos (visibles) no son editables
  if (isFixed) {
    return (
      <View
        style={{ width: size, height: size }}
        className={cn(
          "items-center justify-center rounded-lg border",
          isUsed ? "bg-error/20 border-error" : "bg-surface border-border"
        )}
      >
        <Text
          style={{ fontSize }}
          className={cn(
            "font-semibold",
            isUsed ? "text-error" : "text-foreground"
          )}
        >
          {value}
        </Text>
      </View>
    );
  }

  // Números ocultos (editables)
  return (
    <View
      style={{ width: size, height: size }}
      className={cn(
        "items-center justify-center rounded-lg border-2 border-dashed",
        isUsed ? "bg-error/20 border-error" : "bg-background border-muted"
      )}
    >
      <TextInput
        value={inputValue}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={3}
        className={cn(
          "text-center font-semibold w-full h-full p-0",
          isUsed ? "text-error" : "text-primary"
        )}
        style={{
          fontSize,
          textAlignVertical: "center",
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        placeholder="" 
        placeholderTextColor="transparent"
      />
    </View>
  );
}
