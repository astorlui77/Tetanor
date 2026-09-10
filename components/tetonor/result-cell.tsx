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
  cellWidth?: number;
  onUpdate: (num1: number | null, num2: number | null, operation: OperationType | null) => void;
}

export function ResultCell({
  resultValue,
  userNum1,
  userNum2,
  userOperation,
  hasError,
  cellWidth = 76,
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

  const isCompact = cellWidth < 78;
  const isMini = cellWidth < 68;

  // Sizing and typography adapted to available width
  const resultHeight = Math.max(34, Math.min(58, Math.round(cellWidth * 0.58)));
  const inputHeight = Math.max(26, Math.min(38, Math.round(cellWidth * 0.42)));
  const opWidth = isMini ? 15 : isCompact ? 18 : Math.min(26, Math.round(cellWidth * 0.25));

  const resultFontSize = isMini ? 15 : isCompact ? 17 : cellWidth < 100 ? 20 : 24;
  const inputFontSize = isMini ? 11 : isCompact ? 12 : 14;
  const opFontSize = isMini ? 11 : isCompact ? 13 : 16;

  return (
    <View style={{ width: cellWidth }} className={cn("items-center gap-1", hasError && "opacity-70")}>
      {/* Número resultado grande */}
      <View
        style={{ width: cellWidth, height: resultHeight }}
        className={cn(
          "items-center justify-center rounded-lg bg-surface border",
          hasError ? "border-error" : "border-border"
        )}
      >
        <Text style={{ fontSize: resultFontSize }} className="font-bold text-foreground">
          {resultValue}
        </Text>
      </View>

      {/* Tres celdas para la solución */}
      <View style={{ width: cellWidth }} className="flex-row gap-0.5 sm:gap-1 items-center justify-between">
        {/* Primera celda: primer número */}
        <View
          style={{ height: inputHeight }}
          className="flex-1 items-center justify-center rounded bg-background border border-dashed border-muted min-w-0"
        >
          <TextInput
            value={input1}
            onChangeText={handleNum1Change}
            keyboardType="number-pad"
            maxLength={3}
            className="text-center font-semibold text-primary w-full h-full p-0"
            style={{
              fontSize: inputFontSize,
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

        {/* Segunda celda: operación (+ o ×) */}
        <Pressable
          onPress={handleOperationToggle}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <View
            style={{ width: opWidth, height: inputHeight }}
            className="items-center justify-center rounded bg-background border border-dashed border-muted"
          >
            <Text style={{ fontSize: opFontSize }} className="font-bold text-primary text-center">
              {userOperation === null ? "" : userOperation === "sum" ? "+" : "×"}
            </Text>
          </View>
        </Pressable>

        {/* Tercera celda: segundo número */}
        <View
          style={{ height: inputHeight }}
          className="flex-1 items-center justify-center rounded bg-background border border-dashed border-muted min-w-0"
        >
          <TextInput
            value={input2}
            onChangeText={handleNum2Change}
            keyboardType="number-pad"
            maxLength={3}
            className="text-center font-semibold text-primary w-full h-full p-0"
            style={{
              fontSize: inputFontSize,
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
      </View>
    </View>
  );
}
