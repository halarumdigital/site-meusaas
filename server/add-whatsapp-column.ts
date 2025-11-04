import { config } from "dotenv";
config();

import { getDb } from "./db";

async function addWhatsappColumn() {
  try {
    const db = await getDb();

    console.log("Adicionando coluna whatsapp na tabela settings...");

    await db.execute(`
      ALTER TABLE settings ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20)
    `);

    console.log("Coluna whatsapp adicionada com sucesso!");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao adicionar coluna whatsapp:", error);
    process.exit(1);
  }
}

addWhatsappColumn();
