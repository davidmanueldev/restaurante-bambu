# Plantilla de Ejecución de Pruebas

## Restaurante Bambú - Sistema de Pedidos en Línea

---

## Propósito

Esta plantilla sirve como **formulario estandarizado** para el registro sistemático de resultados de pruebas de caja negra. Asegura que:

- Todas las ejecuciones se documenten de manera consistente
- Los resultados sean trazables y reproducibles
- Los defectos se capturen con suficiente detalle
- Se generen métricas de calidad confiables

---

## Sección 1: Información de la Sesión de Pruebas

### 1.1 Datos Generales

| Campo                  | Valor                |
| ---------------------- | -------------------- |
| **ID de Sesión**       | TEST-YYYYMMDD-NNN    |
| **Fecha de Ejecución** | DD/MM/YYYY           |
| **Hora de Inicio**     | HH:MM                |
| **Hora de Fin**        | HH:MM                |
| **Duración Total**     | HH:MM                |
| **Ejecutor(es)**       | Nombre(s) del tester |
| **Revisado por**       | Nombre del QA Lead   |

---

### 1.2 Entorno de Prueba

| Campo                    | Valor                                              |
| ------------------------ | -------------------------------------------------- |
| **Entorno**              | ☐ Desarrollo<br>☐ Staging<br>☐ Producción          |
| **URL Base**             | http://localhost:3000                              |
| **Versión del Software** | v1.0.0 (git commit: abc123...)                     |
| **Base de Datos**        | MongoDB Atlas - Cluster TEST                       |
| **Datos de Prueba**      | ☐ Dataset de prueba<br>☐ Datos reales anonimizados |

---

### 1.3 Configuración Técnica

| Componente                 | Versión/Detalles            |
| -------------------------- | --------------------------- |
| **Node.js**                | v22.19.0                    |
| **Next.js**                | 14.0.0                      |
| **MongoDB**                | 6.2.0                       |
| **Navegador Principal**    | Chrome 119                  |
| **Sistema Operativo**      | Ubuntu 22.04 / macOS Sonoma |
| **Dispositivo (si móvil)** | iPhone 12 Pro / Pixel 5     |

---

### 1.4 Alcance de la Sesión

**Tipo de Pruebas Ejecutadas**:

- ☐ Pruebas de Validación (CP-AUTH, CP-PROD, CP-CART, CP-ORDER, CP-USER)
- ☐ Pruebas del Sistema - Recuperación (CP-REC)
- ☐ Pruebas del Sistema - Seguridad (CP-SEC)
- ☐ Pruebas del Sistema - Esfuerzo (CP-STR)
- ☐ Pruebas del Sistema - Rendimiento (CP-PERF)
- ☐ Pruebas del Sistema - Despliegue (CP-DEP)

**Módulos Probados**:

- ☐ Autenticación
- ☐ Gestión de Productos
- ☐ Carrito y Checkout
- ☐ Gestión de Pedidos
- ☐ Perfil y Usuarios

---

## Sección 2: Registro de Casos de Prueba

### 2.1 Plantilla por Caso

Para cada caso de prueba ejecutado, completar la siguiente información:

---

#### CP-[ID]: [Nombre del Caso]

| Campo                   | Detalle                                                   |
| ----------------------- | --------------------------------------------------------- |
| **Estado**              | ☐ ✅ PASÓ<br>☐ ❌ FALLÓ<br>☐ ⏸️ BLOQUEADO<br>☐ ⏭️ OMITIDO |
| **Prioridad**           | Alta / Media / Baja                                       |
| **Tiempo de Ejecución** | \_\_\_ minutos                                            |
| **Ejecutado por**       | Nombre del tester                                         |

---

**Datos de Entrada Utilizados**:

```
[Copiar datos específicos usados en esta ejecución]
Ejemplo: Email: test@example.com, Contraseña: Test123!
```

---

**Pasos Ejecutados**:

1. [Paso 1 realizado]
2. [Paso 2 realizado]
3. ...

---

**Resultado Obtenido**:

```
[Describir qué sucedió realmente]
Ejemplo: Usuario fue redirigido a /login tras registro exitoso
```

---

**Resultado Esperado** (de la especificación):

```
[Copiar del documento de casos de prueba]
```

---

**¿Coincide Esperado vs Obtenido?**  
☐ SÍ → Caso PASÓ ✅  
☐ NO → Caso FALLÓ ❌ (completar sección de defectos)

---

**Evidencia**:

- ☐ Captura de pantalla adjunta: `screenshot_CP-XXX-YY.png`
- ☐ Video de ejecución: `video_CP-XXX.mp4`
- ☐ Logs del servidor: `logs_CP-XXX.txt`
- ☐ Respuesta API (JSON): `response_CP-XXX.json`

**Ubicación de Evidencias**: `/testing_caja_negra/evidencias/sesion-YYYYMMDD/`

---

**Observaciones / Notas**:

```
[Cualquier comportamiento inesperado, advertencias, sugerencias]
```

---

**Defectos Encontrados** (si aplica):  
ID de Defecto: `DEF-XXX` (ver Sección 3)

---

### 2.2 Ejemplo Completado: CP-AUTH-01

#### CP-AUTH-01: Registro Exitoso con Datos Válidos

| Campo                   | Detalle     |
| ----------------------- | ----------- |
| **Estado**              | ✅ PASÓ     |
| **Prioridad**           | Alta        |
| **Tiempo de Ejecución** | 2 minutos   |
| **Ejecutado por**       | Juan Tester |

**Datos de Entrada Utilizados**:

```
Email: juan.test@example.com
Contraseña: TestPass123!
Nombre: Juan Pérez
```

**Pasos Ejecutados**:

1. Navegué a http://localhost:3000/register
2. Completé campo Email con "juan.test@example.com"
3. Completé campo Contraseña con "TestPass123!"
4. Completé campo Nombre con "Juan Pérez"
5. Hice clic en botón "Registrar"

**Resultado Obtenido**:

```
- Usuario redirigido a /login
- Toast visible: "Usuario registrado exitosamente"
- Consulté MongoDB:
  db.users.findOne({email: "juan.test@example.com"})
  → Documento creado con password hasheada (bcrypt)
```

**Resultado Esperado**:

```
- Usuario redirigido a /login ✅
- Toast: "Usuario registrado exitosamente" ✅
- MongoDB: usuario creado con password hasheada ✅
```

**¿Coincide?** ✅ SÍ → Caso PASÓ

**Evidencia**:

- ✅ Captura: `screenshot_CP-AUTH-01_success.png`
- ✅ Logs MongoDB: Documento insertado correctamente

**Observaciones**:

```
Ninguna. Caso ejecutado sin problemas.
```

**Defectos**: Ninguno

---

## Sección 3: Registro de Defectos

Para cada defecto encontrado durante la ejecución:

---

### Defecto: DEF-[NNN]

| Campo                | Valor                                                             |
| -------------------- | ----------------------------------------------------------------- |
| **ID**               | DEF-001                                                           |
| **Título**           | [Resumen breve del defecto]                                       |
| **Severidad**        | ☐ Crítica<br>☐ Alta<br>☐ Media<br>☐ Baja                          |
| **Prioridad**        | ☐ Urgente<br>☐ Alta<br>☐ Media<br>☐ Baja                          |
| **Estado**           | ☐ Nuevo<br>☐ Asignado<br>☐ En Progreso<br>☐ Resuelto<br>☐ Cerrado |
| **Caso de Prueba**   | CP-[ID]                                                           |
| **Módulo Afectado**  | Autenticación / Productos / Carrito / etc.                        |
| **Encontrado por**   | Nombre del tester                                                 |
| **Fecha de Reporte** | DD/MM/YYYY                                                        |
| **Asignado a**       | Nombre del desarrollador                                          |

---

**Descripción**:

```
[Descripción detallada del defecto]
Ejemplo: El sistema permite registrar usuarios con emails duplicados,
violando la restricción de unicidad.
```

---

**Pasos para Reproducir**:

1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

---

**Resultado Actual (Incorrecto)**:

```
[Qué sucede actualmente]
```

---

**Resultado Esperado (Correcto)**:

```
[Qué debería suceder]
```

---

**Evidencia**:

- Captura: `defect_DEF-001_screenshot.png`
- Video: `defect_DEF-001_reproduction.mp4`
- Logs: `defect_DEF-001_logs.txt`

---

**Impacto en el Negocio**:

```
[Cómo afecta este defecto a los usuarios o al sistema]
Ejemplo: Usuarios con mismos emails causan conflictos de autenticación
```

---

**Workaround Temporal** (si existe):

```
[Solución temporal mientras se corrige]
```

---

**Notas Adicionales**:

```
[Información extra que pueda ayudar al desarrollador]
```

---

### Clasificación de Severidad

| Severidad   | Definición                                                        | Ejemplo                              |
| ----------- | ----------------------------------------------------------------- | ------------------------------------ |
| **Crítica** | Sistema inoperante, pérdida de datos, vulnerabilidad de seguridad | Pago procesado pero pedido no creado |
| **Alta**    | Funcionalidad principal no opera, workaround difícil              | Login no funciona                    |
| **Media**   | Funcionalidad secundaria afectada, workaround disponible          | Foto de perfil no se actualiza       |
| **Baja**    | Cosmético, no afecta funcionalidad                                | Texto desalineado                    |

---

## Sección 4: Resumen Estadístico

### 4.1 Métricas de Ejecución

| Métrica                         | Valor   |
| ------------------------------- | ------- |
| **Total de Casos Planificados** | \_\_\_  |
| **Casos Ejecutados**            | \_\_\_  |
| **Casos Pendientes**            | \_\_\_  |
| **% de Ejecución**              | \_\_\_% |

---

### 4.2 Resultados por Estado

| Estado            | Cantidad | Porcentaje |
| ----------------- | -------- | ---------- |
| ✅ **PASADOS**    | \_\_\_   | \_\_\_%    |
| ❌ **FALLADOS**   | \_\_\_   | \_\_\_%    |
| ⏸️ **BLOQUEADOS** | \_\_\_   | \_\_\_%    |
| ⏭️ **OMITIDOS**   | \_\_\_   | \_\_\_%    |
| **TOTAL**         | \_\_\_   | 100%       |

---

### 4.3 Tasa de Éxito

**Fórmula**: `(Casos Pasados / Casos Ejecutados) × 100`

**Tasa de Éxito**: \_\_\_\_%

**Criterio de Aceptación**: ≥ 95%

- ☐ ✅ Cumple criterio
- ☐ ❌ No cumple (requiere correcciones)

---

### 4.4 Defectos por Severidad

| Severidad | Cantidad | Bloqueantes |
| --------- | -------- | ----------- |
| Crítica   | \_\_\_   | \_\_\_      |
| Alta      | \_\_\_   | \_\_\_      |
| Media     | \_\_\_   | \_\_\_      |
| Baja      | \_\_\_   | \_\_\_      |
| **TOTAL** | \_\_\_   | \_\_\_      |

---

### 4.5 Cobertura por Módulo

| Módulo           | Casos Totales | Ejecutados | Pasados | Tasa Éxito |
| ---------------- | ------------- | ---------- | ------- | ---------- |
| Autenticación    | 8             | \_\_\_     | \_\_\_  | \_\_\_%    |
| Productos        | 12            | \_\_\_     | \_\_\_  | \_\_\_%    |
| Carrito/Checkout | 15            | \_\_\_     | \_\_\_  | \_\_\_%    |
| Pedidos          | 10            | \_\_\_     | \_\_\_  | \_\_\_%    |
| Perfil/Usuarios  | 8             | \_\_\_     | \_\_\_  | \_\_\_%    |
| Sistema (REC)    | 5             | \_\_\_     | \_\_\_  | \_\_\_%    |
| Sistema (SEC)    | 10            | \_\_\_     | \_\_\_  | \_\_\_%    |
| Sistema (STR)    | 5             | \_\_\_     | \_\_\_  | \_\_\_%    |
| Sistema (PERF)   | 8             | \_\_\_     | \_\_\_  | \_\_\_%    |
| Sistema (DEP)    | 5             | \_\_\_     | \_\_\_  | \_\_\_%    |

---

### 4.6 Tiempo de Ejecución

| Categoría                 | Tiempo         |
| ------------------------- | -------------- |
| Preparación del entorno   | \_\_\_ minutos |
| Ejecución de casos        | \_\_\_ minutos |
| Registro de resultados    | \_\_\_ minutos |
| Investigación de defectos | \_\_\_ minutos |
| **TOTAL**                 | \_\_\_ horas   |

---

## Sección 5: Criterios de Salida

### 5.1 Criterios Funcionales

- ☐ 100% de casos de Prioridad Alta ejecutados
- ☐ ≥ 95% de casos totales pasados
- ☐ 0 defectos críticos abiertos
- ☐ ≤ 3 defectos altos abiertos
- ☐ Todos los RF tienen al menos 1 caso PASADO

### 5.2 Criterios No Funcionales

- ☐ Tiempo de respuesta APIs < 500ms (CP-PERF-01)
- ☐ Tasa de error < 1% (CP-PERF-02)
- ☐ Lighthouse Score > 90 (CP-PERF-07)
- ☐ 0 vulnerabilidades críticas (CP-SEC-10)
- ☐ Compatible con navegadores objetivo (CP-DEP-01 a CP-DEP-04)

### 5.3 Estado de Release

**¿Se cumplen todos los criterios de salida?**

- ☐ ✅ SÍ → **Software APROBADO para release**
- ☐ ❌ NO → **Requiere correcciones antes de release**

---

## Sección 6: Conclusiones y Recomendaciones

### 6.1 Resumen Ejecutivo

```
[Párrafo breve resumiendo el estado general del software tras las pruebas]

Ejemplo:
"Se ejecutaron 53 casos de prueba de validación y 33 casos del sistema,
con una tasa de éxito del 96%. Se encontraron 3 defectos de severidad
media, todos con workarounds disponibles. El sistema está listo para
release en entorno de staging."
```

---

### 6.2 Áreas de Riesgo Identificadas

```
[Módulos o funcionalidades con alta concentración de defectos]

Ejemplo:
- Upload de imágenes a S3: 2 defectos relacionados con timeouts
- Webhooks de Stripe: Requiere mayor testing en entorno de staging
```

---

### 6.3 Recomendaciones

1. [Recomendación 1]
2. [Recomendación 2]
3. [Recomendación 3]

**Ejemplo**:

1. Incrementar timeout de S3 uploads de 30s a 60s
2. Implementar retry automático para webhooks fallidos
3. Agregar logging más detallado en proceso de checkout

---

### 6.4 Próximos Pasos

- ☐ Corregir defectos críticos y altos
- ☐ Re-ejecutar casos fallados tras correcciones
- ☐ Ejecutar testing de regresión completo
- ☐ Realizar pruebas en entorno de staging
- ☐ Programar pruebas Beta con usuarios reales

---

## Sección 7: Firmas y Aprobaciones

| Rol               | Nombre             | Firma              | Fecha          |
| ----------------- | ------------------ | ------------------ | -------------- |
| **Tester / QA**   | ******\_\_\_****** | ******\_\_\_****** | **_/_**/\_\_\_ |
| **QA Lead**       | ******\_\_\_****** | ******\_\_\_****** | **_/_**/\_\_\_ |
| **Product Owner** | ******\_\_\_****** | ******\_\_\_****** | **_/_**/\_\_\_ |
| **Tech Lead**     | ******\_\_\_****** | ******\_\_\_****** | **_/_**/\_\_\_ |

---

## Anexos

### Anexo A: Comandos de Preparación del Entorno

```bash
# 1. Clonar repositorio (si aplica)
cd /home/davidmanuel/Pruebas/ing-software/restaurante-bambu

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.test
# Editar .env.test con credenciales de testing

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Verificar conexión a MongoDB
mongosh "mongodb+srv://..."

# 6. Cargar datos de prueba (opcional)
node scripts/seed-test-data.js
```

---

### Anexo B: Datos de Prueba Estándar

**Usuarios de Prueba**:

```json
// Admin
{
  "email": "admin.test@restaurantebambu.com",
  "password": "Admin123!",
  "admin": true
}

// Cliente Regular
{
  "email": "cliente.test@example.com",
  "password": "Cliente123!",
  "admin": false
}
```

**Productos de Prueba**:

```json
{
  "name": "Arroz Chaufa TEST",
  "basePrice": 25,
  "category": "Platos Principales"
}
```

**Tarjetas Stripe de Prueba**:

- Éxito: `4242 4242 4242 4242`
- Fallo: `4000 0000 0000 0002`
- Requiere 3D Secure: `4000 0025 0000 3155`

---

### Anexo C: Herramientas Utilizadas

| Herramienta     | Propósito                        | Versión         |
| --------------- | -------------------------------- | --------------- |
| Chrome DevTools | Inspección, Network, Performance | Built-in        |
| MongoDB Compass | Inspección de base de datos      | 1.40.0          |
| Postman         | Testing de APIs                  | 10.18           |
| k6              | Pruebas de carga                 | 0.47.0          |
| OWASP ZAP       | Escaneo de seguridad             | 2.14.0          |
| Lighthouse      | Métricas de rendimiento          | Built-in Chrome |

---

### Anexo D: Referencias

- [plan_pruebas_caja_negra.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/plan_pruebas_caja_negra.md) - Estrategia global
- [casos_prueba_validacion.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_validacion.md) - 53 casos RF
- [casos_prueba_sistema.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/casos_prueba_sistema.md) - 33 casos NFR
- [tecnicas_caja_negra.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/tecnicas_caja_negra.md) - PE y AVF
- [matriz_trazabilidad.md](file:///home/davidmanuel/Pruebas/ing-software/restaurante-bambu/testing_caja_negra/matriz_trazabilidad.md) - Cobertura

---

**Plantilla de Ejecución de Pruebas**  
**Versión**: 1.0  
**Última Actualización**: 26 de noviembre de 2024  
**Estado**: Lista para Uso
