# Casos de Prueba Unitarios - Modelos

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Introducción

Este documento contiene los casos de prueba unitarios diseñados para validar los **Modelos de Mongoose** del sistema. Se aplican técnicas de **Caja Blanca** para verificar la estructura interna de cada componente.

---

## Modelo: User

### CU-USER-01: Email es Campo Requerido

**Objetivo**: Verificar que el modelo rechaza la creación sin email.

**Código a Probar**:

```javascript
email: {type: String, required: true, unique: true}
```

**Datos de Entrada**:

```javascript
{
  name: "Test User",
  password: "hash123"
  // email omitido
}
```

**Resultado Esperado**: Error de validación "email is required"

---

### CU-USER-02: Email Debe Ser Único

**Objetivo**: Verificar índice único en email (requiere BD o mock).

**Nota**: Este caso se prueba mejor en tests de integración, pero se documenta aquí.

---

### CU-USER-03: Timestamps Automáticos

**Objetivo**: Verificar que `createdAt` y `updatedAt` se generan automáticamente.

**Datos de Entrada**:

```javascript
{
  name: "User",
  email: "test@test.com",
  password: "hash"
}
```

**Resultado Esperado**: Documento contiene `createdAt` y `updatedAt` con valores Date.

---

## Modelo: MenuItem

### CU-MENU-01: Estructura de Sizes es Array

**Objetivo**: Verificar que `sizes` acepta array de objetos con estructura correcta.

**Datos de Entrada**:

```javascript
{
  name: "Pizza",
  basePrice: 50,
  sizes: [
    {name: "Normal", price: 0},
    {name: "Grande", price: 20}
  ]
}
```

**Resultado Esperado**: Validación exitosa.

---

### CU-MENU-02: BasePrice es Número

**Objetivo**: Verificar rechazo de basePrice no numérico.

**Datos de Entrada**:

```javascript
{
  name: "Pizza",
  basePrice: "cincuenta" // String inválido
}
```

**Resultado Esperado**: Error de validación o casting.

---

### CU-MENU-03: Category es ObjectId

**Objetivo**: Verificar que category acepta ObjectId de Mongoose.

**Datos de Entrada**:

```javascript
{
  name: "Pizza",
  category: new mongoose.Types.ObjectId()
}
```

**Resultado Esperado**: Validación exitosa.

---

## Modelo: Order

### CU-ORDER-01: Paid es False por Defecto

**Objetivo**: Verificar valor por defecto del campo `paid`.

**Datos de Entrada**:

```javascript
{
  userEmail: "user@test.com",
  cartProducts: {}
  // paid omitido
}
```

**Resultado Esperado**: Documento creado con `paid: false`.

---

### CU-ORDER-02: CartProducts Acepta Object

**Objetivo**: Verificar que cartProducts acepta tipo Object.

**Datos de Entrada**:

```javascript
{
  userEmail: "test@test.com",
  cartProducts: {items: [{name: "Pizza", price: 50}]}
}
```

**Resultado Esperado**: Validación exitosa.

---

## Resumen

| Modelo    | Casos de Prueba | Aspectos Cubiertos            |
| --------- | --------------- | ----------------------------- |
| User      | 3               | Campos requeridos, timestamps |
| MenuItem  | 3               | Estructura de datos, tipos    |
| Order     | 2               | Valores por defecto, tipos    |
| **TOTAL** | **8**           | -                             |

---

**Documento**: Casos de Prueba Unitarios - Modelos  
**Estado**: Listo para Implementación
