import { View, Text, TextInput, Pressable, Platform } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { cn } from "@/lib/utils";
import type { OperationType } from "@/lib/tetonor/types";

interface ResultCellProps {
  resultValue: number;
  userNum1: number | null;
  userNum2: number | null;
  userOperation: OperationType | null;
  hasError?: boolean;
  onUpdate: (num1: number | null, num2: number | null, operation: OperationType | null) => void;
}

export function ResultCell({
  resultValue,
  userNum1,
  userNum2,
  userOperation,
  hasError,
  onUpdate,
}: ResultCellProps) {
  const [input1, setInput1] = useState(userNum1?.toString() ?? "");
  const [input2, setInput2] = useState(userNum2?.toString() ?? "");

  // Sincronizar estado local con props cuando cambien (ej: al reiniciar o nuevo juego)
  useEffect(() => {
    setInput1(userNum1?.toString() ?? "");
  }, [userNum1]);

  useEffect(() => {
    setInput2(userNum2?.toString() ?? "");
  }, [userNum2]);

  const handleNum1Change = (text: string) => {
    setInput1(text);
    const num = text === "" ? null : parseInt(text, 10);
    if (text === "" || !isNaN(num!)) {
      onUpdate(num, userNum2, userOperation);
    }
  };

  const handleNum2Change = (text: string) => {
    setInput2(text);
    const num = text === "" ? null : parseInt(text, 10);
    if (text === "" || !isNaN(num!)) {
      onUpdate(userNum1, num, userOperation);
    }
  };

  const handleOperationToggle = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newOp: OperationType = userOperation === "sum" ? "product" : "sum";
    onUpdate(userNum1, userNum2, newOp);
  };

  return (
    <View className={cn("items-center gap-1", hasError && "opacity-70")}>
      {/* Número resultado grande */}
      <View
        className={cn(
          "w-20 h-16 items-center justify-center rounded-lg bg-surface border",
          hasError ? "border-error" : "border-border"
        )}
      >
        <Text className="text-2xl font-bold text-foreground">{resultValue}</Text>
      </View>

      {/* Tres celdas pequeñas para la solución */}
      <View className="flex-row gap-1">
        {/* Primera celda: primer número */}
        <View className="w-12 h-10 items-center justify-center rounded bg-background border border-dashed border-muted">
          <TextInput
            value={input1}
            onChangeText={handleNum1Change}
            keyboardType="number-pad"
            maxLength={3}
            className="text-center font-semibold text-primary text-sm w-full h-full"
            style={{ textAlignVertical: "center", paddingTop: 0, paddingBottom: 0 }}
            placeholder=""
            placeholderTextColor="transparent"
          />
        </View>

        {/* Segunda celda: operación (+ o ×) */}
        <Pressable
          onPress={handleOperationToggle}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <View className="w-8 h-10 items-center justify-center rounded bg-background border border-dashed border-muted">
            <Text className="text-lg font-bold text-primary">
              {userOperation === null ? "" : userOperation === "sum" ? "+" : "×"}
            </Text>
          </View>
        </Pressable>

        {/* Tercera celda: segundo número */}
        <View className="w-12 h-10 items-center justify-center rounded bg-background border border-dashed border-muted">
          <TextInput
            value={input2}
            onChangeText={handleNum2Change}
            keyboardType="number-pad"
            maxLength={3}
            className="text-center font-semibold text-primary text-sm w-full h-full"
            style={{ textAlignVertical: "center", paddingTop: 0, paddingBottom: 0 }}
            placeholder=""
            placeholderTextColor="transparent"
          />
        </View>
      </View>
    </View>
  );
}
