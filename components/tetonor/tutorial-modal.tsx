import { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: "Bienvenido a Tetonor",
    content: "Tetonor es un juego de lógica matemática donde debes descubrir qué números de la lista se suman o multiplican para obtener cada número de la grilla.",
  },
  {
    title: "Regla 1: Números de la lista",
    content: "Cada operación debe usar DOS números que estén en la lista inferior. La lista tiene 16 casilleros en orden ascendente, algunos visibles y otros vacíos que debes completar.",
  },
  {
    title: "Regla 2: Suma Y Producto",
    content: "Esta es la regla clave: cuando emparejas dos números, DEBES usarlos para hacer TANTO una suma COMO un producto, y ambos resultados deben aparecer en la grilla.\n\nEjemplo: Si usas 5 y 8, debes tener tanto 5+8=13 como 5×8=40 en la grilla.",
  },
  {
    title: "Regla 3: Orden ascendente",
    content: "Los números de la lista deben estar en orden ascendente (de menor a mayor). Pueden repetirse, pero nunca romper el orden.\n\nEjemplo: Entre 18 y 22 solo puedes poner 19, 20 o 21.",
  },
  {
    title: "Estrategia: Números grandes",
    content: "Los números muy grandes en la grilla suelen ser productos. Si el número más grande visible en la lista es 20, entonces la suma máxima posible es 20+20=40. Cualquier número mayor a 40 debe ser un producto.",
  },
  {
    title: "Estrategia: Múltiples soluciones",
    content: "Un número como 48 puede ser 6×8, 4×12, 3×16, etc. La magia del juego está en deducir cuál es la correcta verificando que el par completo (suma Y producto) esté en la grilla.\n\nSi 48=6×8, entonces 6+8=14 también debe estar en la grilla.",
  },
  {
    title: "¡A jugar!",
    content: "Al final debes tener exactamente 8 sumas y 8 productos en la grilla. Usa lógica y deducción para resolver el puzzle. ¡Buena suerte!",
  },
];

export function TutorialModal({ visible, onClose }: TutorialModalProps) {
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    setCurrentStep(0);
  };

  const step = TUTORIAL_STEPS[currentStep];

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
              {step.title}
            </Text>
            <Text className="text-sm" style={{ color: colors.muted }}>
              Paso {currentStep + 1} de {TUTORIAL_STEPS.length}
            </Text>
          </View>

          {/* Content */}
          <ScrollView className="max-h-96 mb-6">
            <Text
              className="text-base leading-relaxed"
              style={{ color: colors.foreground }}
            >
              {step.content}
            </Text>
          </ScrollView>

          {/* Progress dots */}
          <View className="flex-row justify-center gap-2 mb-6">
            {TUTORIAL_STEPS.map((_, index) => (
              <View
                key={index}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    index === currentStep ? colors.primary : colors.border,
                }}
              />
            ))}
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            {currentStep > 0 && (
              <Pressable
                onPress={handlePrevious}
                className="flex-1 py-3 rounded-lg items-center"
                style={({ pressed }) => [
                  { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text className="font-semibold" style={{ color: colors.foreground }}>
                  Anterior
                </Text>
              </Pressable>
            )}

            {currentStep < TUTORIAL_STEPS.length - 1 && (
              <Pressable
                onPress={handleSkip}
                className="flex-1 py-3 rounded-lg items-center"
                style={({ pressed }) => [
                  { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text className="font-semibold" style={{ color: colors.muted }}>
                  Saltar
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleNext}
              className="flex-1 py-3 rounded-lg items-center"
              style={({ pressed }) => [
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}
            >
              <Text className="font-semibold" style={{ color: colors.background }}>
                {currentStep === TUTORIAL_STEPS.length - 1 ? "¡Empezar!" : "Siguiente"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
