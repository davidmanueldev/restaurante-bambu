export class CartValidationError extends Error {}

const invalid = (message) => { throw new CartValidationError(message); };
const idOf = (item) => String(item?._id ?? '');
const cents = (value) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) invalid('Precio de menú inválido');
  return Math.round(value * 100);
};
const snapshot = (item) => ({
  _id: idOf(item), name: item.name, image: item.image, basePrice: item.basePrice,
  category: item.category == null ? undefined : String(item.category),
});

// Only identifiers and selections come from the browser, never prices.
export function priceCart(cart, menu, categories) {
  if (!Array.isArray(cart) || cart.length === 0 || cart.length > 100) invalid('El carrito debe contener entre 1 y 100 productos');
  const items = new Map(menu.map(item => [idOf(item), item]));
  const categoryTypes = new Map(categories.map(cat => [idOf(cat), cat.type || 'main']));
  const find = (selection) => {
    const item = items.get(idOf(selection));
    if (!item) invalid('Un producto ya no está disponible');
    return item;
  };
  const lines = cart.map(product => {
    if (!product || typeof product !== 'object') invalid('Producto inválido');
    if (product.isPlate) {
      const config = product.plateConfig;
      if (!config || ![1, 2, 3].includes(config.numCarnes) ||
          !Array.isArray(config.carnes) || config.carnes.length !== config.numCarnes ||
          new Set(config.carnes.map(idOf)).size !== config.carnes.length) invalid('Configuración de plato inválida');
      const meats = config.carnes.map(find);
      const side = find(config.guarnicion);
      if (meats.some(item => categoryTypes.get(String(item.category)) !== 'main') ||
          categoryTypes.get(String(side.category)) !== 'side') invalid('Selecciona carnes y guarnición válidas');
      const amount = [...meats, side].reduce((sum, item) => sum + cents(item.basePrice), 0);
      const name = 'Plato ' + config.numCarnes + ' Carne(s)';
      return {name, amount, product: {
        _id: typeof product._id === 'string' ? product._id.slice(0, 100) : 'plate',
        name, image: '/carne.png', basePrice: amount / 100, isPlate: true,
        description: 'Carnes: ' + meats.map(item => item.name).join(', ') + ' | Guarnición: ' + side.name,
        plateConfig: {numCarnes: config.numCarnes, carnes: meats.map(snapshot), guarnicion: snapshot(side)},
      }};
    }
    const item = find(product);
    let amount = cents(item.basePrice);
    let size = null;
    if (product.size) {
      size = item.sizes?.find(option => idOf(option) === idOf(product.size));
      if (!size) invalid('Tamaño no disponible');
      amount += cents(size.price);
    }
    const requestedExtras = product.extras ?? [];
    if (!Array.isArray(requestedExtras) || requestedExtras.length > 50 ||
        new Set(requestedExtras.map(idOf)).size !== requestedExtras.length) invalid('Extras inválidos');
    const extras = requestedExtras.map(selection => {
      const option = item.extraIngredientPrices?.find(extra => idOf(extra) === idOf(selection));
      if (!option) invalid('Extra no disponible');
      amount += cents(option.price);
      return {_id: idOf(option), name: option.name, price: option.price};
    });
    return {
      product: {...snapshot(item), size: size ? {_id: idOf(size), name: size.name, price: size.price} : null, extras},
      name: item.name, amount,
    };
  });
  if (lines.some(line => line.amount <= 0)) invalid('El importe debe ser mayor que cero');
  return {lines, products: lines.map(line => line.product), total: lines.reduce((sum, line) => sum + line.amount, 0)};
}
