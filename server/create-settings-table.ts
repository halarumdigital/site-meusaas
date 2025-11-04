import { config } from "dotenv";
config();

import { getDb } from "./db";

async function createSettingsTable() {
  try {
    const db = await getDb();

    console.log("Criando tabela de configurações...");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        site_name VARCHAR(255) NOT NULL DEFAULT 'MeuSaaS',
        favicon_path VARCHAR(500),
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("Tabela de configurações criada com sucesso!");

    const existingSettings = await db.execute(`SELECT * FROM settings LIMIT 1`);

    if ((existingSettings as any)[0].length === 0) {
      console.log("Criando configurações padrão...");

      await db.execute(`
        INSERT INTO settings (site_name, favicon_path) VALUES ('MeuSaaS', NULL)
      `);

      console.log("Configurações padrão criadas!");
    } else {
      console.log("Configurações já existem no banco de dados.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar tabela de configurações:", error);
    process.exit(1);
  }
}

createSettingsTable();
