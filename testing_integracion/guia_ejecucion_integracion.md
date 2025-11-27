# Guía de Ejecución: Pruebas de Integración

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## 1. Prerrequisitos

Antes de ejecutar las pruebas de integración, asegúrate de tener instalado:

- **Node.js**: v18+
- **NPM**: v9+
- **Git**

---

## 2. Instalación de Dependencias

Ejecuta el siguiente comando para instalar las librerías necesarias para testing (Jest, Supertest, MongoDB Memory Server):

```bash
npm install --save-dev jest supertest mongodb-memory-server @shelf/jest-mongodb nock
```

---

## 3. Configuración del Entorno

Las pruebas de integración utilizan **MongoDB Memory Server**, por lo que **NO** necesitas una base de datos MongoDB real corriendo, ni afectarás tus datos de desarrollo.

Sin embargo, necesitas configurar las variables de entorno para los tests.

1. Crea el archivo `.env.test` (si no existe, Jest puede usar valores por defecto en `setup.js`):

```env
NEXTAUTH_SECRET=test_secret_key_123
NEXTAUTH_URL=http://localhost:3000
STRIPE_SK=sk_test_mock_key
AWS_ACCESS_KEY_ID=mock_key
AWS_SECRET_ACCESS_KEY=mock_secret
```

---

## 4. Ejecución de Pruebas

### 4.1 Ejecutar Todas las Pruebas

Para correr la suite completa de integración (~35 casos):

```bash
npm run test:integration
```

### 4.2 Ejecutar por Categoría

Si solo quieres probar un módulo específico:

**API ↔ Database**:

```bash
npm test -- tests/integration/api-database.test.js
```

**Inter-API**:

```bash
npm test -- tests/integration/inter-api.test.js
```

**Servicios Externos**:

```bash
npm test -- tests/integration/external-services.test.js
```

**Flujos E2E**:

```bash
npm test -- tests/integration/e2e-flows.test.js
```

### 4.3 Ejecutar con Cobertura

Para ver qué porcentaje del código está siendo probado:

```bash
npm run test:integration:coverage
```

Esto generará una carpeta `coverage/` con un reporte HTML detallado.

---

## 5. Interpretación de Resultados

### ✅ Tests Pasados (PASS)

Indica que la integración funciona según lo esperado.

Ejemplo:

```
PASS  tests/integration/api-database.test.js
  ✓ CI-DB-01: POST /api/register crea usuario en MongoDB (150 ms)
  ✓ CI-DB-02: GET /api/profile obtiene datos (80 ms)
```

### ❌ Tests Fallidos (FAIL)

Indica un error en la integración o un bug en el código.

Ejemplo:

```
FAIL  tests/integration/api-database.test.js
  ✕ CI-DB-01: POST /api/register crea usuario en MongoDB (200 ms)

  Expected: 200
  Received: 500
```

**Acciones ante fallo**:

1. Leer el mensaje de error ("Received: 500").
2. Revisar logs del servidor (si los hay).
3. Verificar si es un problema de configuración o código.

---

## 6. Solución de Problemas Comunes

**Error: `MongoMemoryServer` timeout**

- Causa: Descarga lenta del binario de Mongo.
- Solución: Aumentar timeout en `jest.config.js` o descargar manualmente.

**Error: `Address already in use`**

- Causa: Otro proceso usando el puerto (raro en tests aislados).
- Solución: Matar procesos de Node o Jest colgados.

**Error: `Stripe/AWS connection error`**

- Causa: Nock no está interceptando correctamente o falta configuración.
- Solución: Verificar `tests/integration/setup.js`.

---

## 7. Referencias

- [Plan de Pruebas de Integración](plan_pruebas_integracion.md)
- [Casos API-Database](casos_integracion_api_database.md)
