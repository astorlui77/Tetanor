# TODO - Tetonor App

## Diseño y Branding
- [x] Generar logo personalizado para la app
- [x] Actualizar configuración de branding en app.config.ts
- [x] Configurar paleta de colores austeros en theme.config.js

## Lógica del Juego
- [x] Implementar generador de puzzles Tetonor
- [x] Crear algoritmo de validación de soluciones
- [x] Implementar sistema de pistas
- [x] Crear temporizador de juego
- [x] Implementar detección de números primos
- [x] Crear lógica para identificar sumas vs productos

## Interfaz de Usuario
- [ ] Crear pantalla de bienvenida
- [ ] Crear pantalla de autenticación (login/registro)
- [x] Crear pantalla principal (home) con estadísticas
- [x] Crear pantalla de juego con grilla 4x4 y lista de números
- [ ] Crear pantalla de resultado
- [ ] Crear pantalla de perfil
- [ ] Implementar navegación entre pantallas

## Componentes UI
- [x] Componente de grilla de números (4x4)
- [x] Componente de lista de números ordenada
- [x] Componente de celda numérica editable
- [x] Componente de temporizador
- [ ] Componente de estadísticas
- [x] Componente de botón primario
- [ ] Componente de tarjeta de juego reciente

## Autenticación
- [x] Configurar sistema de autenticación con backend
- [ ] Implementar registro de usuarios
- [ ] Implementar inicio de sesión
- [ ] Implementar cierre de sesión
- [ ] Implementar modo invitado (sin cuenta)
- [ ] Persistir sesión del usuario

## Base de Datos
- [x] Crear esquema de base de datos para usuarios
- [x] Crear esquema para juegos/partidas
- [x] Crear esquema para estadísticas
- [x] Implementar guardado de progreso de juego
- [x] Implementar historial de juegos
- [x] Implementar sincronización de estadísticas

## Funcionalidades Adicionales
- [ ] Implementar toggle de tema claro/oscuro
- [x] Implementar feedback háptico en interacciones
- [ ] Implementar animaciones sutiles
- [ ] Implementar sistema de validación en tiempo real
- [ ] Implementar indicadores visuales de operaciones correctas/incorrectas

## Testing y Pulido
- [ ] Probar flujo completo de juego
- [ ] Probar autenticación y persistencia
- [ ] Verificar diseño en diferentes tamaños de pantalla
- [ ] Optimizar rendimiento
- [ ] Revisar accesibilidad


## Correcciones Urgentes - Mecánica del Juego
- [x] Rediseñar estructura de datos: cada celda de grilla debe tener 3 sub-celdas para colocar los dos números que la generan
- [x] Modificar generador para que la grilla tenga números fijos (no editables) y las 3 celdas debajo sean editables
- [x] Actualizar componente de grilla para mostrar número grande arriba y 3 celdas pequeñas debajo
- [x] Modificar validación: verificar que los dos números colocados debajo de cada resultado sean correctos
- [x] Actualizar interfaz para que coincida con el diseño real del juego (número + 3 celdas por cada posición)

## Correcciones Críticas Después de Revisar Video Completo
- [x] REESCRIBIR generador: debe generar exactamente 8 pares
- [x] CADA par DEBE tener su suma Y su producto en la grilla (Regla 2)
- [x] Verificar que todos los resultados (16) sean únicos
- [x] RESTAURAR validación de pares (la había eliminado por error)
- [x] La lista debe tener exactamente 16 números (puede haber duplicados)
- [x] Todos los números de los pares deben estar en la lista

## Reescritura Completa del Generador
- [x] Eliminar límites artificiales de rango (no más 1-12, 1-20, etc.)
- [x] Generar 8 pares con números variados (algunos grandes para crear ambigüedad)
- [x] Cada par produce suma + producto en grilla (16 celdas totales)
- [x] Lista de 16 números DEBE contener todos los números de los pares
- [x] Permitir números repetidos en la lista (ej: 4, 4, 4)
- [x] Ocultar números estratégicamente según dificultad
- [x] Dificultad = complejidad de deducción, no rango de números
- [x] Test: verificar que cada puzzle sea soluble

## Nuevas Funcionalidades - Tutorial y Tiempos
- [x] Crear tutorial interactivo que se muestre ANTES de empezar el primer juego
- [x] Tutorial debe explicar las 3 reglas del juego con ejemplos visuales
- [x] Tutorial debe mostrar estrategias de resolución
- [x] Implementar sistema de "primera vez" para mostrar tutorial solo una vez
- [x] Agregar botón "Ver Tutorial" en pantalla principal para revisarlo cuando quiera
- [x] Mejorar sistema de tiempos: guardar mejor tiempo por dificultad
- [x] Mostrar estadísticas: mejor tiempo, promedio, juegos completados por dificultad
- [x] Mostrar mensaje especial cuando se logra un nuevo récord
- [ ] Agregar animación de celebración cuando se completa un puzzle

## Bug Reportado - Validación Incorrecta
- [x] Validador no verificaba que hubiera exactamente 8 pares
- [x] Agregada verificación de exactamente 8 pares (a,b) donde a+b Y a×b estén en la grilla
- [x] El generador ya crea puzzles válidos con 8 pares consistentes
- [ ] Crear test con el puzzle reportado por el usuario para reproducir el bug

## Nuevas Mejoras Solicitadas
- [x] Sistema de pistas progresivas (3 niveles)
  - [x] Nivel 1: Sugerir qué números buscar en la lista
  - [x] Nivel 2: Sugerir qué celdas analizar
  - [x] Nivel 3: Revelar un par completo con explicación
- [x] Modo "Resolver paso a paso"
  - [x] Mostrar puzzle ya resuelto
  - [x] Explicar razonamiento de cada par encontrado
  - [x] Navegación entre pasos
- [x] Desafío diario (backend completo)
  - [x] Generar puzzle único del día (mismo para todos los usuarios)
  - [x] Usar seed basado en fecha para reproducibilidad
  - [x] Guardar tiempo del usuario en backend
  - [x] API para tabla de clasificación global de mejores tiempos
  - [x] API para obtener posición del usuario en el ranking
  - [ ] Interfaz de usuario para desafío diario (pendiente)
  - [ ] Pantalla de tabla de clasificación (pendiente)


## Reescritura Completa del Generador - Enfoque Correcto ✅
- [x] El generador debe empezar por la LISTA, no por los pares
- [x] Paso 1: Crear lista de 16 números (con repeticiones) según dificultad
- [x] Paso 2: Generar 8 pares usando SOLO números de la lista
- [x] Paso 3: Verificar que suma y producto de cada par sean únicos
- [x] Paso 4: Ocultar 3/5/7 números según dificultad
- [x] Dificultad fácil: números hasta ~100
- [x] Dificultad medio: números hasta ~300
- [x] Dificultad difícil: números hasta ~500+
- [x] Números grandes crean ambigüedad (480 = 20×24, 16×30, 12×40...)
- [x] Todos los tests pasan (26/26)
- [x] Sin errores de TypeScript
- [x] Generador garantiza puzzles solubles


## Correcciones Críticas - Números Razonables
- [x] Eliminar números gigantes (2479, 4020, 5280) - son injugables
- [x] Usar números razonables hasta 3 cifras máximo (factorizables mentalmente)
- [x] La dificultad NO es el tamaño, sino la cantidad de factorizaciones posibles
- [x] Ejemplo: 48 = 6×8, 4×12, 3×16, 2×24 (múltiples opciones = difícil)
- [x] Garantizar SIEMPRE 8 sumas + 8 multiplicaciones (ya implementado)
- [x] Rangos corregidos: Fácil 2-30, Medio 2-50, Difícil 2-100
- [ ] Implementar progresión: complejidad aumenta según progreso del jugador


## Rediseño Fundamental - Belleza Matemática Natural
- [x] Eliminar niveles de dificultad fijos (fácil/medio/difícil) con rangos artificiales
- [x] Rediseñar generador para usar números naturales y variados sin restricciones de rango
- [x] La dificultad debe emerger de las relaciones matemáticas y ambigüedad de factorizaciones
- [x] Implementar dificultad basada SOLO en cantidad de números ocultos en la lista
- [x] Actualizar interfaz: eliminar selector de dificultad o reemplazar por selector de números ocultos
- [x] Generar puzzles donde la belleza matemática sea el foco, no el tamaño de los números
- [x] Los números deben ser variados y naturales (2, 3, 5, 7, 12, 18, 24, 30, 45, etc.)
- [x] La complejidad viene del razonamiento para encontrar los 8 pares, no del tamaño

- [x] Eliminar sistema de estadísticas por dificultad (use-stats.ts, StatsCard)
- [x] Remover referencias a recordGame y estadísticas en la pantalla principal
- [x] Simplificar interfaz enfocándose solo en el juego matemático


## Corrección Fundamental - Reglas Oficiales del Juego
- [x] ERROR CRÍTICO CORREGIDO: Eliminada lista fija INTERESTING_NUMBERS
- [x] El generador ahora: primero crea 8 pares aleatorios, luego construye la lista dinámica
- [x] La lista contiene TODOS los números usados en los pares (con repeticiones correctas)
- [x] Los números son de 1 a 999 (hasta 3 cifras)
- [x] Garantizado: SIEMPRE hay exactamente 8 sumas + 8 productos (balance global)
- [x] Regla 3 implementada: cada par (a,b) genera a+b Y a×b en la grilla
- [x] La lista está en orden ascendente y puede tener repeticiones
- [x] Validación global: verifica que todos los pares tengan suma Y producto
- [x] Validación por pares (paradigma correcto), no por celdas
- [x] Generador produce puzzles SIEMPRE resolubles matemáticamente
- [x] Tests: 26/26 pasando ✅


## Corrección CRÍTICA - Resultados en Grilla (NO pares) ✅
- [x] ERROR FUNDAMENTAL CORREGIDO: Los RESULTADOS en la grilla son máximo 3 cifras (hasta 999)
- [x] Generador: crea pares aleatorios y verifica que suma ≤ 999 Y producto ≤ 999
- [x] Ejemplo: Par (20, 24) → suma = 44, producto = 480 (ambos ≤ 999)
- [x] Los resultados son números factorizables mentalmente
- [x] Permite números primos con par (1, primo) para flexibilidad
- [x] La dificultad viene de la ambigüedad de factorización, no del tamaño
- [x] Tests: 26/26 pasando ✅


## BUG CRÍTICO CORREGIDO - Balance 8+8 garantizado ✅
- [x] El generador ahora garantiza exactamente 8 sumas + 8 productos
- [x] Solución: todos los productos deben ser > suma máxima posible
- [x] Ejemplo: si suma máx = 159, todos los productos son > 159
- [x] Elimina ambigüedad: cualquier resultado > suma máx es definitivamente un producto
- [x] Tests: 26/26 pasando ✅

## UX - Interfaz limpia ✅
- [x] Eliminado el texto "Números ocultos: 5" de la interfaz inicial
- [x] El jugador descubre por sí mismo cuántos números faltan


## BUG CRÍTICO REPORTADO v2.0.0 - Balance Incorrecto ✅ CORREGIDO
- [x] El generador NO estaba garantizando 8 sumas + 8 productos consistentemente
- [x] Puzzle reportado: 43, 99, 714, 194, 680, 896, 65, 31, 54, 198, 672, 50, 60, 504, 306, 103
- [x] Lista visible: 2, 7, ?, 9, 14, ?, 20, 22, 28, 32, 34
- [x] Algunos resultados podían ser tanto suma como producto (43, 99, 65, 31, 54, 50, 60, 103)
- [x] Corregida lógica de maxPossibleSum: ahora considera repeticiones del número más grande
- [x] Creados 3 tests específicos para verificar el bug (tetonor-balance-bug.test.ts)
- [x] Verificado que TODOS los productos sean > maxPossibleSum en TODOS los puzzles
- [x] Tests: 29/29 pasando ✅


## Actualizar Número de Versión
- [x] Cambiar version en app.config.ts de "1.0.0" a "3.3.0" (actualizado)
- [x] Verificar que el APK descargado tenga el nombre correcto con v3.3.0



## BUG CRÍTICO v2.0.1 - La corrección NO funcionó ✅ CORREGIDO
- [x] Puzzle reportado: 496, 70, 960, 42, 156, 72, 92, 855, 56, 528, 43, 272, 372, 68, 25, 672
- [x] Lista visible: 8, 8, 12, ?, ?, 12, 12, ?, 15, 31, 34
- [x] Resultados ambiguos: 70, 72, 92 (¿son sumas o productos?)
- [x] La corrección de maxSum no está funcionando correctamente
- [x] Investigar por qué el generador sigue produciendo puzzles con balance incorrecto
- [x] Ejecutar generador manualmente para reproducir el problema


## Mejoras UX Solicitadas - Enero 2026
- [x] Marcar números del banco en ROJO cuando se usen en la grilla
- [x] Hacer que los números visibles del banco NO sean editables
- [x] Cambiar "?" por espacios en blanco para números ocultos
- [x] Simplificar sistema de pistas a UN SOLO NIVEL (no 3 niveles)
- [x] Hacer que el botón Home funcione (volver a pantalla inicial)
- [x] Verificar que los cambios funcionen correctamente


## BUG CRÍTICO - Banco muestra solo 11 números en lugar de 16 ✅ CORREGIDO
- [x] El banco de números solo mostraba 11 casilleros en lugar de 16
- [x] Esto causaba que el juego fuera imposible de resolver
- [x] Revisado componente NumberList - estaba bien
- [x] Verificado generador - creaba 16 números correctamente
- [x] Problema encontrado: isFixed era undefined en createListWithHiddenNumbers
- [x] Solución: Agregar isFixed: true por defecto, isFixed: false para ocultos
- [x] Ahora el banco muestra correctamente los 16 números


## Mejoras UX - Banco y Grilla (Enero 2026)
- [x] Reducir tamaño de casilleros del banco para mostrar los 16 números sin scroll horizontal
- [x] Eliminar los "?" de los casilleros vacíos de la grilla (dejarlos completamente vacíos)
- [x] Verificar que los cambios se vean bien en el preview


## Nuevas Funcionalidades - Enero 2026
- [x] Eliminar botón Home inferior (el que no funciona) - Tab bar oculto
- [x] Arreglar botón Home superior (icono + "Tetonor") para que vuelva a pantalla inicial sin salir de la app
- [x] Agregar botón de pausa/reanudar para pausar el temporizador
- [x] Implementar animación de celebración con confetti al completar el puzzle
- [x] Crear sistema de estadísticas al finalizar (tiempo, pistas usadas, calificación por estrellas)
- [x] Verificar que todos los cambios funcionen correctamente


## BUG - Números ocultos no se marcan en rojo ✅ CORREGIDO
- [x] Los números visibles del banco SÍ se marcan en rojo cuando se usan
- [x] Los números ocultos (con borde punteado) NO se marcaban en rojo cuando se usaban
- [x] Esto hacía imposible saber qué números ocultos ya fueron usados
- [x] Revisada la lógica de cálculo de números usados en use-tetonor-game.ts
- [x] Solución: Usar completeList[index] para obtener el valor real de números ocultos
- [x] Ahora tanto números visibles como ocultos se marcan en rojo al usarse


## Mejoras Finales - Enero 2026
- [x] Eliminar badge "VERSIÓN ACTUALIZADA v2" de la pantalla inicial
- [x] Agregar indicador visual de progreso "Números usados: X/16" en tiempo real
- [x] Verificar que los cambios funcionen correctamente


## BUG CRÍTICO - Números ocultos NO se marcan en rojo (REAL) ✅ CORREGIDO
- [x] Los números ocultos (borde punteado) NO se estaban marcando en rojo cuando se usaban
- [x] El componente NumberList solo aplicaba el estilo rojo a números con isFixed=true
- [x] Los números ocultos (isFixed=false) ahora TAMBIÉN aplican el estilo rojo cuando isUsed=true
- [x] Modificado el componente ListNumberCell para aplicar estilos condicionales a números ocultos
- [x] Solución: Agregar className condicional con cn() en el View y TextInput de números ocultos


## REFACTORIZACIÓN COMPLETA v2.7.0 ✅ COMPLETADA

### Sistema de pistas (solución global)
- [x] Mover hintsUsed del componente al hook useTetonorGame
- [x] Incluir hintsUsed en el GameState junto con el resto del estado del juego
- [x] Crear función incrementHint en el hook que incremente el contador
- [x] Resetear hintsUsed automáticamente cuando se inicia un nuevo juego
- [x] Exponer hintsUsed desde el hook para que el componente solo lo lea
- [x] Actualizar index.tsx para usar hintsUsed del hook en lugar de useState local
- [x] Eliminar setHintsUsed del componente (ya no es necesario)
- [x] Solución global: el estado ahora vive en el hook, no en el componente

### Limpieza de errores de TypeScript
- [x] Corregidos imports obsoletos en generator.ts (TetonorCell → GridCell, ListItem → ListNumber)
- [x] Eliminada propiedad isHidden que no existe en el tipo ListNumber
- [x] Actualizado script check-list-length.ts para usar propiedades correctas
- [x] 0 errores de TypeScript en toda la aplicación

### Arquitectura limpia y profesional
- [x] Toda la lógica del juego centralizada en el hook useTetonorGame
- [x] Componente principal solo maneja UI y delegación
- [x] Estado centralizado y consistente
- [x] Sin código duplicado
- [x] Sin parches temporales


## BUGS INTRODUCIDOS EN LA REFACTORIZACIÓN - CRÍTICO ✅ CORREGIDOS
- [x] Los números ocultos (borde punteado) NO se marcaban en rojo cuando se usaban en la grilla
- [x] Los números visibles tampoco se marcaban en rojo correctamente
- [x] La lógica de isUsed se rompió durante la refactorización por usar closures obsoletos
- [x] Revisado el hook useTetonorGame y encontrado el problema en los useCallback
- [x] updateGridCell ahora usa setState funcional para garantizar estado actualizado
- [x] updateListValue también usa setState funcional
- [x] incrementHint usa setState funcional
- [x] Creados tests unitarios que verifican la lógica de isUsed (3 tests, todos pasan)
- [x] Probado exhaustivamente TODAS las funcionalidades

## MEJORA - Modal Paso a Paso ✅ COMPLETADA
- [x] Agregado mucho más detalle a la explicación de por qué se elige cada par
- [x] Mostrada la lógica completa con secciones: Visibilidad, Operaciones, Estrategia, Validación
- [x] Agregados emojis para mejor legibilidad
- [x] Incluidas factorizaciones paso a paso con marcas de verificación
- [x] Explicación clara del razonamiento matemático


## BUG CRÍTICO - No se pueden agregar signos de suma y multiplicación ✅ CORREGIDO
- [x] Los botones de + y × en la grilla no funcionaban
- [x] No se podía completar ninguna celda de la grilla
- [x] Problema: updateGridCell tenía `if (!gameState) return;` con useCallback([]), causando que gameState fuera siempre null
- [x] Solución: Mover TODA la lógica dentro del setState funcional, eliminando el early return
- [x] Creados tests unitarios (4 tests, todos pasan)
- [x] Probado exhaustivamente que funcione correctamente


## BUG - Números ocultos se marcan en rojo revelando su valor ✅ CORREGIDO
- [x] Cuando un número se repite (ej: tres 6, dos visibles y uno oculto)
- [x] Al usar el número suficientes veces, se marcaban TODOS (incluyendo el oculto)
- [x] Esto revelaba el valor del número oculto al jugador, rompiendo la mecánica del juego
- [x] Comportamiento esperado: SOLO los números visibles (isFixed=true) deben marcarse en rojo
- [x] Los números ocultos (isFixed=false) NUNCA se marcan en rojo
- [x] Modificada la lógica de isUsed en updateGridCell para verificar isFixed
- [x] Actualizados tests para verificar este comportamiento (2 nuevos tests, todos pasan)


## UX - Números no están bien centrados ✅ CORREGIDO
- [x] Los números del banco están correctamente centrados
- [x] Los números de las casillas pequeñas de la grilla estaban desplazados hacia arriba
- [x] Ajustado el centrado vertical agregando textAlignVertical: "center" y paddingTop/Bottom: 0
- [x] Agregado h-full a className para que el TextInput ocupe toda la altura
- [x] Verificado que se vea bien

## MEJORA - Botón Reiniciar debe limpiar el tablero ✅ COMPLETADA
- [x] Actualmente el botón "Reiniciar" solo reseteaba el reloj
- [x] No limpiaba la grilla ni los números ingresados por el usuario
- [x] Mejorada la función resetGame en el hook para limpiar toda la entrada del usuario
- [x] Ahora limpia: grilla (userNum1, userNum2, userOperation) y lista (valores ocultos)
- [x] Resetea el reloj a 0, hintsUsed a 0, y isPaused a false
- [x] Resetea isUsed en todos los números de la lista
- [x] El botón Reiniciar ahora funciona perfectamente


## MEJORA - Mostrar todos los errores al verificar solución ✅ COMPLETADA
- [x] Actualmente solo mostraba los primeros 3 errores + contador de errores adicionales
- [x] Cambiado para mostrar TODOS los errores en el Alert
- [x] Eliminado el límite de 3 errores (slice(0, 3))
- [x] Ahora el usuario ve todos los errores de una vez


## BUG - Contador de números usados no cuenta números ocultos ✅ CORREGIDO
- [x] El contador mostraba "5/16" cuando había 6 números usados
- [x] Los números ocultos usados no se contaban porque no se marcan en rojo (isUsed: false)
- [x] El contador solo contaba números con isUsed: true
- [x] Solución: Crear función countUsedNumbers() que cuenta números únicos en la grilla
- [x] Ahora cuenta correctamente todos los números usados (visibles y ocultos)

## BUG - Modal Paso a Paso dice que números ocultos son visibles ✅ CORREGIDO
- [x] El modal decía "12 (visible)" cuando 12 tenía borde punteado (es oculto)
- [x] No estaba verificando correctamente la propiedad isFixed
- [x] Problema: usaba puzzle.list.map(item => item.value) que excluye ocultos sin valor
- [x] Solución: usar puzzle.completeList e isFixed para detectar correctamente
- [x] Ahora distingue correctamente entre números visibles y ocultos


## BUG - Contador no cuenta correctamente números repetidos ✅ CORREGIDO
- [x] Si había dos 14 en el banco (ambos marcados en rojo), el contador mostraba "2/16" en lugar de "3/16"
- [x] La función countUsedNumbers() usaba Set que eliminaba duplicados
- [x] Debería contar cuántos números están marcados en rojo en el banco, no cuántos números únicos se usan
- [x] Solución: Revertido a contar directamente números con isUsed: true en la lista
- [x] Ahora cuenta correctamente números repetidos (dos 14 = cuenta 2)


## BUG CRÍTICO - Marca todos los números repetidos cuando solo se usa uno ✅ CORREGIDO
- [x] Si había dos números 14 en el banco y usabas solo un 14 en la grilla
- [x] El sistema marcaba AMBOS números 14 en rojo (incorrecto)
- [x] Debería marcar solo UNO de los 14 en rojo
- [x] La lógica anterior en updateGridCell marcaba todos los números con el mismo valor
- [x] Ahora cuenta cuántas veces se usa cada número y marca solo esa cantidad
- [x] Solución: Usar usedCount y markedCount para marcar solo la cantidad exacta
- [x] Ejemplo: Si usas 14 una vez → marca 1 de los 14. Si usas 14 dos veces → marca ambos 14
- [x] Creados tests unitarios (4 tests, todos pasan)


## BUG - Contador de números usados no cuenta números ocultos ✅ CORREGIDO
- [x] El contador mostraba "7/16" cuando se usaron 11 números (7 visibles + 4 ocultos)
- [x] Solo contaba números con isUsed: true, pero los ocultos nunca tienen isUsed: true
- [x] Ahora cuenta cuántos números únicos se usan en la grilla (visibles + ocultos)
- [x] Solución: countUsedNumbers() ahora recorre la grilla y usa Set para contar únicos
- [x] Cuenta correctamente todos los números usados independientemente de si son visibles u ocultos

## BUG CRÍTICO - Contador de pistas usadas siempre muestra 0 ✅ CORREGIDO
- [x] Usuario confirmaba que borra-descarga-instala APK nuevo, pero pistas seguía mostrando 0
- [x] Problema encontrado: checkSolution() usaba {...gameState} que capturaba closure obsoleto
- [x] Cuando usabas pistas DESPUÉS de que se creó el callback, el gameState dentro del closure NO tenía hintsUsed actualizado
- [x] Solución: Cambiar setGameState({...gameState}) por setGameState(prevState => {...prevState})
- [x] Ahora checkSolution() usa setState funcional para garantizar estado actualizado
- [x] El modal ahora recibe el valor correcto de hintsUsed al completar el juego

## BUG CRÍTICO - Reiniciar NO limpia la grilla correctamente ✅ CORREGIDO
- [x] Los números ingresados en la grilla NO se borraban al hacer clic en "Reiniciar"
- [x] Problema: resetGame usaba {...gameState} que capturaba closure obsoleto
- [x] Solución: Cambiar a setGameState(prevState => ...) para usar estado actualizado
- [x] Ahora resetGame limpia correctamente userNum1, userNum2, userOperation de TODAS las celdas

## BUG CRÍTICO - Números ocultos quedan visibles después de reiniciar ✅ CORREGIDO
- [x] Después de reiniciar, los números que eran ocultos (borde punteado) quedaban visibles
- [x] La lógica ya existía: value: item.isFixed ? item.value : null
- [x] El problema era el closure obsoleto en resetGame
- [x] Ahora con setState funcional, los números ocultos vuelven correctamente a value: null

## MEJORA - Eliminar contador "Números usados: X/16" ✅ COMPLETADO
- [x] El contador era innecesario y complejo
- [x] Con marcar en rojo los números usados es suficiente
- [x] Eliminado el texto "Números usados: 13/16" de la interfaz
- [x] Eliminada la función countUsedNumbers() que ya no se usa
- [x] UX simplificada

## BUG CRÍTICO - "Nuevo juego" NO limpiaba los números ✅ CORREGIDO
- [x] Al hacer clic en "Nuevo juego", NO se borraban los números
- [x] Borra signos (+/×) ✓
- [x] Elimina marcos rojos ✓
- [x] Problema: ResultCell y ListNumberCell tenían estado local (useState) que no se sincronizaba
- [x] Solución: Agregar useEffect para sincronizar estado local con props cuando cambien
- [x] Ahora los números de la grilla se borran correctamente
- [x] Ahora los números ingresados en el banco se borran correctamente

## BUG CRÍTICO - "Reiniciar" NO limpiaba los números ✅ CORREGIDO
- [x] Al hacer clic en "Reiniciar", solo eliminaba marcos rojos
- [x] Problema: ResultCell y ListNumberCell tenían estado local (useState) que no se sincronizaba
- [x] Solución: Agregar useEffect para sincronizar estado local con props cuando cambien
- [x] Ahora resetGame limpia correctamente userNum1, userNum2 de la grilla
- [x] Ahora resetGame limpia correctamente value de números ocultos del banco

## BUG CRÍTICO - Contador de pistas muestra valor incorrecto (EN INVESTIGACIÓN)
- [x] Usuario usó 8 pistas pero el contador muestra 2
- [x] incrementHint() se llama correctamente
- [x] gameState.hintsUsed se actualiza con setState funcional
- [ ] Agregados console.log para depurar el valor en tiempo real
- [ ] Esperando feedback del usuario para ver los logs y entender el problema
- [ ] Posible causa: React agrupa actualizaciones y el modal lee valor obsoleto

## SIMPLIFICACIÓN - Eliminar contador de pistas completamente ✅ COMPLETADO
- [x] El contador de pistas complicaba demasiado el juego
- [x] Eliminado "Pistas usadas: X" del modal de estadísticas
- [x] Eliminado hintsUsed del estado del juego (GameState)
- [x] Eliminado incrementHint() del hook
- [x] Eliminados console.log de debug
- [x] El botón "Paso a Paso" sigue funcionando, sin contar pistas
- [x] UX simplificada

## BUG - maxLength limitaba a 2 dígitos en la grilla ✅ CORREGIDO
- [x] La app no dejaba ingresar más de 2 dígitos en los campos de la grilla
- [x] Algunos números de la lista tienen 3 dígitos (100, 91, 72, etc.)
- [x] Aumentado maxLength de 2 a 3 en ResultCell
- [x] Ahora se pueden ingresar números de hasta 3 dígitos
