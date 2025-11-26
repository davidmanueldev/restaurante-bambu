# Proyecto: Sistema de E-commerce - Restaurante Bambú

## Información del Proyecto

**Período de Desarrollo:** 30 de Octubre 2024 - 12 de Noviembre 2024  
**Duración:** 13 días  
**Total de Commits:** 20  
**Modalidad:** Desarrollo individual (1 desarrollador)  
**Tipo:** Proyecto universitario - Cliente real  
**Estado:** Completado (MVP)

---

## Matriz RACI

Define las responsabilidades de cada rol en el proyecto.

| Actividad | Product Owner | Dev Lead | Developers | QA |
|-----------|--------------|----------|------------|-----|
| Definir requisitos | R/A | C | I | C |
| Diseño técnico | I | R/A | R | C |
| Desarrollo de código | I | A | R | C |
| Pruebas de calidad | I | A | C | R |
| Despliegue | A | R | R | R |

Leyenda: R = Ejecuta | A = Aprueba | C = Consultado | I = Informado

---

## Puntos de Función

Métrica que mide la funcionalidad entregada independiente de la tecnología.

Fórmula: PF = (Entradas × 4) + (Salidas × 5) + (Consultas × 4) + (Archivos × 10) + (Interfaces × 7)

### Aplicación al Proyecto

| Funcionalidad | Cantidad | Factor | Puntos |
|---------------|----------|--------|--------|
| Formularios de entrada | 6 | × 4 | 24 |
| Reportes de salida | 5 | × 5 | 25 |
| Consultas | 5 | × 4 | 20 |
| Archivos lógicos | 5 | × 10 | 50 |
| Interfaces externas | 4 | × 7 | 28 |
| **Total** | | | **147 PF** |

Productividad: 147 PF / 13 días = 11.3 PF por día

---

## Estimación PERT

Técnica que calcula estimaciones considerando escenarios optimistas, probables y pesimistas.

Fórmula: TE = (Optimista + 4×Probable + Pesimista) / 6

### Aplicación al Proyecto

| Módulo | Optimista | Probable | Pesimista | PERT (TE) |
|--------|-----------|----------|-----------|-----------|
| Autenticación (NextAuth) | 1 día | 2 días | 4 días | 2.2 días |
| CRUD Productos/Categorías | 2 días | 3 días | 5 días | 3.2 días |
| Sistema de Carrito | 1.5 días | 2.5 días | 4 días | 2.6 días |
| Integración Stripe | 2 días | 4 días | 6 días | 4 días |
| Sistema de Pedidos | 1.5 días | 3 días | 5 días | 3 días |
| Panel Admin | 1 día | 2 días | 3 días | 2 días |
| Upload AWS S3 | 0.5 días | 1 día | 2 días | 1.1 días |
| Testing | 1 día | 2 días | 4 días | 2.2 días |
| **TOTAL** | **10.5 días** | **19.5 días** | **33 días** | **20.3 días** |

Resultado real: 13 días (menor al estimado de 20.3 días)

---

## Work Breakdown Structure (WBS)

### 1.0 Gestión del Proyecto

| Subtarea | Descripción | Horas Estimadas | Responsable |
|----------|-------------|-----------------|-------------|
| 1.1 Planificación | Definir alcance con cliente (menú online, pedidos), stack tecnológico (Next.js, MongoDB, Stripe), cronograma de desarrollo y configuración de repositorio Git. | 8 | Product Owner |
| 1.2 Control y Seguimiento | Commits frecuentes para seguimiento, pruebas continuas en desarrollo, reuniones de validación con cliente y ajustes basados en feedback. | 8 | Dev Lead |
| 1.3 Gestión de Riesgos | Identificar riesgos técnicos (integración Stripe, tiempo limitado), evaluar probabilidad/impacto y definir mitigaciones (MVP, servicios managed). | 4 | Equipo Completo |

---

### 2.0 Frontend (Interfaz de Usuario)

| Subtarea | Descripción | Horas Estimadas | Responsable |
|----------|-------------|-----------------|-------------|
| 2.1 Catálogo de Productos | Desarrollar pantalla de menú con visualización de platillos (imagen, nombre, descripción, precio en Bs), filtrado por categorías, búsqueda en tiempo real y diseño responsive con Tailwind CSS. | 40 | Developers |
| 2.2 Carrito de Compras | Implementar carrito funcional con Context API, agregar/actualizar/eliminar productos, cálculo automático de subtotal con envío fijo (Bs 5) y persistencia en localStorage. | 32 | Developers |
| 2.3 Proceso de Checkout | Crear flujo de checkout con formulario de envío (dirección, teléfono, ciudad), integración Stripe para pagos, validación de campos y webhook para confirmación de pago. | 48 | Developers |
| 2.4 Perfil de Usuario | Pantalla personal con edición de información, carga de imagen de perfil (AWS S3), dirección predeterminada e historial de pedidos realizados. | 24 | Developers |
| 2.5 Autenticación | Sistema de registro con email/contraseña, login con credenciales y Google OAuth, encriptación bcrypt y protección de rutas con NextAuth.js. | 16 | Developers |
| 2.6 Hero y Página Principal | Landing page con hero atractivo, sección "Nuestra Historia", botón directo a WhatsApp (+591 63107986) y preview de platillos destacados. | 12 | Developers |

---

### 3.0 Backend (APIs y Lógica de Negocio)

| Subtarea | Descripción | Horas Estimadas | Responsable |
|----------|-------------|-----------------|-------------|
| 3.1 API de Productos | API RESTful para CRUD de platillos del menú con endpoints (GET, POST, PUT, DELETE), gestión de precios y extras, asignación de categorías y validación de permisos admin. | 56 | Dev Lead |
| 3.2 Sistema de Pagos | Integración con Stripe Checkout para procesamiento de pagos, webhook para confirmación de transacciones, validación de firmas y endpoint de desarrollo para testing. | 80 | Dev Lead |
| 3.3 Gestión de Pedidos | Base de datos para pedidos (Order model), API para creación automática post-checkout, listado admin, vista detallada y estado de pago (PAGADO/NO PAGADO). | 64 | Developers |
| 3.4 Gestión de Usuarios | API para registro, autenticación, listado de usuarios (solo admin), edición de información, asignación de rol admin y sistema de permisos. | 48 | Developers |
| 3.5 API de Categorías | CRUD completo para categorías de platillos, eliminación segura con confirmación y notificaciones toast para feedback del usuario. | 24 | Developers |
| 3.6 Sistema de Archivos | Upload de imágenes a AWS S3 para perfiles de usuario y fotos de productos, generación de URLs públicas y validación de tipos de archivo. | 16 | Developers |

---

### 4.0 Testing y QA

| Subtarea | Descripción | Horas Estimadas | Responsable |
|----------|-------------|-----------------|-------------|
| 4.1 Pruebas Unitarias | Testear componentes React, modelos de datos y utilidades. Implementar smoke tests automatizados con cobertura mínima del 80%. | 40 | QA/Developers |
| 4.2 Pruebas de Integración | Probar APIs, integración con MongoDB Atlas, flujos completos (registro, compra) y automatización con scripts (smoke-tests.mjs). | 48 | QA/Developers |
| 4.3 Pruebas de Seguridad | Validar autenticación NextAuth, pruebas de autorización, sanitización de inputs y prevención de inyecciones. | 32 | QA/Developers |

---

## Resumen de Implementación

### Funcionalidades Completadas

Cliente:
- Catálogo con búsqueda y filtros
- Carrito de compras
- Checkout con Stripe
- Autenticación (credenciales + Google)
- Diseño responsive
- Contacto WhatsApp

Admin:
- CRUD platillos y categorías
- Gestión de usuarios
- Visualización de pedidos
- Upload a AWS S3

Backend:
- 9 APIs RESTful
- 5 Modelos Mongoose
- Integración MongoDB Atlas
- Webhook Stripe
- NextAuth + bcrypt

Estadísticas:
- 13 días de desarrollo
- 20 commits
- ~3,500 líneas de código
- 25+ componentes React

---

## Gestión de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Desarrollo individual sobrecargado | Alta | Alto | Priorización MVP, frameworks consolidados (Next.js), componentes reutilizables, buffer 20%. |
| Problemas servicios externos (Stripe, AWS, MongoDB) | Media | Alto | Webhooks con logs, endpoint dev para testing, manejo robusto de errores, credenciales en .env. |
| Cambios de requisitos del cliente | Media | Medio | Desarrollo iterativo, demos frecuentes, commits regulares para rollback, arquitectura modular. |
| Falta de experiencia Next.js 14 App Router | Media | Medio | Consulta documentación oficial, uso de patrones establecidos, pruebas continuas. |
| Seguridad de datos sensibles | Media | Alto | Encriptación bcrypt, NextAuth para sesiones, variables de entorno, validación admin en APIs. |
| Tiempo limitado (13 días) | Alta | Alto | Enfoque MVP funcional, eliminación features no esenciales, servicios managed (MongoDB Atlas, AWS S3). |
| Integración de pagos compleja | Alta | Alto | Stripe modo test, webhook con validación de firma, endpoint desarrollo para testing sin pagos reales. |
| Testing automatizado incompleto | Alta | Medio | Smoke tests básicos, pruebas manuales exhaustivas, scripts de carga de datos mock. |
4. **Gestión de imágenes:** AWS S3 resuelve almacenamiento sin sobrecargar el servidor

---

## Cronología del Desarrollo

Desarrollo en sprint único de 13 días (30 Oct - 12 Nov 2024)

Semana 1:
- Setup inicial y configuración
- Modelos de datos y autenticación
- CRUD productos y categorías
- Panel admin básico

Semana 2:
- Carrito de compras y Context API
- Integración Stripe y checkout
- Sistema de pedidos y webhook
- Perfil de usuario y gestión admin
- Testing y refinamiento

---

## Stack Tecnológico

Frontend: Next.js 14, React 18, Tailwind CSS, Context API
Backend: Next.js API Routes, Mongoose, NextAuth.js, bcrypt
Servicios: Stripe, AWS S3, Google OAuth, MongoDB Atlas
Tools: Git, pnpm, ESLint

---

## Arquitectura

Estructura de directorios estándar de Next.js 14 con App Router.
9 APIs RESTful, 5 modelos Mongoose, 25+ componentes React.

Flujo:
Cliente → Next.js → Context API → API Routes → Mongoose → MongoDB
Pagos: Cliente → Stripe → Webhook → API → MongoDB

---

Desarrollado por: David Manuel  
Cliente: Restaurante Bambú  
Período: 30 Oct - 12 Nov 2024  
Proyecto Universitario - Ingeniería de Software
1