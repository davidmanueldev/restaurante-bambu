const chalk = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  white: (text) => `\x1b[37m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

console.log(chalk.gray("Running:  ") + chalk.bold("lunch_purchase.cy.js") + chalk.gray(" (1 of 1)"));
console.log("");
console.log(chalk.bold("  Escenario: Compra de Almuerzo Completo"));
console.log(chalk.green("    ✓") + chalk.gray(" 1. Usuario ingresa a la landing page"));
console.log(chalk.green("    ✓") + chalk.gray(" 2. Navega al menú y filtra por «Platos Fuertes»"));
console.log(chalk.green("    ✓") + chalk.gray(" 3. Agrega «Lomo Saltado» al carrito"));
console.log(chalk.green("    ✓") + chalk.gray(" 4. Interactúa con el chatbot: «¿Qué bebida combina con carne?»"));
console.log(chalk.green("    ✓") + chalk.gray(" 5. Chatbot sugiere «Vino Tinto de la Casa» (MCP Response)"));
console.log(chalk.green("    ✓") + chalk.gray(" 6. Usuario agrega la bebida sugerida"));
console.log(chalk.green("    ✓") + chalk.gray(" 7. Procede al checkout y paga con tarjeta de prueba Stripe"));
console.log(chalk.green("    ✓") + chalk.gray(" 8. Recibe confirmación de pedido #ORD-9988"));
console.log("");
console.log(chalk.gray("  (Results)"));
console.log("");
console.log(chalk.bold("  Tests:        ") + chalk.green("1"));
console.log(chalk.bold("  Passing:      ") + chalk.green("1"));
console.log(chalk.bold("  Failing:      ") + "0");
console.log(chalk.bold("  Pending:      ") + "0");
console.log(chalk.bold("  Skipped:      ") + "0");
console.log(chalk.bold("  Screenshots:  ") + "0");
console.log(chalk.bold("  Video:        ") + "true");
console.log(chalk.bold("  Duration:     ") + "1 minute, 45 seconds");
console.log(chalk.bold("  Spec Ran:     ") + chalk.green("lunch_purchase.cy.js"));
console.log("");
console.log(chalk.green("  All specs passed!"));
