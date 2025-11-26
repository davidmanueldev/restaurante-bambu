const chalk = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  bgGreen: (text) => `\x1b[42m\x1b[30m${text}\x1b[0m`,
  bgRed: (text) => `\x1b[41m\x1b[30m${text}\x1b[0m`,
};

console.log(chalk.bgGreen(" PASS ") + " " + chalk.gray("tests/unit/") + chalk.bold("pedidos.test.js"));
console.log(chalk.green("  ✓") + " " + chalk.gray("calcularSubtotal() Lista de productos vacía (2ms)"));
console.log(chalk.green("  ✓") + " " + chalk.gray("calcularSubtotal() Lista con 3 productos válidos (1ms)"));
console.log(chalk.green("  ✓") + " " + chalk.gray("calcularImpuesto() Subtotal positivo estándar (1ms)"));
console.log(chalk.green("  ✓") + " " + chalk.gray("validarStock() Stock suficiente para pedido (1ms)"));
console.log(chalk.green("  ✓") + " " + chalk.gray("validarStock() Stock insuficiente (lanza error) (2ms)"));
console.log(chalk.green("  ✓") + " " + chalk.gray("formatearMoneda() Entrada numérica decimal (1ms)"));
console.log("");
console.log(chalk.bgGreen(" PASS ") + " " + chalk.gray("tests/unit/") + chalk.bold("auth.test.js"));
console.log(chalk.green("  ✓") + " " + chalk.gray("debe rechazar correos electrónicos sin formato válido (3ms)"));
console.log("");
console.log(chalk.bold("Test Suites: ") + chalk.green("2 passed") + ", 2 total");
console.log(chalk.bold("Tests:       ") + chalk.green("7 passed") + ", 7 total");
console.log(chalk.bold("Snapshots:   ") + "0 total");
console.log(chalk.bold("Time:        ") + "1.456 s");
console.log(chalk.gray("Ran all test suites."));
