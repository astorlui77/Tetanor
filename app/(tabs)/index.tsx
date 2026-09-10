import { ScrollView, Text, View, Pressable, Alert, Platform } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { TutorialModal } from "@/components/tetonor/tutorial-modal";
import { useTutorial } from "@/hooks/use-tutorial";
import { generateProgressiveHint } from "@/lib/tetonor/progressive-hints";
import { StepByStepModal } from "@/components/tetonor/step-by-step-modal";

import { GameGrid } from "@/components/tetonor/game-grid";
import { NumberList } from "@/components/tetonor/number-list";
import { Timer } from "@/components/tetonor/timer";
import { ConfettiAnimation } from "@/components/tetonor/confetti-animation";
import { StatsModal } from "@/components/tetonor/stats-modal";
import { useTetonorGame } from "@/hooks/use-tetonor-game";
import { cn } from "@/lib/utils";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const [hiddenCount, setHiddenCount] = useState<number>(5);
  const { showTutorial, openTutorial, closeTutorial } = useTutorial();
  const [showStepByStep, setShowStepByStep] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const colors = useColors();

  const {
    gameState,
    elapsedTime,
    isPaused,
    startNewGame,
    updateListValue,
    updateGridCell,
    checkSolution,
    getHint,
    resetGame,
    togglePause,
  } = useTetonorGame(hiddenCount);



  const handleStartGame = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    startNewGame();
  };

  const handleCheckSolution = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const result = checkSolution();

    if (result.isValid) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Mostrar confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Mostrar modal de estadísticas
      setTimeout(() => setShowStats(true), 500);
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert(
        "Solución incorrecta",
        result.errors.join("\n")
      );
    }
  };

  const handleHint = () => {
    if (!gameState) return;
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Generar pista de nivel 1 (sugerir números) directamente
    const hint = generateProgressiveHint(gameState.puzzle, 1);
    
    Alert.alert(
      "Pista",
      hint.message,
      [{ text: "Entendido", style: "default" }]
    );
  };



  const handleReset = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert("Reiniciar", "¿Estás seguro de que quieres reiniciar el juego?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Reiniciar",
        onPress: () => {
          resetGame();
        },
        style: "destructive",
      },
    ]);
  };

  const handleGoHome = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert(
      "Volver al inicio",
      "¿Estás seguro de que quieres salir del juego actual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          onPress: () => {
            resetGame();
          },
          style: "destructive",
        },
      ]
    );
  };

  if (!gameState) {
    return (
      <ScreenContainer className="px-4 py-6 sm:px-6 max-w-lg mx-auto w-full">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center items-center gap-8">
            {/* Logo y título */}
            <View className="items-center gap-3">
              <Text className="text-5xl font-bold text-foreground">Tetonor</Text>
              <Text className="text-base text-muted text-center max-w-xs leading-relaxed">
                Para cada número en la grilla, encuentra los dos números de la lista que lo generan mediante suma o multiplicación
              </Text>
            </View>

            {/* Botón de inicio */}
            <Pressable
              onPress={handleStartGame}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <View className="bg-primary px-8 py-4 rounded-full">
                <Text className="text-background text-lg font-semibold">Nuevo Juego</Text>
              </View>
            </Pressable>

            {/* Botón de Tutorial */}
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                openTutorial();
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View className="bg-surface border border-border px-6 py-3 rounded-full items-center">
                <Text className="text-primary text-base font-semibold">📖 Ver Tutorial</Text>
              </View>
            </Pressable>

            {/* Reglas del juego */}
            <View className="w-full max-w-sm bg-surface rounded-2xl p-5 gap-3">
              <Text className="text-base font-semibold text-foreground">Reglas del juego:</Text>
              <Text className="text-sm text-muted leading-relaxed">
                Cada número en la grilla es el resultado de sumar o multiplicar dos números de la
                lista. Debajo de cada número, coloca los dos números que lo generan y selecciona la
                operación (+ o ×).
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Cuando emparejas dos números, debes usarlos para hacer tanto una suma como un
                producto en diferentes celdas de la grilla.
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Los números de la lista están en orden ascendente y pueden repetirse.
              </Text>
            </View>
          </View>
        </ScrollView>
        <TutorialModal visible={showTutorial} onClose={closeTutorial} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-2 py-3 sm:px-6 sm:py-6 max-w-lg mx-auto w-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4 sm:gap-6">
          {/* Header con botón Home y temporizador */}
          <View className="flex-row justify-between items-center">
            <Pressable
              onPress={handleGoHome}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol size={24} name="house.fill" color={colors.primary} />
                <Text className="text-xl font-bold text-foreground">Tetonor</Text>
              </View>
            </Pressable>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={togglePause}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <IconSymbol 
                  size={24} 
                  name={isPaused ? "play.fill" : "pause.fill"} 
                  color={colors.primary} 
                />
              </Pressable>
              <Timer seconds={elapsedTime} isRunning={!gameState.isComplete && !isPaused} />
            </View>
          </View>

          {/* Grilla de juego */}
          <GameGrid
            grid={gameState.puzzle.grid}
            onCellUpdate={updateGridCell}
          />

          {/* Lista de números */}
          <NumberList list={gameState.puzzle.list} onValueChange={updateListValue} />

          {/* Botones de acción */}
          <View className="gap-3 mt-4">
            <Pressable
              onPress={handleCheckSolution}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <View className="bg-primary py-4 rounded-xl items-center">
                <Text className="text-background text-base font-semibold">
                  Verificar Solución
                </Text>
              </View>
            </Pressable>

            <View className="gap-3">
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleHint}
                  className="flex-1"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View className="bg-surface border border-border py-3 rounded-xl items-center">
                    <Text className="text-foreground text-sm font-medium">Pista</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => setShowStepByStep(true)}
                  className="flex-1"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View className="bg-surface border border-border py-3 rounded-xl items-center">
                    <Text className="text-foreground text-sm font-medium">Paso a Paso</Text>
                  </View>
                </Pressable>
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleReset}
                  className="flex-1"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View className="bg-surface border border-border py-3 rounded-xl items-center">
                    <Text className="text-foreground text-sm font-medium">Reiniciar</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={handleStartGame}
                  className="flex-1"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View className="bg-surface border border-border py-3 rounded-xl items-center">
                    <Text className="text-foreground text-sm font-medium">Nuevo</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <TutorialModal visible={showTutorial} onClose={closeTutorial} />
      {gameState && (
        <StepByStepModal
          visible={showStepByStep}
          onClose={() => setShowStepByStep(false)}
          puzzle={gameState.puzzle}
        />
      )}
      {showConfetti && <ConfettiAnimation />}
      <StatsModal
        visible={showStats}
        onClose={() => setShowStats(false)}
        onNewGame={() => {
          setShowStats(false);
          handleStartGame();
        }}
        elapsedTime={elapsedTime}
      />
    </ScreenContainer>
  );
}
