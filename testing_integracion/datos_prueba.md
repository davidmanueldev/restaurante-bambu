# Datos de Prueba para Integración

## Restaurante Bambú

Este documento define los **datasets estándar** utilizados en las pruebas de integración para asegurar consistencia y reproducibilidad.

---

## 1. Usuarios de Prueba

### Admin User

```json
{
  "name": "Admin Test",
  "email": "admin@test.com",
  "password": "AdminPass123!",
  "admin": true
}
```

### Regular User

```json
{
  "name": "Cliente Test",
  "email": "cliente@test.com",
  "password": "ClientePass123!",
  "admin": false
}
```

### UserInfo (Perfil)

```json
{
  "email": "cliente@test.com",
  "streetAddress": "Av. Principal #100",
  "city": "Santa Cruz",
  "phone": "+591 70012345",
  "admin": false
}
```

---

## 2. Catálogo

### Categoría

```json
{
  "name": "Platos Principales"
}
```

### Producto (MenuItem)

```json
{
  "name": "Pique Macho",
  "description": "Plato tradicional cochabambino",
  "basePrice": 80,
  "category": "(ObjectId de Platos Principales)",
  "image": "https://bucket.s3.amazonaws.com/pique.jpg",
  "sizes": [
    { "name": "Normal", "price": 0 },
    { "name": "Familiar", "price": 40 }
  ],
  "extraIngredientPrices": [{ "name": "Huevo Extra", "price": 5 }]
}
```

---

## 3. Checkout y Pedidos

### Carrito (Payload Checkout)

```json
{
  "address": "Calle Test 123",
  "cartProducts": [
    {
      "_id": "(ObjectId Producto)",
      "name": "Pique Macho",
      "price": 80,
      "size": { "name": "Normal", "price": 0 },
      "extras": [{ "name": "Huevo Extra", "price": 5 }]
    }
  ]
}
```

### Webhook Stripe (Simulado)

```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_mock_123456",
      "amount": 8500,
      "metadata": {
        "orderId": "(ObjectId Orden)",
        "userEmail": "cliente@test.com"
      }
    }
  }
}
```

---

## 4. Configuración Mock

### AWS S3 Mock

- **Bucket**: `test-bucket`
- **Region**: `us-east-1`
- **Upload Response**:
  ```json
  {
    "Location": "https://test-bucket.s3.amazonaws.com/test-image.jpg",
    "Key": "test-image.jpg"
  }
  ```

### Stripe Mock

- **Payment Intent Response**:
  ```json
  {
    "id": "pi_mock_123456",
    "client_secret": "pi_mock_secret_123",
    "status": "requires_payment_method"
  }
  ```
