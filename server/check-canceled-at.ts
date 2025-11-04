import { config } from "dotenv";
config();

import { getDb } from "./db";

async function checkCanceledAt() {
  try {
    const db = await getDb();

    console.log("Verificando estrutura da tabela subscriptions...");

    const [columns] = await db.execute(`
      SHOW COLUMNS FROM subscriptions
    `);

    console.log("\nColunas da tabela subscriptions:");
    console.log(columns);

    console.log("\nVerificando dados das assinaturas...");
    const [rows] = await db.execute(`
      SELECT id, status, canceled_at, created_at
      FROM subscriptions
    `);

    console.log("\nAssinaturas:");
    console.log(rows);

    process.exit(0);
  } catch (error) {
    console.error("Erro:", error);
    process.exit(1);
  }
}

checkCanceledAt();
