import { config } from "dotenv";
config();

import { getDb } from "./db";
import { users } from "@shared/schema";
import bcrypt from "bcryptjs";

async function initDatabase() {
  try {
    const db = await getDb();
    
    console.log("Criando tabela de usuários...");
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("Tabela criada com sucesso!");
    
    const existingUsers = await db.select().from(users).limit(1);
    
    if (existingUsers.length === 0) {
      console.log("Criando usuário admin padrão...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await db.insert(users).values({
        name: "Administrador",
        email: "admin@sistema.com",
        password: hashedPassword,
        role: "admin",
      });
      
      console.log("Usuário admin criado! Email: admin@sistema.com | Senha: admin123");
    } else {
      console.log("Banco de dados já possui usuários.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error);
    process.exit(1);
  }
}

initDatabase();
