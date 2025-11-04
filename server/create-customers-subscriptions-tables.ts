import { config } from "dotenv";
config();

import { getDb } from "./db";

async function createTables() {
  try {
    const db = await getDb();

    console.log("Criando tabela de customers...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        asaas_customer_id VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        cpf_cnpj VARCHAR(20) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        postal_code VARCHAR(10),
        address VARCHAR(255),
        address_number VARCHAR(20),
        complement VARCHAR(255),
        province VARCHAR(100),
        city VARCHAR(100),
        state VARCHAR(2),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela customers criada com sucesso!");

    console.log("Criando tabela de subscriptions...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        asaas_subscription_id VARCHAR(255) NOT NULL UNIQUE,
        status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        value INT NOT NULL,
        next_due_date TIMESTAMP NOT NULL,
        billing_type VARCHAR(50) NOT NULL DEFAULT 'CREDIT_CARD',
        cycle VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);
    console.log("Tabela subscriptions criada com sucesso!");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
    process.exit(1);
  }
}

createTables();
