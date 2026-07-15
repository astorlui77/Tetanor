import { View, Text, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ListNumber } from "@/lib/tetonor/types";

interface NumberListProps {
  list: ListNumber[];
  onValueChange: (index: number, value: number | null) => void;
}

export function NumberList({ list, onValueChange }: NumberListProps) {
  return (
    <View className="w-full">
      <Text className="text-sm font-medium text-muted mb-3 text-center">
        Lista de Números (orden ascendente)
      </Text>
      <View className="bg-surface rounded-2xl p-3">
        <View className="flex-row flex-wrap gap-1.5 justify-center">
          {list.map((item, index) => (
            <ListNumberCell
              key={index}
              value={item.value}
              isFixed={item.isFixed}
              isUsed={item.isUsed}
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
  onValueChange: (value: number | null) => void;
}

function ListNumberCell({ value, isFixed, isUsed, onValueChange }: ListNumberCellProps) {
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

  // Números fijos (visibles) no son editables
  if (isFixed) {
    return (
      <View className={cn(
        "w-11 h-11 items-center justify-center rounded-lg border",
        isUsed ? "bg-error/20 border-error" : "bg-surface border-border"
      )}>
        <Text className={cn(
          "font-semibold text-sm",
          isUsed ? "text-error" : "text-foreground"
        )}>{value}</Text>
      </View>
    );
  }

  // Números ocultos (editables)
  return (
    <View className={cn(
      "w-11 h-11 items-center justify-center rounded-lg border-2 border-dashed",
      isUsed ? "bg-error/20 border-error" : "bg-background border-muted"
    )}>
      <TextInput
        value={inputValue}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={3}
        className={cn(
          "text-center font-semibold w-full text-sm h-full",
          isUsed ? "text-error" : "text-primary"
        )}
        style={{ textAlignVertical: "center" }}
        placeholder="" 
        placeholderTextColor="transparent"
      />
    </View>
  );
}
