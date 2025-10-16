# Resumen de Ejecución de Pruebas

Fecha de Ejecución: 8 de Octubre de 2025

Ejecutado por: David Manuel Mamani Huanca

Versión Probada: 1.0

Entorno: Desarrollo (Next.js 14.0.0, Node.js v22.19.0, Localhost 3000)

## Resultados Generales

Proyecto: Restaurante Bambú (Next.js)

Módulos detectados a partir de `src/app/` y APIs en `src/app/api/`:
- Autenticación: `login`, `register`, `/api/register`, `/api/profile`
- Dashboard/Operación: `page` (home), `orders`, `orders/[id]`
- Contenidos (Catálogo): `menu`, `menu-items`, `categories`, APIs `/api/menu-items`, `/api/categories`
- Usuarios: `users`, `users/[id]`, API `/api/users`
- Carrito/Checkout: `cart`, API `/api/checkout`, `/api/webhook`
- Subidas: API `/api/upload`

Tabla de resultados por categoría (totales estimados según alcance actual del proyecto):

| Categoría      | Total | Pasaron | Fallaron | Pendientes |
|---------------|:-----:|:-------:|:--------:|:----------:|
| Autenticación  |   2   |    2    |    0     |     0      |
| Dashboard      |   3   |    3    |    0     |     0      |
| Contenidos     |   3   |    3    |    0     |     0      |
| Usuarios       |   2   |    2    |    0     |     0      |
| Carrito/Checkout |  3  |    3    |    0     |     0      |
| Subidas        |   1   |    0    |    0     |     1      |
| Usabilidad     |   4   |    0    |    0     |     4      |
| Seguridad      |   3   |    3    |    0     |     0      |
| TOTAL          |  21   |   16    |    0     |     5      |

Notas:
- Las categorías y totales se han ajustado al alcance real del repositorio: se incluyen “Carrito/Checkout” y “Subidas”. No se detectan módulos de Reportes ni Configuración.
- Si se agregan nuevas secciones, actualizar esta tabla y el total.

## Métricas de Calidad

- Tasa de Éxito = (Casos Pasados / Total Casos) × 100%
  - Tasa de Éxito = (16 / 21) × 100% = 76%
- Defectos Encontrados: 0 (simulación)
- Defectos Resueltos: 0 (simulación)

### Explicación sencilla de esta simulación

- **Qué es**: Un adelanto de resultados usando datos simulados (sin conectarse a base de datos, Stripe ni S3).
- **Cómo se estimó**: Revisión de lógica en `src/app/api/*/route.js` y presencia de páginas en `src/app/`. Donde aplica, se usaron mocks o se dejó como pendiente.
- **Dónde está la lógica**:
  - Rutas de API: `src/app/api/*/route.js`
  - Páginas: `src/app/`
  - Script de verificación: `scripts/smoke-tests.mjs` (con mocks en `scripts/mock-loader.mjs`)

## Ejemplos Breves de Casos de Prueba

### Autenticación: Login
- **Objetivo**: Verificar acceso al sistema con credenciales correspondientes.
- **Datos de Prueba**:
```json
{ "email": "alumno@example.com", "password": "abcde" }
```
- **Pasos de Ejecución**:
  1. Ingresar usuario y contraseña en pantalla de Login.
  2. Validar credenciales en base de datos.
  3. Acceder a Menú Principal según rol.
  4. Verificar permisos de usuario.
- **Resultado Esperado**:
  - ✓ Acceso concedido con credenciales válidas.
  - ✓ Denegación con credenciales incorrectas.
  - ✓ Redirección a Menú Principal.
  - ✓ Permisos aplicados según rol.

- **Código de ejemplo (registro previo para pruebas)**:
```bash
curl -X POST http://localhost:3000/api/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email":"alumno@example.com",
    "password":"abcde",
    "name":"Alumno Test"
  }'
```

### Autenticación: Registro de Usuario
- **Objetivo**: Validar creación de cuenta nueva.
- **Datos de Prueba**: Email único y contraseña con longitud mínima.
- **Pasos de Ejecución**:
  1. Abrir formulario de registro.
  2. Completar email y contraseña válidos.
  3. Enviar formulario.
  4. Verificar creación y posibilidad de iniciar sesión.
- **Resultado Esperado**:
  - ✓ Usuario creado con datos válidos.
  - ✓ Errores claros si el email ya existe o la contraseña es corta.
  - ✓ Redirección o confirmación de registro exitoso.
  - ✓ Hash de contraseña almacenado.

### Catálogo: Categorías (CRUD básico)
- **Objetivo**: Gestionar categorías del menú.
- **Datos de Prueba**: Nombres de categoría válidos/duplicados.
- **Pasos de Ejecución**:
  1. Crear nueva categoría.
  2. Editar nombre de categoría existente.
  3. Listar categorías.
  4. Eliminar categoría de prueba.
- **Resultado Esperado**:
  - ✓ Creación/edición reflejada en el listado.
  - ✓ Validación ante duplicados o nombres vacíos.
  - ✓ Eliminación exitosa sin afectar otras.
  - ✓ Acceso restringido a rol administrador.

### Catálogo: Ítems del Menú (Crear/Editar)
- **Objetivo**: Gestionar productos del menú.
- **Datos de Prueba**: Nombre, precio base, tamaños/extras.
- **Pasos de Ejecución**:
  1. Crear ítem con nombre y precio base.
  2. Agregar tamaño y extras.
  3. Editar precio o propiedades.
  4. Verificar en la lista y detalle.
- **Resultado Esperado**:
  - ✓ Ítem creado y visible en el catálogo.
  - ✓ Cálculo correcto de precios con tamaños/extras.
  - ✓ Edición reflejada en el listado.
  - ✓ Acceso restringido a rol administrador.

### Checkout: Compra y Confirmación de Pago
- **Objetivo**: Simular flujo de compra y confirmación.
- **Datos de Prueba**: Carrito con 1 producto y dirección válida.
- **Pasos de Ejecución**:
  1. Agregar producto al carrito.
  2. Iniciar checkout.
  3. Recibir URL de pago.
  4. Confirmar pago (webhook simulado).
- **Resultado Esperado**:
  - ✓ Generación de URL de pago.
  - ✓ Registro de pedido pendiente.
  - ✓ Webhook marca pedido como pagado.
  - ✓ Redirección a orden con estado actualizado.
