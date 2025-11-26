# SISTEMA DE PEDIDOS EN LÍNEA - RESTAURANTE BAMBÚ

## METODOLOGÍA

---

### Pruebas de Usuario (User Testing)

|**Aspecto**|**Descripción**|
|---|---|
|**Tipo de diseño**|Observacional y experimental, basado en **pruebas de usuario** y **pruebas funcionales**.|
|**Objetivo principal**|Comprender la experiencia del usuario al realizar pedidos en línea, identificar problemas de usabilidad y optimizar el flujo de compra.|
|**Metodología**|**User Testing**: recopilación de datos sobre el comportamiento del usuario mientras navega, selecciona productos, realiza pedidos y gestiona su perfil.|
|**Principios clave de las pruebas**||
|➤ Observación del comportamiento (Descriptivo)|Se observa cómo los usuarios navegan por el menú, agregan productos al carrito, completan el checkout y gestionan sus pedidos.|
|➤ Análisis de la experiencia (Cualitativo)|Se analiza si la interfaz es intuitiva, si el proceso de compra es fluido y si el usuario puede completar sus objetivos sin frustración.|
|➤ Análisis de la utilidad (Utilitario)|Se recopilan datos sobre errores de interfaz, tiempos de respuesta, problemas de navegación y puntos de abandono del proceso de compra.|
|**Consideraciones metodológicas**|Las pruebas deben realizarse con diferentes perfiles de usuarios (clientes y administradores) para cubrir todos los casos de uso.|
|**Ciclo de mejora**|Las pruebas permiten detectar problemas, implementar mejoras iterativas y validar que las soluciones funcionen correctamente.|

---

## METODOLOGÍA DE SCRUM

|**Aspecto**|**Descripción**|
|---|---|
|**Metodología principal**|Se utiliza **Scrum**, una metodología ágil que permite el desarrollo iterativo e incremental del sistema de pedidos.|
|**Complemento metodológico**|Se integra con **pruebas de usuario** que proporcionan feedback continuo sobre la experiencia de uso.|
|**Relación entre ambas**|El enfoque es: "feedback del usuario, mejora continua". Los datos de las pruebas alimentan directamente los sprints de desarrollo.|
|**Desarrollo simultáneo**|Scrum permite implementar nuevas funcionalidades (módulos de menú, carrito, pagos) de forma escalable basándose en las prioridades del negocio.|
|**Adaptabilidad**|Scrum facilita cambios rápidos según el feedback de usuarios y los requerimientos del negocio del restaurante.|
|**Herramientas de apoyo**|Se utilizan **diagramas UML**, **DFD** y **EPS** para representar la arquitectura del sistema de forma clara y escalable.|

---

## ARQUITECTURA DEL SISTEMA

### ¿Por qué una arquitectura basada en componentes es ideal en Next.js?

|**Ventaja**|**Descripción**|
|---|---|
|**Modularidad**|Cada componente representa una funcionalidad específica (Header, MenuItems, Cart, etc.), permitiendo desarrollo independiente.|
|**Escalabilidad**|Se pueden agregar nuevas funcionalidades (nuevos métodos de pago, sistemas de notificaciones) sin afectar el resto del sistema.|
|**Reusabilidad**|Los componentes pueden reutilizarse en diferentes páginas (botones, formularios, tarjetas de productos).|
|**Separación de responsabilidades**|La arquitectura separa frontend (React/Next.js), backend (API Routes), base de datos (MongoDB) y servicios externos (Stripe, S3).|
|**Mantenibilidad**|El código organizado en módulos facilita la detección y corrección de errores, y permite actualizaciones sin riesgo.|

---

### Estructura del proyecto

```plaintext
restaurante-bambu/
├── src/
│   ├── app/                     # Páginas y rutas de Next.js
│   │   ├── api/                 # API Routes (Backend)
│   │   │   ├── auth/            # Autenticación (NextAuth)
│   │   │   ├── register/        # Registro de usuarios
│   │   │   ├── profile/         # Gestión de perfil
│   │   │   ├── categories/      # CRUD de categorías
│   │   │   ├── menu-items/      # CRUD de productos del menú
│   │   │   ├── users/           # Gestión de usuarios
│   │   │   ├── checkout/        # Proceso de pago
│   │   │   ├── orders/          # Gestión de pedidos
│   │   │   ├── webhook/         # Webhook de Stripe
│   │   │   └── upload/          # Subida de imágenes a S3
│   │   ├── login/               # Página de inicio de sesión
│   │   ├── register/            # Página de registro
│   │   ├── menu/                # Página del menú público
│   │   ├── cart/                # Página del carrito
│   │   ├── orders/              # Historial de pedidos
│   │   └── profile/             # Perfil del usuario
│   ├── components/              # Componentes reutilizables
│   │   ├── layout/              # Header, Footer, Navigation
│   │   ├── menu/                # MenuItems, Categories
│   │   └── icons/               # Iconos SVG
│   ├── models/                  # Modelos de MongoDB (Mongoose)
│   │   ├── User.js              # Modelo de usuario
│   │   ├── MenuItem.js          # Modelo de producto
│   │   ├── Category.js          # Modelo de categoría
│   │   └── Order.js             # Modelo de pedido
│   └── libs/                    # Utilidades y configuraciones
└── public/                      # Archivos estáticos
```

---

## TECNOLOGÍAS UTILIZADAS

### Stack Tecnológico Principal

|**Tecnología**|**Uso en el Proyecto**|**Justificación**|
|---|---|---|
|**Next.js 14**|Framework frontend y backend|Permite Server Side Rendering, API Routes, optimización automática y mejor SEO.|
|**React 18**|Biblioteca de interfaz de usuario|Componentes reutilizables, estado reactivo y ecosistema maduro.|
|**MongoDB**|Base de datos NoSQL|Flexibilidad en el esquema de datos, escalabilidad horizontal y fácil integración con Node.js.|
|**Mongoose**|ODM para MongoDB|Validación de esquemas, relaciones entre documentos y queries simplificadas.|
|**NextAuth.js**|Autenticación|Soporte para múltiples proveedores (Google, credenciales), sesiones seguras y fácil integración.|
|**TailwindCSS**|Framework CSS|Desarrollo rápido de interfaces, diseño responsive y personalización sencilla.|
|**Stripe**|Procesamiento de pagos|Plataforma confiable, segura y con excelente documentación para pagos en línea.|
|**AWS S3**|Almacenamiento de imágenes|Almacenamiento escalable y confiable para fotos de productos.|
|**bcryptjs**|Hashing de contraseñas|Seguridad en el almacenamiento de credenciales de usuarios.|

---

## REQUERIMIENTOS FUNCIONALES

---

### 👤 Gestión de Usuarios

|**ID**|**Funcionalidad**|**Descripción**|
|---|---|---|
|RF-01|Registro de Usuario|Los usuarios pueden crear una cuenta nueva proporcionando email, contraseña y nombre.|
|RF-02|Inicio de Sesión|Los usuarios pueden acceder al sistema con email/contraseña o mediante Google OAuth.|
|RF-03|Gestión de Perfil|Los usuarios pueden actualizar su información personal, dirección, teléfono y foto de perfil.|
|RF-04|Roles de Usuario|El sistema distingue entre usuarios regulares y administradores con diferentes permisos.|

---

### 🍽️ Gestión del Menú (Administrador)

|**ID**|**Funcionalidad**|**Descripción**|
|---|---|---|
|RF-05|Crear Categoría|Los administradores pueden crear nuevas categorías para organizar el menú.|
|RF-06|Editar/Eliminar Categoría|Los administradores pueden modificar o eliminar categorías existentes.|
|RF-07|Crear Producto|Los administradores pueden agregar productos al menú con nombre, descripción, precio, imagen y categoría.|
|RF-08|Editar Producto|Los administradores pueden modificar la información de productos existentes.|
|RF-09|Eliminar Producto|Los administradores pueden eliminar productos del menú.|
|RF-10|Gestionar Extras|Los administradores pueden definir extras y tamaños para cada producto con precios adicionales.|
|RF-11|Subir Imágenes|Los administradores pueden subir fotos de productos que se almacenan en AWS S3.|

---

### 🛒 Carrito de Compras

|**ID**|**Funcionalidad**|**Descripción**|
|---|---|---|
|RF-12|Agregar al Carrito|Los usuarios pueden agregar productos al carrito desde el menú, seleccionando tamaño y extras.|
|RF-13|Modificar Cantidad|Los usuarios pueden incrementar o reducir la cantidad de productos en el carrito.|
|RF-14|Eliminar del Carrito|Los usuarios pueden remover productos del carrito.|
|RF-15|Ver Subtotal|El sistema calcula automáticamente el subtotal considerando precios base, extras y cantidades.|

---

### 💳 Proceso de Pago

|**ID**|**Funcionalidad**|**Descripción**|
|---|---|---|
|RF-16|Checkout|Los usuarios pueden proceder al pago proporcionando dirección de entrega.|
|RF-17|Integración con Stripe|El sistema genera una sesión de pago segura en Stripe.|
|RF-18|Confirmación de Pago|Stripe envía un webhook que confirma el pago exitoso.|
|RF-19|Creación de Pedido|Una vez confirmado el pago, se crea un registro del pedido en la base de datos.|

---

### 📦 Gestión de Pedidos

|**ID**|**Funcionalidad**|**Descripción**|
|---|---|---|
|RF-20|Historial de Pedidos (Usuario)|Los usuarios pueden ver sus pedidos anteriores con estado y detalles.|
|RF-21|Ver Detalle de Pedido|Los usuarios pueden ver productos, precios, dirección y estado de cada pedido.|
|RF-22|Listado de Pedidos (Admin)|Los administradores pueden ver todos los pedidos del sistema.|
|RF-23|Actualizar Estado de Pedido|Los administradores pueden cambiar el estado del pedido (Pendiente, En preparación, Entregado).|
|RF-24|Buscar Pedidos|Los administradores pueden buscar pedidos por email del cliente.|

---

## REQUERIMIENTOS NO FUNCIONALES

---

### 🎨 Usabilidad

|**ID**|**Requerimiento**|**Descripción**|
|---|---|---|
|RNF-01|Interfaz Intuitiva|El usuario debe poder navegar por el menú y realizar un pedido sin instrucciones adicionales.|
|RNF-02|Diseño Responsive|El sitio debe funcionar correctamente en dispositivos móviles, tablets y escritorio.|
|RNF-03|Feedback Visual|Todas las acciones deben tener confirmación visual inmediata usando react-hot-toast.|
|RNF-04|Consistencia Visual|El diseño debe mantener un estilo coherente usando TailwindCSS en todas las páginas.|

---

### ⚡ Rendimiento

|**ID**|**Requerimiento**|**Descripción**|
|---|---|---|
|RNF-05|Tiempo de Carga|Las páginas principales deben cargar en menos de 2 segundos con conexión estándar.|
|RNF-06|Optimización de Imágenes|Next.js debe optimizar automáticamente las imágenes usando el componente Image.|
|RNF-07|Server Side Rendering|Las páginas del menú deben usar SSR para mejor SEO y tiempo de carga inicial.|

---

### 🔒 Seguridad

|**ID**|**Requerimiento**|**Descripción**|
|---|---|---|
|RSEG-01|Protección de Contraseñas|Las contraseñas deben hashearse con bcrypt antes de almacenarse.|
|RSEG-02|Autenticación Segura|NextAuth debe manejar sesiones con tokens seguros y httpOnly cookies.|
|RSEG-03|Autorización por Rol|Las rutas de administrador deben verificar permisos en cada request.|
|RSEG-04|Validación de Datos|Todos los inputs del usuario deben validarse en el servidor.|
|RSEG-05|Protección de API Keys|Las claves sensibles deben estar en variables de entorno, nunca en el código.|
|RSEG-06|Webhooks Verificados|Los webhooks de Stripe deben verificarse con la firma secreta.|

---

### 🛡️ Fiabilidad

|**ID**|**Requerimiento**|**Descripción**|
|---|---|---|
|RFIA-01|Manejo de Errores|El sistema debe capturar y manejar errores sin exponer información sensible.|
|RFIA-02|Transacciones Atómicas|Los pedidos deben crearse completamente o no crearse en caso de error.|
|RFIA-03|Validación de Pagos|Solo se deben crear pedidos tras confirmación exitosa del webhook de Stripe.|
|RFIA-04|Disponibilidad de Base de Datos|Debe haber manejo apropiado de errores si MongoDB no está disponible.|

---

## FLUJOS PRINCIPALES DEL SISTEMA

---

### Flujo 1: Registro e Inicio de Sesión

```
Usuario → Formulario de Registro → API /register
  ↓
Validación de datos (email único, contraseña válida)
  ↓
Hash de contraseña con bcrypt
  ↓
Guardar usuario en MongoDB
  ↓
Redirección a Login
  ↓
Autenticación con NextAuth
  ↓
Sesión activa → Acceso al sistema
```

---

### Flujo 2: Realizar un Pedido (Cliente)

```
Usuario autenticado → Navega el Menú
  ↓
Selecciona producto + extras/tamaño
  ↓
Agrega al carrito (localStorage)
  ↓
Revisa carrito → Procede al Checkout
  ↓
Proporciona dirección de entrega
  ↓
API /checkout → Crea sesión de Stripe
  ↓
Redirección a Stripe Checkout
  ↓
Usuario completa pago
  ↓
Stripe envía webhook → API /webhook
  ↓
Webhook verifica firma → Crea pedido en MongoDB
  ↓
Usuario ve confirmación del pedido
```

---

### Flujo 3: Gestión de Productos (Administrador)

```
Admin autenticado → Accede a /menu-items
  ↓
Crea nuevo producto o edita existente
  ↓
Sube imagen → API /upload → AWS S3
  ↓
Completa formulario (nombre, precio, categoría, extras)
  ↓
API /menu-items → Guarda en MongoDB
  ↓
Producto visible en el menú público
```

---

## ESTRUCTURA DE LA BASE DE DATOS (MongoDB)

---

### Colecciones Principales

#### 1. users
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "image": "string (URL)"
}
```

#### 2. userinfos
```json
{
  "_id": "ObjectId",
  "email": "string",
  "streetAddress": "string",
  "city": "string",
  "phone": "string",
  "admin": "boolean"
}
```

#### 3. categories
```json
{
  "_id": "ObjectId",
  "name": "string"
}
```

#### 4. menuitems
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "basePrice": "number",
  "image": "string",
  "category": "ObjectId",
  "sizes": [{"name": "string", "price": "number"}],
  "extraIngredientPrices": [{"name": "string", "price": "number"}]
}
```

#### 5. orders
```json
{
  "_id": "ObjectId",
  "userEmail": "string",
  "streetAddress": "string",
  "city": "string",
  "cartProducts": "array",
  "paid": "boolean",
  "createdAt": "date"
}
```

---

## PLAN DE PRUEBAS

---

### Resultados de Pruebas

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
| **TOTAL**      |  **21**   |   **16**    |    **0**     |     **5**      |

**Tasa de Éxito:** 76%

---

## CONSIDERACIONES DE DESPLIEGUE

---

### Variables de Entorno Requeridas

```env
MONGO_URL="mongodb+srv://usuario:password@cluster.mongodb.net/restaurante-bambu"
NEXTAUTH_URL="http://localhost:3000"
SECRET="tu-secret-para-nextauth"
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
MY_AWS_ACCESS_KEY="tu-aws-access-key"
MY_AWS_SECRET_KEY="tu-aws-secret-key"
STRIPE_SK="tu-stripe-secret-key"
STRIPE_PK="tu-stripe-public-key"
```

---

### Comandos de Instalación y Ejecución

```bash
# Instalación de dependencias
npm install

# Ejecución en desarrollo
npm run dev

# Construcción para producción
npm run build

# Ejecución en producción
npm start

# Pruebas funcionales
npm run smoke
```

---

## MEJORAS FUTURAS

---

|**Funcionalidad**|**Descripción**|**Prioridad**|
|---|---|---|
|**Notificaciones por Email**|Enviar confirmaciones de pedido y actualizaciones de estado.|Alta|
|**Sistema de Calificaciones**|Permitir que los clientes califiquen productos y dejen reseñas.|Media|
|**Programa de Lealtad**|Implementar puntos de recompensa por compras frecuentes.|Media|
|**Reportes Analíticos**|Dashboard con estadísticas de ventas y productos más vendidos.|Alta|
|**Cupones de Descuento**|Sistema de códigos promocionales y descuentos.|Alta|
|**Multi-idioma**|Soporte para inglés, español y otros idiomas.|Media|

---

## CONCLUSIÓN

El **Sistema de Pedidos en Línea - Restaurante Bambú** es una aplicación web moderna que permite a los clientes explorar el menú, realizar pedidos con pagos seguros y rastrear sus entregas. Los administradores tienen control total sobre el catálogo, usuarios y pedidos a través de un panel intuitivo.

**Características principales:**
- ✅ Autenticación segura con NextAuth y Google OAuth
- ✅ Gestión completa del menú con categorías y extras
- ✅ Carrito de compras con persistencia local
- ✅ Integración de pagos con Stripe
- ✅ Sistema de roles (cliente/administrador)
- ✅ Almacenamiento de imágenes en AWS S3
- ✅ Base de datos MongoDB escalable
- ✅ Diseño responsive con TailwindCSS

---
