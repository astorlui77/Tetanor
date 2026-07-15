# Diseño de Interfaz - Tetonor

## Concepto General
Aplicación móvil minimalista para el juego de lógica matemática Tetonor, con diseño austero inspirado en apps nativas iOS. Orientación vertical (9:16) optimizada para uso con una mano.

## Paleta de Colores
- **Fondo principal**: Gris muy claro (#F5F5F5) / Negro suave (#151718) en modo oscuro
- **Superficie**: Blanco (#FFFFFF) / Gris oscuro (#1E2022) en modo oscuro
- **Texto primario**: Negro carbón (#11181C) / Blanco humo (#ECEDEE) en modo oscuro
- **Texto secundario**: Gris medio (#687076) / Gris claro (#9BA1A6) en modo oscuro
- **Acento**: Azul petróleo (#0A7EA4) - para botones y elementos interactivos
- **Bordes**: Gris muy claro (#E5E7EB) / Gris pizarra (#334155) en modo oscuro
- **Éxito**: Verde (#22C55E) - para validaciones correctas
- **Error**: Rojo (#EF4444) - para validaciones incorrectas

## Lista de Pantallas

### 1. Pantalla de Bienvenida (Welcome)
- Logo de la app centrado
- Título "Tetonor"
- Subtítulo breve explicando el juego
- Botón "Iniciar Sesión" 
- Botón "Registrarse"
- Botón "Jugar sin cuenta" (modo invitado)

### 2. Pantalla de Autenticación (Auth)
- Formulario simple con email y contraseña
- Botón de acción principal
- Link para alternar entre login/registro
- Mensajes de error discretos

### 3. Pantalla Principal (Home)
- Título "Tetonor" en la parte superior
- Estadísticas del usuario (juegos jugados, mejor tiempo, racha)
- Botón grande "Nuevo Juego"
- Lista de juegos recientes con estado (completado/en progreso)
- Botón de perfil en esquina superior derecha

### 4. Pantalla de Juego (Game)
- Header con botón de volver y temporizador
- **Grilla superior**: 4x4 con 16 números (algunos vacíos)
- **Lista inferior**: 16 números en orden ascendente (algunos vacíos para completar)
- Números seleccionables con feedback visual
- Indicadores de operación (suma/producto)
- Botón "Verificar" para comprobar solución
- Botón "Pista" (opcional)
- Botón "Reiniciar"

### 5. Pantalla de Resultado (Result)
- Mensaje de felicitación/ánimo
- Tiempo completado
- Botón "Nuevo Juego"
- Botón "Ver Solución"
- Botón "Volver al Inicio"

### 6. Pantalla de Perfil (Profile)
- Avatar/inicial del usuario
- Nombre y email
- Estadísticas detalladas
- Historial de juegos
- Botón "Cerrar Sesión"
- Toggle de tema (claro/oscuro)

## Flujos de Usuario Principales

### Flujo 1: Primer Uso
1. Usuario abre app → Pantalla de Bienvenida
2. Usuario toca "Registrarse" → Pantalla de Autenticación
3. Usuario completa registro → Pantalla Principal
4. Usuario toca "Nuevo Juego" → Pantalla de Juego

### Flujo 2: Jugar una Partida
1. Usuario en Pantalla Principal → toca "Nuevo Juego"
2. Se genera puzzle → Pantalla de Juego
3. Usuario completa números y operaciones
4. Usuario toca "Verificar"
5. Si correcto → Pantalla de Resultado
6. Si incorrecto → feedback visual en pantalla de juego

### Flujo 3: Modo Invitado
1. Usuario en Bienvenida → toca "Jugar sin cuenta"
2. Va directo a Pantalla de Juego
3. Al terminar → opción de crear cuenta para guardar progreso

### Flujo 4: Ver Perfil y Estadísticas
1. Usuario en Pantalla Principal → toca icono de perfil
2. Ve estadísticas y historial → Pantalla de Perfil
3. Puede cerrar sesión o cambiar tema

## Elementos de Interacción

### Números en Grilla
- Números fijos: texto negro/blanco, no interactivos
- Espacios vacíos: fondo ligeramente diferente, tocables
- Números completados por usuario: color azul petróleo

### Números en Lista
- Números fijos: texto negro/blanco
- Espacios vacíos: input numérico discreto
- Números usados en operaciones: marcados con indicador sutil

### Indicadores de Operación
- Suma: símbolo "+" discreto junto a los números emparejados
- Producto: símbolo "×" discreto junto a los números emparejados
- Colores: verde para operaciones correctas, rojo para incorrectas

## Principios de Diseño
- **Minimalismo**: Sin elementos decorativos innecesarios
- **Legibilidad**: Tipografía clara, tamaños generosos
- **Espaciado**: Uso generoso de espacio en blanco
- **Feedback**: Respuesta visual inmediata a todas las interacciones
- **Accesibilidad**: Contraste suficiente, tamaños táctiles adecuados (mínimo 44x44pt)
- **Consistencia**: Seguir patrones de iOS Human Interface Guidelines
