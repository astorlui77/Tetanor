import { Modal, View, Text, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface StatsModalProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  elapsedTime: number;
}

export function StatsModal({
  visible,
  onClose,
  onNewGame,
  elapsedTime,
}: StatsModalProps) {
  const colors = useColors();

  const mins = Math.floor(elapsedTime / 60);
  const secs = elapsedTime % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-6">
        <View className="bg-background rounded-2xl p-6 w-full max-w-sm border border-border">
          {/* Título */}
          <Text className="text-3xl font-bold text-center text-foreground mb-6">
            ¡Felicitaciones! 🎉
          </Text>

          {/* Estadísticas */}
          <View className="gap-4 mb-6">
            {/* Tiempo */}
            <View className="flex-row justify-between items-center py-3 border-b border-border">
              <Text className="text-base text-muted">Tiempo total</Text>
              <Text className="text-xl font-bold text-primary">{timeStr}</Text>
            </View>

            {/* Calificación */}
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-base text-muted">Calificación</Text>
              <Text className="text-xl font-bold text-primary">
                ⭐⭐⭐
              </Text>
            </View>
          </View>

          {/* Botones */}
          <View className="gap-3">
            <Pressable
              onPress={onNewGame}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View className="bg-primary py-4 rounded-xl items-center">
                <Text className="text-background text-base font-bold">
                  Nuevo Juego
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View className="bg-surface border border-border py-4 rounded-xl items-center">
                <Text className="text-foreground text-base font-medium">
                  Cerrar
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
