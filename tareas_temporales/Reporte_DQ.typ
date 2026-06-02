#import "@preview/cetz:0.3.2"

// --- Configuración Global y Traducciones ---
#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  header: align(right, text(8pt, gray)[Pruebas y Validaciones de Datos]),
  footer: context [
    #set text(8pt, gray)
    #counter(page).display("1")
    #h(1fr)
    Restaurante Bambú - Ingeniería de Software
  ]
)

#set text(lang: "es", font: "serif", size: 11pt)
#set heading(numbering: "1.1")

// Traducción de términos de Typst
#show outline: set heading(numbering: none)
#show outline.entry: it => {
  if it.level == 1 {
    strong(it)
  } else {
    it
  }
}

// --- Portada ---
#align(center + horizon)[
  #text(12pt, weight: "bold", fill: rgb("#c0392b"))[UNIFRANZ - FACULTAD DE INGENIERÍA]
  #v(0.5cm)
  #text(28pt, weight: "bold", fill: rgb("#1a4a7a"))[Pruebas y Validaciones de Datos en Talend Data Quality]
  #v(0.5cm)
  #text(18pt, style: "italic", fill: gray)[Proyecto: Restaurante Bambú]
  #v(1cm)
  #text(14pt)[Basado en Roger Pressman (7ª Ed.) & Talend DQ Principles]
  #v(2cm)
  #image(width: 40%, "../public/pizza.png") 
  #v(2cm)
  #rect(fill: rgb("#f8f6f1"), stroke: rgb("#e0dcd5"), inset: 15pt, radius: 4pt)[
    #align(left)[
      *Estudiante:* David Manuel Mamani Huanca \
      *Materia:* Proyecto Integrador II \
      *Tarea:* Pruebas y Calidad de Datos
    ]
  ]
]

#pagebreak()

// --- Índice ---
#outline(title: "Índice de Contenido", indent: auto)
#pagebreak()

= Introducción a las Pruebas de Software

== Definición y Objetivos
Según la guía de Pressman, las pruebas de software son el proceso de ejecutar un programa con la intención de encontrar errores. Un caso de prueba exitoso es aquel que revela un error no descubierto hasta el momento.

En este proyecto, el objetivo principal es asegurar que los datos que ingresan al sistema del Restaurante Bambú sean íntegros, válidos y completos, aplicando los estándares de Talend Data Quality.

== Verificación vs Validación
- *Verificación:* "¿Estamos construyendo el producto correctamente?"
- *Validación:* "¿Estamos construyendo el producto correcto?"

= Fundamentos de Calidad de Datos (Data Quality)

== Dimensiones de Calidad según Talend
Para evitar errores de visualización, presentamos la distribución de importancia de las dimensiones de calidad mediante un gráfico de barras comparativo:

#figure(
  caption: [Distribución de Relevancia de Dimensiones DQ],
  cetz.canvas({
    import cetz.draw: *
    
    let data = (
      ("Completitud", 85),
      ("Validez", 90),
      ("Unicidad", 100),
      ("Integridad", 95),
    )
    
    for (i, (name, val)) in data.enumerate() {
      let y = i * 0.8
      // Fondo de la barra
      rect((0, y), (5, y + 0.5), fill: rgb("#eeeeee"), stroke: none)
      // Barra de progreso
      rect((0, y), (val / 20, y + 0.5), fill: rgb("#2980b9"), stroke: none)
      // Etiqueta
      content((-0.2, y + 0.25), text(9pt, name), anchor: "east")
      content((val / 20 + 0.2, y + 0.25), text(8pt, str(val) + "%"), anchor: "west")
    }
    
    line((0, -0.5), (0, 3.5), stroke: 0.5pt + gray)
  })
)

== Errores, Defectos y Fallos
1. *Error:* Equivocación humana.
2. *Defecto:* Error plasmado en el código u otros artefactos.
3. *Fallo:* Comportamiento incorrecto en ejecución.

= Los 7 Principios de las Pruebas
Aplicamos los principios de Pressman: Pruebas tempranas, agrupación de defectos y la paradoja del pesticida, entre otros, para maximizar la detección de fallos.

= Niveles de Prueba y Estrategia de Integración
Implementamos la pirámide de pruebas con un enfoque **Bottom-Up**:
- *Unitarias:* Validaciones de modelos de base de datos.
- *Integración:* Comunicación entre API Routes y MongoDB.
- *Sistema:* Flujos de usuario completos (Checkout).

= Técnicas de Diseño de Casos de Prueba (Caja Negra)

== Partición de Equivalencia (EP)
#table(
  columns: (1fr, 1.2fr, 2fr, 1.5fr),
  inset: 10pt,
  fill: (x, y) => if y == 0 { rgb("#1a4a7a") } else { if calc.even(y) { rgb("#f2f2f2") } else { white } },
  [*Módulo*], [*Clase de Entrada*], [*Datos de Prueba*], [*Resultado*],
  [Usuarios], [Email Válido], [cliente\@bambu.com], [Éxito],
  [Usuarios], [Email Inválido], [cliente_sin_arroba], [Error],
  [Menú], [Precio Positivo], [25.00], [Éxito],
  [Menú], [Precio Negativo], [-10.50], [Error],
)

== Análisis de Valores Límite (BVA)
#table(
  columns: (1fr, 1.2fr, 2fr, 1.5fr),
  inset: 10pt,
  fill: (x, y) => if y == 0 { rgb("#c0392b") } else { if calc.even(y) { rgb("#f2f2f2") } else { white } },
  [*Módulo*], [*Límite*], [*Dato*], [*Resultado*],
  [Menú], [Precio Mínimo], [0.01], [Aceptado],
  [Menú], [Cero], [0.00], [Rechazado],
  [Pedido], [Carrito Mínimo], [1 producto], [Aceptado],
  [Pedido], [Carrito Vacío], [0 productos], [Rechazado],
)

= Implementación Técnica y Código JavaScript

== Modelo de Usuario (`User.js`)
Validamos la unicidad y el formato del correo electrónico:

#rect(fill: rgb("#2d2d2d"), width: 100%, inset: 12pt, radius: 4pt)[
  #text(fill: white, font: "Courier New", size: 8pt)[
    ```javascript
    const UserSchema = new Schema({
      name: { type: String },
      email: { 
        type: String, 
        required: [true, 'El email es obligatorio'], 
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido'] // Regla de Validez
      },
      password: { type: String, required: true },
    }, { timestamps: true });
    ```
  ]
]

== Modelo de Pedido (`Order.js`)
Aseguramos que los pedidos contengan la información necesaria para el delivery:

#rect(fill: rgb("#2d2d2d"), width: 100%, inset: 12pt, radius: 4pt)[
  #text(fill: white, font: "Courier New", size: 8pt)[
    ```javascript
    const OrderSchema = new Schema({
      userEmail: { type: String, required: true },
      phone: { type: String, required: true },
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      cartProducts: { type: Object, required: true },
      paid: { type: Boolean, default: false },
    }, { timestamps: true });
    ```
  ]
]

== Modelo de Ítem del Menú (`MenuItem.js`)
Validamos precios e ingredientes extra:

#rect(fill: rgb("#2d2d2d"), width: 100%, inset: 12pt, radius: 4pt)[
  #text(fill: white, font: "Courier New", size: 8pt)[
    ```javascript
    const ExtraPriceSchema = new Schema({
      name: String,
      price: { type: Number, min: 0 } // Integridad: Precios no negativos
    });

    const MenuItemSchema = new Schema({
      name: { type: String, required: true },
      basePrice: { type: Number, required: true, min: 0.01 },
      sizes: [ExtraPriceSchema],
      extraIngredientPrices: [ExtraPriceSchema],
    });
    ```
  ]
]

== Script de Pruebas Automáticas (Jest)
Ejemplo de ejecución de pruebas de calidad de datos:

#rect(fill: rgb("#f0f4f8"), width: 100%, inset: 12pt, radius: 4pt)[
  #text(fill: rgb("#333"), font: "Courier New", size: 8pt)[
    ```javascript
    describe('Data Quality Tests', () => {
      test('Debe rechazar precios menores a 0.01', async () => {
        const item = new MenuItem({ name: 'Test', basePrice: 0 });
        const err = item.validateSync();
        expect(err.errors.basePrice).toBeDefined();
      });

      test('Debe requerir un número de teléfono en pedidos', () => {
        const order = new Order({ userEmail: 'a@a.com' });
        const err = order.validateSync();
        expect(err.errors.phone).toBeDefined();
      });
    });
    ```
  ]
]

= Conclusión
La aplicación de las dimensiones de Talend y las técnicas de Pressman garantiza un sistema con datos confiables, minimizando los fallos en producción y mejorando la experiencia del cliente en el Restaurante Bambú.
