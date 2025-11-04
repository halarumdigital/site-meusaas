import { config } from "dotenv";
config();

import { getDb } from "./db";

async function createVideosTable() {
  try {
    const db = await getDb();

    console.log("Criando tabela de vídeos...");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(500) NOT NULL,
        youtube_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tabela de vídeos criada com sucesso!");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar tabela de vídeos:", error);
    process.exit(1);
  }
}

createVideosTable();
