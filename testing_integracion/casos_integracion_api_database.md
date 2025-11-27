# Casos de Integración: API ↔ Database

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Introducción

Este documento contiene los **12 casos de prueba de integración** que verifican la correcta comunicación entre las **API Routes de Next.js** y la **base de datos MongoDB** a través de **Mongoose**.

**Objetivo**: Asegurar que las operaciones CRUD en los endpoints HTTP se reflejen correctamente en la base de datos.

**Categoría**: INT-1 (Prioridad Alta)

---

## CI-DB-01: POST /api/register Crea Usuario en MongoDB

**Módulos Integrados**: `/api/register` + Modelo `User` + MongoDB

**Objetivo**: Verificar que al registrar un usuario, se crea correctamente en la base de datos con contraseña hasheada.

**Precondiciones**:

- MongoDB Memory Server iniciado
- Base de datos limpia (sin usuarios)

**Datos de Entrada**:

```json
{
  "name": "Juan Test",
  "email": "juan.test@example.com",
  "password": "Password123!"
}
```

**Pasos**:

1. Enviar POST a `/api/register` con datos de entrada
2. Verificar respuesta HTTP 200
3. Consultar MongoDB: `db.users.findOne({email: "juan.test@example.com"})`
4. Verificar que el documento existe
5. Verificar que `password` está hasheada (bcrypt, inicia con `$2b$`)

**Resultado Esperado**:

- Response 200: `{success: true}`
- Usuario creado en colección `users`
- Password hasheada (NO "Password123!" en texto plano)
- Campos `createdAt` y `updatedAt` poblados

**Script de Test**:

```javascript
test("CI-DB-01: POST /api/register crea usuario en MongoDB", async () => {
  const res = await request(app).post("/api/register").send({
    name: "Juan Test",
    email: "juan.test@example.com",
    password: "Password123!",
  });

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);

  // Verificar en BD
  const user = await User.findOne({ email: "juan.test@example.com" });
  expect(user).toBeTruthy();
  expect(user.name).toBe("Juan Test");
  expect(user.password).not.toBe("Password123!");
  expect(user.password).toMatch(/^\$2b\$/);
});
```

**Criterio de Éxito**: ✅ Usuario en BD con contraseña hasheada

---

## CI-DB-02: GET /api/profile Obtiene Datos de userinfos

**Módulos Integrados**: `/api/profile` + Modelo `UserInfo` + MongoDB

**Objetivo**: Verificar que GET /api/profile consulta correctamente la colección `userinfos`.

**Precondiciones**:

- Usuario autenticado con sesión válida
- Documento en `userinfos` asociado al email del usuario

**Datos de Entrada**:

- Session cookie con email: `test@example.com`

**Pasos**:

1. Crear usuario de prueba en `users` y `userinfos`
2. Obtener cookie de sesión autenticada
3. Enviar GET `/api/profile` con cookie
4. Verificar respuesta contiene datos de `userinfos`

**Resultado Esperado**:

```json
{
  "email": "test@example.com",
  "streetAddress": "Av. Test #123",
  "city": "Santa Cruz",
  "phone": "+591 77788899",
  "admin": false
}
```

**Script de Test**:

```javascript
test("CI-DB-02: GET /api/profile obtiene datos de userinfos", async () => {
  // Setup: crear usuario y userinfo
  const user = await User.create({
    email: "test@example.com",
    password: await hash("Pass123!", 10),
  });

  await UserInfo.create({
    email: "test@example.com",
    streetAddress: "Av. Test #123",
    city: "Santa Cruz",
    phone: "+591 77788899",
    admin: false,
  });

  // Obtener sesión autenticada
  const cookie = await authenticateUser("test@example.com", "Pass123!");

  // Test
  const res = await request(app).get("/api/profile").set("Cookie", cookie);

  expect(res.status).toBe(200);
  expect(res.body.email).toBe("test@example.com");
  expect(res.body.city).toBe("Santa Cruz");
});
```

**Criterio de Éxito**: ✅ Datos de userinfos retornados correctamente

---

## CI-DB-03: PUT /api/profile Actualiza BD

**Módulos Integrados**: `/api/profile` + Modelo `UserInfo` + MongoDB

**Objetivo**: Verificar que PUT /api/profile actualiza correctamente en MongoDB.

**Precondiciones**:

- Usuario con `userinfo` existente

**Datos de Entrada**:

```json
{
  "streetAddress": "Nueva Dirección #456",
  "city": "Cochabamba",
  "phone": "+591 66655544"
}
```

**Pasos**:

1. Crear userinfo con dirección antigua
2. Enviar PUT /api/profile con nuevos datos
3. Consultar MongoDB para verificar actualización

**Resultado Esperado**:

- Response 200: `{success: true}`
- `userinfos` documento actualizado con nuevos valores
- `updatedAt` timestamp actualizado

**Criterio de Éxito**: ✅ Datos actualizados en BD

---

## CI-DB-04: POST /api/menu-items Guarda con Referencia a Categoría

**Módulos Integrados**: `/api/menu-items` + Modelos `MenuItem`, `Category` + MongoDB

**Objetivo**: Verificar que se crea producto con referencia correcta a categoría (ObjectId).

**Precondiciones**:

- Usuario admin autenticado
- Categoría "Platos" creada con ID conocido

**Datos de Entrada**:

```json
{
  "name": "Arroz Chaufa",
  "description": "Arroz frito estilo chino",
  "basePrice": 28,
  "category": "64f8a1b2c3d4e5f6g7h8i9j0",
  "image": "https://bucket.s3.amazonaws.com/chaufa.jpg"
}
```

**Pasos**:

1. Crear categoría de prueba, obtener su `_id`
2. POST /api/menu-items con `category` = ID de categoría
3. Verificar que `menuitem` se guarda con referencia correcta

**Resultado Esperado**:

- MenuItem creado en BD
- Campo `category` es ObjectId que referencia a la categoría
- Hacer populate funciona: `MenuItem.findOne().populate('category')`

**Script de Test**:

```javascript
test("CI-DB-04: POST /api/menu-items guarda con referencia", async () => {
  // Crear categoría
  const category = await Category.create({ name: "Platos" });

  const cookie = await getAdminCookie();

  const res = await request(app)
    .post("/api/menu-items")
    .set("Cookie", cookie)
    .send({
      name: "Arroz Chaufa",
      basePrice: 28,
      category: category._id.toString(),
    });

  expect(res.status).toBe(200);

  // Verificar en BD con populate
  const menuItem = await MenuItem.findOne({ name: "Arroz Chaufa" }).populate(
    "category"
  );
  expect(menuItem.category.name).toBe("Platos");
});
```

**Criterio de Éxito**: ✅ Referencia a categoría correcta

---

## CI-DB-05: GET /api/menu-items con Populate de Categoría

**Módulos Integrados**: `/api/menu-items` + Modelos `MenuItem`, `Category` + MongoDB

**Objetivo**: Verificar que GET /api/menu-items retorna productos con datos de categoría poblados.

**Precondiciones**:

- Productos con categorías asignadas

**Pasos**:

1. Crear categoría "Bebidas"
2. Crear producto asociado a categoría
3. GET /api/menu-items
4. Verificar que respuesta incluye `category.name`

**Resultado Esperado**:

```json
[
  {
    "_id": "...",
    "name": "Coca Cola",
    "basePrice": 5,
    "category": {
      "_id": "...",
      "name": "Bebidas"
    }
  }
]
```

**Criterio de Éxito**: ✅ Populate funciona correctamente

---

## CI-DB-06: DELETE /api/menu-items Elimina de BD

**Módulos Integrados**: `/api/menu-items` + Modelo `MenuItem` + MongoDB

**Objetivo**: Verificar que DELETE /api/menu-items elimina permanentemente de MongoDB.

**Precondiciones**:

- Producto existente con ID conocido

**Pasos**:

1. Crear producto de prueba
2. DELETE /api/menu-items con `_id` del producto
3. Intentar buscar producto en BD

**Resultado Esperado**:

- Response 200: `{success: true}`
- `MenuItem.findById()` retorna `null`

**Criterio de Éxito**: ✅ Producto eliminado de BD

---

## CI-DB-07: POST /api/orders Crea Pedido en BD

**Módulos Integrados**: `/api/webhook` (que crea orden) + Modelo `Order` + MongoDB

**Objetivo**: Verificar que el webhook de Stripe crea pedido en MongoDB.

**Precondiciones**:

- Webhook de Stripe recibido con `payment_intent.succeeded`

**Datos de Entrada** (payload webhook):

```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "metadata": {
        "userEmail": "cliente@test.com",
        "cartProducts": "[{...}]",
        "address": "{...}"
      }
    }
  }
}
```

**Pasos**:

1. Simular POST /api/webhook con payload válido
2. Verificar que se crea documento en `orders`

**Resultado Esperado**:

- Orden creada con `paid: true`
- Campos `userEmail`, `cartProducts`, `streetAddress` poblados

**Criterio de Éxito**: ✅ Pedido en BD tras webhook

---

## CI-DB-08: GET /api/orders Filtra por Email

**Módulos Integrados**: `/api/orders` + Modelo `Order` + MongoDB

**Objetivo**: Verificar que la consulta filtra correctamente por email del usuario.

**Precondiciones**:

- 2 pedidos en BD: uno de `user1@test.com`, otro de `user2@test.com`

**Pasos**:

1. Usuario `user1@test.com` autenticado
2. GET /api/orders
3. Verificar que solo retorna pedidos de `user1@test.com`

**Resultado Esperado**:

- Solo pedidos del usuario autenticado
- No se filtran pedidos de otros usuarios

**Script de Test**:

```javascript
test("CI-DB-08: GET /api/orders filtra por email", async () => {
  // Crear 2 pedidos
  await Order.create({ userEmail: "user1@test.com", paid: true });
  await Order.create({ userEmail: "user2@test.com", paid: true });

  const cookie = await authenticateUser("user1@test.com", "Pass123!");

  const res = await request(app).get("/api/orders").set("Cookie", cookie);

  expect(res.body.length).toBe(1);
  expect(res.body[0].userEmail).toBe("user1@test.com");
});
```

**Criterio de Éxito**: ✅ Filtrado correcto por usuario

---

## CI-DB-09: Manejo de Errores de Conexión MongoDB

**Módulos Integrados**: API Routes + Mongoose + MongoDB

**Objetivo**: Verificar que APIs manejan gracefully la pérdida de conexión a MongoDB.

**Precondiciones**:

- MongoDB Memory Server funcionando

**Pasos**:

1. Detener MongoDB Memory Server durante un test
2. Intentar POST /api/register
3. Verificar que retorna error apropiado (500)

**Resultado Esperado**:

- Status 500: Internal Server Error
- Mensaje: "Database connection error"
- NO se cae el servidor Node.js

**Criterio de Éxito**: ✅ Error manejado correctamente

---

## CI-DB-10: Transaccionalidad en Operaciones Críticas

**Módulos Integrados**: `/api/register` + Modelos `User`, `UserInfo` + MongoDB

**Objetivo**: Verificar que operaciones multi-documento son atómicas (o se revierten completas).

**Escenario**: Registro crea tanto `User` como `UserInfo`

**Pasos**:

1. Simular fallo al crear `UserInfo` (ej. violación de constraint)
2. Verificar que `User` tampoco se creó (transacción revertida)

**Resultado Esperado**:

- Si `UserInfo` falla, `User` NO debe existir en BD
- Rollback automático

**Nota**: Requiere MongoDB con replica set o transacciones manuales

**Criterio de Éxito**: ✅ Atomicidad garantizada

---

## CI-DB-11: Integridad Referencial (Categoría Eliminada)

**Módulos Integrados**: `/api/categories` + Modelos `Category`, `MenuItem` + MongoDB

**Objetivo**: Verificar comportamiento cuando se elimina categoría con productos asociados.

**Precondiciones**:

- Categoría "Postres" con 3 productos asociados

**Pasos**:

1. Intentar DELETE /api/categories con ID de "Postres"
2. Verificar que se previene eliminación o se manejan productos huérfanos

**Resultado Esperado** (opción 1):

- Error 400: "Cannot delete category with associated products"

**Resultado Esperado** (opción 2):

- Categoría eliminada
- Productos quedan con `category: null` o se eliminan en cascada

**Criterio de Éxito**: ✅ Integridad referencial mantenida

---

## CI-DB-12: Índices Únicos (Email Duplicado)

**Módulos Integrados**: `/api/register` + Modelo `User` + MongoDB

**Objetivo**: Verificar que el índice `unique` en `email` previene duplicados.

**Precondiciones**:

- Usuario con email `admin@test.com` ya existe

**Pasos**:

1. Intentar POST /api/register con `email: "admin@test.com"`
2. Verificar que MongoDB rechaza con error de duplicado

**Resultado Esperado**:

- Status 400: "Email already in use"
- Usuario NO se crea en BD
- Error de Mongo: `E11000 duplicate key error`

**Script de Test**:

```javascript
test("CI-DB-12: Índice único previene email duplicado", async () => {
  // Crear usuario inicial
  await User.create({ email: "admin@test.com", password: "hash" });

  // Intentar duplicar
  const res = await request(app)
    .post("/api/register")
    .send({ email: "admin@test.com", password: "Pass123!" });

  expect(res.status).toBe(400);
  expect(res.body.error).toMatch(/already/i);

  // Verificar que solo hay 1 usuario
  const count = await User.countDocuments({ email: "admin@test.com" });
  expect(count).toBe(1);
});
```

**Criterio de Éxito**: ✅ Prevención de duplicados funciona

---

## Resumen de Cobertura

| Caso     | Endpoint               | Operación             | Modelo(s)          | Prioridad |
| -------- | ---------------------- | --------------------- | ------------------ | --------- |
| CI-DB-01 | POST /api/register     | CREATE                | User               | Alta      |
| CI-DB-02 | GET /api/profile       | READ                  | UserInfo           | Alta      |
| CI-DB-03 | PUT /api/profile       | UPDATE                | UserInfo           | Alta      |
| CI-DB-04 | POST /api/menu-items   | CREATE + REF          | MenuItem, Category | Alta      |
| CI-DB-05 | GET /api/menu-items    | READ + POPULATE       | MenuItem, Category | Media     |
| CI-DB-06 | DELETE /api/menu-items | DELETE                | MenuItem           | Media     |
| CI-DB-07 | POST /api/webhook      | CREATE                | Order              | Alta      |
| CI-DB-08 | GET /api/orders        | READ + FILTER         | Order              | Alta      |
| CI-DB-09 | Cualquier API          | ERROR HANDLING        | -                  | Alta      |
| CI-DB-10 | POST /api/register     | TRANSACTION           | User, UserInfo     | Media     |
| CI-DB-11 | DELETE /api/categories | REFERENTIAL INTEGRITY | Category, MenuItem | Media     |
| CI-DB-12 | POST /api/register     | UNIQUE INDEX          | User               | Alta      |

**Total**: 12 casos de integración API ↔ Database

---

**Documento**: Casos de Integración API-Database  
**Estado**: Listo para Implementación  
**Próximo**: Ver [casos_integracion_inter_api.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_integracion/casos_integracion_inter_api.md)
