import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { HintLevel } from "@/lib/tetonor/progressive-hints";

interface ProgressiveHintModalProps {
  visible: boolean;
  onClose: () => void;
  onRequestHint: (level: HintLevel) => void;
  currentHintLevel: HintLevel | null;
  hintMessage: string | null;
}

export function ProgressiveHintModal({
  visible,
  onClose,
  onRequestHint,
  currentHintLevel,
  hintMessage,
}: ProgressiveHintModalProps) {
  const colors = useColors();

  const hintLevels: { level: HintLevel; title: string; description: string; emoji: string }[] = [
    {
      level: 1,
      title: "Pista Básica",
      description: "Te sugiero qué tipo de números buscar",
      emoji: "💡",
    },
    {
      level: 2,
      title: "Pista Intermedia",
      description: "Te muestro números específicos y celdas relacionadas",
      emoji: "🔍",
    },
    {
      level: 3,
      title: "Revelar Solución",
      description: "Te muestro un par completo con explicación",
      emoji: "🎯",
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/70 p-4">
        <View
          className="w-full max-w-md rounded-2xl p-6"
          style={{ backgroundColor: colors.surface }}
        >
          {/* Header */}
          <View className="mb-4">
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: colors.foreground }}
            >
              Sistema de Pistas
            </Text>
            <Text className="text-sm" style={{ color: colors.muted }}>
              Elige el nivel de ayuda que necesitas
            </Text>
          </View>

          {/* Hint message if available */}
          {hintMessage && (
            <ScrollView className="max-h-48 mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
              <Text className="text-base leading-relaxed" style={{ color: colors.foreground }}>
                {hintMessage}
              </Text>
            </ScrollView>
          )}

          {/* Hint level buttons */}
          <View className="gap-3 mb-6">
            {hintLevels.map((hint) => (
              <Pressable
                key={hint.level}
                onPress={() => onRequestHint(hint.level)}
                disabled={currentHintLevel !== null && currentHintLevel >= hint.level}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : currentHintLevel !== null && currentHintLevel >= hint.level ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  className="p-4 rounded-xl border"
                  style={{
                    backgroundColor:
                      currentHintLevel === hint.level ? colors.primary + "20" : colors.background,
                    borderColor:
                      currentHintLevel === hint.level ? colors.primary : colors.border,
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">{hint.emoji}</Text>
                    <View className="flex-1">
                      <Text
                        className="text-base font-semibold mb-1"
                        style={{ color: colors.foreground }}
                      >
                        {hint.title}
                      </Text>
                      <Text className="text-sm" style={{ color: colors.muted }}>
                        {hint.description}
                      </Text>
                    </View>
                    {currentHintLevel !== null && currentHintLevel >= hint.level && (
                      <Text className="text-lg">✓</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Close button */}
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.9 },
            ]}
            className="py-3 rounded-lg items-center"
          >
            <Text className="font-semibold" style={{ color: colors.background }}>
              Cerrar
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
