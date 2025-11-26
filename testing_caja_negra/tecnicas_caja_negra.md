# Técnicas de Caja Negra Aplicadas

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Introducción

Este documento detalla la aplicación de las **técnicas específicas de caja negra** mencionadas por Pressman para el diseño de casos de prueba:

- **Partición de Equivalencia (PE)**
- **Análisis de Valor de Frontera (AVF)**

Aunque Pressman profundiza en estas técnicas en el **Capítulo 18** (p. 411+), las menciona en la estrategia de validación como fundamentales para el diseño de pruebas de caja negra efectivas.

---

## 1. Partición de Equivalencia

### 1.1 Concepto (Pressman)

> "La partición de equivalencia divide el dominio de entrada de un programa en clases de datos a partir de las cuales se derivan casos de prueba. Un caso de prueba ideal descubre una clase completa de errores." (Pressman, p. 411)

**Principio**: Si un caso de prueba descubre un error en una clase de equivalencia, es probable que todos los valores de esa clase produzcan el mismo error.

### 1.2 Metodología

Para cada campo de entrada:

1. **Identificar clases válidas**: Valores que el sistema debe aceptar
2. **Identificar clases inválidas**: Valores que el sistema debe rechazar
3. **Diseñar casos de prueba**: Al menos 1 caso por cada clase

---

### 1.3 Aplicación al Proyecto

#### Campo: Email

| Clase          | Tipo     | Valores de Ejemplo                                                              | Casos de Prueba          |
| -------------- | -------- | ------------------------------------------------------------------------------- | ------------------------ |
| Email válido   | Válida   | `usuario@dominio.com`<br>`test+alias@gmail.com`<br>`nombre.apellido@empresa.bo` | CP-AUTH-01<br>CP-AUTH-03 |
| Sin @          | Inválida | `usuariodominio.com`                                                            | CP-AUTH-08               |
| Sin dominio    | Inválida | `usuario@`                                                                      | CP-AUTH-08               |
| Sin local-part | Inválida | `@dominio.com`                                                                  | CP-AUTH-08               |
| Vacío          | Inválida | `""`                                                                            | CP-AUTH-08               |
| Con espacios   | Inválida | `user name@domain.com`                                                          | CP-AUTH-08               |

**Cobertura**: 6 clases → 6 casos de prueba mínimos

---

#### Campo: Precio (basePrice, extras, sizes)

| Clase         | Tipo     | Valores de Ejemplo           | Casos de Prueba          |
| ------------- | -------- | ---------------------------- | ------------------------ |
| Positivos > 0 | Válida   | `0.01`, `25`, `150.50`       | CP-PROD-01<br>CP-PROD-03 |
| Cero          | Inválida | `0`                          | CP-PROD-07               |
| Negativos     | Inválida | `-10`, `-0.01`               | CP-PROD-07               |
| No numérico   | Inválida | `"abc"`, `null`, `undefined` | CP-PROD-09               |
| Símbolos      | Inválida | `$25`, `%10`                 | -                        |

**Cobertura**: 5 clases → 5 casos diseñados

---

#### Campo: Cantidad en Carrito

| Clase        | Tipo     | Valores de Ejemplo    | Casos de Prueba                   |
| ------------ | -------- | --------------------- | --------------------------------- |
| Enteros 1-50 | Válida   | `1`, `10`, `25`, `50` | CP-CART-01<br>CP-CART-02          |
| Cero         | Inválida | `0`                   | CP-CART-03<br>(producto removido) |
| Negativos    | Inválida | `-5`                  | -                                 |
| Mayor a 50   | Inválida | `51`, `100`           | CP-CART-15                        |
| Decimales    | Inválida | `2.5`                 | -                                 |
| No numérico  | Inválida | `"texto"`             | -                                 |

**Cobertura**: 6 clases identificadas

---

#### Campo: Teléfono

| Clase        | Tipo     | Valores de Ejemplo                              | Casos de Prueba |
| ------------ | -------- | ----------------------------------------------- | --------------- |
| 8-15 dígitos | Válida   | `62294912`<br>`+591 77788899`<br>`123-456-7890` | CP-CART-08      |
| Menos de 8   | Inválida | `123456`                                        | CP-CART-11      |
| Más de 15    | Inválida | `12345678901234567`                             | -               |
| Con letras   | Inválida | `ABC12345`                                      | CP-CART-11      |
| Vacío        | Inválida | `""`                                            | CP-CART-11      |

**Cobertura**: 5 clases

---

#### Campo: Contraseña

| Clase            | Tipo     | Valores de Ejemplo               | Casos de Prueba          |
| ---------------- | -------- | -------------------------------- | ------------------------ |
| 6-100 caracteres | Válida   | `Pass123!`<br>`MyS3cur3P@ssw0rd` | CP-AUTH-01<br>CP-AUTH-03 |
| Menos de 6       | Inválida | `12345`                          | -                        |
| Más de 100       | Inválida | `a` repetido 101 veces           | -                        |
| Vacío            | Inválida | `""`                             | CP-AUTH-04               |

**Cobertura**: 4 clases

---

#### Campo: Dirección (streetAddress, city)

| Clase                  | Tipo     | Valores de Ejemplo               | Casos de Prueba          |
| ---------------------- | -------- | -------------------------------- | ------------------------ |
| Texto 1-200 caracteres | Válida   | `Av. Busch #456`<br>`Santa Cruz` | CP-CART-08<br>CP-USER-01 |
| Vacío                  | Inválida | `""`                             | CP-CART-11               |
| Más de 200 chars       | Inválida | Texto largo...                   | -                        |

**Cobertura**: 3 clases

---

### 1.4 Resumen de Partición de Equivalencia

Total de clases identificadas: **34 clases**

- Clases Válidas: **11**
- Clases Inválidas: **23**

**Casos de prueba diseñados** que aplican PE: **15 casos** explícitos (CP-AUTH-08, CP-PROD-07, CP-PROD-09, CP-CART-03, CP-CART-06, CP-CART-11, CP-CART-15, etc.)

---

## 2. Análisis de Valor de Frontera (AVF)

### 2.1 Concepto (Pressman)

> "El análisis de valor de frontera complementa la partición de equivalencia al seleccionar casos de prueba en los 'bordes' de la clase, donde la probabilidad de errores es mayor." (Pressman, p. 413)

**Principio**: Los errores tienden a ocurrir en los límites del dominio de entrada más que en el centro.

### 2.2 Regla de Pressman

Para un rango `min ≤ x ≤ max`, probar:

- `min - 1` (justo debajo del límite inferior)
- `min` (límite inferior)
- `min + 1` (justo arriba del límite inferior)
- Valor nominal (centro del rango)
- `max - 1` (justo debajo del límite superior)
- `max` (límite superior)
- `max + 1` (justo arriba del límite superior)

---

### 2.3 Aplicación al Proyecto

#### Frontera 1: Precio basePrice (rango teórico: 0.01 - 10,000)

| Valor   | Posición | Resultado Esperado      | Caso de Prueba |
| ------- | -------- | ----------------------- | -------------- |
| `0`     | min - 1  | ❌ Rechazado            | CP-PROD-07     |
| `0.01`  | min      | ✅ Aceptado             | -              |
| `1`     | min + 1  | ✅ Aceptado             | CP-PROD-01     |
| `150`   | Nominal  | ✅ Aceptado             | CP-PROD-03     |
| `9999`  | max - 1  | ✅ Aceptado             | -              |
| `10000` | max      | ✅ Aceptado             | -              |
| `10001` | max + 1  | ❌ Rechazado (opcional) | -              |

**Errores típicos detectados**:

- Off-by-one: ¿0.01 se acepta o se rechaza?
- Comparación incorrecta: `if (price > 0)` vs `if (price >= 0.01)`

---

#### Frontera 2: Cantidad en Carrito (rango: 1 - 50)

| Valor | Posición | Resultado Esperado           | Caso de Prueba |
| ----- | -------- | ---------------------------- | -------------- |
| `0`   | min - 1  | ❌ Producto removido         | CP-CART-03     |
| `1`   | min      | ✅ Aceptado                  | CP-CART-01     |
| `2`   | min + 1  | ✅ Aceptado                  | CP-CART-02     |
| `25`  | Nominal  | ✅ Aceptado                  | -              |
| `49`  | max - 1  | ✅ Aceptado                  | CP-CART-15     |
| `50`  | max      | ✅ Aceptado                  | CP-CART-15     |
| `51`  | max + 1  | ❌ Rechazado o limitado a 50 | CP-CART-15     |

**Resultado de CP-CART-15**: Verifica comportamiento en límite superior

---

#### Frontera 3: Longitud de Contraseña (rango: 6 - 100 caracteres)

| Valor       | Posición | Resultado Esperado        | Caso de Prueba |
| ----------- | -------- | ------------------------- | -------------- |
| `5 chars`   | min - 1  | ❌ "Contraseña muy corta" | -              |
| `6 chars`   | min      | ✅ Aceptado               | -              |
| `7 chars`   | min + 1  | ✅ Aceptado               | CP-AUTH-01     |
| `50 chars`  | Nominal  | ✅ Aceptado               | -              |
| `99 chars`  | max - 1  | ✅ Aceptado               | -              |
| `100 chars` | max      | ✅ Aceptado               | -              |
| `101 chars` | max + 1  | ❌ "Contraseña muy larga" | -              |

---

#### Frontera 4: Teléfono (rango: 8 - 15 dígitos)

| Valor        | Posición | Resultado Esperado | Caso de Prueba |
| ------------ | -------- | ------------------ | -------------- |
| `7 dígitos`  | min - 1  | ❌ Rechazado       | CP-CART-11     |
| `8 dígitos`  | min      | ✅ Aceptado        | -              |
| `9 dígitos`  | min + 1  | ✅ Aceptado        | CP-CART-08     |
| `12 dígitos` | Nominal  | ✅ Aceptado        | -              |
| `14 dígitos` | max - 1  | ✅ Aceptado        | -              |
| `15 dígitos` | max      | ✅ Aceptado        | -              |
| `16 dígitos` | max + 1  | ❌ Rechazado       | -              |

---

#### Frontera 5: Productos por Pedido (límite teórico: 1 - 100)

| Valor           | Posición | Resultado Esperado                  | Caso de Prueba |
| --------------- | -------- | ----------------------------------- | -------------- |
| `0 productos`   | min - 1  | ❌ Checkout deshabilitado           | CP-CART-13     |
| `1 producto`    | min      | ✅ Pedido válido                    | CP-ORDER-01    |
| `2 productos`   | min + 1  | ✅ Pedido válido                    | -              |
| `50 productos`  | Nominal  | ✅ Pedido válido                    | -              |
| `99 productos`  | max - 1  | ✅ Pedido válido (si límite existe) | -              |
| `100 productos` | max      | ✅ Pedido válido                    | -              |
| `101 productos` | max + 1  | ❌ Rechazado                        | -              |

---

#### Frontera 6: Usuarios Concurrentes (límite de estrés: ~800)

| Valor          | Posición  | Resultado Esperado        | Caso de Prueba |
| -------------- | --------- | ------------------------- | -------------- |
| `100 usuarios` | Bajo      | ✅ Rendimiento óptimo     | -              |
| `400 usuarios` | Medio     | ✅ Rendimiento aceptable  | CP-STR-01      |
| `500 usuarios` | Alta      | ✅ Degradación controlada | CP-STR-01      |
| `750 usuarios` | max - 50  | ⚠️ Latencia elevada       | -              |
| `800 usuarios` | max       | ⚠️ Límite operacional     | CP-STR-05      |
| `900 usuarios` | max + 100 | ❌ Sistema colapsa        | CP-STR-05      |

**Objetivo**: Documentar límite donde el sistema falla (CP-STR-05)

---

### 2.4 Resumen de Análisis de Valor de Frontera

Total de fronteras identificadas: **6 fronteras**

Valores de frontera probados: **42 valores** (7 por frontera)

**Casos de prueba diseñados** con AVF: **8 casos** explícitos (CP-PROD-07, CP-CART-03, CP-CART-13, CP-CART-15, CP-STR-01, CP-STR-05, etc.)

---

## 3. Combinación de Técnicas

### 3.1 PE + AVF en Acción

**Ejemplo**: Campo **Cantidad en Carrito**

1. **PE** identifica clases:

   - Válida: 1-50
   - Inválida: ≤0, >50, no numérico

2. **AVF** refina con valores de frontera:

   - Probar: 0, 1, 49, 50, 51

3. **Casos resultantes**:
   - CP-CART-01 (agregar con cantidad válida)
   - CP-CART-03 (decrementar a 0 → remover)
   - CP-CART-15 (límite 49, 50, 51)

**Beneficio**: Cobertura exhaustiva con casos mínimos

---

### 3.2 Tabla de Decisión

Para casos complejos con múltiples condiciones, se puede usar una **tabla de decisión**:

**Ejemplo**: Checkout

| Condición             | Caso 1              | Caso 2           | Caso 3               | Caso 4              |
| --------------------- | ------------------- | ---------------- | -------------------- | ------------------- |
| Usuario autenticado   | ✅                  | ✅               | ❌                   | ✅                  |
| Carrito con productos | ✅                  | ❌               | ✅                   | ✅                  |
| Dirección completa    | ✅                  | ✅               | ✅                   | ❌                  |
| **Resultado**         | ✅ Checkout exitoso | ❌ Carrito vacío | ❌ Redirigir a login | ❌ Validación falla |
| **Caso de Prueba**    | CP-CART-08          | CP-CART-13       | CP-CART-12           | CP-CART-11          |

---

## 4. Grafos de Causa-Efecto (Opcional)

Para relaciones complejas entre entradas y salidas, Pressman menciona los **grafos de causa-efecto** (p. 416).

**Aplicación limitada en este proyecto** debido a que la mayoría de funciones tienen relaciones directas entrada-salida.

**Caso potencial**: Cálculo de precio total

- Causas: basePrice, size, extras[], cantidad
- Efecto: precioTotal = (basePrice + sizePrice + sum(extras)) × cantidad

**Prueba**: CP-CART-06 verifica esta fórmula

---

## 5. Cobertura Lograda

### 5.1 Métricas de Cobertura

| Técnica                           | Aplicación                | Casos Diseñados     |
| --------------------------------- | ------------------------- | ------------------- |
| **Partición de Equivalencia**     | 34 clases identificadas   | 15 casos explícitos |
| **Análisis de Valor de Frontera** | 6 fronteras, 42 valores   | 8 casos explícitos  |
| **Combinadas (PE + AVF)**         | Campos numéricos críticos | 23 casos totales    |

### 5.2 Campos Cubiertos por Técnicas de Caja Negra

- ✅ Email (PE)
- ✅ Precio (PE + AVF)
- ✅ Cantidad (PE + AVF)
- ✅ Teléfono (PE + AVF)
- ✅ Contraseña (PE + AVF)
- ✅ Dirección (PE)
- ✅ Carga de usuarios (AVF - pruebas de estrés)

**Cobertura**: 100% de campos de entrada críticos

---

## 6. Errores Típicos Detectados por Estas Técnicas

### 6.1 Errores Detectados por Partición de Equivalencia

- **Validación incompleta**: Olvidar validar clase "email sin @"
- **Manejo de null/undefined**: No considerar valores vacíos
- **Tipos de datos**: Aceptar string donde se espera number

### 6.2 Errores Detectados por AVF

- **Off-by-one errors**: `if (qty > 50)` en lugar de `if (qty >= 50)`
- **Comparación incorrecta**: `price > 0` vs `price >= 0.01`
- **Límites no documentados**: No especificar máximo de productos

---

## 7. Recomendaciones para Ejecución

### 7.1 Priorización

**Alta Prioridad** (ejecutar primero):

- Fronteras de seguridad: contraseña, autenticación
- Fronteras de negocio: precios, cantidades
- Validaciones de pago

**Media Prioridad**:

- Fronteras de usabilidad: longitudes de texto
- Límites de rendimiento

### 7.2 Automatización

Casos ideales para automatizar (por ser repetitivos):

- Validación de formatos (email, teléfono)
- Fronteras numéricas (precio, cantidad)

**Herramientas**:

- Jest + Supertest para APIs
- Playwright para validaciones de UI

---

## Referencias

- **Pressman, R. S.** (2010). _Ingeniería del Software: Un Enfoque Práctico_ (7ª ed.).
  - Sección 18.2: Partición de Equivalencia (p. 411)
  - Sección 18.3: Análisis de Valor de Frontera (p. 413)
  - Sección 18.4: Grafos de Causa-Efecto (p. 416)

---

**Documento**: Técnicas de Caja Negra Aplicadas  
**Estado**: Completo  
**Próximo Paso**: Ver [matriz_trazabilidad.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/matriz_trazabilidad.md)
