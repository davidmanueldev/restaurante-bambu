# Blueprint Técnico y de Negocio: The Grill - Bambú

Este documento es el plano arquitectónico y funcional del proyecto **The Grill - Bambú**. Detalla cómo funciona cada módulo, las reglas de negocio ocultas en el código, las estructuras de datos que maneja y los patrones de interfaz para ser replicados o integrados en un sistema de producción definitivo.

---

## 1. Sistema de Enrutamiento y Autenticación (Core Layout)
El proyecto usa el App Router de Next.js. El diseño base incluye una barra de navegación (`Navbar.tsx`) que reacciona al estado de autenticación gestionado por **Clerk**.

*   **Lógica de Renderizado en Navbar:**
    *   **Usuario NO autenticado:** Solo ve "Inicio" y el botón de "Iniciar Sesión".
    *   **Usuario Autenticado:** Aparece la pestaña "Pedir ahora", y los iconos dinámicos de "Carrito", "Puntos" y "Perfil".
*   **Comportamiento Visual:** La Navbar es `sticky top-0`, tiene una altura de `h-20` (80px), fondo blanco y un borde inferior sutil (`border-bambu-100`). Los botones activos resaltan con fondo verde claro (`bg-bambu-50 text-bambu-700`).

---

## 2. La Landing Page (`/page.tsx`)
Página de conversión sin lógica de estado compleja. Se compone de 5 secciones exactas:

1.  **Hero Section:** Imagen a pantalla completa (`min-h-screen`) de una parrilla. Tiene un overlay con gradiente oscuro (`bg-gradient-to-b from-black/80 via-black/60 to-bambu-950/90`). Título principal gigante, botones de CTA redondeados (uno verde, uno efecto cristal) e indicador de scroll animado.
2.  **Tarjetas de Beneficios:** Tres tarjetas (`rounded-[2rem]`) flotantes (`hover:-translate-y-2`). La tarjeta central está destacada con sombra y borde verde.
3.  **Mapa de Ubicación:** Iframe de Google Maps con bordes redondeados (`rounded-3xl`) y sombra profunda.
4.  **Galería "Conoce el Lugar":** 3 imágenes cuadradas (`aspect-[4/3]`) con zoom interno suave (`group-hover:scale-110`) y un logo marca de agua en la esquina superior derecha que aparece al hacer hover.
5.  **Fortalezas & Footer:** Lista de checks verdes. Footer oscuro (`bg-bambu-950`) con links sociales.

---

## 3. EL NÚCLEO: Motor de Pedidos (`/pedidos/page.tsx`)
Funciona como un formulario de múltiples pasos ("Wizard") dinámico en una sola vista.

### A. Estructura de Datos (Estado del Componente)
```typescript
// Estado principal
totalPlates: number | null; // Cantidad de platos a armar
activePlate: number; // Índice del plato actual (0, 1, 2...)

type PlateConfig = {
  numCarnes: number;          // 1 | 2 | 3 piezas
  selectedOptionId: string | null; // ID de la carne o combo
  arrozId: string | null;     // ID de la guarnición
};

plates: PlateConfig[]; // Array de platos
drinkQty: Record<string, number>; // Ej: {"cocacola_500ml": 2}
```

### B. Flujo de Interfaz (El "Wizard")
1.  **Paso 0 (Selector Inicial):** Contador gigante. Hasta que no se define `totalPlates`, no se muestra el menú.
2.  **El Constructor (Izquierda):**
    *   **Tabs de Platos:** Botones "Plato 1", "Plato 2". Si el plato tiene `selectedOptionId`, se marca en verde con un Check.
    *   **Selección de Carnes:** Los botones ocultan el precio para limpiar la UI. Muestran foto y título. Al hacer clic, borde verde y check. Dependiendo de si se elige 1, 2 o 3 carnes, cambia el catálogo mostrado.
    *   **Bebidas:** Contadores `-` y `+` por tamaño.
3.  **El Ticket Resumen (Derecha - Sticky):**
    *   Recorre el array `plates`. Platos incompletos dicen "Pendiente de configurar" en gris. Platos completos detallan subtotal.
    *   **REGLA DE NEGOCIO CRÍTICA:** El botón "Ir a Pagar" está `disabled` si existe al menos un plato en `plates` donde `selectedOptionId === null`.
    *   Al hacer clic, transforma todo el estado en un JSON, lo guarda en `localStorage` (bajo la key `bambu_cart`) y redirige a `/carrito`.

---

## 4. Carrito y Checkout (`/carrito/page.tsx`)

### A. Lógica y Reglas de Negocio
*   Lee `bambu_cart` desde `localStorage` al montar el componente.
*   **REGLA CRÍTICA (Protección del Restaurante):** 
    Existe el flag `isLargeOrder = cartItems.length >= 3`.
    Si es `true`, obliga a pagar un **adelanto del 30%** para reservar la orden. Calcula dinámicamente `advanceAmount` y `remainingAmount`.

### B. Selector de Horas
*   Genera turnos de 5 minutos desde las 12:10 hasta 16:00.
*   **Bloqueo de UI:** Si una hora está en el array `bookedSlots`, el botón se deshabilita y se pone gris.

### C. Métodos de Pago
*   **Pedido Pequeño (< 3):** "Pago QR 100%" o "Efectivo al recoger".
*   **Pedido Grande (>= 3):** Obliga a "Pago QR 100%" o "Adelanto QR 30%". Se muestra caja de advertencia amarilla.
*   Si se elige pago QR, se despliega una interfaz para escanear código QR manual.

### D. Finalización (Envío)
*   No hay backend en el MVP. Construye un String codificado con el detalle de la orden, hora y método de pago (detallando adelantos si los hay) y abre la API de WhatsApp para enviar el mensaje al administrador.

---

## 5. Sistema de Fidelización (`/recompensas/page.tsx`)
*   **Interfaz:** Tarjeta premium superior mostrando saldo (ej. 450 pts).
*   **Regla de Canje:** En la grilla de premios, el botón de canje tiene validación estricta `disabled={puntosActuales < premio.points}`.
*   **Historial:** Timeline de sumas y restas de puntos.

---

## 6. Perfil de Usuario (`/perfil/page.tsx`)
*   Extrae datos de la sesión (`useUser()` de Clerk): Avatar, Nombre, Correo, Teléfono.
*   **Historial de Pedidos:** Muestra tarjetas limpias con Número de Orden, Estado, Fecha y un botón "Volver a Pedir" (proyectado para recargar un pedido pasado al carrito activo).

---

## 7. 🚀 GUÍA DE MIGRACIÓN A PRODUCCIÓN (Action Items)

Para que este blueprint funcione en un entorno de producción real, **DEBES** reemplazar los siguientes elementos mockeados:

1.  **Estado Global / Base de Datos:**
    *   **Frontend:** Eliminar `localStorage` para el carrito. Usar Zustand, React Context, o insertar el pedido en estado `DRAFT` en la base de datos directamente desde `/pedidos`.
2.  **Catálogos Dinámicos:**
    *   Los arrays de `carnes`, `combos`, `arroces` y `bebidas` deben venir de un endpoint (ej. `GET /api/menu`).
3.  **Control de Horarios y Capacidad (Booking):**
    *   La constante `bookedSlots` en `/carrito` debe venir de una consulta al backend (ej. `GET /api/slots?date=today`). El backend debe contar pedidos por bloque horario y bloquear si sobrepasa la capacidad de parrilla.
4.  **Flujo de Confirmación Transaccional:**
    *   Cambiar el botón de WhatsApp por un `POST /api/orders` que envíe la orden final.
    *   Implementar un Dashboard Administrativo (Panel de Recepción) que escuche vía WebSockets o Polling cuando llegue este POST para empezar a cocinar.
5.  **Autenticación y Persistencia:**
    *   Sincronizar el UID de Clerk con tu base de datos (mediante Webhooks) para relacionar cada Orden Creada y Puntos Acumulados con un usuario real.
