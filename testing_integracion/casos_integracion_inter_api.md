# Casos de Integración: Inter-API

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Introducción

Este documento contiene los **8 casos de prueba de integración** que verifican la correcta comunicación y flujo de datos entre diferentes **API Routes**.

**Objetivo**: Asegurar que los procesos que involucran múltiples llamadas a API o dependencias entre endpoints funcionen correctamente.

**Categoría**: INT-5 (Prioridad Alta)

---

## CI-API-01: Registro → Login (Flujo de Autenticación)

**Módulos Integrados**: `/api/register` → `/api/auth/[...nextauth]`

**Objetivo**: Verificar que un usuario recién registrado puede autenticarse inmediatamente.

**Precondiciones**:

- Base de datos limpia

**Pasos**:

1. **Paso 1**: POST `/api/register`
   - Body: `{email: "newuser@test.com", password: "Pass123!", name: "New User"}`
   - Verificar status 200
2. **Paso 2**: POST `/api/auth/callback/credentials` (Login)
   - Body: `{email: "newuser@test.com", password: "Pass123!"}`
   - Verificar status 200
   - Verificar cookie de sesión recibida

**Resultado Esperado**:

- El registro es exitoso
- El login subsiguiente es exitoso con las credenciales creadas
- Se establece la sesión correctamente

**Script de Test**:

```javascript
test("CI-API-01: Usuario registrado puede hacer login", async () => {
  // 1. Registrar
  await request(app)
    .post("/api/register")
    .send({ email: "newuser@test.com", password: "Pass123!", name: "New User" })
    .expect(200);

  // 2. Login
  const res = await request(app)
    .post("/api/auth/callback/credentials")
    .send({ email: "newuser@test.com", password: "Pass123!" }); // NextAuth usa csrfToken, simular flujo

  // Nota: En tests de integración con NextAuth real, esto puede requerir mocks
  // o usar un endpoint de login simulado si NextAuth es difícil de testear via HTTP puro
});
```

---

## CI-API-02: Login → GET /api/profile (Acceso Protegido)

**Módulos Integrados**: `/api/auth` → `/api/profile`

**Objetivo**: Verificar que la sesión creada en el login permite acceso a rutas protegidas.

**Precondiciones**:

- Usuario registrado

**Pasos**:

1. **Paso 1**: Login exitoso (obtener cookie)
2. **Paso 2**: GET `/api/profile` SIN cookie
   - Verificar status 401/403
3. **Paso 3**: GET `/api/profile` CON cookie
   - Verificar status 200
   - Verificar datos del usuario

**Resultado Esperado**:

- Acceso denegado sin sesión
- Acceso permitido con sesión válida

---

## CI-API-03: Crear Categoría → Crear Producto (Dependencia de Datos)

**Módulos Integrados**: `/api/categories` → `/api/menu-items`

**Objetivo**: Verificar que un producto puede ser creado referenciando una categoría recién creada.

**Precondiciones**:

- Admin autenticado

**Pasos**:

1. **Paso 1**: POST `/api/categories`
   - Body: `{name: "Pastas"}`
   - Capturar `_id` de la respuesta
2. **Paso 2**: POST `/api/menu-items`
   - Body: `{name: "Spaghetti", category: _id_capturado, ...}`
   - Verificar status 200

**Resultado Esperado**:

- Producto creado exitosamente vinculado a la nueva categoría

---

## CI-API-04: Checkout → Webhook → Orders (Flujo de Pago)

**Módulos Integrados**: `/api/checkout` → `/api/webhook` → `/api/orders`

**Objetivo**: Verificar el ciclo completo de creación de pedido mediante pago.

**Pasos**:

1. **Paso 1**: POST `/api/checkout`
   - Crear intención de pago (simulado)
   - Obtener `paymentIntentId`
2. **Paso 2**: POST `/api/webhook` (Simular callback de Stripe)
   - Payload: `payment_intent.succeeded` con `paymentIntentId`
   - Verificar status 200
3. **Paso 3**: GET `/api/orders`
   - Verificar que existe una orden asociada a ese pago
   - Verificar `paid: true`

**Resultado Esperado**:

- El webhook procesa correctamente la información iniciada en el checkout
- La orden aparece en el listado final

---

## CI-API-05: PUT /api/users → Permisos Reflejados

**Módulos Integrados**: `/api/users` (Admin) → Middleware de Autorización

**Objetivo**: Verificar que cambiar el rol de un usuario afecta sus permisos inmediatamente.

**Precondiciones**:

- Admin autenticado
- Usuario regular existente (`user@test.com`)

**Pasos**:

1. **Paso 1**: Usuario regular intenta GET `/api/users` (Ruta Admin)
   - Verificar status 403 (Forbidden)
2. **Paso 2**: Admin hace PUT `/api/users` para promover a `user@test.com` a admin
3. **Paso 3**: Usuario (ahora admin) intenta GET `/api/users`
   - Verificar status 200

**Resultado Esperado**:

- Elevación de privilegios efectiva inmediatamente (o tras refrescar sesión)

---

## CI-API-06: Sesión Expirada

**Módulos Integrados**: Session Management → API Routes Protegidas

**Objetivo**: Verificar comportamiento de APIs cuando la sesión expira.

**Pasos**:

1. Login exitoso
2. Simular expiración de cookie (o manipular fecha)
3. GET `/api/profile`
   - Verificar redirección o error 401

**Resultado Esperado**:

- API rechaza solicitud con sesión caducada

---

## CI-API-07: Logout → APIs Requieren Reautenticación

**Módulos Integrados**: `/api/auth/signout` → API Routes

**Objetivo**: Verificar que el logout invalida efectivamente el acceso.

**Pasos**:

1. Login exitoso
2. POST `/api/auth/signout`
3. GET `/api/profile` con la cookie antigua

**Resultado Esperado**:

- Acceso denegado (la cookie debe ser borrada o invalidada)

---

## CI-API-08: Middleware de Autorización Múltiple

**Módulos Integrados**: Middleware → `/api/categories`, `/api/menu-items`, `/api/users`

**Objetivo**: Verificar que el middleware de protección admin funciona consistentemente en múltiples rutas.

**Pasos**:

1. Autenticar como Usuario Regular
2. Intentar POST `/api/categories` -> Esperar 403
3. Intentar POST `/api/menu-items` -> Esperar 403
4. Intentar GET `/api/users` -> Esperar 403

**Resultado Esperado**:

- Bloqueo consistente en todas las rutas administrativas

---

## Resumen de Cobertura

| Caso      | Flujo                      | Tipo              | Prioridad |
| --------- | -------------------------- | ----------------- | --------- |
| CI-API-01 | Registro → Login           | Secuencial        | Alta      |
| CI-API-02 | Login → Perfil             | Acceso            | Alta      |
| CI-API-03 | Categoría → Producto       | Dependencia Datos | Media     |
| CI-API-04 | Checkout → Webhook → Orden | Asíncrono         | Alta      |
| CI-API-05 | Cambio Rol → Permisos      | Seguridad         | Alta      |
| CI-API-06 | Sesión Expirada            | Estado            | Media     |
| CI-API-07 | Logout                     | Estado            | Media     |
| CI-API-08 | Middleware Admin           | Seguridad         | Alta      |

---

**Documento**: Casos de Integración Inter-API  
**Estado**: Listo para Implementación  
**Próximo**: Ver [casos_integracion_servicios_externos.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_integracion/casos_integracion_servicios_externos.md)
