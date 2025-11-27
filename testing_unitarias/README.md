# Pruebas Unitarias - Restaurante Bambú

## Metodología de Pressman (Sección 17.4)

---

## 📋 Contenido

Documentación completa de **Pruebas Unitarias** para Modelos de Mongoose.

### Documentos

| Documento                                                                    | Descripción                                    |
| ---------------------------------------------------------------------------- | ---------------------------------------------- |
| **[INFORME_DETALLADO.md](INFORME_DETALLADO.md)**                             | Informe profesional completo con código fuente |
| **[plan_pruebas_unitarias.md](plan_pruebas_unitarias.md)**                   | Plan maestro de testing                        |
| **[casos_pruebas_unitarias_modelos.md](casos_pruebas_unitarias_modelos.md)** | Casos de prueba para modelos                   |

**Total**: 9 casos de prueba para 3 modelos (User, MenuItem, Order)

---

## 🚀 Ejecución

```bash
# Ejecutar todos los tests unitarios
npm run test:unit

# Con cobertura
npm run test:unit:coverage

# Modo watch (desarrollo)
npm run test:unit:watch
```

---

## ✅ Resultados

```
PASS  tests/unit/models/Order.test.js
PASS  tests/unit/models/User.test.js
PASS  tests/unit/models/MenuItem.test.js

Test Suites: 3 passed, 3 total
Tests:       9 passed, 9 total
Time:        1.055 s
```

**Estado**: ✅ Todos los tests pasan

---

## 📁 Scripts Ejecutables

Ubicados en `tests/unit/models/`:

- `User.test.js` (3 tests)
- `MenuItem.test.js` (3 tests)
- `Order.test.js` (3 tests)

Ver [INFORME_DETALLADO.md](INFORME_DETALLADO.md) para código fuente completo.
