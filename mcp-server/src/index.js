#!/usr/bin/env node

/**
 * MCP Server for Restaurante Bambú
 * 
 * This server exposes tools for:
 * - WhatsApp messaging (simulated - requires WhatsApp Business API setup)
 * - Restaurant operations (menu search, order status)
 * 
 * Transport: stdio (for local development with Claude Desktop, etc.)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create the MCP Server
const server = new McpServer({
  name: "restaurante-bambu",
  version: "1.0.0",
});

// ============================================
// TOOL: searchMenu
// Searches the restaurant menu
// ============================================
server.tool(
  "searchMenu",
  "Busca platos en el menú del Restaurante Bambú por nombre o categoría",
  {
    query: {
      type: "string",
      description: "Nombre del plato o ingrediente a buscar (ej: 'pollo', 'arroz')"
    },
    category: {
      type: "string",
      description: "Categoría del plato (ej: 'Entradas', 'Platos Principales', 'Bebidas')"
    }
  },
  async ({ query, category }) => {
    // In a real implementation, this would query MongoDB
    // For now, return simulated data
    const mockMenu = [
      { name: "Arroz Chaufa", category: "Platos Principales", price: 25 },
      { name: "Pollo Broaster", category: "Platos Principales", price: 20 },
      { name: "Gato a la Parrilla", category: "Platos Principales", price: 30 },
      { name: "Chicha Morada", category: "Bebidas", price: 8 },
      { name: "Tequeños", category: "Entradas", price: 12 },
    ];

    let results = mockMenu;
    
    if (query) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category) {
      results = results.filter(item => 
        item.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2)
        }
      ]
    };
  }
);

// ============================================
// TOOL: getOrderStatus
// Gets the status of an order
// ============================================
server.tool(
  "getOrderStatus",
  "Consulta el estado de un pedido del restaurante por su ID",
  {
    orderId: {
      type: "string",
      description: "ID del pedido a consultar"
    }
  },
  async ({ orderId }) => {
    // Simulated order status
    // In production, this would query MongoDB
    const mockOrder = {
      id: orderId,
      status: "En preparación",
      paid: true,
      items: 3,
      estimatedTime: "15 minutos"
    };

    return {
      content: [
        {
          type: "text",
          text: `Pedido ${orderId}:\n- Estado: ${mockOrder.status}\n- Pagado: ${mockOrder.paid ? 'Sí' : 'No'}\n- Items: ${mockOrder.items}\n- Tiempo estimado: ${mockOrder.estimatedTime}`
        }
      ]
    };
  }
);

// ============================================
// TOOL: getRestaurantInfo
// Returns general restaurant information
// ============================================
server.tool(
  "getRestaurantInfo",
  "Obtiene información general del Restaurante Bambú (horarios, ubicación, contacto)",
  {},
  async () => {
    const info = {
      name: "Restaurante Bambú",
      address: "Av. Busch #123, Santa Cruz, Bolivia",
      hours: "Lunes a Domingo: 11:00 AM - 10:00 PM",
      phone: "+591 62294912",
      payment: "Tarjetas de crédito/débito via Stripe",
      delivery: true
    };

    return {
      content: [
        {
          type: "text",
          text: `🎋 ${info.name}\n📍 ${info.address}\n🕐 ${info.hours}\n📞 ${info.phone}\n💳 ${info.payment}\n🚗 Delivery: ${info.delivery ? 'Disponible' : 'No disponible'}`
        }
      ]
    };
  }
);

// ============================================
// TOOL: sendWhatsAppMessage (Simulated)
// Sends a message via WhatsApp
// ============================================
server.tool(
  "sendWhatsAppMessage",
  "Envía un mensaje de WhatsApp a un cliente (requiere configuración de WhatsApp Business API)",
  {
    phoneNumber: {
      type: "string",
      description: "Número de teléfono del destinatario con código de país (ej: +59162294912)"
    },
    message: {
      type: "string",
      description: "Contenido del mensaje a enviar"
    }
  },
  async ({ phoneNumber, message }) => {
    // SIMULATED: In production, this would use the WhatsApp Business API
    // You would need to:
    // 1. Register for WhatsApp Business API (via Meta Business)
    // 2. Get approved phone number
    // 3. Use the Cloud API or On-Premises API
    
    console.log(`[WhatsApp] Sending to ${phoneNumber}: ${message}`);
    
    return {
      content: [
        {
          type: "text",
          text: `✅ [SIMULATED] Mensaje enviado a ${phoneNumber}:\n"${message}"\n\n⚠️ Nota: Para enviar mensajes reales, configure WhatsApp Business API.`
        }
      ]
    };
  }
);

// ============================================
// RESOURCE: menu
// Provides the full menu as a resource
// ============================================
server.resource(
  "menu://full",
  "Menú completo del Restaurante Bambú",
  "application/json",
  async () => {
    const fullMenu = {
      categories: [
        {
          name: "Platos Principales",
          items: [
            { name: "Arroz Chaufa", price: 25, description: "Arroz frito estilo chino" },
            { name: "Pollo Broaster", price: 20, description: "Pollo frito crujiente" },
          ]
        },
        {
          name: "Bebidas",
          items: [
            { name: "Chicha Morada", price: 8 },
            { name: "Limonada", price: 6 },
          ]
        }
      ]
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(fullMenu, null, 2)
        }
      ]
    };
  }
);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Restaurante Bambú MCP Server running on stdio");
}

main().catch(console.error);
