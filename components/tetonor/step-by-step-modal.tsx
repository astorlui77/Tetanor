import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import type { TetonorPuzzle } from "@/lib/tetonor/types";

interface StepByStepModalProps {
  visible: boolean;
  onClose: () => void;
  puzzle: TetonorPuzzle;
}

interface Step {
  pairIndex: number;
  num1: number;
  num2: number;
  sum: number;
  product: number;
  explanation: string;
}

export function StepByStepModal({ visible, onClose, puzzle }: StepByStepModalProps) {
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);

  // Generar pasos a partir de los pares del puzzle
  const steps: Step[] = puzzle.pairs.map((pair, index) => ({
    pairIndex: index + 1,
    num1: pair.num1,
    num2: pair.num2,
    sum: pair.sum,
    product: pair.product,
    explanation: generateExplanation(pair, puzzle, index),
  }));

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  if (steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
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
              Resolver Paso a Paso
            </Text>
            <Text className="text-sm" style={{ color: colors.muted }}>
              Paso {currentStep + 1} de {steps.length}
            </Text>
          </View>

          {/* Pair display */}
          <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
            <Text className="text-lg font-bold mb-3 text-center" style={{ color: colors.foreground }}>
              Par {step.pairIndex}: ({step.num1}, {step.num2})
            </Text>

            <View className="gap-2">
              <View className="flex-row items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="text-base" style={{ color: colors.foreground }}>
                  {step.num1} + {step.num2}
                </Text>
                <Text className="text-base font-bold" style={{ color: colors.primary }}>
                  = {step.sum}
                </Text>
              </View>

              <View className="flex-row items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="text-base" style={{ color: colors.foreground }}>
                  {step.num1} × {step.num2}
                </Text>
                <Text className="text-base font-bold" style={{ color: colors.primary }}>
                  = {step.product}
                </Text>
              </View>
            </View>
          </View>

          {/* Explanation */}
          <ScrollView className="max-h-48 mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
            <Text className="text-base leading-relaxed" style={{ color: colors.foreground }}>
              {step.explanation}
            </Text>
          </ScrollView>

          {/* Navigation buttons */}
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={handlePrevious}
              disabled={currentStep === 0}
              style={({ pressed }) => [
                {
                  opacity: currentStep === 0 ? 0.3 : pressed ? 0.7 : 1,
                  flex: 1,
                },
              ]}
            >
              <View
                className="py-3 rounded-lg items-center border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <Text className="font-medium" style={{ color: colors.foreground }}>
                  ← Anterior
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleNext}
              disabled={currentStep === steps.length - 1}
              style={({ pressed }) => [
                {
                  opacity: currentStep === steps.length - 1 ? 0.3 : pressed ? 0.7 : 1,
                  flex: 1,
                },
              ]}
            >
              <View
                className="py-3 rounded-lg items-center border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <Text className="font-medium" style={{ color: colors.foreground }}>
                  Siguiente →
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Close button */}
          <Pressable
            onPress={handleClose}
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

function generateExplanation(
  pair: { num1: number; num2: number; sum: number; product: number },
  puzzle: TetonorPuzzle,
  index: number
): string {
  const { num1, num2, sum, product } = pair;

  let explanation = `📌 Par ${index + 1}: (${num1}, ${num2})\n\n`;

  // Verificar si los números están visibles u ocultos usando completeList e isFixed
  const num1Index = puzzle.completeList.indexOf(num1);
  const num2Index = puzzle.completeList.indexOf(num2);
  const isNum1Visible = num1Index !== -1 && puzzle.list[num1Index]?.isFixed;
  const isNum2Visible = num2Index !== -1 && puzzle.list[num2Index]?.isFixed;

  // Sección 1: Visibilidad de los números
  explanation += `🔍 VISIBILIDAD:\n`;
  if (isNum1Visible && isNum2Visible) {
    explanation += `✓ Ambos números (${num1} y ${num2}) están visibles en la lista desde el inicio.\n`;
  } else if (!isNum1Visible && !isNum2Visible) {
    explanation += `✗ Ambos números (${num1} y ${num2}) estaban ocultos. Debías deducirlos analizando la grilla.\n`;
  } else {
    const visible = isNum1Visible ? num1 : num2;
    const hidden = isNum1Visible ? num2 : num1;
    explanation += `• Visible: ${visible}\n• Oculto: ${hidden} (debías deducirlo)\n`;
  }

  // Sección 2: Operaciones
  explanation += `\n➕ OPERACIONES:\n`;
  explanation += `• Suma: ${num1} + ${num2} = ${sum}\n`;
  explanation += `• Producto: ${num1} × ${num2} = ${product}\n`;

  // Sección 3: Estrategia de resolución
  explanation += `\n💡 ESTRATEGIA DE RESOLUCIÓN:\n`;
  
  if (isPrime(sum) && sum > 2) {
    explanation += `El número ${sum} es PRIMO. Un número primo solo puede obtenerse como producto de 1 × ${sum}. Pero si ese fuera el caso, también debería existir 1 + ${sum} = ${sum + 1} en la grilla. Como ${sum + 1} no está en la grilla, concluimos que ${sum} debe ser una SUMA, no un producto.\n\n`;
    explanation += `Entonces buscamos dos números que sumen ${sum}. Probando factorizaciones de ${product} encontramos que ${num1} × ${num2} = ${product}, y verificamos que ${num1} + ${num2} = ${sum}. ¡Ambos resultados están en la grilla!`;
  } else if (isPrime(product) && product > 2) {
    explanation += `El número ${product} es PRIMO. Solo puede ser:\n`;
    explanation += `  • Producto: 1 × ${product}\n`;
    explanation += `  • Suma: muchas combinaciones posibles\n\n`;
    explanation += `Como ${product} es grande, es más probable que sea un producto. Si fuera 1 × ${product}, también debería existir 1 + ${product} = ${product + 1} en la grilla. Verificando la grilla, encontramos que ${sum} también está presente, confirmando que el par es (${num1}, ${num2}).`;
  } else if (product > 100) {
    explanation += `El número ${product} es GRANDE (> 100). Los números grandes en la grilla suelen ser productos porque:\n`;
    explanation += `  • Las sumas están limitadas por los números disponibles en la lista\n`;
    explanation += `  • Los productos crecen mucho más rápido\n\n`;
    explanation += `Factorizamos ${product}:\n`;
    const factors = getFactorPairs(product);
    factors.slice(0, 3).forEach(([a, b]) => {
      explanation += `  • ${a} × ${b} = ${product} → suma: ${a} + ${b} = ${a + b}${a + b === sum ? ' ✓ (¡está en la grilla!)' : ' ✗ (no está en la grilla)'}\n`;
    });
    explanation += `\nEncontramos que ${num1} × ${num2} = ${product} y ${num1} + ${num2} = ${sum}, ambos presentes en la grilla.`;
  } else {
    explanation += `Para encontrar este par, analizamos las factorizaciones de ${product}:\n`;
    const factors = getFactorPairs(product);
    factors.slice(0, 4).forEach(([a, b]) => {
      explanation += `  • ${a} × ${b} = ${product} → suma: ${a} + ${b} = ${a + b}${a + b === sum ? ' ✓ (¡está en la grilla!)' : ' ✗ (no está en la grilla)'}\n`;
    });
    explanation += `\nSolo el par (${num1}, ${num2}) tiene AMBOS resultados (${sum} y ${product}) en la grilla.`;
  }

  explanation += `\n\n✅ VALIDACIÓN:\n`;
  explanation += `• ${num1} + ${num2} = ${sum} → Presente en la grilla ✓\n`;
  explanation += `• ${num1} × ${num2} = ${product} → Presente en la grilla ✓\n`;
  explanation += `• Cumple la Regla 2: cada par genera una suma Y un producto en la grilla.`;

  return explanation;
}

function getFactorPairs(n: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      pairs.push([i, n / i]);
    }
  }
  return pairs.sort((a, b) => a[0] - b[0]);
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  
  return true;
}
