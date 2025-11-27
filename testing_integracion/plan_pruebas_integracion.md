# Plan de Pruebas de Integración - Restaurante Bambú

## Sistema de Pedidos en Línea

---

## 1. Introducción

Este documento presenta el **Plan de Pruebas de Integración** para el Sistema de Pedidos en Línea del Restaurante Bambú, siguiendo la metodología de Pressman (Capítulo 17, sección 17.5: "Pruebas de Integración", páginas 395-398).

### 1.1 Definición (Pressman, p. 395)

> "La prueba de integración es una técnica sistem ática para construir la estructura del programa mientras se realizan pruebas para descubrir errores asociados con las interfaces."

### 1.2 Objetivo

Las pruebas de integración buscan encontrar errores que ocurren cuando **los módulos individuales se combinan**:

- **Datos perdidos** a través de una interfaz
- **Efectos secundarios** inesperados de un submódulo sobre otro
- **Funciones combinadas** que no producen el resultado esperado
- **Errores acumulados** en estructuras de datos globales

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Módulos

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                  [Fuera de alcance]                      │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP Requests
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  API ROUTES (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ /register│  │ /profile │  │ /checkout│  │ /orders │ │
│  └─────┬────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│        │            │               │             │      │
└────────┼────────────┼───────────────┼─────────────┼──────┘
         │            │               │             │
         ▼            ▼               ▼             ▼
┌─────────────────────────────────────────────────────────┐
│              MODELOS MONGOOSE (ODM)                      │
│  ┌──────┐  ┌──────────┐  ┌──────────┐  ┌────────┐      │
│  │ User │  │ UserInfo │  │ MenuItem │  │ Order  │      │
│  └───┬──┘  └─────┬────┘  └────┬─────┘  └───┬────┘      │
└──────┼───────────┼────────────┼────────────┼───────────┘
       │           │            │            │
       └───────────┴────────────┴────────────┘
                       │
                       ▼
               ┌──────────────┐
               │   MongoDB    │
               │   (Atlas)    │
               └──────────────┘

         Servicios Externos
┌──────────────┐  ┌──────────────┐
│   Stripe     │  │   AWS S3     │
│   (Pagos)    │  │  (Storage)   │
└──────────────┘  └──────────────┘
```

### 2.2 Puntos de Integración Identificados

| ID        | Integración    | Módulos Involucrados             | Prioridad |
| --------- | -------------- | -------------------------------- | --------- |
| **INT-1** | API ↔ Database | API Routes + Mongoose + MongoDB  | Alta      |
| **INT-2** | API ↔ Auth     | API Routes + NextAuth + Sessions | Alta      |
| **INT-3** | API ↔ Stripe   | /checkout, /webhook + Stripe API | Alta      |
| **INT-4** | API ↔ AWS S3   | /upload + AWS SDK + S3 Bucket    | Media     |
| **INT-5** | Inter-API      | /checkout → /webhook → /orders   | Alta      |
| **INT-6** | Flujos E2E     | Múltiples APIs en secuencia      | Alta      |

---

## 3. Estrategia de Integración

### 3.1 Enfoque Seleccionado: **Bottom-Up Incremental**

**Definición** (Pressman, p. 396):

> "La integración ascendente (bottom-up) comienza con módulos de nivel más bajo y procede hacia arriba en la jerarquía del programa."

**Orden de Integración para este Proyecto**:

1. **Nivel 1 (Bottom)**: Modelos Mongoose + MongoDB

   - Probar conexión, schemas, validaciones

2. **Nivel 2**: API Routes + Modelos

   - Integrar endpoints con acceso a datos

3. **Nivel 3**: API Routes + Servicios Externos

   - Integrar Stripe, AWS S3

4. **Nivel 4 (Top)**: Flujos completos E2E
   - Integrar múltiples APIs en secuencia

**Ventajas de Bottom-Up**:

- ✅ No requiere **drivers** o **stubs** complejos (usamos los módulos reales)
- ✅ Facilita el debugging (errores aislados en niveles superiores)
- ✅ Los módulos de bajo nivel (modelos) son estables y confiables

---

## 4. Categorías de Pruebas de Integración

### 4.1 Integración API ↔ Database

**Objetivo**: Verificar que los endpoints interactúan correctamente con MongoDB a través de Mongoose.

**Casos de Prueba**: 12 casos (CI-DB-01 a CI-DB-12)

**Documento**: [casos_integracion_api_database.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_integracion/casos_integracion_api_database.md)

**Ejemplos**:

- CI-DB-01: POST /api/register crea usuario en MongoDB
- CI-DB-04: POST /api/menu-items guarda con referencia a categoría
- CI-DB-09: Manejo de errores de conexión MongoDB

---

### 4.2 Integración Inter-API

**Objetivo**: Verificar que las APIs se comunican correctamente entre sí.

**Casos de Prueba**: 8 casos (CI-API-01 a CI-API-08)

**Documento**: [casos_integracion_inter_api.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_integracion/casos_integracion_inter_api.md)

**Ejemplos**:

- CI-API-01: Registro → Login (flujo de autenticación)
- CI-API-04: Checkout → Webhook → Orders (flujo de pago)

---

### 4.3 Integración con Servicios Externos

**Objetivo**: Verificar integración con Stripe y AWS S3.

**Casos de Prueba**: 10 casos (CI-EXT-01 a CI-EXT-10)

**Documento**: [casos_integracion_servicios_externos.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_integracion/casos_integracion_servicios_externos.md)

**Ejemplos**:

- CI-EXT-01: Crear sesión de Stripe desde /api/checkout
- CI-EXT-06: Upload de imagen a S3 desde /api/upload

---

### 4.4 Flujos End-to-End (E2E)

**Objetivo**: Verificar flujos completos que cruzan múltiples módulos.

**Casos de Prueba**: 5 casos (CI-E2E-01 a CI-E2E-05)

**Documento**: [casos_integracion_flujos_e2e.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_integracion/casos_integracion_flujos_e2e.md)

**Ejemplos**:

- CI-E2E-03: Flujo completo de compra (menú → checkout → webhook → pedido)

---

## 5. Herramientas y Tecnologías

### 5.1 Stack de Testing

| Herramienta               | Versión | Propósito                          |
| ------------------------- | ------- | ---------------------------------- |
| **Jest**                  | ^29.0.0 | Framework de testing               |
| **Supertest**             | ^6.3.0  | Testing de APIs HTTP               |
| **MongoDB Memory Server** | ^9.0.0  | MongoDB en memoria (aislamiento)   |
| **@shelf/jest-mongodb**   | ^4.1.0  | Preset Jest para MongoDB           |
| **nock**                  | ^13.3.0 | Mock de requests HTTP (Stripe, S3) |

### 5.2 Instalación

```bash
npm install --save-dev jest supertest mongodb-memory-server @shelf/jest-mongodb nock
```

### 5.3 Configuración Jest

Archivo: `jest.config.integration.js`

```javascript
module.exports = {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  testMatch: ["**/tests/integration/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.js"],
  collectCoverageFrom: ["src/app/api/**/*.js", "src/models/**/*.js"],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
};
```

---

## 6. Estructura de Archivos

```
restaurante-bambu/
├── testing_integracion/               # Documentación
│   ├── README.md
│   ├── plan_pruebas_integracion.md    (este archivo)
│   ├── casos_integracion_api_database.md
│   ├── casos_integracion_inter_api.md
│   ├── casos_integracion_servicios_externos.md
│   ├── casos_integracion_flujos_e2e.md
│   ├── guia_ejecucion_integracion.md
│   └── datos_prueba.md
│
└── tests/
    └── integration/                   # Scripts ejecutables
        ├── setup.js                   # Config global
        ├── helpers.js                 # Utilidades
        ├── api-database.test.js       # 12 tests
        ├── inter-api.test.js          # 8 tests
        ├── external-services.test.js  # 10 tests
        └── e2e-flows.test.js          # 5 tests
```

---

## 7. Ejecución de Pruebas

### 7.1 Comandos Disponibles

```bash
# Todas las pruebas de integración
npm run test:integration

# Categoría específica
npm test -- tests/integration/api-database.test.js

# Con cobertura
npm run test:integration:coverage

# Modo watch (desarrollo)
npm run test:integration:watch
```

### 7.2 Configuración de `package.json`

```json
{
  "scripts": {
    "test:integration": "jest --config=jest.config.integration.js",
    "test:integration:coverage": "jest --config=jest.config.integration.js --coverage",
    "test:integration:watch": "jest --config=jest.config.integration.js --watch"
  }
}
```

---

## 8. Datos de Prueba

### 8.1 Aislamiento de Base de Datos

- **Entorno de Pruebas**: MongoDB Memory Server (no afecta BD de desarrollo/producción)
- **Inicialización**: Cada suite de tests crea BD limpia
- **Limpieza**: `afterEach` elimina datos de prueba

### 8.2 Datos Estándar

Ver [datos_prueba.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_integracion/datos_prueba.md) para:

- Usuarios de test (admin y regular)
- Categorías y productos
- Respuestas mock de Stripe
- Configuración de AWS S3 mock

---

## 9. Criterios de Éxito

### 9.1 Criterios Funcionales

- ✅ **100% de casos pasan**: 35/35 tests exitosos
- ✅ **Cobertura de integración**: ≥80% de líneas en API Routes
- ✅ **Tiempo de ejecución**: Suite completa < 30 segundos
- ✅ **0 errores de interfaz**: No hay pérdida de datos entre módulos

### 9.2 Criterios por Categoría

| Categoría          | Casos | Criterio                                  |
| ------------------ | ----- | ----------------------------------------- |
| API ↔ Database     | 12    | Todas las operaciones CRUD funcionan      |
| Inter-API          | 8     | Flujos multi-paso completan correctamente |
| Servicios Externos | 10    | Integración con Stripe y S3 opera         |
| E2E Flows          | 5     | Flujos de negocio completos sin errores   |

---

## 10. Diferencias con Otros Tipos de Pruebas

### Pruebas de Integración vs Pruebas de Unidad

| Aspecto          | Unidad                    | Integración                          |
| ---------------- | ------------------------- | ------------------------------------ |
| **Alcance**      | Función/método individual | Múltiples módulos combinados         |
| **Dependencias** | Mockadas                  | Reales (módulos reales)              |
| **Velocidad**    | Muy rápida (ms)           | Rápida (100-500ms)                   |
| **Objetivo**     | Lógica interna correcta   | Interfaces funcionan                 |
| **Ejemplo**      | `hashPassword()` funciona | POST /api/register guarda en MongoDB |

### Pruebas de Integración vs Pruebas de Caja Negra

| Aspecto          | Caja Negra              | Integración                       |
| ---------------- | ----------------------- | --------------------------------- |
| **Nivel**        | Sistema completo        | Subsistemas/módulos               |
| **Conocimiento** | No se ve el código      | Se conoce arquitectura            |
| **Ejecución**    | Manual/automatizada     | Automatizada                      |
| **Enfoque**      | Requisitos funcionales  | Interfaces entre módulos          |
| **Ejemplo**      | "Usuario puede comprar" | "/checkout crea sesión en Stripe" |

---

## 11. Plan de Ejecución

### Fase 1: Preparación (1 hora)

- [ ] Instalar dependencias de testing
- [ ] Configurar MongoDB Memory Server
- [ ] Crear archivos de setup y helpers

### Fase 2: Desarrollo de Tests (4 horas)

- [ ] Escribir tests API ↔ Database (1.5h)
- [ ] Escribir tests Inter-API (1h)
- [ ] Escribir tests Servicios Externos (1h)
- [ ] Escribir tests E2E Flows (0.5h)

### Fase 3: Ejecución y Ajuste (1 hora)

- [ ] Ejecutar suite completa
- [ ] Corregir tests fallidos
- [ ] Alcanzar cobertura objetivo (80%)

### Fase 4: Documentación (1 hora)

- [ ] Completar guía de ejecución
- [ ] Documentar hallazgos
- [ ] Crear reporte de cobertura

**Tiempo Total Estimado**: 7 horas

---

## 12. Riesgos y Mitigaciones

| Riesgo                                         | Impacto | Mitigación                                             |
| ---------------------------------------------- | ------- | ------------------------------------------------------ |
| MongoDB Memory Server no funciona              | Alto    | Usar MongoDB local de desarrollo como fallback         |
| Tests lentos (>30s)                            | Medio   | Optimizar con `beforeAll` compartido                   |
| Servicios externos (Stripe, S3) no disponibles | Alto    | Usar **mocks con nock** para mayoría, 1-2 tests reales |
| Conflictos con DB de desarrollo                | Alto    | **Siempre** usar BD separada para tests                |

---

## 13. Métricas a Recolectar

Durante y después de la ejecución:

- **Tasa de éxito**: (Tests pasados / Total tests) × 100
- **Cobertura de código**: % de líneas ejecutadas en API Routes
- **Tiempo promedio por test**: Total time / Número de tests
- **Defectos encontrados**: Por categoría de integración
- **Tasa de defectos de interfaz**: Errores específicos de integración

---

## 14. Próximos Pasos

Tras completar pruebas de integración:

1. **Corregir defectos** encontrados en interfaces
2. **Ejecutar pruebas de regresión** (caja negra) para validar que correcciones no rompieron nada
3. **Documentar lecciones aprendidas** sobre puntos de integración problemáticos
4. **Automatizar en CI/CD**: Agregar `npm run test:integration` a pipeline

---

## 15. Referencias

- **Pressman, R. S.** (2010). _Ingeniería del Software: Un Enfoque Práctico_ (7ª ed.). McGraw-Hill.
  - Sección 17.5: Pruebas de Integración (pp. 395-398)
  - Enfoque Bottom-Up (p. 396)
  - Enfoque Top-Down (p. 397)
- **Jest Documentation**: https://jestjs.io/
- **Supertest Documentation**: https://github.com/visionmedia/supertest
- **MongoDB Memory Server**: https://github.com/nodkz/mongodb-memory-server

---

## 16. Resumen de Documentos

| Documento              | Contenido                              | Casos  |
| ---------------------- | -------------------------------------- | ------ |
| **Plan de Pruebas**    | Estrategia, arquitectura, herramientas | -      |
| **API ↔ Database**     | Integración endpoints con MongoDB      | 12     |
| **Inter-API**          | Comunicación entre APIs                | 8      |
| **Servicios Externos** | Stripe y AWS S3                        | 10     |
| **Flujos E2E**         | Flujos completos de negocio            | 5      |
| **Guía de Ejecución**  | Cómo ejecutar los tests                | -      |
| **Datos de Prueba**    | Datasets y configuración               | -      |
| **TOTAL**              | -                                      | **35** |

---

**Elaborado por**: Equipo de QA - Restaurante Bambú  
**Fecha**: 26 de noviembre de 2024  
**Versión**: 1.0  
**Estado**: Listo para Implementación
