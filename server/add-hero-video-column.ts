import { config } from "dotenv";
config();

import { getDb } from "./db";

async function addHeroVideoColumn() {
  try {
    const db = await getDb();

    console.log("Adicionando coluna is_hero_video na tabela videos...");

    await db.execute(`
      ALTER TABLE videos
      ADD COLUMN is_hero_video INT NOT NULL DEFAULT 0
    `);

    console.log("Coluna is_hero_video adicionada com sucesso!");

    // Verificar resultado
    const [columns] = await db.execute(`
      SHOW COLUMNS FROM videos
    `);

    console.log("\nColunas da tabela videos:");
    console.log(columns);

    process.exit(0);
  } catch (error) {
    console.error("Erro ao adicionar coluna:", error);
    process.exit(1);
  }
}

addHeroVideoColumn();
