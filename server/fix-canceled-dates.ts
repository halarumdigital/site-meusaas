import { config } from "dotenv";
config();

import { getDb } from "./db";

async function fixCanceledDates() {
  try {
    const db = await getDb();

    console.log("Atualizando datas de cancelamento para assinaturas antigas...");

    // Atualizar assinaturas INACTIVE que não têm canceled_at
    // Usando updated_at como data de cancelamento
    const result = await db.execute(`
      UPDATE subscriptions
      SET canceled_at = updated_at
      WHERE status = 'INACTIVE'
      AND canceled_at IS NULL
    `);

    console.log(`${result[0].affectedRows} assinaturas atualizadas com sucesso!`);

    // Verificar resultado
    const [rows] = await db.execute(`
      SELECT id, status, canceled_at, updated_at
      FROM subscriptions
      WHERE status = 'INACTIVE'
    `);

    console.log("\nAssinaturas canceladas:");
    console.log(rows);

    process.exit(0);
  } catch (error) {
    console.error("Erro:", error);
    process.exit(1);
  }
}

fixCanceledDates();
