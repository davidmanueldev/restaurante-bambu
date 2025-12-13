<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/MongoDB-6.2-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe" alt="Stripe">
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google" alt="Gemini AI">
</p>

# 🎋 Restaurante Bambú

> Sistema de pedidos en línea con chatbot IA potenciado por Gemini y servidor MCP para integraciones.

---

## ✨ Características Principales

| Módulo                     | Descripción                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------- |
| 🍽️ **Menú Digital**        | Catálogo de productos con búsqueda, filtros por categoría e imágenes optimizadas   |
| 🛒 **Carrito Inteligente** | Sistema de carrito con tamaños, extras y cálculo automático de precios             |
| 💳 **Pagos Seguros**       | Integración con Stripe Checkout para pagos con tarjeta                             |
| 🤖 **Chatbot IA**          | Asistente virtual con Gemini 2.5 Flash, memoria de conversación y function calling |
| 👤 **Autenticación**       | Login con credenciales o Google OAuth via NextAuth.js                              |
| 📦 **Panel Admin**         | Gestión completa de productos, categorías, usuarios y pedidos                      |
| 🔌 **MCP Server**          | Servidor MCP para integración con Claude Desktop y WhatsApp                        |

---

## 🛠️ Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│              Next.js 14 + React 18 + TailwindCSS                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                         BACKEND                                  │
│                    Next.js API Routes                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ NextAuth │  │ Mongoose │  │  Stripe  │  │ Gemini Function  │ │
│  │  (Auth)  │  │  (ODM)   │  │ (Pagos)  │  │    Calling       │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                      SERVICIOS EXTERNOS                          │
│  MongoDB Atlas • AWS S3 • Google OAuth • Stripe • Gemini API    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js v18+
- MongoDB (local o Atlas)
- Cuentas en: Stripe, AWS S3, Google Cloud, Google AI Studio

### 1. Clonar e Instalar

```bash
git clone <repo-url>
cd restaurante-bambu
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Base de Datos
MONGO_URL="mongodb+srv://..."

# Autenticación
NEXTAUTH_URL="http://localhost:3000"
SECRET="tu-secreto-nextauth"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Pagos
STRIPE_SK="sk_test_..."
STRIPE_PK="pk_test_..."

# Storage
MY_AWS_ACCESS_KEY="..."
MY_AWS_SECRET_KEY="..."

# Chatbot IA
GOOGLE_API_KEY="AIza..."
```

### 3. Ejecutar

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 🤖 Chatbot IA con Gemini

El chatbot incluye:

- **Memoria de Conversación**: Mantiene contexto de mensajes anteriores
- **Function Calling**: Puede buscar en el menú y consultar estados de pedidos
- **UI Moderna**: Widget flotante expandible con diseño premium

### Herramientas Disponibles del Chatbot

| Tool                | Descripción                         |
| ------------------- | ----------------------------------- |
| `searchMenu`        | Busca platos por nombre o categoría |
| `getOrderStatus`    | Consulta estado de un pedido        |
| `getRestaurantInfo` | Información general del restaurante |

---

## 🔌 MCP Server

Servidor compatible con Model Context Protocol para integración con clientes IA externos.

### Iniciar MCP Server

```bash
cd mcp-server
npm install
npm start
```

### Configurar en Claude Desktop

Agregar a `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "restaurante-bambu": {
      "command": "node",
      "args": ["/ruta/completa/mcp-server/src/index.js"]
    }
  }
}
```

### Herramientas MCP

| Tool                  | Descripción                        |
| --------------------- | ---------------------------------- |
| `searchMenu`          | Buscar en el menú                  |
| `getOrderStatus`      | Estado de pedidos                  |
| `getRestaurantInfo`   | Info del restaurante               |
| `sendWhatsAppMessage` | Enviar mensaje WhatsApp (simulado) |

---

## 📁 Estructura del Proyecto

```
restaurante-bambu/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # NextAuth
│   │   │   ├── chat/           # Chatbot Gemini
│   │   │   ├── menu-items/     # CRUD Productos
│   │   │   ├── orders/         # Pedidos
│   │   │   └── checkout/       # Stripe
│   │   ├── menu/               # Página del menú
│   │   ├── cart/               # Carrito
│   │   └── profile/            # Perfil usuario
│   ├── components/             # Componentes React
│   │   ├── chat/               # ChatWidget
│   │   └── layout/             # Header, Footer
│   ├── models/                 # Mongoose Schemas
│   └── libs/                   # Utilidades
├── mcp-server/                 # MCP Server independiente
│   ├── src/index.js            # Servidor principal
│   └── README.md               # Documentación MCP
├── tests/                      # Tests unitarios e integración
└── public/                     # Assets estáticos
```

---

## 🧪 Testing

```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Smoke tests
npm run smoke
```

---

## 📊 Usuarios de Prueba

| Rol     | Email                      | Password    |
| ------- | -------------------------- | ----------- |
| Admin   | admin@restaurantebambu.com | Admin123!   |
| Cliente | cliente@example.com        | Cliente123! |

---

## 📝 API Endpoints

### Autenticación

- `POST /api/register` - Registro
- `POST /api/auth/[...nextauth]` - NextAuth

### Productos

- `GET /api/menu-items` - Listar productos
- `POST /api/menu-items` - Crear (admin)
- `PUT /api/menu-items` - Actualizar (admin)
- `DELETE /api/menu-items` - Eliminar (admin)

### Pedidos

- `POST /api/checkout` - Crear sesión de pago
- `GET /api/orders` - Listar pedidos
- `POST /api/webhook` - Webhook de Stripe

### Chatbot

- `POST /api/chat` - Enviar mensaje al chatbot

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Sesiones seguras con cookies httpOnly
- ✅ Validación de webhooks Stripe
- ✅ Variables de entorno para API keys
- ✅ Middleware de autorización por roles

---

## 📄 Licencia

Este proyecto es parte de un trabajo universitario de Ingeniería de Software.

---

<p align="center">
  <strong>🎋 Restaurante Bambú</strong><br>
  <em>Desarrollado con ❤️ usando Next.js + Gemini AI + MCP</em>
</p>
