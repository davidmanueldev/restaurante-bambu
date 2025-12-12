import {MenuItem} from "@/models/MenuItem";
import {Category} from "@/models/Category";
import mongoose from "mongoose";

/**
 * Searches for menu items based on a text query and/or category.
 * @param {string} query - The search text (e.g., "pollo").
 * @param {string} category - The category to filter by (optional).
 * @returns {Promise<Array>} List of found menu items.
 */
export async function searchMenu(query, category) {
  try {
    const filter = {};
    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }
    
    // If category name is provided, we first need to find the category ID
    if (category) {
      const categoryDoc = await Category.findOne({ name: { $regex: category, $options: 'i' } });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    const items = await MenuItem.find(filter).lean();
    return items.map(item => ({
      name: item.name,
      description: item.description,
      price: item.basePrice,
      hasSizes: item.sizes.length > 0,
    }));
  } catch (error) {
    console.error("Error in searchMenu:", error);
    return [];
  }
}

/**
 * Returns general information about the restaurant.
 * @returns {Object} Restaurant info.
 */
export function getRestaurantInfo() {
  return {
    name: "Restaurante Bambú",
    description: "Sistema de pedidos en línea con la mejor comida asiática.",
    hours: "Lunes a Domingo: 11:00 AM - 10:00 PM",
    paymentMethods: "Tarjeta de crédito/débito via Stripe.",
    contact: "WhatsApp integrado en la web.",
    location: "Av. Busch #123, Santa Cruz"
  };
}
