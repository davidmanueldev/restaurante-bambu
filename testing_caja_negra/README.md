# Testing de Caja Negra - Restaurante Bambú

## Metodología de Pressman (Páginas 384-404)

---

## 📋 Contenido de esta Carpeta

Esta carpeta contiene la documentación completa de **Pruebas de Caja Negra** siguiendo estrictamente la metodología descrita por Pressman en el Capítulo 17 (Estrategias de Prueba de Software).

### Documentos Principales

| Documento                                                            | Descripción                                                 | Casos      | Estado      |
| -------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- | ----------- |
| **[plan_pruebas_caja_negra.md](plan_pruebas_caja_negra.md)**         | Plan maestro con estrategia global de testing               | -          | ✅ Completo |
| **[casos_prueba_validacion.md](casos_prueba_validacion.md)**         | Casos de prueba para requisitos funcionales (RF-01 a RF-24) | 53         | ✅ Completo |
| **[casos_prueba_sistema.md](casos_prueba_sistema.md)**               | Casos de prueba para requisitos no funcionales              | 33         | ✅ Completo |
| **[tecnicas_caja_negra.md](tecnicas_caja_negra.md)**                 | Análisis de Partición de Equivalencia y Valor de Frontera   | -          | ✅ Completo |
| **[matriz_trazabilidad.md](matriz_trazabilidad.md)**                 | Matrices de cobertura RF/NFR → Casos de prueba              | 5 matrices | ✅ Completo |
| **[plantilla_ejecucion_pruebas.md](plantilla_ejecucion_pruebas.md)** | Formulario para registrar resultados de ejecución           | -          | ✅ Completo |

**Total**: 86 casos de prueba diseñados (53 validación + 33 sistema)

---

## 🎯 Cobertura Alcanzada

### Requisitos Funcionales

- **24/24 RF** cubiertos (100%)
- **53 casos de prueba** diseñados
- Organizado en **5 módulos**: Autenticación, Productos, Carrito/Checkout, Pedidos, Perfil/Usuarios

### Requisitos No Funcionales

- **23/25 NFR** cubiertos (92%)
- **33 casos de prueba del sistema** en **5 categorías**:
  - ✅ Recuperación (5 casos)
  - ✅ Seguridad (10 casos)
  - ✅ Esfuerzo/Stress (5 casos)
  - ✅ Rendimiento (8 casos)
  - ✅ Despliegue (5 casos)

### Técnicas de Caja Negra Aplicadas

- **Partición de Equivalencia**: 34 clases identificadas
- **Análisis de Valor de Frontera**: 6 fronteras analizadas

---

## 🚀 Cómo Usar Estos Documentos

### Para Ejecutar Pruebas

1. **Leer el Plan Maestro**: Comenzar con [plan_pruebas_caja_negra.md](plan_pruebas_caja_negra.md) para entender la estrategia global

2. **Seleccionar Casos a Ejecutar**:

   - Pruebas de Validación (funcionales): [casos_prueba_validacion.md](casos_prueba_validacion.md)
   - Pruebas del Sistema (no funcionales): [casos_prueba_sistema.md](casos_prueba_sistema.md)

3. **Preparar Entorno**: Ver Anexo A en [plantilla_ejecucion_pruebas.md](plantilla_ejecucion_pruebas.md)

4. **Ejecutar y Registrar**: Usar [plantilla_ejecucion_pruebas.md](plantilla_ejecucion_pruebas.md) para documentar resultados

5. **Verificar Cobertura**: Consultar [matriz_trazabilidad.md](matriz_trazabilidad.md)

### Para Entender las Técnicas

- **Partición de Equivalencia**: Ver sección 1 de [tecnicas_caja_negra.md](tecnicas_caja_negra.md)
- **Análisis de Valor de Frontera**: Ver sección 2 de [tecnicas_caja_negra.md](tecnicas_caja_negra.md)

---

## 📊 Resumen Estadístico

| Métrica                       | Valor        |
| ----------------------------- | ------------ |
| Total de casos de prueba      | 86           |
| Casos de Prioridad Alta       | 48 (56%)     |
| Casos de Prioridad Media      | 30 (35%)     |
| Endpoints API cubiertos       | 15/15 (100%) |
| Módulos funcionales cubiertos | 5/5 (100%)   |
| Tipos de pruebas del sistema  | 5/5 (100%)   |

---

## 📚 Fundamento Teórico (Pressman)

Estos documentos se basan en:

- **Capítulo 17**: Estrategias de Prueba de Software (p. 384-404)
  - 17.6: Pruebas de Validación (p. 399-400)
  - 17.7: Pruebas del Sistema (p. 401-403)
  - Pruebas de caja negra como enfoque principal

**Referencia**:  
Pressman, R. S. (2010). _Ingeniería del Software: Un Enfoque Práctico_ (7ª ed.). McGraw-Hill.

---

## ✅ Criterios de Aceptación

Para considerar el software **validado** mediante estas pruebas:

### Pruebas de Validación

- [x] 100% de RF tienen casos de prueba diseñados
- [ ] ≥ 95% de casos ejecutados PASARON
- [ ] 0 defectos críticos abiertos
- [ ] ≤ 3 defectos altos abiertos

### Pruebas del Sistema

- [ ] Todas las pruebas de Seguridad PASADAS (0 vulnerabilidades críticas)
- [ ] Rendimiento: APIs < 500ms, Lighthouse > 90
- [ ] Compatible con Chrome, Firefox, Safari (CP-DEP-01 a CP-DEP-04)
- [ ] Sistema soporta 400+ usuarios concurrentes (CP-STR-01)

---

## 🔧 Herramientas Recomendadas

| Categoría        | Herramienta                        |
| ---------------- | ---------------------------------- |
| **Load Testing** | k6, Apache JMeter                  |
| **Security**     | OWASP ZAP                          |
| **Performance**  | Google Lighthouse, Chrome DevTools |
| **API Testing**  | Postman, Supertest                 |
| **E2E Testing**  | Playwright, Cypress                |

---

## 📝 Notas Importantes

1. **Datos de Prueba**: Usar datos del Anexo B de `plantilla_ejecucion_pruebas.md`
2. **Evidencias**: Guardar en `/testing_caja_negra/evidencias/sesion-YYYYMMDD/`
3. **Defectos**: Registrar usando formato de Sección 3 de la plantilla
4. **Actualizaciones**: Mantener matrices de trazabilidad actualizadas al agregar nuevos casos

---

## 📞 Contacto

**Proyecto**: Restaurante Bambú - Sistema de Pedidos en Línea  
**Equipo de Testing**: [Nombre del equipo]  
**Última Actualización**: 26 de noviembre de 2024

---

**Estado General**: ✅ Documentación completa y lista para ejecución de pruebas
