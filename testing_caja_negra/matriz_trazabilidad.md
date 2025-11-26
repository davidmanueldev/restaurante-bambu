# Matrices de Trazabilidad

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Introducción

Las **matrices de trazabilidad** son herramientas fundamentales para garantizar la **cobertura completa** de requisitos mediante casos de prueba. Permiten rastrear la relación bidireccional entre:

- Requisitos Funcionales ↔ Casos de Prueba
- Casos de Prueba ↔ Endpoints API
- Requisitos No Funcionales ↔ Pruebas del Sistema

**Propósito** (según Pressman):

> "Las pruebas de validación se basan en los criterios de validación establecidos. La base para el diseño de las pruebas son los requerimientos del software." (p. 399)

---

## Matriz 1: Requisitos Funcionales → Casos de Prueba

### Objetivo

Garantizar que **cada requisito funcional (RF)** tiene al menos un caso de prueba que lo valide.

**Meta de Cobertura**: 100% (24/24 RF cubiertos)

---

### Módulo: Autenticación

| RF ID | Requisito           | Prioridad | Casos de Prueba                                                                                                                      | Cobertura |
| ----- | ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| RF-01 | Registro de usuario | Alta      | CP-AUTH-01 (Registro exitoso)<br>CP-AUTH-02 (Email duplicado)<br>CP-AUTH-07 (Hash bcrypt)<br>CP-AUTH-08 (Validación email)           | ✅ 100%   |
| RF-02 | Inicio de sesión    | Alta      | CP-AUTH-03 (Login exitoso)<br>CP-AUTH-04 (Credenciales incorrectas)<br>CP-AUTH-05 (Google OAuth)<br>CP-AUTH-06 (Persistencia sesión) | ✅ 100%   |

**Subtotal Autenticación**: 2 RF → 8 casos de prueba

---

### Módulo: Perfil y Usuarios

| RF ID | Requisito         | Prioridad | Casos de Prueba                                                                                     | Cobertura |
| ----- | ----------------- | --------- | --------------------------------------------------------------------------------------------------- | --------- |
| RF-03 | Gestión de perfil | Media     | CP-USER-01 (Actualizar info)<br>CP-USER-02 (Actualizar dirección)<br>CP-USER-03 (Subir foto perfil) | ✅ 100%   |
| RF-04 | Roles de usuario  | Alta      | CP-USER-04 (Distinguir rol admin)<br>CP-USER-08 (Usuario sin acceso admin)                          | ✅ 100%   |

**Subtotal Perfil**: 2 RF → 5 casos de prueba

---

### Módulo: Categorías

| RF ID | Requisito                 | Prioridad | Casos de Prueba                                                  | Cobertura |
| ----- | ------------------------- | --------- | ---------------------------------------------------------------- | --------- |
| RF-05 | Crear categoría           | Alta      | CP-USER-05 (Crear categoría admin)                               | ✅ 100%   |
| RF-06 | Editar/eliminar categoría | Media     | CP-USER-06 (Editar categoría)<br>CP-USER-07 (Eliminar categoría) | ✅ 100%   |

**Subtotal Categorías**: 2 RF → 3 casos de prueba

---

### Módulo: Productos

| RF ID | Requisito         | Prioridad | Casos de Prueba                                                                                                                                                                         | Cobertura |
| ----- | ----------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| RF-07 | Crear producto    | Alta      | CP-PROD-01 (Crear con datos completos)<br>CP-PROD-02 (Crear sin imagen)<br>CP-PROD-07 (Validar precio negativo)<br>CP-PROD-09 (Campos obligatorios)<br>CP-PROD-10 (Listar públicamente) | ✅ 100%   |
| RF-08 | Editar producto   | Alta      | CP-PROD-03 (Editar precio)                                                                                                                                                              | ✅ 100%   |
| RF-09 | Eliminar producto | Media     | CP-PROD-04 (Eliminar producto)                                                                                                                                                          | ✅ 100%   |
| RF-10 | Gestionar extras  | Media     | CP-PROD-05 (Agregar tamaños)<br>CP-PROD-06 (Agregar extras)                                                                                                                             | ✅ 100%   |
| RF-11 | Subir imágenes    | Alta      | CP-PROD-08 (Upload a S3)<br>CP-REC-04 (Fallo upload)                                                                                                                                    | ✅ 100%   |

**Subtotal Productos**: 5 RF → 11 casos de prueba

---

### Módulo: Carrito y Checkout

| RF ID | Requisito            | Prioridad | Casos de Prueba                                                                                                                  | Cobertura |
| ----- | -------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| RF-12 | Agregar al carrito   | Alta      | CP-CART-01 (Agregar producto)<br>CP-CART-14 (Persistencia localStorage)                                                          | ✅ 100%   |
| RF-13 | Modificar cantidad   | Alta      | CP-CART-02 (Incrementar)<br>CP-CART-03 (Decrementar)<br>CP-CART-15 (Límite máximo)                                               | ✅ 100%   |
| RF-14 | Eliminar del carrito | Alta      | CP-CART-04 (Eliminar producto)                                                                                                   | ✅ 100%   |
| RF-15 | Calcular subtotal    | Alta      | CP-CART-05 (Calcular correctamente)<br>CP-CART-06 (Con extras)<br>CP-CART-07 (Con tamaño)                                        | ✅ 100%   |
| RF-16 | Proceso de pago      | Alta      | CP-CART-08 (Checkout con dirección)<br>CP-CART-11 (Validar campos)<br>CP-CART-12 (Auth requerida)<br>CP-CART-13 (Carrito vacío)  | ✅ 100%   |
| RF-17 | Integración Stripe   | Alta      | CP-CART-09 (Crear sesión Stripe)                                                                                                 | ✅ 100%   |
| RF-18 | Confirmación pago    | Alta      | CP-CART-10 (Webhook confirmación)<br>CP-REC-02 (Interrupción red)<br>CP-REC-05 (Timeout webhook)<br>CP-SEC-04 (Validación firma) | ✅ 100%   |

**Subtotal Carrito/Checkout**: 7 RF → 16 casos de prueba

---

### Módulo: Pedidos

| RF ID | Requisito           | Prioridad | Casos de Prueba                                                                                                                                   | Cobertura |
| ----- | ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| RF-19 | Creación de pedido  | Alta      | CP-ORDER-01 (Crear tras pago)<br>CP-ORDER-07 (Verificar paid=true)<br>CP-ORDER-08 (No crear si pago falla)<br>CP-ORDER-09 (Validación integridad) | ✅ 100%   |
| RF-20 | Historial (usuario) | Media     | CP-ORDER-02 (Ver historial propio)                                                                                                                | ✅ 100%   |
| RF-21 | Detalle de pedido   | Media     | CP-ORDER-03 (Ver detalle específico)                                                                                                              | ✅ 100%   |
| RF-22 | Listado (admin)     | Alta      | CP-ORDER-04 (Listar todos los pedidos)                                                                                                            | ✅ 100%   |
| RF-23 | Actualizar estado   | Media     | CP-ORDER-05 (Cambiar estado admin)                                                                                                                | ✅ 100%   |
| RF-24 | Buscar pedidos      | Media     | CP-ORDER-06 (Buscar por email)                                                                                                                    | ✅ 100%   |

**Subtotal Pedidos**: 6 RF → 10 casos de prueba

---

### Resumen de Cobertura Funcional

| Módulo           | RF Cubiertos | Total RF | % Cobertura | Casos de Prueba |
| ---------------- | ------------ | -------- | ----------- | --------------- |
| Autenticación    | 2            | 2        | 100%        | 8               |
| Perfil/Usuarios  | 2            | 2        | 100%        | 5               |
| Categorías       | 2            | 2        | 100%        | 3               |
| Productos        | 5            | 5        | 100%        | 11              |
| Carrito/Checkout | 7            | 7        | 100%        | 16              |
| Pedidos          | 6            | 6        | 100%        | 10              |
| **TOTAL**        | **24**       | **24**   | **100%**    | **53**          |

✅ **Meta Alcanzada**: 100% de cobertura de requisitos funcionales

---

## Matriz 2: Casos de Prueba → Endpoints API

### Objetivo

Mapear cada caso de prueba con los **endpoints de API** que ejercita, facilitando la identificación de endpoints con poca cobertura.

---

### Autenticación

| Endpoint                  | Método | Casos de Prueba                                | Cobertura |
| ------------------------- | ------ | ---------------------------------------------- | --------- |
| `/api/register`           | POST   | CP-AUTH-01, CP-AUTH-02, CP-AUTH-07, CP-AUTH-08 | ✅ Alta   |
| `/api/auth/[...nextauth]` | POST   | CP-AUTH-03, CP-AUTH-04, CP-AUTH-05, CP-AUTH-06 | ✅ Alta   |

---

### Perfil y Usuarios

| Endpoint       | Método | Casos de Prueba                     | Cobertura |
| -------------- | ------ | ----------------------------------- | --------- |
| `/api/profile` | GET    | CP-USER-01, CP-USER-02, CP-REC-03   | ✅ Alta   |
| `/api/profile` | PUT    | CP-USER-01, CP-USER-02, CP-USER-03  | ✅ Alta   |
| `/api/users`   | GET    | CP-ORDER-04, CP-SEC-01, CP-ORDER-10 | ✅ Alta   |
| `/api/users`   | PUT    | CP-USER-04                          | ⚠️ Media  |

---

### Categorías

| Endpoint          | Método | Casos de Prueba        | Cobertura |
| ----------------- | ------ | ---------------------- | --------- |
| `/api/categories` | GET    | CP-PROD-12, CP-PROD-10 | ⚠️ Media  |
| `/api/categories` | POST   | CP-USER-05             | ⚠️ Media  |
| `/api/categories` | PUT    | CP-USER-06             | ⚠️ Media  |
| `/api/categories` | DELETE | CP-USER-07             | ⚠️ Media  |

**Nota**: Categorías tienen cobertura funcional, pero podría ampliarse con casos de frontera y seguridad.

---

### Productos

| Endpoint          | Método | Casos de Prueba                                                        | Cobertura |
| ----------------- | ------ | ---------------------------------------------------------------------- | --------- |
| `/api/menu-items` | GET    | CP-PROD-10, CP-PROD-12, CP-PERF-01                                     | ✅ Alta   |
| `/api/menu-items` | POST   | CP-PROD-01, CP-PROD-02, CP-PROD-05, CP-PROD-06, CP-PROD-07, CP-PROD-09 | ✅ Alta   |
| `/api/menu-items` | PUT    | CP-PROD-03, CP-PROD-05, CP-PROD-06                                     | ✅ Alta   |
| `/api/menu-items` | DELETE | CP-PROD-04                                                             | ⚠️ Media  |

---

### Carrito y Checkout

| Endpoint        | Método | Casos de Prueba                                                                   | Cobertura |
| --------------- | ------ | --------------------------------------------------------------------------------- | --------- |
| `/api/checkout` | POST   | CP-CART-08, CP-CART-09, CP-CART-11, CP-CART-12, CP-CART-13, CP-REC-01, CP-PERF-01 | ✅ Alta   |
| `/api/webhook`  | POST   | CP-CART-10, CP-REC-02, CP-REC-05, CP-SEC-04, CP-STR-04                            | ✅ Alta   |

---

### Pedidos

| Endpoint      | Método | Casos de Prueba                                                | Cobertura |
| ------------- | ------ | -------------------------------------------------------------- | --------- |
| `/api/orders` | GET    | CP-ORDER-02, CP-ORDER-04, CP-ORDER-06, CP-ORDER-10, CP-PERF-01 | ✅ Alta   |

---

### Upload

| Endpoint      | Método | Casos de Prueba                              | Cobertura |
| ------------- | ------ | -------------------------------------------- | --------- |
| `/api/upload` | POST   | CP-PROD-08, CP-USER-03, CP-REC-04, CP-STR-03 | ✅ Alta   |

---

### Resumen por Endpoint

**Total Endpoints**: 15  
**Cobertura Alta** (≥3 casos): 11 endpoints (73%)  
**Cobertura Media** (1-2 casos): 4 endpoints (27%)  
**Sin Cobertura**: 0 endpoints (0%)

✅ **100% de endpoints tienen al menos 1 caso de prueba**

---

## Matriz 3: Requisitos No Funcionales → Pruebas del Sistema

### Objetivo

Rastrear la cobertura de **requisitos no funcionales (NFR)** mediante las **5 categorías de pruebas del sistema**.

---

### Usabilidad (RNF-01 a RNF-04)

| NFR ID | Requerimiento       | Tipo de Prueba | Casos de Prueba                           | Cobertura    |
| ------ | ------------------- | -------------- | ----------------------------------------- | ------------ |
| RNF-01 | Interfaz intuitiva  | Manual         | _(Requiere pruebas de usuario)_           | ⚠️ Pendiente |
| RNF-02 | Diseño responsive   | Despliegue     | CP-DEP-05 (320px - 2560px)                | ✅ Cubierto  |
| RNF-03 | Feedback visual     | Rendimiento    | CP-PERF-03 (Lighthouse), CP-PERF-08 (FID) | ✅ Cubierto  |
| RNF-04 | Consistencia visual | Manual         | _(Inspección visual)_                     | ⚠️ Pendiente |

---

### Rendimiento (RNF-05 a RNF-07)

| NFR ID | Requerimiento         | Tipo de Prueba | Casos de Prueba                          | Cobertura   |
| ------ | --------------------- | -------------- | ---------------------------------------- | ----------- |
| RNF-05 | Tiempo de carga < 2s  | Rendimiento    | CP-PERF-03 (Páginas)<br>CP-PERF-08 (LCP) | ✅ Cubierto |
| RNF-06 | Optimización imágenes | Rendimiento    | CP-PERF-04 (WebP)                        | ✅ Cubierto |
| RNF-07 | Server Side Rendering | Rendimiento    | CP-PERF-05 (SSR)                         | ✅ Cubierto |

---

### Seguridad (RSEG-01 a RSEG-06)

| NFR ID  | Requerimiento          | Tipo de Prueba | Casos de Prueba                                                              | Cobertura   |
| ------- | ---------------------- | -------------- | ---------------------------------------------------------------------------- | ----------- |
| RSEG-01 | Protección contraseñas | Seguridad      | CP-AUTH-07 (bcrypt)<br>CP-SEC-06 (No texto plano)                            | ✅ Cubierto |
| RSEG-02 | Autenticación segura   | Seguridad      | CP-SEC-07 (Tokens httpOnly)<br>CP-SEC-08 (CSRF)<br>CP-SEC-09 (Rate limiting) | ✅ Cubierto |
| RSEG-03 | Autorización por rol   | Seguridad      | CP-SEC-01 (Acceso no autorizado)<br>CP-PROD-11<br>CP-ORDER-10                | ✅ Cubierto |
| RSEG-04 | Validación de datos    | Seguridad      | CP-SEC-02 (NoSQL injection)<br>CP-SEC-03 (XSS)<br>CP-PROD-09                 | ✅ Cubierto |
| RSEG-05 | Protección API keys    | Seguridad      | CP-SEC-05 (Exposición keys)                                                  | ✅ Cubierto |
| RSEG-06 | Webhooks verificados   | Seguridad      | CP-SEC-04 (Firma Stripe)                                                     | ✅ Cubierto |

---

### Fiabilidad (RFIA-01 a RFIA-04)

| NFR ID  | Requerimiento          | Tipo de Prueba | Casos de Prueba                                                | Cobertura   |
| ------- | ---------------------- | -------------- | -------------------------------------------------------------- | ----------- |
| RFIA-01 | Manejo de errores      | Recuperación   | CP-REC-03 (Sesión expirada)<br>CP-REC-04 (Fallo S3)            | ✅ Cubierto |
| RFIA-02 | Transacciones atómicas | Recuperación   | CP-REC-02 (Integridad webhook)                                 | ✅ Cubierto |
| RFIA-03 | Validación de pagos    | Recuperación   | CP-REC-02<br>CP-REC-05 (Timeout)<br>CP-ORDER-07<br>CP-ORDER-08 | ✅ Cubierto |
| RFIA-04 | Disponibilidad BD      | Recuperación   | CP-REC-01 (Caída MongoDB)                                      | ✅ Cubierto |

---

### Estrés y Carga (Implícitos)

| Aspecto               | Tipo de Prueba | Casos de Prueba                              | Cobertura   |
| --------------------- | -------------- | -------------------------------------------- | ----------- |
| Usuarios concurrentes | Esfuerzo       | CP-STR-01 (500 usuarios)                     | ✅ Cubierto |
| Alta TPS              | Esfuerzo       | CP-STR-02 (50+ TPS)                          | ✅ Cubierto |
| Carga masiva datos    | Esfuerzo       | CP-STR-03 (Imágenes)<br>CP-STR-04 (Webhooks) | ✅ Cubierto |
| Límites operacionales | Esfuerzo       | CP-STR-05 (Punto de fallo)                   | ✅ Cubierto |

---

### Compatibilidad (Implícito en RNF-02)

| Aspecto     | Tipo de Prueba | Casos de Prueba                                                                        | Cobertura   |
| ----------- | -------------- | -------------------------------------------------------------------------------------- | ----------- |
| Navegadores | Despliegue     | CP-DEP-01 (Chrome)<br>CP-DEP-02 (Firefox)<br>CP-DEP-03 (Safari)<br>CP-DEP-04 (Android) | ✅ Cubierto |

---

### Resumen de Cobertura No Funcional

| Categoría      | Total NFR      | Cubiertos | % Cobertura |
| -------------- | -------------- | --------- | ----------- |
| Usabilidad     | 4              | 2         | 50%         |
| Rendimiento    | 3              | 3         | 100%        |
| Seguridad      | 6              | 6         | 100%        |
| Fiabilidad     | 4              | 4         | 100%        |
| Estrés/Carga   | 4 (implícitos) | 4         | 100%        |
| Compatibilidad | 4 (implícitos) | 4         | 100%        |
| **TOTAL**      | **25 NFR**     | **23**    | **92%**     |

**Gaps Identificados**:

- RNF-01 (Interfaz intuitiva): Requiere pruebas de usabilidad con usuarios reales
- RNF-04 (Consistencia visual): Requiere inspección manual de diseño

---

## Matriz 4: Prioridad de Casos de Prueba

### Distribución por Prioridad

| Prioridad              | Casos de Prueba | Porcentaje |
| ---------------------- | --------------- | ---------- |
| **Alta**               | 48              | 56%        |
| **Media**              | 30              | 35%        |
| **Baja**               | 1               | 1%         |
| _(Estrés/Rendimiento)_ | 7               | 8%         |
| **TOTAL**              | **86**          | **100%**   |

**Recomendación de Ejecución**:

1. **Prioridad Alta** (48 casos): Ejecución obligatoria antes de release
2. **Prioridad Media** (30 casos): Ejecutar en testing de regresión
3. **Prioridad Baja** (1 caso): Ejecutar si hay tiempo

---

## Trazabilidad Inversa

### Casos de Prueba Huérfanos

**Pregunta**: ¿Hay casos de prueba que NO rastrean a ningún requisito?

**Respuesta**: ❌ NO. Todos los 86 casos rastrean a:

- 1 o más Requisitos Funcionales (RF-01 a RF-24), O
- 1 o más Requisitos No Funcionales (RNF, RSEG, RFIA)

---

### Requisitos Sin Cobertura

**Pregunta**: ¿Hay requisitos sin casos de prueba?

**Respuesta**: ⚠️ 2 NFR pendientes (de 26 totales)

- RNF-01: Interfaz intuitiva (requiere testing con usuarios)
- RNF-04: Consistencia visual (inspección manual)

**Acción**: Documentar como pruebas manuales post-entrega

---

## Matriz 5: Técnicas de Caja Negra Aplicadas

| Técnica                           | Casos de Prueba                                                                        | Total |
| --------------------------------- | -------------------------------------------------------------------------------------- | ----- |
| **Partición de Equivalencia**     | CP-AUTH-08, CP-PROD-07, CP-PROD-09, CP-CART-06, CP-CART-11, CP-SEC-02, CP-SEC-03, etc. | 15    |
| **Análisis de Valor de Frontera** | CP-PROD-07, CP-CART-03, CP-CART-13, CP-CART-15, CP-STR-01, CP-STR-05, etc.             | 8     |
| **Tabla de Decisión**             | CP-CART-08, CP-CART-11, CP-CART-12, CP-CART-13                                         | 4     |
| **Sin técnica específica**        | Casos funcionales directos                                                             | 59    |

---

## Conclusión

✅ **Cobertura de RF**: 100% (24/24)  
✅ **Cobertura de NFR**: 92% (23/25) - 2 pendientes justificados  
✅ **Cobertura de Endpoints**: 100% (15/15)  
✅ **Total de Casos**: 86 (53 validación + 33 sistema)

**Estado**: Sistema bien cubierto por pruebas de caja negra

---

**Documento**: Matrices de Trazabilidad  
**Estado**: Completo  
**Próximo Paso**: Ver [plantilla_ejecucion_pruebas.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/plantilla_ejecucion_pruebas.md)
