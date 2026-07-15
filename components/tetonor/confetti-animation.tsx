import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";

interface ConfettiPieceProps {
  delay: number;
  color: string;
  left: number;
}

function ConfettiPiece({ delay, color, left }: ConfettiPieceProps) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Delay inicial
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 100 });
      
      // Caída
      translateY.value = withTiming(800, {
        duration: 2000 + Math.random() * 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      // Movimiento horizontal
      translateX.value = withSequence(
        withTiming((Math.random() - 0.5) * 100, { duration: 500 }),
        withRepeat(
          withTiming((Math.random() - 0.5) * 100, { duration: 1000 }),
          3,
          true
        )
      );
      
      // Rotación
      rotate.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    }, delay);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        { backgroundColor: color, left: `${left}%` },
        animatedStyle,
      ]}
    />
  );
}

export function ConfettiAnimation() {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE"];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 500,
    color: colors[Math.floor(Math.random() * colors.length)],
    left: Math.random() * 100,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          delay={piece.delay}
          color={piece.color}
          left={piece.left}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  confettiPiece: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
