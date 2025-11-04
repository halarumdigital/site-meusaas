import { config } from "dotenv";
config();

import { getDb } from "./db";

async function createFaqsTable() {
  try {
    const db = await getDb();

    console.log("Criando tabela de FAQs...");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question VARCHAR(500) NOT NULL,
        answer VARCHAR(1000) NOT NULL,
        display_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tabela de FAQs criada com sucesso!");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar tabela de FAQs:", error);
    process.exit(1);
  }
}

createFaqsTable();
