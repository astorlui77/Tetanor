import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

interface TimerProps {
  seconds: number;
  isRunning?: boolean;
}

export function Timer({ seconds, isRunning = true }: TimerProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

  return (
    <View className="items-center">
      <Text className="text-xs text-muted mb-1">Tiempo</Text>
      <View
        className={cn(
          "bg-surface px-4 py-2 rounded-full border border-border",
          isRunning && "border-primary"
        )}
      >
        <Text className="text-lg font-mono font-semibold text-foreground">
          {formattedTime}
        </Text>
      </View>
    </View>
  );
}
