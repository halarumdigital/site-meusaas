import { config } from "dotenv";
config();

import { getDb } from "./db";

async function addTrackingScriptsColumns() {
  try {
    const db = await getDb();

    console.log("Adicionando colunas de tracking scripts na tabela settings...");

    // Adicionar coluna facebook_pixel
    await db.execute(`
      ALTER TABLE settings
      ADD COLUMN facebook_pixel VARCHAR(100) NULL
    `);

    console.log("Coluna facebook_pixel adicionada!");

    // Adicionar coluna google_analytics
    await db.execute(`
      ALTER TABLE settings
      ADD COLUMN google_analytics VARCHAR(100) NULL
    `);

    console.log("Coluna google_analytics adicionada!");

    console.log("\nColunas adicionadas com sucesso!");

    // Verificar resultado
    const [columns] = await db.execute(`
      SHOW COLUMNS FROM settings
    `);

    console.log("\nColunas da tabela settings:");
    console.log(columns);

    process.exit(0);
  } catch (error) {
    console.error("Erro ao adicionar colunas:", error);
    process.exit(1);
  }
}

addTrackingScriptsColumns();
