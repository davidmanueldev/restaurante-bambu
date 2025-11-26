# Instrucciones para Ejecutar las Pruebas de Software

## 1. Pruebas Unitarias (Unit Tests)

ejecución de pruebas con Jest.

**Comando:**

```bash
node scripts/run-unit-tests.js
```

## 2. Pruebas de Integración (Integration Tests)

verificación de endpoints de API y la integración con servidores MCP.

**Comando:**

```bash
node scripts/run-integration-tests.js
```

## 3. Pruebas End-to-End (E2E Tests)

flujo completo de usuario (compra de almuerzo) usando Cypress.

**Comando:**

```bash
node scripts/run-e2e-tests.js
```

## 4. Pruebas de Rendimiento (Performance Tests)

prueba de carga con JMeter/k6.

**Comando:**

```bash
node scripts/run-performance-tests.js
```

## 5. Pruebas de Seguridad (Security Tests)

escaneo de vulnerabilidades con OWASP ZAP.

**Comando:**

```bash
node scripts/run-security-scan.js
```
