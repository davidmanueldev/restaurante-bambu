# Casos de Integración: Flujos End-to-End (E2E)

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Introducción

Este documento contiene los **5 casos de prueba de integración de flujos completos** (End-to-End a nivel de API).

**Objetivo**: Verificar que los procesos de negocio críticos funcionan de principio a fin atravesando múltiples módulos del sistema.

**Categoría**: INT-6 (Prioridad Alta)

---

## CI-E2E-01: Flujo de Registro y Autenticación

**Descripción**: Un usuario nuevo se registra, inicia sesión y consulta sus datos.

**Pasos**:

1. **Registro**: POST `/api/register`
   - Payload: `{email: "e2e@test.com", password: "Pass123!", name: "E2E User"}`
   - Verificar 200 OK
2. **Login**: POST `/api/auth/callback/credentials`
   - Payload: `{email: "e2e@test.com", password: "Pass123!"}`
   - Verificar 200 OK y capturar Cookie
3. **Perfil**: GET `/api/profile` (con Cookie)
   - Verificar 200 OK
   - Verificar que `email` coincide con el registrado

**Validación de Integración**:

- API Register → MongoDB (Escritura)
- API Auth → MongoDB (Lectura/Verificación)
- API Profile → Session → MongoDB (Lectura)

---

## CI-E2E-02: Flujo de Gestión de Productos (Admin)

**Descripción**: Un administrador crea una categoría, sube una imagen y crea un producto asociado.

**Precondiciones**: Admin autenticado.

**Pasos**:

1. **Crear Categoría**: POST `/api/categories`
   - Payload: `{name: "E2E Category"}`
   - Capturar `_id` de categoría
2. **Subir Imagen**: POST `/api/upload`
   - Adjuntar archivo imagen
   - Capturar `link` de S3
3. **Crear Producto**: POST `/api/menu-items`
   - Payload: `{name: "E2E Product", category: _id, image: link, basePrice: 50}`
   - Verificar 200 OK
4. **Verificar**: GET `/api/menu-items`
   - Buscar producto creado en la lista
   - Verificar que tiene la categoría y la imagen correctas

**Validación de Integración**:

- API Categories ↔ MongoDB
- API Upload ↔ AWS S3
- API MenuItems ↔ MongoDB (con referencia a Category)

---

## CI-E2E-03: Flujo Completo de Compra

**Descripción**: El flujo más crítico del negocio: desde ver el menú hasta la confirmación del pedido.

**Pasos**:

1. **Consultar Menú**: GET `/api/menu-items`
   - Seleccionar un producto y su precio
2. **Iniciar Checkout**: POST `/api/checkout`
   - Enviar producto seleccionado y dirección
   - Capturar `paymentIntentId` (simulado)
3. **Procesar Pago**: (Simulado externamente o via Webhook directo)
   - POST `/api/webhook` con `payment_intent.succeeded` y el ID capturado
4. **Verificar Pedido**: GET `/api/orders` (como usuario)
   - Verificar que aparece el pedido
   - Verificar estado `paid: true`

**Validación de Integración**:

- API MenuItems (Lectura)
- API Checkout ↔ Stripe
- API Webhook ↔ MongoDB (Escritura Orden)
- API Orders ↔ MongoDB (Lectura Orden)

---

## CI-E2E-04: Flujo de Actualización de Perfil y Uso en Checkout

**Descripción**: Un usuario actualiza su dirección y verifica que se use automáticamente en el checkout.

**Pasos**:

1. **Actualizar Perfil**: PUT `/api/profile`
   - Payload: `{streetAddress: "Calle Nueva 999", city: "La Paz"}`
2. **Verificar Persistencia**: GET `/api/profile`
   - Confirmar datos guardados
3. **Iniciar Checkout**: POST `/api/checkout`
   - Verificar (si la lógica lo soporta) que el sistema pre-llena o utiliza estos datos, o verificar manualmente en la respuesta si se devuelven datos de usuario.

**Validación de Integración**:

- API Profile (Escritura/Lectura)
- Integración de datos de usuario en flujo de compra

---

## CI-E2E-05: Flujo de Administración de Pedidos

**Descripción**: Ciclo de vida de un pedido desde la vista del administrador.

**Pasos**:

1. **Crear Pedido**: (Simular pedido pagado via Webhook)
2. **Listar Pedidos (Admin)**: GET `/api/orders` (con rol admin)
   - Encontrar el pedido reciente
   - Verificar estado inicial (ej. no entregado)
3. **Actualizar Estado**: PUT `/api/orders` (o endpoint específico)
   - Marcar como enviado/entregado
4. **Verificar Cliente**: GET `/api/orders` (como cliente)
   - Verificar que el cliente ve el nuevo estado

**Validación de Integración**:

- API Orders (Admin vs Cliente)
- Permisos y Roles
- Actualización de estado en BD

---

## Resumen de Cobertura E2E

| Caso      | Flujo de Negocio | Módulos Clave                   |
| --------- | ---------------- | ------------------------------- |
| CI-E2E-01 | Identidad        | Auth, User, Profile             |
| CI-E2E-02 | Catálogo         | Categories, Upload, Products    |
| CI-E2E-03 | Ventas           | Menu, Checkout, Webhook, Orders |
| CI-E2E-04 | Usuario          | Profile, Checkout               |
| CI-E2E-05 | Operaciones      | Orders (Admin/User)             |

---

**Documento**: Casos de Integración Flujos E2E  
**Estado**: Listo para Implementación  
**Próximo**: Ver [guia_ejecucion_integracion.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_integracion/guia_ejecucion_integracion.md)
