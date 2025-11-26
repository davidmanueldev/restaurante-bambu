# Casos de Prueba de Validación - Caja Negra

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Introducción

Este documento contiene los **53 casos de prueba de caja negra** para las **Pruebas de Validación** (Pressman, p. 399-400), diseñados para verificar que cada requisito funcional (RF-01 a RF-24) se cumple según su especificación.

**Estructura**:

- **5 Módulos Funcionales**
- **53 Casos de Prueba Totales**
- **Cobertura**: 100% de requisitos funcionales

---

## Módulo 1: Autenticación

### CP-AUTH-01: Registro Exitoso con Datos Válidos

**RF Relacionado**: RF-01 (Registro de usuario)  
**Prioridad**: Alta

**Precondiciones**:

- El email de prueba no está registrado en la base de datos
- Servidor MongoDB accesible

**Datos de Entrada**:

```json
{
  "name": "Juan Pérez",
  "email": "juan.perez.test@example.com",
  "password": "Password123!"
}
```

**Pasos de Ejecución**:

1. Navegar a `/register`
2. Completar campo "Nombre" con "Juan Pérez"
3. Completar campo "Email" con "juan.perez.test@example.com"
4. Completar campo "Contraseña" con "Password123!"
5. Hacer clic en botón "Registrar"

**Resultado Esperado**:

- Usuario es redirigido a `/login`
- Toast notification: "Usuario registrado exitosamente"
- En MongoDB, colección `users` contiene nuevo documento con:
  - `email`: "juan.perez.test@example.com"
  - `password`: hash bcrypt (no texto plano)
  - `name`: "Juan Pérez"

**Criterio de Éxito**: ✅ Usuario registrado puede iniciar sesión inmediatamente

---

### CP-AUTH-02: Registro Fallido con Email Duplicado

**RF Relacionado**: RF-01 (Registro de usuario)  
**Prioridad**: Alta

**Precondiciones**:

- Email "admin@restaurantebambu.com" YA existe en la base de datos

**Datos de Entrada**:

```json
{
  "name": "Usuario Duplicado",
  "email": "admin@restaurantebambu.com",
  "password": "OtraPassword456!"
}
```

**Pasos de Ejecución**:

1. Navegar a `/register`
2. Completar formulario con datos de entrada
3. Hacer clic en "Registrar"

**Resultado Esperado**:

- Usuario NO es redirigido
- Toast notification ERROR: "Este email ya está registrado"
- NO se crea nuevo documento en MongoDB
- Formulario permanece visible con datos ingresados

**Criterio de Éxito**: ✅ Sistema previene duplicados de email

---

### CP-AUTH-03: Login con Credenciales Correctas

**RF Relacionado**: RF-02 (Inicio de sesión)  
**Prioridad**: Alta

**Precondiciones**:

- Usuario con email "cliente@example.com" y password "Cliente123!" existe en BD

**Datos de Entrada**:

```json
{
  "email": "cliente@example.com",
  "password": "Cliente123!"
}
```

**Pasos de Ejecución**:

1. Navegar a `/login`
2. Completar campo Email
3. Completar campo Contraseña
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado**:

- Usuario redirigido a `/` (home)
- Header muestra nombre del usuario logueado
- Cookie de sesión `next-auth.session-token` presente en navegador
- En base de datos, `sessions` tiene nueva entrada

**Criterio de Éxito**: ✅ Sesión creada, usuario autenticado

---

### CP-AUTH-04: Login con Credenciales Incorrectas

**RF Relacionado**: RF-02 (Inicio de sesión)  
**Prioridad**: Alta

**Datos de Entrada**:

```json
{
  "email": "cliente@example.com",
  "password": "PasswordIncorrecta"
}
```

**Pasos de Ejecución**:

1. Navegar a `/login`
2. Ingresar credenciales incorrectas
3. Hacer clic en "Iniciar Sesión"

**Resultado Esperado**:

- Usuario NO es redirigido
- Mensaje de error: "Credenciales inválidas"
- NO se crea sesión
- NO hay cookie de sesión en navegador

**Criterio de Éxito**: ✅ Acceso denegado con credenciales incorrectas

---

### CP-AUTH-05: Login con Google OAuth

**RF Relacionado**: RF-02 (Inicio de sesión)  
**Prioridad**: Media

**Precondiciones**:

- Variables GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET configuradas
- Usuario tiene cuenta de Google

**Pasos de Ejecución**:

1. Navegar a `/login`
2. Hacer clic en botón "Continuar con Google"
3. Seleccionar cuenta de Google en popup
4. Autorizar acceso a la aplicación

**Resultado Esperado**:

- Usuario redirigido a `/` tras autorización
- Si email no existía, se crea usuario en BD con `provider: 'google'`
- Sesión NextAuth creada
- Header muestra foto y nombre de Google

**Criterio de Éxito**: ✅ Autenticación OAuth funcional

---

### CP-AUTH-06: Persistencia de Sesión

**RF Relacionado**: RF-02 (Sesión persistente)  
**Prioridad**: Media

**Precondiciones**:

- Usuario autenticado en sesión anterior
- Cookie de sesión válida

**Pasos de Ejecución**:

1. Usuario cierra el navegador SIN cerrar sesión
2. Reabre el navegador
3. Navega a `http://localhost:3000`

**Resultado Esperado**:

- Usuario sigue autenticado (NO redirigido a `/login`)
- Header muestra nombre del usuario
- NextAuth recupera sesión desde cookie `httpOnly`

**Criterio de Éxito**: ✅ Sesión persiste tras cerrar navegador

---

### CP-AUTH-07: Protección de Contraseña (bcrypt)

**RF Relacionado**: RF-01 (Contraseña hasheada)  
**Prioridad**: Alta

**Precondiciones**:

- Acceso directo a MongoDB

**Pasos de Ejecución**:

1. Registrar usuario con password "MiPassword123"
2. Consultar colección `users` en MongoDB:
   ```javascript
   db.users.findOne({ email: "test@example.com" });
   ```
3. Inspeccionar campo `password`

**Resultado Esperado**:

- Campo `password` NO contiene "MiPassword123"
- Valor es hash bcrypt (60 caracteres, inicia con `$2b$10$`)
- Ejemplo: `$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcf...`

**Criterio de Éxito**: ✅ Contraseñas nunca almacenadas en texto plano

---

### CP-AUTH-08: Validación Formato Email

**RF Relacionado**: RF-01 (Email válido)  
**Prioridad**: Media

**Técnica**: Partición de Equivalencia - Clase Inválida para Email

**Datos de Entrada** (múltiples tests):

```
Caso A: "emailsinArroba.com"
Caso B: "@sinLocalPart.com"
Caso C: "sin.dominio@"
Caso D: "" (vacío)
```

**Pasos de Ejecución** (para cada caso):

1. Ir a `/register`
2. Ingresar email inválido
3. Intentar enviar formulario

**Resultado Esperado**:

- Validación HTML5 previene envío: "Por favor ingresa un email válido"
- Si se bypasea HTML5, API retorna error 400: "Email inválido"

**Criterio de Éxito**: ✅ Solo emails con formato válido aceptados

---

## Módulo 2: Gestión de Productos

### CP-PROD-01: Crear Producto con Datos Completos

**RF Relacionado**: RF-07 (Crear producto)  
**Prioridad**: Alta

**Precondiciones**:

- Usuario admin autenticado
- Existe al menos 1 categoría (ej. "Platos Principales")

**Datos de Entrada**:

```json
{
  "name": "Arroz Chaufa Especial",
  "description": "Arroz frito con pollo, verduras y huevo",
  "basePrice": 28,
  "category": "ObjectId('6548...')", // ID de categoría existente
  "image": "https://bucket.s3.amazonaws.com/chaufa.jpg",
  "sizes": [
    { "name": "Personal", "price": 0 },
    { "name": "Familiar", "price": 12 }
  ],
  "extraIngredientPrices": [
    { "name": "Extra Carne", "price": 8 },
    { "name": "Extra Verduras", "price": 4 }
  ]
}
```

**Pasos de Ejecución**:

1. Navegar a `/menu-items`
2. Clic en "Crear Nuevo Producto"
3. Completar todos los campos del formulario
4. Subir imagen (CP-PROD-08 cubre upload)
5. Guardar

**Resultado Esperado**:

- Producto creado en colección `menuitems`
- Toast: "Producto creado exitosamente"
- Producto visible en `/menu` para clientes
- Todos los campos guardados correctamente

**Criterio de Éxito**: ✅ Producto funcional con pricing completo

---

### CP-PROD-02: Crear Producto Sin Imagen

**RF Relacionado**: RF-07 (Crear producto)  
**Prioridad**: Media

**Datos de Entrada**:

- Todos los campos completos EXCEPTO `image` (dejado vacío o null)

**Pasos de Ejecución**:

1. Ir a `/menu-items` como admin
2. Crear producto sin subir imagen
3. Guardar

**Resultado Esperado**:

- Producto se crea exitosamente
- Campo `image` es `null` o URL placeholder
- En `/menu`, producto se muestra con imagen por defecto

**Criterio de Éxito**: ✅ Imagen es opcional

---

### CP-PROD-03: Editar Precio de Producto

**RF Relacionado**: RF-08 (Editar producto)  
**Prioridad**: Alta

**Precondiciones**:

- Producto "Arroz Chaufa" existe con `basePrice: 28`

**Datos de Entrada**:

```json
{
  "_id": "ObjectId('producto existente')",
  "basePrice": 32 // Nuevo precio
}
```

**Pasos de Ejecución**:

1. Navegar a `/menu-items` como admin
2. Clic en "Editar" en producto "Arroz Chaufa"
3. Cambiar `basePrice` de 28 a 32
4. Guardar cambios

**Resultado Esperado**:

- Toast: "Producto actualizado"
- En base de datos, `basePrice` es 32
- En `/menu` público, precio actualizado visible

**Criterio de Éxito**: ✅ Cambios reflejados inmediatamente

---

### CP-PROD-04: Eliminar Producto

**RF Relacionado**: RF-09 (Eliminar producto)  
**Prioridad**: Media

**Precondiciones**:

- Producto de prueba creado

**Pasos de Ejecución**:

1. Ir a `/menu-items` como admin
2. Localizar producto a eliminar
3. Clic en botón "Eliminar"
4. Confirmar eliminación en modal

**Resultado Esperado**:

- Producto removido de colección `menuitems`
- Ya NO aparece en `/menu-items` ni en `/menu`
- Toast: "Producto eliminado"

**Criterio de Éxito**: ✅ Producto eliminado permanentemente

---

### CP-PROD-05: Agregar Tamaños a Producto

**RF Relacionado**: RF-10 (Gestionar extras - tamaños)  
**Prioridad**: Media

**Datos de Entrada**:

```json
{
  "sizes": [
    { "name": "Pequeño", "price": 0 },
    { "name": "Mediano", "price": 5 },
    { "name": "Grande", "price": 12 }
  ]
}
```

**Pasos de Ejecución**:

1. Editar producto existente
2. En sección "Tamaños", agregar 3 tamaños con sus precios
3. Guardar

**Resultado Esperado**:

- Array `sizes` guardado en MongoDB
- En `/menu`, al seleccionar producto aparece dropdown de tamaños
- Precio total = `basePrice + sizePrice`

**Criterio de Éxito**: ✅ Tamaños funcionales en frontend

---

### CP-PROD-06: Agregar Extras a Producto

**RF Relacionado**: RF-10 (Gestionar extras - ingredientes)  
**Prioridad**: Media

**Datos de Entrada**:

```json
{
  "extraIngredientPrices": [
    { "name": "Queso Extra", "price": 5 },
    { "name": "Tocino", "price": 6 },
    { "name": "Aguacate", "price": 4 }
  ]
}
```

**Pasos de Ejecución**:

1. Editar producto
2. Agregar 3 extras con precios
3. Guardar

**Resultado Esperado**:

- Checkbox de extras visible en `/menu`
- Al seleccionar extras, precio total se actualiza dinámicamente
- Precio = `basePrice + sizePrice + sum(extrasSeleccionados)`

**Criterio de Éxito**: ✅ Cálculo de precio correcto

---

### CP-PROD-07: Validar Precio Negativo (Frontera)

**RF Relacionado**: RF-07 (Validación de datos)  
**Prioridad**: Alta  
**Técnica**: Análisis de Valor de Frontera

**Datos de Entrada**:

```json
{
  "basePrice": -10 // Valor inválido
}
```

**Pasos de Ejecución**:

1. Intentar crear/editar producto con precio negativo
2. Guardar

**Resultado Esperado**:

- Validación RECHAZA el valor
- Error: "El precio debe ser mayor a 0"
- Producto NO se guarda con precio negativo

**Criterio de Éxito**: ✅ Solo precios positivos aceptados

---

### CP-PROD-08: Upload Imagen a S3

**RF Relacionado**: RF-11 (Subir imágenes)  
**Prioridad**: Alta

**Precondiciones**:

- Variables AWS configuradas (MY_AWS_ACCESS_KEY, MY_AWS_SECRET_KEY)

**Datos de Entrada**:

- Archivo de imagen: `chaufa.jpg` (tamaño < 5MB, formato JPEG/PNG)

**Pasos de Ejecución**:

1. Crear/editar producto
2. Clic en botón "Upload Image"
3. Seleccionar archivo del sistema
4. Esperar carga

**Resultado Esperado**:

- Imagen subida a bucket S3
- API `/api/upload` retorna URL de S3:
  ```json
  { "url": "https://bucket-name.s3.amazonaws.com/images/123456.jpg" }
  ```
- URL guardada en campo `image` del producto
- Imagen visible en `/menu`

**Criterio de Éxito**: ✅ Imagen accesible públicamente desde S3

---

### CP-PROD-09: Validar Campos Obligatorios

**RF Relacionado**: RF-07 (Validación mongoose)  
**Prioridad**: Media

**Técnica**: Partición de Equivalencia - Clase Inválida

**Datos de Entrada**:

```json
{
  "name": "", // Vacío
  "description": "Descripción válida",
  "basePrice": null, // Null
  "category": ""
}
```

**Pasos de Ejecución**:

1. Intentar crear producto sin campos requeridos
2. Enviar formulario

**Resultado Esperado**:

- Validación frontend: campos marcados en rojo
- Si bypaseada, API retorna 400: "Campos obligatorios faltantes"
- Producto NO creado

**Criterio de Éxito**: ✅ Validación robusta de campos obligatorios

---

### CP-PROD-10: Listar Productos Públicamente

**RF Relacionado**: RF-07 (Implicado - visibilidad pública)  
**Prioridad**: Alta

**Precondiciones**:

- Al menos 3 productos creados en diferentes categorías

**Pasos de Ejecución**:

1. Usuario NO autenticado
2. Navegar a `/menu`

**Resultado Esperado**:

- Todos los productos visibles
- Imágenes cargadas
- Precios mostrados
- Filtro por categoría funcional
- NO se requiere login

**Criterio de Éxito**: ✅ Menú accesible sin autenticación

---

### CP-PROD-11: Verificar Autorización Admin

**RF Relacionado**: RF-07 (Seguridad - solo admin)  
**Prioridad**: Alta

**Precondiciones**:

- Usuario regular (NO admin) autenticado

**Pasos de Ejecución**:

1. Usuario regular intenta acceder a `/menu-items`

**Resultado Esperado**:

- Redirigido a `/` o mensaje "Acceso denegado"
- NO ve interfaz de gestión de productos

**Criterio de Éxito**: ✅ Solo admins gestionan productos

---

### CP-PROD-12: Búsqueda por Categoría

**RF Relacionado**: RF-05, RF-07 (Filtrado)  
**Prioridad**: Media

**Precondiciones**:

- Productos en categorías "Platos", "Bebidas", "Postres"

**Pasos de Ejecución**:

1. Ir a `/menu`
2. Seleccionar filtro "Bebidas"

**Resultado Esperado**:

- Solo productos de categoría "Bebidas" visibles
- Otros productos ocultos temporalmente
- Contador: "X productos encontrados"

**Criterio de Éxito**: ✅ Filtrado correcto por categoría

---

## Módulo 3: Carrito y Checkout

### CP-CART-01: Agregar Producto al Carrito

**RF Relacionado**: RF-12 (Agregar al carrito)  
**Prioridad**: Alta

**Precondiciones**:

- Usuario en `/menu`
- Producto "Arroz Chaufa" disponible

**Datos de Entrada**:

```json
{
  "producto": "Arroz Chaufa",
  "size": { "name": "Familiar", "price": 12 },
  "extras": [{ "name": "Extra Carne", "price": 8 }],
  "cantidad": 2
}
```

**Pasos de Ejecución**:

1. Ir a `/menu`
2. Clic en producto "Arroz Chaufa"
3. Seleccionar tamaño "Familiar"
4. Marcar checkbox "Extra Carne"
5. Ajustar cantidad a 2
6. Clic "Agregar al Carrito"

**Resultado Esperado**:

- Toast: "Producto agregado al carrito"
- Ícono de carrito muestra badge "2 ítems"
- LocalStorage contiene:
  ```javascript
  localStorage.getItem("cart");
  // [{"name": "Arroz Chaufa", "size": {...}, "extras": [...], "qty": 2}]
  ```

**Criterio de Éxito**: ✅ Producto en carrito con configuración correcta

---

### CP-CART-02: Modificar Cantidad (Incrementar)

**RF Relacionado**: RF-13 (Modificar cantidad)  
**Prioridad**: Alta

**Precondiciones**:

- Carrito contiene 1 producto con cantidad = 2

**Pasos de Ejecución**:

1. Ir a `/cart`
2. Clic en botón "+" de cantidad
3. Verificar subtotal actualizado

**Resultado Esperado**:

- Cantidad incrementada a 3
- Subtotal recalculado automáticamente
- LocalStorage actualizado

**Criterio de Éxito**: ✅ Incremento funcional

---

### CP-CART-03: Modificar Cantidad (Decrementar)

**RF Relacionado**: RF-13 (Modificar cantidad)  
**Prioridad**: Alta

**Precondiciones**:

- Producto con cantidad = 3

**Pasos de Ejecución**:

1. En `/cart`, clic en botón "-"

**Resultado Esperado**:

- Cantidad reducida a 2
- Subtotal recalculado
- Si cantidad llega a 0, producto removido del carrito

**Criterio de Éxito**: ✅ Decremento funcional, producto removido si qty=0

---

### CP-CART-04: Eliminar Producto del Carrito

**RF Relacionado**: RF-14 (Eliminar del carrito)  
**Prioridad**: Alta

**Pasos de Ejecución**:

1. En `/cart`, clic en ícono "🗑️" de un producto
2. Confirmar eliminación

**Resultado Esperado**:

- Producto removido de la lista
- Subtotal recalculado
- Si carrito queda vacío: mensaje "Tu carrito está vacío"

**Criterio de Éxito**: ✅ Eliminación inmediata

---

### CP-CART-05: Calcular Subtotal Correctamente

**RF Relacionado**: RF-15 (Calcular subtotal)  
**Prioridad**: Alta

**Datos de Prueba**:

- Producto A: basePrice 25, size +5, extras +8, qty 2
  - Total A: (25+5+8) × 2 = 76
- Producto B: base Price 15, sin extras, qty 1
  - Total B: 15
- **Subtotal Esperado**: 76 + 15 = **91**

**Pasos de Ejecución**:

1. Agregar productos al carrito
2. Ir a `/cart`
3. Verificar subtotal mostrado

**Resultado Esperado**:

- Subtotal = 91
- Desglose visible por producto

**Criterio de Éxito**: ✅ Cálculo matemático correcto

---

### CP-CART-06: Calcular Total con Extras

**RF Relacionado**: RF-15 (Cálculo precio)  
**Prioridad**: Media

**Técnica**: Partición de Equivalencia

**Datos de Entrada**:

```
basePrice: 30
size: +10
extras: [+5, +8, +3]
cantidad: 1
Total Esperado: 30 + 10 + (5+8+3) = 56
```

**Pasos**:

1. Configurar producto con múltiples extras
2. Agregar al carrito
3. Verificar precio

**Resultado Esperado**:

- Precio unitario = 56
- Desglose muestra: "Base 30 + Tamaño 10 + Extras 16"

**Criterio de Éxito**: ✅ Suma de extras correcta

---

### CP-CART-07: Calcular Total con Tamaño

**RF Relacionado**: RF-15 (Cálculo precio)  
**Prioridad**: Media

**Datos de Entrada**:

```
basePrice: 20
size: {"name": "XL", "price": 15}
No extras
cantidad: 3
Total Esperado: (20 + 15) × 3 = 105
```

**Resultado Esperado**:

- Total = 105

**Criterio de Éxito**: ✅ Precio de tamaño aplicado correctamente

---

### CP-CART-08: Proceso Checkout con Dirección Válida

**RF Relacionado**: RF-16 (Proceso de pago)  
**Prioridad**: Alta

**Precondiciones**:

- Usuario autenticado
- Carrito con al menos 1 producto

**Datos de Entrada**:

```json
{
  "phone": "+591 62294912",
  "streetAddress": "Av. Busch #456",
  "city": "Santa Cruz",
  "postalCode": "0000",
  "country": "Bolivia"
}
```

**Pasos de Ejecución**:

1. En `/cart`, clic "Proceder al Pago"
2. Completar formulario de dirección
3. Clic "Pagar"

**Resultado Esperado**:

- Redirigido a Stripe Checkout
- URL contiene `checkout.stripe.com/pay/cs_test_...`

**Criterio de Éxito**: ✅ Sesión de Stripe creada exitosamente

---

### CP-CART-09: Crear Sesión Stripe

**RF Relacionado**: RF-17 (Integración Stripe)  
**Prioridad**: Alta

**Precondiciones**:

- Variable `STRIPE_SK` configurada

**Pasos**:

1. Ejecutar checkout (CP-CART-08)
2. Inspeccionar respuesta de `/api/checkout`

**Resultado Esperado**:

- Response 200:
  ```json
  { "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3..." }
  ```
- En Stripe Dashboard, ver sesión creada con productos correctos

**Criterio de Éxito**: ✅ Integración Stripe funcional

---

### CP-CART-10: Confirmación Pago Webhook

**RF Relacionado**: RF-18 (Webhook confirma pago)  
**Prioridad**: Alta

**Precondiciones**:

- Stripe CLI configurado para forwarding: `stripe listen --forward-to localhost:3000/api/webhook`

**Pasos**:

1. Completar pago en Stripe Checkout (usar tarjeta test `4242 4242 4242 4242`)
2. Stripe envía evento `payment_intent.succeeded` a webhook

**Resultado Esperado**:

- Endpoint `/api/webhook` recibe evento
- Valida firma Stripe
- Crea pedido en colección `orders` con `paid: true`
- Logs: "Pedido creado: ORD-123456"

**Criterio de Éxito**: ✅ Pedido solo creado tras confirmación webhook

---

### CP-CART-11: Validar Campos Dirección Obligatorios

**RF Relacionado**: RF-16 (Validación datos checkout)  
**Prioridad**: Media

**Técnica**: Partición de Equivalencia - Clase Inválida

**Datos de Entrada**:

```json
{
  "phone": "", // Vacío
  "streetAddress": "",
  "city": "Santa Cruz"
}
```

**Pasos**:

1. Intentar checkout sin dirección completa

**Resultado Esperado**:

- Error: "Por favor completa todos los campos"
- NO se crea sesión de Stripe

**Criterio de Éxito**: ✅ Validación previene datos incompletos

---

### CP-CART-12: Verificar Autenticación Requerida

**RF Relacionado**: RF-16 (Seguridad)  
**Prioridad**: Alta

**Precondiciones**:

- Usuario NO autenticado
- Carrito tiene productos (localStorage)

**Pasos**:

1. Usuario sin login intenta "Proceder al Pago"

**Resultado Esperado**:

- Redirigido a `/login`
- Mensaje: "Inicia sesión para continuar"

**Criterio de Éxito**: ✅ Checkout requiere autenticación

---

### CP-CART-13: Carrito Vacío No Permite Checkout

**RF Relacionado**: RF-16 (Validación)  
**Prioridad**: Media

**Pasos**:

1. Vaciar carrito completamente
2. Intentar acceder a checkout

**Resultado Esperado**:

- Botón "Proceder al Pago" deshabilitado
- Mensaje: "Agrega productos para continuar"

**Criterio de Éxito**: ✅ Prevención de checkouts vacíos

---

### CP-CART-14: Persistencia Carrito en LocalStorage

**RF Relacionado**: RF-12 (Implicado)  
**Prioridad**: Media

**Pasos**:

1. Agregar productos al carrito
2. Cerrar navegador
3. Reabrir y volver a la aplicación

**Resultado Esperado**:

- Carrito mantiene productos agregados
- Badge de carrito muestra cantidad correcta

**Criterio de Éxito**: ✅ Carrito persiste entre sesiones

---

### CP-CART-15: Límite Máximo Productos (Frontera)

**RF Relacionado**: RF-13 (Implicado)  
**Prioridad**: Baja  
**Técnica**: Análisis de Valor de Frontera

**Datos de Entrada**:

- Intentar agregar 50, 51 unidades del mismo producto

**Pasos**:

1. Incrementar cantidad hasta 50

**Resultado Esperado**:

- Si hay límite implementado: cantidad máxima 50
- Botón "+" deshabilitado al alcanzar límite

**Criterio de Éxito**: ✅ Sistema maneja límites razonables

---

## Módulo 4: Gestión de Pedidos

### CP-ORDER-01: Crear Pedido Tras Pago Exitoso

**RF Relacionado**: RF-19 (Creación de pedido)  
**Prioridad**: Alta

**Precondiciones**:

- Pago completado en Stripe
- Webhook confirmó `payment_intent.succeeded`

**Pasos**:

1. Completar flujo de checkout (CP-CART-10)
2. Consultar MongoDB: `db.orders.find({userEmail: "cliente@example.com"})`

**Resultado Esperado**:

- Nuevo documento en colección `orders`:
  ```json
  {
    "_id": ObjectId("..."),
    "userEmail": "cliente@example.com",
    "cartProducts": [...],
    "paid": true,
    "streetAddress": "Av. Busch #456",
    "city": "Santa Cruz",
    "phone": "+591 62294912",
    "createdAt": ISODate("2024-11-26...")
  }
  ```

**Criterio de Éxito**: ✅ Pedido creado con `paid: true`

---

### CP-ORDER-02: Ver Historial de Pedidos (Usuario)

**RF Relacionado**: RF-20 (Historial usuario)  
**Prioridad**: Media

**Precondiciones**:

- Usuario autenticado tiene 3 pedidos previos

**Pasos**:

1. Navegar a `/orders`

**Resultado Esperado**:

- Lista de 3 pedidos del usuario actual
- Muestra: fecha, total, estado
- Pedidos ordenados por fecha descendente

**Criterio de Éxito**: ✅ Solo ve sus propios pedidos

---

### CP-ORDER-03: Ver Detalle de Pedido Específico

**RF Relacionado**: RF-21 (Detalle de pedido)  
**Prioridad**: Media

**Pasos**:

1. En `/orders`, clic en pedido específico
2. Ver detalle completo

**Resultado Esperado**:

- Muestra:
  - Productos con cantidades y precios
  - Dirección de entrega
  - Estado del pedido
  - Fecha y hora
  - Total pagado

**Criterio de Éxito**: ✅ Toda la información del pedido visible

---

### CP-ORDER-04: Listar Todos los Pedidos (Admin)

**RF Relacionado**: RF-22 (Listado admin)  
**Prioridad**: Alta

**Precondiciones**:

- Usuario admin autenticado
- Existen pedidos de múltiples usuarios

**Pasos**:

1. Admin navega a `/orders` (o ruta admin específica)

**Resultado Esperado**:

- Ve TODOS los pedidos del sistema (de todos los usuarios)
- Incluye email del cliente en cada pedido
- Paginación si hay muchos pedidos

**Criterio de Éxito**: ✅ Admin ve pedidos de todos los clientes

---

### CP-ORDER-05: Actualizar Estado Pedido (Admin)

**RF Relacionado**: RF-23 (Actualizar estado)  
**Prioridad**: Media

**Precondiciones**:

- Pedido con estado "Pendiente"

**Pasos**:

1. Admin selecciona pedido
2. Cambia estado a "En Preparación"
3. Guarda

**Resultado Esperado**:

- Campo `status` actualizado en BD
- Cliente ve estado actualizado en su `/orders`

**Criterio de Éxito**: ✅ Cambio de estado persistido

---

### CP-ORDER-06: Buscar Pedidos por Email

**RF Relacionado**: RF-24 (Buscar pedidos)  
**Prioridad**: Media

**Pasos**:

1. Admin en vista de pedidos
2. Ingresa email en campo de búsqueda: "cliente@example.com"
3. Presiona Enter

**Resultado Esperado**:

- Muestra solo pedidos de "cliente@example.com"
- Otros pedidos filtrados

**Criterio de Éxito**: ✅ Búsqueda por email funcional

---

### CP-ORDER-07: Verificar Campo paid=true

**RF Relacionado**: RF-19 (Validación pago)  
**Prioridad**: Alta

**Pasos**:

1. Intentar crear pedido sin confirmación de pago
   - Simular: llamar directamente `/api/orders` SIN webhook

**Resultado Esperado**:

- Pedido NO creado
- O si se crea, campo `paid: false`
- Solo webhook Stripe puede marcar `paid: true`

**Criterio de Éxito**: ✅ Seguridad: solo pagos confirmados

---

### CP-ORDER-08: Pedido No Creado Si Pago Falla

**RF Relacionado**: RF-19, RFIA-03 (Fiabilidad)  
**Prioridad**: Alta

**Pasos**:

1. Iniciar checkout
2. En Stripe, usar tarjeta que falle: `4000 0000 0000 0002`
3. Stripe rechaza pago

**Resultado Esperado**:

- Webhook recibe evento `payment_intent.failed`
- NO se crea pedido en MongoDB
- Usuario ve mensaje: "Pago rechazado"

**Criterio de Éxito**: ✅ Pedidos solo con pago exitoso

---

### CP-ORDER-09: Validación Integridad Datos Pedido

**RF Relacionado**: RF-19 (Validación)  
**Prioridad**: Media

**Pasos**:

1. Inspeccionar pedido creado en MongoDB
2. Verificar que contiene:
   - `cartProducts` (array completo)
   - `userEmail`
   - `streetAddress`, `city`, `phone`
   - `paid`, `createdAt`

**Resultado Esperado**:

- Todos los campos requeridos presentes
- NO hay campos `undefined` o `null` donde se espera valor

**Criterio de Éxito**: ✅ Datos completos y consistentes

---

### CP-ORDER-10: Autorización por Rol

**RF Relacionado**: RF-22, RF-23 (Seguridad admin)  
**Prioridad**: Alta

**Precondiciones**:

- Usuario regular (NO admin) autenticado

**Pasos**:

1. Usuario regular intenta acceder a endpoint admin:
   ```
   GET /api/orders (sin filtro de email)
   ```

**Resultado Esperado**:

- Error 403: "Acceso denegado. Requiere permisos de administrador"
- NO retorna pedidos de otros usuarios

**Criterio de Éxito**: ✅ Protección de rutas admin

---

## Módulo 5: Perfil y Usuarios

### CP-USER-01: Actualizar Información Perfil

**RF Relacionado**: RF-03 (Gestión de perfil)  
**Prioridad**: Media

**Precondiciones**:

- Usuario autenticado

**Datos de Entrada**:

```json
{
  "name": "Juan Pérez Actualizado",
  "phone": "+591 77788899",
  "streetAddress": "Nueva Dirección #789",
  "city": "Cochabamba"
}
```

**Pasos**:

1. Ir a `/profile`
2. Editar campos
3. Guardar

**Resultado Esperado**:

- Toast: "Perfil actualizado"
- Colección `userinfos` actualizada
- Cambios reflejados en futuras cargas de `/profile`

**Criterio de Éxito**: ✅ Actualización persistente

---

### CP-USER-02: Actualizar Dirección

**RF Relacionado**: RF-03 (Dirección)  
**Prioridad**: Media

**Pasos**:

1. Actualizar `streetAddress` y `city`
2. Guardar
3. Ir a checkout
4. Verificar que dirección se pre-llena

**Resultado Esperado**:

- Dirección guardada en `userinfos`
- Checkout usa dirección guardada por defecto

**Criterio de Éxito**: ✅ Dirección predeterminada funcional

---

### CP-USER-03: Subir Foto Perfil

**RF Relacionado**: RF-03 (Foto)  
**Prioridad**: Baja

**Pasos**:

1. En `/profile`, clic "Cambiar Foto"
2. Subir imagen
3. Guardar

**Resultado Esperado**:

- Imagen subida a S3
- URL guardada en `users.image`
- Foto visible en header

**Criterio de Éxito**: ✅ Foto de perfil actualizada

---

### CP-USER-04: Distinguir Rol Admin

**RF Relacionado**: RF-04 (Roles)  
**Prioridad**: Alta

**Pasos**:

1. Usuario admin autenticado
2. Verificar en UI elementos admin:
   - Link a `/menu-items`
   - Link a `/categories`
   - Link a `/users`

**Resultado Esperado**:

- Usuario admin ve opciones administrativas
- Usuario regular NO las ve

**Criterio de Éxito**: ✅ UI diferenciada por rol

---

### CP-USER-05: Crear Categoría (Admin)

**RF Relacionado**: RF-05 (Crear categoría)  
**Prioridad**: Alta

**Datos de Entrada**:

```json
{ "name": "Desayunos" }
```

**Pasos**:

1. Admin va a `/categories`
2. Clic "Nueva Categoría"
3. Ingresar nombre
4. Guardar

**Resultado Esperado**:

- Categoría en colección `categories`
- Visible en selector al crear productos

**Criterio de Éxito**: ✅ Categoría creada y funcional

---

### CP-USER-06: Editar Categoría (Admin)

**RF Relacionado**: RF-06 (Editar categoría)  
**Prioridad**: Media

**Pasos**:

1. Seleccionar categoría "Desayunos"
2. Cambiar nombre a "Desayunos Especiales"
3. Guardar

**Resultado Esperado**:

- Nombre actualizado en BD
- Productos de esa categoría mantienen relación

**Criterio de Éxito**: ✅ Edición sin romper relaciones

---

### CP-USER-07: Eliminar Categoría (Admin)

**RF Relacionado**: RF-06 (Eliminar categoría)  
**Prioridad**: Media

**Precondiciones**:

- Categoría sin productos asignados

**Pasos**:

1. Eliminar categoría vacía

**Resultado Esperado**:

- Categoría removida de BD
- Si hay productos: advertencia "No se puede eliminar"

**Criterio de Éxito**: ✅ Protección de integridad referencial

---

### CP-USER-08: Usuario Regular Sin Acceso Admin

**RF Relacionado**: RF-04 (Seguridad)  
**Prioridad**: Alta

**Pasos**:

1. Usuario regular intenta navegar directamente a `/categories`

**Resultado Esperado**:

- Redirigido o mensaje "Acceso denegado"

**Criterio de Éxito**: ✅ Protección de rutas

---

## Resumen de Cobertura

| Módulo             | Requisitos Funcionales | Casos Diseñados | Cobertura |
| ------------------ | ---------------------- | --------------- | --------- |
| Autenticación      | RF-01, RF-02           | 8               | 100%      |
| Gestión Productos  | RF-05 a RF-11          | 12              | 100%      |
| Carrito y Checkout | RF-12 a RF-18          | 15              | 100%      |
| Gestión Pedidos    | RF-19 a RF-24          | 10              | 100%      |
| Perfil y Usuarios  | RF-03, RF-04           | 8               | 100%      |
| **TOTAL**          | **24 RF**              | **53 casos**    | **100%**  |

---

## Técnicas de Caja Negra Aplicadas

- ✅ **Partición de Equivalencia**: CP-AUTH-08, CP-PROD-07, CP-PROD-09, CP-CART-06, CP-CART-11
- ✅ **Análisis de Valor de Frontera**: CP-PROD-07, CP-CART-15

---

**Documento**: Casos de Prueba de Validación  
**Estado**: Completo para Ejecución  
**Próximo Paso**: Ver [matriz_trazabilidad.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/matriz_trazabilidad.md)
