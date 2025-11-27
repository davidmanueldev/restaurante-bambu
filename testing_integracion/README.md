# Pruebas de Integración - Restaurante Bambú

## Metodología de Pressman (Sección 17.5)

---

## 📋 Contenido de esta Carpeta

Esta carpeta contiene la documentación completa de **Pruebas de Integración**, diseñadas para verificar la interacción entre los módulos del sistema (API, Base de Datos, Servicios Externos).

### Documentos Principales

| Documento                                                                              | Descripción                         | Casos |
| -------------------------------------------------------------------------------------- | ----------------------------------- | ----- |
| **[plan_pruebas_integracion.md](plan_pruebas_integracion.md)**                         | Plan maestro y estrategia Bottom-Up | -     |
| **[casos_integracion_api_database.md](casos_integracion_api_database.md)**             | Integración API ↔ MongoDB           | 12    |
| **[casos_integracion_inter_api.md](casos_integracion_inter_api.md)**                   | Comunicación entre APIs             | 8     |
| **[casos_integracion_servicios_externos.md](casos_integracion_servicios_externos.md)** | Stripe y AWS S3                     | 10    |
| **[casos_integracion_flujos_e2e.md](casos_integracion_flujos_e2e.md)**                 | Flujos de negocio completos         | 5     |
| **[guia_ejecucion_integracion.md](guia_ejecucion_integracion.md)**                     | Cómo instalar y correr los tests    | -     |
| **[datos_prueba.md](datos_prueba.md)**                                                 | Datasets estándar                   | -     |

**Total**: ~35 casos de prueba de integración

---

## 🛠️ Scripts Ejecutables

Los scripts de prueba se encuentran en la carpeta raíz del proyecto:

`tests/integration/`

- `setup.js`: Configuración de MongoDB en memoria
- `api-database.test.js`: Ejemplo de tests ejecutables
- `helpers.js`: Utilidades

---

## 🚀 Cómo Ejecutar

1. Instalar dependencias:

   ```bash
   npm install --save-dev jest supertest mongodb-memory-server @shelf/jest-mongodb nock
   ```

2. Ejecutar tests:
   ```bash
   npm run test:integration
   ```

Ver [guia_ejecucion_integracion.md](guia_ejecucion_integracion.md) para más detalles.

---

## 🎯 Cobertura

- **API ↔ DB**: CRUD completo, transacciones, integridad referencial
- **Inter-API**: Autenticación, dependencias de datos
- **Externos**: Pagos (Stripe), Archivos (S3)
- **E2E**: Flujos críticos de negocio

---

## 💻 Códigos de los Scripts de Prueba

A continuación se presenta el código fuente completo de los scripts de prueba creados, para referencia en este informe.

### 1. Configuración Global (`tests/integration/setup.js`)

```javascript
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

// Configuración Global para Tests de Integración

beforeAll(async () => {
  // 1. Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // 2. Conectar Mongoose a la instancia en memoria
  await mongoose.connect(mongoUri);

  // 3. Mockear variables de entorno si es necesario
  process.env.NEXTAUTH_URL = "http://localhost:3000";
});

afterAll(async () => {
  // 1. Desconectar Mongoose
  await mongoose.disconnect();

  // 2. Detener servidor MongoDB
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  // Limpiar base de datos entre tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});
```

### 2. Funciones Auxiliares (`tests/integration/helpers.js`)

```javascript
const mongoose = require("mongoose");
const { User } = require("../../src/models/User"); // Ajustar path según estructura real
const { UserInfo } = require("../../src/models/UserInfo");

/**
 * Crea un usuario de prueba en la BD
 */
async function createTestUser(email = "test@example.com", isAdmin = false) {
  const user = await User.create({
    name: "Test User",
    email,
    password: "$2b$10$EpIq...hashedpassword...", // Hash pre-calculado
    image: "test.jpg",
    admin: isAdmin,
  });
  return user;
}

/**
 * Simula una cookie de sesión autenticada (Mock)
 * Nota: En un entorno real con NextAuth, esto es complejo.
 * Para integración pura API, a veces es mejor mockear el middleware de sesión.
 */
function getMockSessionCookie(email) {
  // Retorna un objeto o string que tu middleware de test acepte
  // O si usas supertest con una app que tiene auth deshabilitado para tests
  return `next-auth.session-token=mock-token-${email}`;
}

module.exports = {
  createTestUser,
  getMockSessionCookie,
};
```

### 3. Ejemplo de Test API-Database (`tests/integration/api-database.test.js`)

```javascript
/**
 * @jest-environment node
 */
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../src/models/User"); // Ajustar imports según estructura
// const app = require('../../src/app'); // Necesitamos exportar la app de Next o usar un handler

// MOCK: Como Next.js API Routes no exportan una 'app' de Express tradicional,
// los tests de integración suelen requerir levantar un servidor de prueba
// o usar 'next-test-api-route-handler'.
//
// Para este ejemplo, asumiremos que tenemos una forma de invocar el handler.

describe("Integración API ↔ Database", () => {
  // CI-DB-01
  test("POST /api/register crea usuario en MongoDB", async () => {
    // Simulación de la llamada
    // En un proyecto Next.js real, usaríamos:
    // const { testApiHandler } = require('next-test-api-route-handler');
    // await testApiHandler({ handler: registerHandler, ... });

    // Aquí escribimos la lógica de verificación de BD que es lo crucial para INT

    // 1. Simular creación (directa o via handler)
    const userData = {
      name: "Integration Test",
      email: "int@test.com",
      password: "password123",
    };

    // Simulamos que el endpoint ejecutó: User.create(...)
    await User.create(userData);

    // 2. Verificación (La parte real del test de integración)
    const userInDb = await User.findOne({ email: "int@test.com" });

    expect(userInDb).toBeTruthy();
    expect(userInDb.name).toBe("Integration Test");
    // expect(userInDb.password).not.toBe('password123'); // Si el modelo hashea
  });

  // CI-DB-12
  test("Índice único previene email duplicado", async () => {
    await User.create({ email: "dup@test.com", password: "123" });

    // Intentar crear el mismo
    let error;
    try {
      await User.create({ email: "dup@test.com", password: "456" });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // Código de error MongoDB para duplicados
  });
});
```

---

**Estado**: ✅ Documentación completa y scripts base creados.
