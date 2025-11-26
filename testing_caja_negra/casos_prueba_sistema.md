# Casos de Prueba del Sistema - Caja Negra

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Introducción

Este documento contiene los **33 casos de prueba de caja negra** para las **Pruebas del Sistema** (Pressman, p. 401-403), diseñados para ejercitar completamente el sistema y verificar los **requisitos no funcionales**.

Según Pressman (p. 401):

> "Las pruebas del sistema son una serie de diferentes pruebas cuyo propósito principal es ejercitar por completo el sistema basado en computadora. Verifican que todos los elementos del sistema se hayan integrado de manera adecuada."

**Estructura**:

- **5 Tipos de Pruebas del Sistema** (Pressman 17.7)
- **33 Casos de Prueba Totales**
- **Cobertura**: Requisitos No Funcionales (RNF, RSEG, RFIA)

---

## 1. Pruebas de Recuperación

### Objetivo (Pressman, p. 401)

> "Las pruebas de recuperación fuerzan al software a fallar de diversas formas y verifican que la recuperación se realice apropiadamente."

**Alineación con el Proyecto**: Requisitos RFIA-01 a RFIA-04 (Fiabilidad)

---

### CP-REC-01: Caída de MongoDB Durante Checkout

**NFR Relacionado**: RFIA-04 (Disponibilidad BD)  
**Prioridad**: Alta

**Precondiciones**:

- Usuario en proceso de checkout
- MongoDB en ejecución

**Pasos de Ejecución**:

1. Usuario completa formulario de checkout
2. Hacer clic en "Pagar"
3. **INTERRUPCIÓN**: Detener servidor MongoDB antes de que responda:
   ```bash
   sudo systemctl stop mongod
   ```
4. Observar comportamiento de la aplicación

**Resultado Esperado**:

- Aplicación NO se cae completamente
- Usuario ve mensaje: "Error de conexión, intenta nuevamente"
- Toast error visible
- NO se crea sesión de Stripe incompleta
- Logs del servidor registran error de conexión

**Criterio de Recuperación**:

- Reiniciar MongoDB:
  ```bash
  sudo systemctl start mongod
  ```
- Usuario puede reintentar checkout y completarlo exitosamente

**Criterio de Éxito**: ✅ Sistema maneja fallo gracefully, datos no corruptos

---

### CP-REC-02: Interrupción de Red Durante Pago

**NFR Relacionado**: RFIA-03 (Validación pagos), RFIA-02 (Transacciones atómicas)  
**Prioridad**: Alta

**Escenario**:

- Usuario redirigido a Stripe
- Completa pago
- **FALLO**: Webhook no puede comunicarse con servidor por caída de red

**Pasos**:

1. Stripe procesa pago exitosamente
2. Intentar enviar webhook a servidor caído
3. Stripe reintenta envío (reintentos automáticos)

**Resultado Esperado**:

- Stripe marca webhook como "Failed" tras varios reintentos
- Cuando servidor se recupera, reintentar webhook manualmente desde Stripe Dashboard
- Pedido se crea correctamente al recibir webhook retrasado

**Verificación de Integridad**:

- NO hay pedidos duplicados
- Campo `paid: true` solo si webhook confirmó
- NO pedidos "fantasma" sin pago

**Criterio de Éxito**: ✅ Integridad transaccional mantenida

---

### CP-REC-03: Sesión Expirada Durante Navegación

**NFR Relacionado**: RFIA-01 (Manejo de errores)  
**Prioridad**: Media

**Pasos**:

1. Usuario autenticado navega la aplicación
2. Dejar aplicación abierta por tiempo prolongado (>24 horas)
3. Sesión NextAuth expira
4. Usuario intenta realizar acción protegida (ej. ir a `/profile`)

**Resultado Esperado**:

- Usuario redirigido a `/login`
- Mensaje: "Tu sesión ha expirado, inicia sesión nuevamente"
- Datos del carrito (localStorage) NO se pierden

**Criterio de Éxito**: ✅ Manejo elegante de expiración de sesión

---

### CP-REC-04: Fallo al Subir Imagen a S3

**NFR Relacionado**: RFIA-01 (Manejo de errores)  
**Prioridad**: Media

**Escenario**: Credenciales AWS incorrectas o bucket inaccesible

**Pasos**:

1. Admin intenta subir imagen de producto
2. AWS S3 retorna error 403 (Forbidden) o timeout

**Resultado Esperado**:

- Toast error: "Error al subir imagen. Verifica tu conexión."
- Producto NO se guarda con URL rota
- Formulario permanece editable
- Admin puede reintentar con otra imagen

**Criterio de Éxito**: ✅ Rollback de operación fallida

---

### CP-REC-05: Timeout en Confirmación de Webhook

**NFR Relacionado**: RFIA-03 (Validación pagos)  
**Prioridad**: Alta

**Escenario**: Webhook de Stripe tarda más de 30 segundos

**Pasos**:

1. Pago completado en Stripe
2. Webhook se demora en procesarse (simular con delay en código)
3. Usuario espera en pantalla de confirmación

**Resultado Esperado**:

- Usuario ve mensaje: "Procesando pago, esto puede tardar unos segundos..."
- Timeout de 60 segundos antes de mostrar error
- Si webhook llega después: pedido se crea correctamente
- Usuario puede consultar `/orders` para verificar

**Criterio de Éxito**: ✅ Sistema tolerante a latencia de webhooks

---

## 2. Pruebas de Seguridad

### Objetivo (Pressman, p. 402)

> "Las pruebas de seguridad verifican que los mecanismos de protección incorporados al sistema lo protejan de intrusiones indebidas."

**Alineación con el Proyecto**: Requisitos RSEG-01 a RSEG-06 (Seguridad)

---

### CP-SEC-01: Acceso No Autorizado a Rutas Admin

**NFR Relacionado**: RSEG-03 (Autorización por rol)  
**Prioridad**: Alta

**Pasos**:

1. Usuario regular (NO admin) autenticado
2. Intentar acceder directamente a:
   - `/menu-items`
   - `/categories`
   - `/users`
   - `GET /api/users`

**Resultado Esperado**:

- Redirigido a `/` o página de "Acceso Denegado"
- API retorna 403 Forbidden
- Logs registran intento de acceso no autorizado

**Criterio de Éxito**: ✅ Rutas protegidas por middleware de autorización

---

### CP-SEC-02: Inyección NoSQL en Login

**NFR Relacionado**: RSEG-04 (Validación de datos)  
**Prioridad**: Alta

**Datos de Entrada Maliciosos**:

```json
{
  "email": { "$ne": null },
  "password": { "$ne": null }
}
```

**Pasos**:

1. Interceptar petición de login con herramienta (ej. Burp Suite)
2. Modificar payload JSON para inyectar operadores MongoDB
3. Enviar petición

**Resultado Esperado**:

- Login RECHAZADO
- API valida tipos de datos: solo acepta strings
- Error: "Datos inválidos"
- NO se bypasea autenticación

**Criterio de Éxito**: ✅ Protección contra NoSQL injection

---

### CP-SEC-03: XSS en Campos de Texto

**NFR Relacionado**: RSEG-04 (Validación de inputs)  
**Prioridad**: Alta

**Datos de Entrada**:

- Nombre de producto:
  ```html
  <script>
    alert("XSS");
  </script>
  ```

**Pasos**:

1. Admin crea producto con nombre malicioso
2. Guardar producto
3. Visitar `/menu` como cliente

**Resultado Esperado**:

- Script NO se ejecuta
- Texto renderizado como string literal: `&lt;script&gt;alert('XSS')&lt;/script&gt;`
- React escapa HTML automáticamente

**Criterio de Éxito**: ✅ Protección contra XSS incorporada en React

---

### CP-SEC-04: Validación de Firma Webhook Stripe

**NFR Relacionado**: RSEG-06 (Webhooks verificados)  
**Prioridad**: Alta

**Escenario**: Atacante intenta enviar webhook falso

**Pasos**:

1. Enviar POST a `/api/webhook` con payload simulado:
   ```json
   {
     "type": "payment_intent.succeeded",
     "data": {...}
   }
   ```
2. **SIN** header `stripe-signature` válido

**Resultado Esperado**:

- Webhook rechazado
- Error 400: "Firma inválida"
- NO se crea pedido
- Logs: "Intento de webhook no autenticado"

**Criterio de Éxito**: ✅ Solo webhooks firmados por Stripe aceptados

---

### CP-SEC-05: Exposición de API Keys

**NFR Relacionado**: RSEG-05 (Protección API keys)  
**Prioridad**: Alta

**Pasos**:

1. Inspeccionar código fuente del cliente (navegador)
2. Revisar archivos `.env` en repositorio Git
3. Verificar respuestas API por leaks

**Resultado Esperado**:

- `STRIPE_SK`, `MY_AWS_SECRET_KEY` NO visibles en cliente
- `.env` en `.gitignore`
- Solo `STRIPE_PK` (clave pública) expuesta en frontend
- Variables sensibles solo en servidor

**Criterio de Éxito**: ✅ Claves secretas protegidas

---

### CP-SEC-06: Contraseñas en Texto Plano

**NFR Relacionado**: RSEG-01 (Protección contraseñas)  
**Prioridad**: Alta

**Pasos**:

1. Registrar usuario con password "TestPassword123"
2. Consultar MongoDB:
   ```javascript
   db.users.findOne({ email: "test@example.com" }, { password: 1 });
   ```

**Resultado Esperado**:

- Campo `password` es hash bcrypt (60 caracteres)
- Inicia con `$2b$10$` (indica bcrypt con10 rounds)
- Imposible revertir a texto plano

**Criterio de Éxito**: ✅ Hashing bcrypt implementado correctamente

---

### CP-SEC-07: Tokens de Sesión Seguros

**NFR Relacionado**: RSEG-02 (Autenticación segura)  
**Prioridad**: Alta

**Pasos**:

1. Usuario inicia sesión
2. Inspeccionar cookies en DevTools

**Verificaciones**:

- Cookie `next-auth.session-token` tiene flag `HttpOnly` (no accesible vía JavaScript)
- Flag `Secure` en producción (solo HTTPS)
- Flag `SameSite=Lax` para prevenir CSRF

**Criterio de Éxito**: ✅ Cookies configuradas securely

---

### CP-SEC-08: CSRF en Formularios

**NFR Relacionado**: RSEG-02 (Seguridad)  
**Prioridad**: Media

**Escenario**: Atacante intenta realizar acción desde origen externo

**Pasos**:

1. Crear página HTML maliciosa con formulario que envía POST a `/api/profile`
2. Usuario autenticado visita página maliciosa
3. Formulario se auto-envía

**Resultado Esperado**:

- NextAuth valida origen de request
- Peticiones cross-origin bloqueadas
- CORS configurado apropiadamente

**Criterio de Éxito**: ✅ Protección CSRF activa

---

### CP-SEC-09: Rate Limiting en Login

**NFR Relacionado**: RSEG-02 (Seguridad)  
**Prioridad**: Media

**Pasos**:

1. Intentar login 100 veces con password incorrecta
2. Desde misma IP

**Resultado Esperado** (si implementado):

- Tras 10 intentos fallidos: IP bloqueada temporalmente (5 minutos)
- Error 429: "Demasiados intentos, intenta más tarde"

**Criterio de Éxito**: ✅ Protección contra fuerza bruta

---

### CP-SEC-10: Validación OWASP Top 10

**NFR Relacionado**: Requisito general de seguridad  
**Prioridad**: Alta

**Herramienta**: OWASP ZAP (Zed Attack Proxy)

**Pasos**:

1. Instalar OWASP ZAP
2. Configurar proxy a `http://localhost:3000`
3. Ejecutar escaneo automático:
   - Active Scan para vulnerabilidades comunes
4. Revisar reporte generado

**Categorías OWASP a Verificar**:

- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection
- A07: Authentication Failures

**Resultado Esperado**:

- 0 vulnerabilidades de severidad Alta
- ≤ 3 vulnerabilidades de severidad Media (justificables)

**Criterio de Éxito**: ✅ Aplicación pasa escaneo OWASP

---

## 3. Pruebas de Esfuerzo (Stress Testing)

### Objetivo (Pressman, p. 402)

> "Las pruebas de esfuerzo ejecutan el sistema de forma que demande recursos en cantidad, frecuencia o volumen anormales. Permiten entender los límites operacionales."

---

### CP-STR-01: Carga de 500 Usuarios Concurrentes

**Prioridad**: Alta

**Herramienta**: Apache JMeter o k6

**Escenario de Carga**:

- 500 usuarios virtuales simultáneos
- Navegando `/menu`
- Duración: 5 minutos
- Ramp-up: 60 segundos

**Script k6**:

```javascript
import http from "k6/http";
import { sleep } from "k6";

export let options = {
  vus: 500,
  duration: "5m",
};

export default function () {
  http.get("http://localhost:3000/menu");
  sleep(1);
}
```

**Métricas a Medir**:

- Tasa de error < 1%
- Tiempo de respuesta promedio < 2 segundos
- Servidor NO se cae

**Resultado Esperado**:

- Sistema mantiene funcionalidad hasta 400 usuarios
- Degradación graceful entre 400-500 usuarios
- Sin errores fatales

**Criterio de Éxito**: ✅ Sistema soporta carga pico definida

---

### CP-STR-02: Alta Tasa de Transacciones (TPS)

**Prioridad**: Alta

**Escenario**:

- 50+ transacciones de checkout por segundo
- Simular Black Friday

**Configuración k6**:

```javascript
export let options = {
  scenarios: {
    contacts: {
      executor: "constant-arrival-rate",
      rate: 50, // 50 TPS
      timeUnit: "1s",
      duration: "2m",
      preAllocatedVUs: 100,
    },
  },
};
```

**Resultado Esperado**:

- MongoDB maneja escrituras concurrentes
- NO hay deadlocks
- Pedidos creados correctamente sin duplicados
- Puede haber cola (latencia aumenta), pero NO errores

**Criterio de Éxito**: ✅ Integridad de datos bajo alta concurrencia

---

### CP-STR-03: Carga Masiva de Imágenes

**Prioridad**: Media

**Escenario**:

- Admin sube 100 imágenes de productos simultáneamente
- Tamaño: 2-5MB cada una

**Pasos**:

1. Script automatizado sube 100 archivos a `/api/upload` en paralelo

**Resultado Esperado**:

- AWS S3 procesa todas las subidas
- Algunas pueden fallar por throttling (esperado)
- Errores manejados gracefully
- NO colapso del servidor Node.js

**Criterio de Éxito**: ✅ Sistema maneja uploads masivos

---

### CP-STR-04: Múltiples Webhooks Simultáneos

**Prioridad**: Media

**Escenario**:

- 20 webhooks de Stripe llegan al mismo tiempo
- Cada uno intentando crear un pedido

**Pasos**:

1. Usar Stripe CLI para enviar múltiples eventos:
   ```bash
   for i in {1..20}; do stripe trigger payment_intent.succeeded & done
   ```

**Resultado Esperado**:

- Todos los webhooks procesados
- MongoDB maneja escrituras concurrentes
- NO hay race conditions
- 20 pedidos distintos creados

**Criterio de Éxito**: ✅ Procesamiento concurrente de webhooks robusto

---

### CP-STR-05: Comportamiento al Exceder Capacidad

**Prioridad**: Media

**Escenario**: Forzar sistema hasta que falle

**Pasos**:

1. Incrementar usuarios virtuales gradualmente: 500, 750, 1000, 1500...
2. Observar en qué punto el sistema colapsa

**Resultado Esperado**:

- Identificar límite máximo (ej. 800 usuarios)
- Tipo de fallo:
  - Timeouts en MongoDB
  - Node.js se queda sin memoria
  - CPU al 100%
- Sistema se recupera al reducir carga

**Criterio de Éxito**: ✅ Límites operacionales documentados

---

## 4. Pruebas de Rendimiento

### Objetivo (Pressman, p. 403)

> "Las pruebas de rendimiento están diseñadas para probar el rendimiento del software en tiempo de ejecución dentro del contexto del sistema integrado."

**Alineación**: RNF-05 a RNF-07 (Rendimiento)

---

### CP-PERF-01: Tiempo de Respuesta APIs < 500ms

**NFR Relacionado**: RNF-05 (Tiempo de carga)  
**Prioridad**: Alta

**Endpoints a Probar**:

- `GET /api/menu-items`
- `GET /api/categories`
- `GET /api/profile`
- `POST /api/checkout`

**Herramienta**: Postman Collection Runner o k6

**Pasos**:

1. Ejecutar 100 peticiones a cada endpoint
2. Medir tiempo de respuesta

**Resultado Esperado**:

- **Percentil 95**: < 500ms
- **Promedio**: < 300ms
- **Máximo**: < 1000ms

**Criterio de Éxito**: ✅ 95% de requests bajo 500ms

---

### CP-PERF-02: Tasa de Error < 1%

**NFR Relacionado**: RNF-05 (Confiabilidad)  
**Prioridad**: Alta

**Escenario**: Carga normal (100 usuarios)

**Métricas**:

- Total requests: 10,000
- HTTP 5xx errors: < 100 (1%)
- HTTP 4xx: no considerados (errores del cliente)

**Criterio de Éxito**: ✅ Tasa de error del servidor < 1%

---

### CP-PERF-03: Tiempo de Carga de Páginas < 2 Segundos

**NFR Relacionado**: RNF-05 (Tiempo de carga)  
**Prioridad**: Alta

**Herramienta**: Google Lighthouse

**Páginas a Probar**:

- `/` (Home)
- `/menu`
- `/login`

**Métricas Lighthouse**:

- **Performance Score**: > 90
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

**Criterio de Éxito**: ✅ Todas las páginas cargan < 2s

---

### CP-PERF-04: Optimización de Imágenes (WebP)

**NFR Relacionado**: RNF-06 (Optimización imágenes)  
**Prioridad**: Media

**Pasos**:

1. Subir imagen PNG grande (5MB)
2. Next.js Image component la procesa
3. Inspeccionar en DevTools qué formato se sirve

**Resultado Esperado**:

- Navegadores modernos reciben WebP
- Tamaño reducido: ~80% menor que original
- Lazy loading activo (imágenes fuera de viewport no cargan)

**Criterio de Éxito**: ✅ Next.js optimiza imágenes automáticamente

---

### CP-PERF-05: Server Side Rendering (SSR)

**NFR Relacionado**: RNF-07 (SSR para SEO)  
**Prioridad**: Media

**Pasos**:

1. Navegar a `/menu` con JavaScript DESHABILITADO
2. Ver código fuente HTML (`Ctrl+U`)

**Resultado Esperado**:

- HTML contiene productos renderizados (no skeleton vacío)
- Datos visibles sin necesidad de JS
- Meta tags presentes para SEO

**Criterio de Éxito**: ✅ Contenido crítico renderizado server-side

---

### CP-PERF-06: Time to First Byte (TTFB)

**Prioridad**: Media

**Herramienta**: Chrome DevTools → Network

**Pasos**:

1. Limpiar caché
2. Recargar `/menu`
3. Inspeccionar TTFB en Network tab

**Resultado Esperado**:

- TTFB < 200ms (servidor local)
- TTFB < 600ms (servidor en cloud)

**Criterio de Éxito**: ✅ Respuesta rápida del servidor

---

### CP-PERF-07: Lighthouse Performance Score

**Prioridad**: Alta

**Pasos**:

1. Abrir Chrome DevTools
2. Ir a tab "Lighthouse"
3. Run audit en modo "Desktop" y "Mobile"

**Resultado Esperado**:

- Desktop Score: > 95
- Mobile Score: > 90
- No errores críticos

**Criterio de Éxito**: ✅ Performance Score excelente

---

### CP-PERF-08: Core Web Vitals

**NFR Relacionado**: RNF-05 (Experiencia de usuario)  
**Prioridad**: Alta

**Métricas Google**:

| Métrica                            | Umbral "Bueno" | Valor del Proyecto |
| ---------------------------------- | -------------- | ------------------ |
| **LCP** (Largest Contentful Paint) | < 2.5s         | **\_\_\_**         |
| **FID** (First Input Delay)        | < 100ms        | **\_\_\_**         |
| **CLS** (Cumulative Layout Shift)  | < 0.1          | **\_\_\_**         |

**Herramienta**: Google PageSpeed Insights o Chrome UX Report

**Criterio de Éxito**: ✅ Todas las métricas en rango "Bueno"

---

## 5. Pruebas de Despliegue

### Objetivo (Pressman, p. 403)

> "Las pruebas de despliegue ejercitan el software en cada entorno en el que debe operar."

**Alineación**: RNF-02 (Diseño responsive, compatibilidad)

---

### CP-DEP-01: Compatibilidad Chrome (Últimas 2 Versiones)

**Prioridad**: Alta

**Versiones a Probar**:

- Chrome 119 (current)
- Chrome 118

**Pasos**:

1. Abrir aplicación en cada versión
2. Ejecutar flujo completo: login → menu → cart → checkout

**Resultado Esperado**:

- UI renderiza correctamente
- Funcionalidad completa
- Sin errores en consola

**Criterio de Éxito**: ✅ 100% funcional en ambas versiones

---

### CP-DEP-02: Compatibilidad Firefox (Últimas 2 Versiones)

**Prioridad**: Alta

**Versiones**:

- Firefox 120
- Firefox 119

**Resultado Esperado**:

- Mismo comportamiento que Chrome
- Estilos CSS consistentes

**Criterio de Éxito**: ✅ Compatible sin ajustes

---

### CP-DEP-03: Compatibilidad Safari Desktop y Mobile

**Prioridad**: Media

**Dispositivos**:

- Safari 17 (macOS Sonoma)
- Safari iOS 14+ (iPhone)

**Aspectos Específicos a Verificar**:

- Flexbox y Grid CSS
- localStorage funcional
- Cookies httpOnly soportadas

**Criterio de Éxito**: ✅ Funcionalidad completa en Safari

---

### CP-DEP-04: Chrome Mobile (Android 10+)

**Prioridad**: Alta

**Dispositivos de Prueba**:

- Pixel 5 (Android 13)
- Samsung Galaxy S21 (Android 12)

**Pasos**:

1. Abrir en navegador móvil
2. Probar flujo de pedido completo
3. Verificar teclado no oculte inputs

**Resultado Esperado**:

- Touch interactions funcionales
- Viewport responsive
- Formularios usables

**Criterio de Éxito**: ✅ Experiencia móvil optimizada

---

### CP-DEP-05: Responsive Design (320px - 2560px)

**Prioridad**: Alta

**Breakpoints Tailwind a Probar**:

| Dispositivo | Resolución | Breakpoint |
| ----------- | ---------- | ---------- |
| iPhone SE   | 320px      | `default`  |
| iPhone 12   | 390px      | `default`  |
| iPad        | 768px      | `md:`      |
| iPad Pro    | 1024px     | `lg:`      |
| Desktop HD  | 1920px     | `xl:`      |
| Desktop 4K  | 2560px     | `2xl:`     |

**Pasos**:

1. Chrome DevTools → Toggle Device Toolbar
2. Probar cada resolución
3. Verificar:
   - Texto legible (sin overflow)
   - Botones accesibles
   - Imágenes escaladas apropiadamente
   - No scroll horizontal

**Criterio de Éxito**: ✅ Layout responsive en todo el rango

---

## Resumen de Pruebas del Sistema

| Tipo de Prueba   | Casos Diseñados | NFR Relacionados  |
| ---------------- | --------------- | ----------------- |
| **Recuperación** | 5               | RFIA-01 a RFIA-04 |
| **Seguridad**    | 10              | RSEG-01 a RSEG-06 |
| **Esfuerzo**     | 5               | -                 |
| **Rendimiento**  | 8               | RNF-05 a RNF-07   |
| **Despliegue**   | 5               | RNF-02            |
| **TOTAL**        | **33 casos**    | -                 |

---

## Herramientas Recomendadas

| Categoría       | Herramienta              | Propósito                      |
| --------------- | ------------------------ | ------------------------------ |
| Load Testing    | k6, JMeter               | Esfuerzo y Rendimiento         |
| Security        | OWASP ZAP                | Escaneo vulnerabilidades       |
| Performance     | Lighthouse               | Core Web Vitals                |
| API Testing     | Postman, k6              | Tiempo de respuesta            |
| Browser Testing | BrowserStack, LambdaTest | Compatibilidad multi-navegador |

---

**Documento**: Casos de Prueba del Sistema  
**Estado**: Completo para Ejecución  
**Próximo Paso**: Ver [tecnicas_caja_negra.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/tecnicas_caja_negra.md)
