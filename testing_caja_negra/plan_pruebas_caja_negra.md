# Plan de Pruebas de Caja Negra - Restaurante Bambú

## Sistema de Pedidos en Línea

---

## 1. Introducción

Este documento presenta el **Plan de Pruebas de Caja Negra** para el Sistema de Pedidos en Línea del Restaurante Bambú, siguiendo estrictamente la **Estrategia de Prueba de Software** descrita por Roger S. Pressman en el Capítulo 17 (páginas 384-404) de _Ingeniería del Software: Un Enfoque Práctico_ (7ª edición).

### 1.1 Contexto Teórico - Pressman

Las **pruebas de caja negra**, también conocidas como **pruebas de comportamiento**, se enfocan en los **requerimientos funcionales** del software. Examinan el dominio de la información (entradas y salidas) sin considerar la estructura lógica interna del programa.

**Objetivos de las Pruebas de Caja Negra** (Pressman, p. 385):

- Encontrar funciones incorrectas o faltantes
- Detectar errores de interfaz
- Identificar errores en estructuras de datos o acceso a bases de datos externas
- Descubrir errores de comportamiento o rendimiento
- Localizar errores de inicialización y terminación

### 1.2 Alcance del Documento

Este plan cubre:

- **Fase I**: Pruebas de Validación (RF-01 a RF-24)
- **Fase II**: Pruebas del Sistema (5 tipos: Recuperación, Seguridad, Esfuerzo, Rendimiento, Despliegue)
- **Técnicas Aplicadas**: Partición de Equivalencia y Análisis de Valor de Frontera

---

## 2. Estrategia Global de Pruebas

### 2.1 Enfoque en Espiral (Pressman, p. 388)

La estrategia de prueba para software sigue un enfoque en espiral que **comienza "por lo pequeño"** y avanza **"hacia lo grande"**:

```
┌─────────────────────────────────────────────────────────┐
│              ESTRATEGIA DE PRUEBA EN ESPIRAL             │
└─────────────────────────────────────────────────────────┘

    Pruebas de Unidad (componentes individuales)
           ↓
    Pruebas de Integración (módulos combinados)
           ↓
    PRUEBAS DE VALIDACIÓN ← [ENFOQUE CAJA NEGRA]
           ↓
    PRUEBAS DEL SISTEMA ← [ENFOQUE CAJA NEGRA]
```

Para el proyecto Restaurante Bambú, nos enfocaremos en las **etapas superiores** donde las técnicas de caja negra son predominantes:

1. **Pruebas de Validación**: Garantizar que el software cumple con todos los requerimientos funcionales especificados
2. **Pruebas del Sistema**: Ejercitar completamente el sistema verificando aspectos no funcionales

### 2.2 Criterios de Validación (Pressman, p. 399)

> "La validación se logra mediante una serie de pruebas de caja negra que demuestran la conformidad con los requisitos."

**Fuente de Casos de Prueba**: Los 24 Requisitos Funcionales (RF-01 a RF-24) documentados en [info.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/info.md).

**Condiciones de Salida** (Pressman, p. 400):

- ✅ **Función se ajusta a especificación** → Caso PASADO
- ❌ **Desviación de la especificación** → Defecto registrado, lista de deficiencias creada

---

## 3. FASE I: Pruebas de Validación

### 3.1 Objetivo

Demostrar que **cada función** cumple con su especificación funcional mediante pruebas de caja negra.

### 3.2 Organización de Casos de Prueba

Los casos de prueba se organizan en **5 módulos funcionales**:

| Módulo                   | Requisitos Funcionales | N° Casos Diseñados | Documento                                                                                                                                                                 |
| ------------------------ | ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Autenticación**        | RF-01, RF-02           | 8                  | [casos_prueba_validacion.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_validacion.md#módulo-1-autenticación)        |
| **Gestión de Productos** | RF-05 a RF-11          | 12                 | [casos_prueba_validacion.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_validacion.md#módulo-2-gestión-de-productos) |
| **Carrito y Checkout**   | RF-12 a RF-18          | 15                 | [casos_prueba_validacion.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_validacion.md#módulo-3-carrito-y-checkout)   |
| **Gestión de Pedidos**   | RF-19 a RF-24          | 10                 | [casos_prueba_validacion.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_validacion.md#módulo-4-gestión-de-pedidos)   |
| **Perfil y Usuarios**    | RF-03, RF-04           | 8                  | [casos_prueba_validacion.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_validacion.md#módulo-5-perfil-y-usuarios)    |
| **TOTAL**                | **24 RF**              | **53 casos**       | -                                                                                                                                                                         |

### 3.3 Estructura de Caso de Prueba

Cada caso de prueba incluye:

- **ID**: Identificador único (ej. CP-AUTH-01)
- **Nombre**: Descripción breve
- **RF Relacionado**: Trazabilidad a requisito funcional
- **Prioridad**: Alta / Media / Baja
- **Precondiciones**: Estado inicial requerido
- **Datos de Entrada**: Valores específicos de prueba
- **Pasos de Ejecución**: Procedimiento detallado
- **Resultado Esperado**: Output según especificación
- **Criterio de Éxito**: Condiciones de aceptación

### 3.4 Pruebas Alfa y Beta (Pressman, p. 400)

**Prueba Alfa**:

- Realizada en el sitio de desarrollo
- Cliente observa al desarrollador ejecutar casos de prueba
- Entorno controlado

**Prueba Beta** (Recomendada para siguientes iteraciones):

- Realizada por clientes reales en sus propios entornos
- Uso del software con datos reales de restaurante
- Reportes de problemas al equipo de desarrollo

---

## 4. FASE II: Pruebas del Sistema

### 4.1 Objetivo (Pressman, p. 401)

> "Las pruebas del sistema son una serie de diferentes pruebas cuyo propósito principal es ejercitar por completo el sistema basado en computadora."

Verificar que **todos los elementos del sistema** (hardware, software, personas, datos) se hayan **integrado adecuadamente** y **realicen las funciones asignadas**.

### 4.2 Tipos de Pruebas del Sistema (Pressman 17.7)

#### 4.2.1 Pruebas de Recuperación (p. 401)

**Objetivo**: Forzar al software a fallar de diversas formas y verificar que la **recuperación se realice apropiadamente**.

**Aplicación al Proyecto**:

- Simular caída del servidor MongoDB durante checkout
- Interrumpir proceso de pago en Stripe
- Verificar integridad transaccional de pedidos
- Validar manejo de timeouts y reintentos

**Casos**: CP-REC-01 a CP-REC-05 (5 casos)

**Documento**: [casos_prueba_sistema.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_sistema.md#1-pruebas-de-recuperación)

---

#### 4.2.2 Pruebas de Seguridad (p. 402)

**Objetivo**: Verificar que los **mecanismos de protección** incorporados al sistema lo protejan de **intrusiones indebidas**.

**Aplicación al Proyecto** (alineado con RSEG-01 a RSEG-06):

- Intentar acceso a rutas `/api/users` sin autenticación
- Inyección NoSQL en campos de entrada
- Validación de firma de webhooks Stripe
- Verificar que contraseñas estén hasheadas (bcrypt)
- Protección CSRF en formularios
- Validación OWASP Top 10

**Casos**: CP-SEC-01 a CP-SEC-10 (10 casos)

**Documento**: [casos_prueba_sistema.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_sistema.md#2-pruebas-de-seguridad)

---

#### 4.2.3 Pruebas de Esfuerzo (Stress Testing) (p. 402)

**Objetivo**: Ejecutar el sistema de forma que demande **recursos en cantidad, frecuencia o volumen anormales**.

**Aplicación al Proyecto**:

- 500 usuarios concurrentes navegando el menú
- 50+ transacciones por segundo en checkout
- Carga masiva de imágenes al catálogo
- Múltiples webhooks simultáneos de Stripe

**Criterio de Pressman** (p. 403):

> "Las pruebas de esfuerzo ejecutan el sistema hasta que falla. Permiten entender los límites operacionales."

**Casos**: CP-STR-01 a CP-STR-05 (5 casos)

**Documento**: [casos_prueba_sistema.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_sistema.md#3-pruebas-de-esfuerzo)

---

#### 4.2.4 Pruebas de Rendimiento (p. 403)

**Objetivo**: Probar el rendimiento del software en **tiempo de ejecución** dentro del contexto del sistema integrado.

**Aplicación al Proyecto** (alineado con RNF-05 a RNF-07):

- Tiempo de respuesta APIs < 500ms
- Tasa de error < 1%
- Tiempo de carga de páginas < 2 segundos
- Métricas Core Web Vitals (LCP, FID, CLS)
- Lighthouse Performance Score > 90

**Casos**: CP-PERF-01 a CP-PERF-08 (8 casos)

**Documento**: [casos_prueba_sistema.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_sistema.md#4-pruebas-de-rendimiento)

---

#### 4.2.5 Pruebas de Despliegue (p. 403)

**Objetivo**: Ejercitar el software en **cada entorno** en el que debe operar (sistema operativo, navegadores, dispositivos).

**Aplicación al Proyecto** (alineado con RNF-02):

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari Desktop y Mobile (iOS 14+)
- Chrome Mobile (Android 10+)
- Responsive design: 320px (móvil) a 2560px (desktop)

**Casos**: CP-DEP-01 a CP-DEP-05 (5 casos)

**Documento**: [casos_prueba_sistema.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_sistema.md#5-pruebas-de-despliegue)

---

### 4.3 Resumen de Pruebas del Sistema

| Tipo de Prueba | Casos Diseñados | Requisitos NFR Relacionados |
| -------------- | --------------- | --------------------------- |
| Recuperación   | 5               | RFIA-01 a RFIA-04           |
| Seguridad      | 10              | RSEG-01 a RSEG-06           |
| Esfuerzo       | 5               | -                           |
| Rendimiento    | 8               | RNF-05 a RNF-07             |
| Despliegue     | 5               | RNF-02                      |
| **TOTAL**      | **33 casos**    | -                           |

---

## 5. Técnicas de Caja Negra Aplicadas

### 5.1 Partición de Equivalencia (PE)

**Definición** (Pressman, p. 411):

> "Divide el dominio de entrada en clases de datos a partir de las cuales se derivan casos de prueba. Un caso de prueba ideal descubre una clase de errores completa."

**Aplicación**: Todos los campos de entrada del sistema están particionados en clases válidas e inválidas.

**Ejemplo**:

- Campo **Precio** de producto:
  - Clase Válida: números positivos > 0 (ej. 25.50, 100)
  - Clase Inválida: negativos (-10), cero (0), texto ("abc"), símbolos ($%&)

**Documento**: [tecnicas_caja_negra.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/tecnicas_caja_negra.md#1-partición-de-equivalencia)

### 5.2 Análisis de Valor de Frontera (AVF)

**Definición** (Pressman, p. 413):

> "Complementa la partición de equivalencia seleccionando casos de prueba en los 'bordes' de la clase de entrada, donde la probabilidad de errores es mayor."

**Aplicación**: Valores en límites y justo fuera de límites para campos numéricos.

**Ejemplo**:

- Campo **Cantidad en Carrito** (límite máximo: 50):
  - Valores de prueba: 49, **50**, **51**
  - Se espera que 49 y 50 sean aceptados, 51 rechazado o limitado

**Documento**: [tecnicas_caja_negra.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/tecnicas_caja_negra.md#2-análisis-de-valor-de-frontera)

---

## 6. Trazabilidad y Cobertura

### 6.1 Matriz de Trazabilidad Requisitos → Casos de Prueba

Garantiza que **cada requisito funcional** tiene **al menos un caso de prueba** que lo valida.

**Cobertura Objetivo**: 100% de los 24 RF

**Documento**: [matriz_trazabilidad.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/matriz_trazabilidad.md#matriz-1-requisitos--casos-de-prueba)

### 6.2 Matriz de Trazabilidad Casos de Prueba → Endpoints API

Mapea cada caso de prueba con los **endpoints de API** que ejercita, facilitando la identificación de áreas con poca cobertura.

**Documento**: [matriz_trazabilidad.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/matriz_trazabilidad.md#matriz-2-casos-de-prueba--endpoints-api)

### 6.3 Matriz NFR → Pruebas del Sistema

Rastrea la cobertura de **requisitos no funcionales** mediante las 5 categorías de pruebas del sistema.

**Documento**: [matriz_trazabilidad.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/matriz_trazabilidad.md#matriz-3-nfr--pruebas-del-sistema)

---

## 7. Ejecución y Registro de Resultados

### 7.1 Plantilla de Ejecución

Para el registro sistemático de resultados de pruebas se utiliza la plantilla estandarizada que incluye:

- Información de la sesión de pruebas
- Registro detallado de cada caso ejecutado
- Estado: ✅ Pasó / ❌ Falló / ⏸️ Bloqueado / ⏭️ Omitido
- Evidencias (capturas de pantalla, logs)
- Defectos encontrados
- Resumen estadístico

**Documento**: [plantilla_ejecucion_pruebas.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/plantilla_ejecucion_pruebas.md)

### 7.2 Ciclo de Ejecución

```
┌──────────────────────────────────────────────────┐
│         CICLO DE EJECUCIÓN DE PRUEBAS            │
└──────────────────────────────────────────────────┘

1. Preparar entorno de pruebas
   ↓
2. Ejecutar casos de Validación (53 casos)
   ↓
3. Registrar resultados y defectos
   ↓
4. Ejecutar Pruebas del Sistema (33 casos)
   ↓
5. Compilar reporte final
   ↓
6. Decisión: ¿Cumple criterios de aceptación?
   → SÍ: Software validado ✅
   → NO: Iterar correcciones y re-probar ❌
```

---

## 8. Criterios de Aceptación Global

### 8.1 Pruebas de Validación

- ✅ **Cobertura**: 100% de RF (24/24) tienen casos de prueba ejecutados
- ✅ **Tasa de Éxito**: ≥ 95% de casos PASADOS
- ✅ **Defectos Críticos**: 0 defectos que bloqueen funcionalidad principal
- ✅ **Defectos Mayores**: ≤ 3 defectos mayores pendientes

### 8.2 Pruebas del Sistema

- ✅ **Recuperación**: Sistema recupera estado consistente tras fallas
- ✅ **Seguridad**: 0 vulnerabilidades críticas o altas (OWASP)
- ✅ **Esfuerzo**: Sistema mantiene funcionalidad hasta 400 usuarios concurrentes
- ✅ **Rendimiento**: APIs responden < 500ms en 95% de peticiones
- ✅ **Despliegue**: 100% compatibilidad en navegadores objetivo

---

## 9. Resumen de Documentación

Este plan se complementa con los siguientes documentos técnicos:

| Documento                 | Propósito                        | Ubicación                                                                                                                                           |
| ------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plan de Pruebas**       | Estrategia global y organización | _Este documento_                                                                                                                                    |
| **Casos de Validación**   | 53 casos para RF-01 a RF-24      | [casos_prueba_validacion.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_validacion.md)         |
| **Casos del Sistema**     | 33 casos para NFR (5 tipos)      | [casos_prueba_sistema.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_sistema.md)               |
| **Técnicas Caja Negra**   | PE y AVF aplicados               | [tecnicas_caja_negra.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/tecnicas_caja_negra.md)                 |
| **Matrices Trazabilidad** | Cobertura RF/NFR                 | [matriz_trazabilidad.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/matriz_trazabilidad.md)                 |
| **Plantilla Ejecución**   | Formulario de registro           | [plantilla_ejecucion_pruebas.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/plantilla_ejecucion_pruebas.md) |

---

## 10. Referencias

- **Pressman, R. S.** (2010). _Ingeniería del Software: Un Enfoque Práctico_ (7ª ed.). McGraw-Hill. Capítulo 17: Estrategias de Prueba de Software (pp. 384-404).
- **Información del Proyecto**: [info.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/info.md)
- **Requisitos Funcionales**: RF-01 a RF-24 (Sección 3 de info.md)
- **Requisitos No Funcionales**: RNF-01 a RNF-07, RSEG-01 a RSEG-06, RFIA-01 a RFIA-04 (Sección 4 de info.md)

---

**Elaborado por**: Equipo de Testing - Restaurante Bambú  
**Fecha**: 26 de noviembre de 2024  
**Versión**: 1.0  
**Estado**: Aprobado para Ejecución
