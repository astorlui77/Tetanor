import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useStats } from "@/hooks/use-stats";

interface StatsCardProps {
  difficulty: "easy" | "medium" | "hard";
}

export function StatsCard({ difficulty }: StatsCardProps) {
  const colors = useColors();
  const { stats, getAverageTime, formatTime } = useStats();

  const diffStats = stats[difficulty];
  const avgTime = getAverageTime(difficulty);

  const difficultyLabel = {
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
  };

  if (diffStats.gamesPlayed === 0) {
    return (
      <View
        className="rounded-xl p-4 border"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
          {difficultyLabel[difficulty]}
        </Text>
        <Text className="text-xs" style={{ color: colors.muted }}>
          Sin juegos completados
        </Text>
      </View>
    );
  }

  return (
    <View
      className="rounded-xl p-4 border"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <Text className="text-sm font-semibold mb-3" style={{ color: colors.foreground }}>
        {difficultyLabel[difficulty]}
      </Text>

      <View className="gap-2">
        <View className="flex-row justify-between">
          <Text className="text-xs" style={{ color: colors.muted }}>
            Mejor tiempo:
          </Text>
          <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
            {formatTime(diffStats.bestTime)}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-xs" style={{ color: colors.muted }}>
            Promedio:
          </Text>
          <Text className="text-xs font-medium" style={{ color: colors.foreground }}>
            {formatTime(avgTime)}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-xs" style={{ color: colors.muted }}>
            Juegos:
          </Text>
          <Text className="text-xs font-medium" style={{ color: colors.foreground }}>
            {diffStats.gamesPlayed}
          </Text>
        </View>
      </View>
    </View>
  );
}
