import { config } from "dotenv";
config();

import { getDb } from "./db";

async function addCanceledAtColumn() {
  try {
    const db = await getDb();

    console.log("Adicionando coluna canceled_at na tabela subscriptions...");

    // Adicionar coluna canceled_at
    await db.execute(`
      ALTER TABLE subscriptions
      ADD COLUMN canceled_at TIMESTAMP NULL
    `);

    console.log("Coluna canceled_at adicionada com sucesso!");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao adicionar coluna:", error);
    process.exit(1);
  }
}

addCanceledAtColumn();
