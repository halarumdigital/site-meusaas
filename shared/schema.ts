import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = mysqlTable("settings", {
  id: int("id").primaryKey().autoincrement(),
  siteName: varchar("site_name", { length: 255 }).notNull().default("MeuSaaS"),
  faviconPath: varchar("favicon_path", { length: 500 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  facebookPixel: varchar("facebook_pixel", { length: 100 }),
  googleAnalytics: varchar("google_analytics", { length: 100 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const videos = mysqlTable("videos", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  youtubeUrl: varchar("youtube_url", { length: 500 }).notNull(),
  isHeroVideo: int("is_hero_video").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const faqs = mysqlTable("faqs", {
  id: int("id").primaryKey().autoincrement(),
  question: varchar("question", { length: 500 }).notNull(),
  answer: varchar("answer", { length: 1000 }).notNull(),
  displayOrder: int("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const customers = mysqlTable("customers", {
  id: int("id").primaryKey().autoincrement(),
  asaasCustomerId: varchar("asaas_customer_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  cpfCnpj: varchar("cpf_cnpj", { length: 20 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  postalCode: varchar("postal_code", { length: 10 }),
  address: varchar("address", { length: 255 }),
  addressNumber: varchar("address_number", { length: 20 }),
  complement: varchar("complement", { length: 255 }),
  province: varchar("province", { length: 100 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customer_id").notNull(),
  asaasSubscriptionId: varchar("asaas_subscription_id", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 50 }).notNull().default("ACTIVE"),
  value: int("value").notNull(),
  nextDueDate: timestamp("next_due_date").notNull(),
  billingType: varchar("billing_type", { length: 50 }).notNull().default("CREDIT_CARD"),
  cycle: varchar("cycle", { length: 50 }).notNull().default("MONTHLY"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  canceledAt: timestamp("canceled_at"),
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
}).omit({
  id: true,
  createdAt: true,
});

export const selectUserSchema = createSelectSchema(users);

export const insertSettingsSchema = createInsertSchema(settings, {
  siteName: z.string().min(1, "Nome do site é obrigatório"),
  whatsapp: z.string().regex(/^\d{10,15}$/, "WhatsApp deve conter apenas números (10-15 dígitos)").optional().or(z.literal("")),
  facebookPixel: z.string().optional().or(z.literal("")),
  googleAnalytics: z.string().optional().or(z.literal("")),
}).omit({
  id: true,
  updatedAt: true,
});

export const selectSettingsSchema = createSelectSchema(settings);

export const insertVideoSchema = createInsertSchema(videos, {
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  youtubeUrl: z.string().url("URL inválida").refine(
    (url) => url.includes("youtube.com") || url.includes("youtu.be"),
    "URL deve ser do YouTube"
  ),
  isHeroVideo: z.number().int().min(0).max(1).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const selectVideoSchema = createSelectSchema(videos);

export const insertFaqSchema = createInsertSchema(faqs, {
  question: z.string().min(1, "Pergunta é obrigatória"),
  answer: z.string().min(1, "Resposta é obrigatória"),
  displayOrder: z.number().int().min(0).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const selectFaqSchema = createSelectSchema(faqs);

export const insertCustomerSchema = createInsertSchema(customers, {
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  phone: z.string().min(10, "Telefone inválido"),
}).omit({
  id: true,
  createdAt: true,
});

export const selectCustomerSchema = createSelectSchema(customers);

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectSubscriptionSchema = createSelectSchema(subscriptions);

export const createSubscriptionSchema = z.object({
  // Dados pessoais
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ é obrigatório"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  postalCode: z.string().optional(),
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  complement: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  // Dados do cartão
  creditCard: z.object({
    holderName: z.string().min(3, "Nome do titular é obrigatório"),
    number: z.string().min(13, "Número do cartão inválido"),
    expiryMonth: z.string().length(2, "Mês deve ter 2 dígitos"),
    expiryYear: z.string().length(4, "Ano deve ter 4 dígitos"),
    ccv: z.string().min(3, "CVV deve ter 3 ou 4 dígitos"),
  }),
  // Dados da assinatura
  value: z.number().min(1, "Valor é obrigatório"),
  cycle: z.enum(["MONTHLY", "QUARTERLY", "SEMIANNUALLY", "YEARLY"]).default("MONTHLY"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type CreateSubscription = z.infer<typeof createSubscriptionSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
