import { View, Text, TextInput, Pressable, Platform } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { cn } from "@/lib/utils";

interface NumberCellProps {
  value: number | null;
  isFixed: boolean;
  isCorrect?: boolean;
  isError?: boolean;
  onValueChange?: (value: number | null) => void;
  size?: "small" | "medium" | "large";
}

export function NumberCell({
  value,
  isFixed,
  isCorrect,
  isError,
  onValueChange,
  size = "medium",
}: NumberCellProps) {
  const [inputValue, setInputValue] = useState(value?.toString() ?? "");

  const handleChange = (text: string) => {
    setInputValue(text);
    
    if (text === "") {
      onValueChange?.(null);
    } else {
      const num = parseInt(text, 10);
      if (!isNaN(num) && num >= 0) {
        onValueChange?.(num);
      }
    }
  };

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const sizeClasses = {
    small: "w-14 h-14 text-base",
    medium: "w-16 h-16 text-lg",
    large: "w-20 h-20 text-xl",
  };

  if (isFixed) {
    return (
      <View
        className={cn(
          "items-center justify-center rounded-lg bg-surface border border-border",
          sizeClasses[size],
          isCorrect && "bg-success/10 border-success",
          isError && "bg-error/10 border-error"
        )}
      >
        <Text
          className={cn(
            "font-semibold text-foreground",
            sizeClasses[size].split(" ")[2]
          )}
        >
          {value}
        </Text>
      </View>
    );
  }

  return (
    <Pressable onPress={handlePress}>
      <View
        className={cn(
          "items-center justify-center rounded-lg bg-background border-2 border-dashed border-muted",
          sizeClasses[size],
          isCorrect && "bg-success/10 border-success",
          isError && "bg-error/10 border-error"
        )}
      >
        <TextInput
          value={inputValue}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={3}
          className={cn(
            "text-center font-semibold text-primary w-full",
            sizeClasses[size].split(" ")[2]
          )}
          placeholder="?"
          placeholderTextColor="#9BA1A6"
        />
      </View>
    </Pressable>
  );
}
