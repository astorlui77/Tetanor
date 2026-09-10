# Tetonor

Juego de ingenio matemático y deducción lógica basado en operaciones aritméticas, desarrollado con **React Native** y **Expo**.

100% offline, sin backend ni bases de datos: toda la generación de tableros, verificación de soluciones y cálculo de pistas corre localmente en el dispositivo.

---

## 🎯 Reglas del Juego

1. **Grilla de Resultados (4×4)**: 16 números objetivo generados a partir de 8 pares únicos $(a, b)$.
2. **Lista de Números**: 16 números ordenados ascendentemente en la parte inferior, con algunos valores ocultos que el jugador debe deducir.
3. **Mecánica Central**:
   - Cada celda de la grilla se compone de dos números de la lista combinados mediante **suma ($+$)** o **producto ($\times$)**.
   - **Regla de oro**: Cuando emparejás dos números $(a, b)$, ambos deben aparecer en el tablero resolviendo **tanto su suma ($a + b$) como su producto ($a \times b$)**.
   - Los números de la lista pueden repetirse y se van marcando a medida que se utilizan.

---

## 🏗️ Arquitectura

- **Motor de Juego (`lib/tetonor/`)**:
  - `generator.ts`: Generación determinística con algoritmo Fisher-Yates, validación de solvencia, unicidad y balance aritmético ($\le 999$).
  - `progressive-hints.ts`: Sistema de pistas escalonadas (sugerencia de números, operaciones y celdas clave).
  - `daily-challenge.ts`: Generación del desafío del día mediante seed basado en fecha.
  - `types.ts`: Tipado estricto del dominio.
- **Estado de Juego (`hooks/use-tetonor-game.ts`)**:
  - Hook autónomo para ciclo de vida de la partida, control de tiempo transcurrido, pausa y verificación.
- **Diseño Adaptativo / Responsivo (`components/tetonor/`)**:
  - Cálculo geométrico dinámico (`cellWidth`) en base a `useWindowDimensions`.
  - Soporte fluido para cualquier pantalla Android: teléfonos compactos y plegables cerrados ($\ge 320\text{px}$), smartphones estándar ($360\text{px} - 412\text{px}$) y tablets/plegables abiertos.

---

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo Expo
npx expo start

# Ejecutar tests de lógica y solvencia
npx vitest run
```

---

## 🧪 Testing

La suite de pruebas en `tests/` cubre:
- Generación válida de pares únicos con suma y producto
- Verificación exhaustiva de solvencia de tableros
- Marcado y control de consumo de números repetidos
- Lógica de actualización de celdas y listas
