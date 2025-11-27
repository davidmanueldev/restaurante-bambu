# Casos de Integración: Servicios Externos

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Introducción

Este documento contiene los **10 casos de prueba de integración** que verifican la correcta comunicación con servicios de terceros: **Stripe** (pagos) y **AWS S3** (almacenamiento de imágenes).

**Objetivo**: Asegurar que el sistema maneja correctamente las respuestas, errores y tiempos de espera de servicios externos.

**Categoría**: INT-3 y INT-4 (Prioridad Alta/Media)

---

## Integración con Stripe (INT-3)

### CI-EXT-01: POST /api/checkout Crea Sesión Válida

**Módulos Integrados**: `/api/checkout` ↔ Stripe API

**Objetivo**: Verificar que se genera una URL de pago válida al enviar productos.

**Precondiciones**:

- Claves de Stripe Test configuradas

**Datos de Entrada**:

```json
{
  "cartProducts": [
    { "_id": "...", "name": "Pizza", "price": 100 },
    { "_id": "...", "name": "Soda", "price": 20 }
  ],
  "address": "Calle Falsa 123"
}
```

**Pasos**:

1. Enviar POST `/api/checkout`
2. Verificar respuesta 200
3. Verificar que body contiene `url` (enlace a Stripe Checkout)

**Resultado Esperado**:

- URL retornada comienza con `https://checkout.stripe.com/`
- Sesión creada en Dashboard de Stripe (verificable en logs de test)

---

### CI-EXT-02: Webhook de Stripe Actualiza Pedido

**Módulos Integrados**: Stripe Webhook ↔ `/api/webhook`

**Objetivo**: Verificar que un evento real (o simulado fielmente) de Stripe desencadena la lógica de negocio.

**Pasos**:

1. Usar Stripe CLI para disparar evento: `stripe trigger payment_intent.succeeded`
2. O enviar payload firmado manualmente a `/api/webhook`
3. Verificar status 200 en respuesta al webhook

**Resultado Esperado**:

- El sistema acepta el webhook
- Se crea el pedido en la base de datos

---

### CI-EXT-03: Validación de Firma de Webhook

**Módulos Integrados**: Stripe SDK (`constructEvent`) ↔ `/api/webhook`

**Objetivo**: Verificar que el sistema rechaza webhooks sin firma válida de Stripe (seguridad).

**Pasos**:

1. Enviar POST `/api/webhook` con payload válido pero SIN header `stripe-signature`
2. Enviar POST `/api/webhook` con firma inválida

**Resultado Esperado**:

- Status 400
- Mensaje de error: "Webhook Error: No signature" o similar
- NO se procesa el pedido

---

### CI-EXT-04: Reintentos de Webhook

**Módulos Integrados**: Stripe Retry Logic ↔ `/api/webhook`

**Objetivo**: Verificar comportamiento ante fallos temporales.

**Escenario**: Base de datos caída temporalmente.

**Pasos**:

1. Simular fallo en BD (mockear error en `Order.create`)
2. Enviar webhook
3. Verificar que API retorna 500 (para que Stripe reintente)
4. Restaurar BD
5. Reenviar webhook (simulando reintento de Stripe)
6. Verificar que API retorna 200

**Resultado Esperado**:

- El sistema permite el mecanismo de reintento de Stripe al retornar códigos 5xx ante fallos internos.

---

### CI-EXT-05: Idempotencia de Webhooks

**Módulos Integrados**: `/api/webhook`

**Objetivo**: Verificar que procesar el mismo webhook dos veces no duplica pedidos.

**Pasos**:

1. Enviar webhook con `evt_123`
2. Verificar pedido creado
3. Enviar MISMO webhook `evt_123` nuevamente

**Resultado Esperado**:

- Segundo request retorna 200 (OK)
- NO se crea un segundo pedido duplicado en BD

---

## Integración con AWS S3 (INT-4)

### CI-EXT-06: POST /api/upload Sube Imagen Correctamente

**Módulos Integrados**: `/api/upload` ↔ AWS S3 Bucket

**Objetivo**: Verificar subida de archivos a la nube.

**Precondiciones**:

- Credenciales AWS Test configuradas
- Archivo de imagen de prueba (`test.jpg`)

**Pasos**:

1. Enviar POST `/api/upload` con `multipart/form-data`
2. Adjuntar archivo `file`
3. Verificar respuesta 200

**Resultado Esperado**:

- Body contiene `link`: URL pública del archivo
- URL es accesible (HTTP 200 al hacer GET)
- Archivo aparece en S3 Bucket

---

### CI-EXT-07: URL Retornada es Accesible

**Módulos Integrados**: S3 Public Access

**Objetivo**: Verificar que los permisos del bucket permiten lectura pública.

**Pasos**:

1. Obtener URL de CI-EXT-06
2. Hacer GET a esa URL desde cliente anónimo (sin credenciales AWS)

**Resultado Esperado**:

- Descarga de la imagen exitosa
- No error 403 Forbidden

---

### CI-EXT-08: Manejo de Errores S3 (Credenciales)

**Módulos Integrados**: AWS SDK ↔ `/api/upload`

**Objetivo**: Verificar manejo de error cuando falla autenticación con AWS.

**Pasos**:

1. Configurar variables de entorno con `AWS_SECRET_ACCESS_KEY` inválida
2. Intentar subir imagen

**Resultado Esperado**:

- Status 500
- Mensaje de error genérico al cliente (no exponer detalles de AWS)
- Log del servidor registra error de autenticación

---

### CI-EXT-09: Límite de Tamaño de Archivo

**Módulos Integrados**: `/api/upload` (Validación)

**Objetivo**: Verificar que no se envíen archivos gigantes a S3.

**Pasos**:

1. Intentar subir archivo de 10MB (si el límite es 5MB)

**Resultado Esperado**:

- Status 400 o 413 (Payload Too Large)
- Archivo NO llega a S3 (ahorro de ancho de banda/costos)

---

### CI-EXT-10: Formatos de Imagen Permitidos

**Módulos Integrados**: `/api/upload` (Validación)

**Objetivo**: Verificar que solo se suban imágenes.

**Pasos**:

1. Intentar subir archivo `.txt` o `.exe` renombrado a `.jpg` (validación de contenido) o simplemente por extensión.

**Resultado Esperado**:

- Status 400 "Invalid file type"
- Solo permitir JPG, PNG, WEBP

---

## Resumen de Cobertura

| Caso      | Servicio | Operación           | Prioridad |
| --------- | -------- | ------------------- | --------- |
| CI-EXT-01 | Stripe   | Checkout Session    | Alta      |
| CI-EXT-02 | Stripe   | Webhook Success     | Alta      |
| CI-EXT-03 | Stripe   | Webhook Signature   | Alta      |
| CI-EXT-04 | Stripe   | Webhook Retry       | Media     |
| CI-EXT-05 | Stripe   | Webhook Idempotency | Media     |
| CI-EXT-06 | AWS S3   | Upload File         | Alta      |
| CI-EXT-07 | AWS S3   | Public Access       | Alta      |
| CI-EXT-08 | AWS S3   | Auth Error          | Media     |
| CI-EXT-09 | AWS S3   | Size Limit          | Media     |
| CI-EXT-10 | AWS S3   | File Type           | Media     |

---

**Documento**: Casos de Integración Servicios Externos  
**Estado**: Listo para Implementación  
**Próximo**: Ver [casos_integracion_flujos_e2e.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_integracion/casos_integracion_flujos_e2e.md)
