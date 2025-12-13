# Restaurante Bambú - MCP Server

Servidor MCP (Model Context Protocol) que expone herramientas del restaurante para uso con agentes IA como Claude Desktop.

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
cd mcp-server
npm install
```

### 2. Ejecutar el servidor

```bash
npm start
```

## 🔧 Herramientas Disponibles

| Tool                  | Descripción                                    |
| --------------------- | ---------------------------------------------- |
| `searchMenu`          | Busca platos en el menú por nombre o categoría |
| `getOrderStatus`      | Consulta el estado de un pedido por ID         |
| `getRestaurantInfo`   | Obtiene información general del restaurante    |
| `sendWhatsAppMessage` | Envía mensaje de WhatsApp (simulado)           |

## 📦 Recursos

- `menu://full` - Menú completo en formato JSON

## ⚙️ Configuración para Claude Desktop

Agrega esto a tu archivo de configuración de Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "restaurante-bambu": {
      "command": "node",
      "args": ["/ruta/al/proyecto/mcp-server/src/index.js"]
    }
  }
}
```

## 📱 Integración WhatsApp (Producción)

Para enviar mensajes reales de WhatsApp, necesitas:

1. **Registrar** en [Meta Business Suite](https://business.facebook.com/)
2. **Crear** una WhatsApp Business App
3. **Obtener** el Access Token y Phone Number ID
4. **Configurar** las variables de entorno:

```env
WHATSAPP_TOKEN=tu_token_aqui
WHATSAPP_PHONE_ID=tu_phone_id
```

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌──────────────────┐
│  Claude Desktop │◄───►│  MCP Server      │
│  u otro cliente │     │  (stdio)         │
└─────────────────┘     │                  │
                        │  Tools:          │
                        │  - searchMenu    │
                        │  - getOrderStatus│
                        │  - sendWhatsApp  │
                        └──────────────────┘
```
