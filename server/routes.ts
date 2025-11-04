import type { Express } from "express";
import { createServer, type Server } from "http";
import { getDb } from "./db";
import { users, insertUserSchema, loginSchema, settings, insertSettingsSchema, videos, insertVideoSchema, faqs, insertFaqSchema, customers, subscriptions, createSubscriptionSchema } from "@shared/schema";
import { requireAuth, requireAdmin } from "./auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import { asaasService } from "./asaas";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "favicon-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|ico|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas"));
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 } // 2MB
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const db = await getDb();
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      req.session.userId = user.id;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Erro ao fazer login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    res.json({ user: req.user });
  });

  app.get("/api/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      const db = await getDb();
      const allUsers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      }).from(users);
      
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.post("/api/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const db = await getDb();
      
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const [newUser] = await db.insert(users).values({
        ...userData,
        password: hashedPassword,
      });

      const [createdUser] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, newUser.insertId))
        .limit(1);
      
      res.status(201).json(createdUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Erro ao criar usuário" });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const db = await getDb();

      if (userId === req.user?.id) {
        return res.status(400).json({ message: "Você não pode deletar seu próprio usuário" });
      }

      await db.delete(users).where(eq(users.id, userId));

      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const db = await getDb();
      const [siteSettings] = await db.select().from(settings).limit(1);

      if (!siteSettings) {
        const [newSettings] = await db.insert(settings).values({
          siteName: "MeuSaaS",
          faviconPath: null,
        });

        const [createdSettings] = await db
          .select()
          .from(settings)
          .where(eq(settings.id, newSettings.insertId))
          .limit(1);

        return res.json(createdSettings);
      }

      res.json(siteSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  });

  app.post("/api/settings", requireAuth, requireAdmin, upload.single("favicon"), async (req, res) => {
    try {
      const db = await getDb();
      const { siteName, whatsapp } = req.body;

      const updateData: any = {
        siteName,
        whatsapp: whatsapp || null,
      };

      if (req.file) {
        updateData.faviconPath = `/uploads/${req.file.filename}`;

        const [currentSettings] = await db.select().from(settings).limit(1);
        if (currentSettings?.faviconPath) {
          const oldPath = path.join(process.cwd(), currentSettings.faviconPath);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }

      const [existingSettings] = await db.select().from(settings).limit(1);

      if (existingSettings) {
        await db.update(settings)
          .set(updateData)
          .where(eq(settings.id, existingSettings.id));

        const [updatedSettings] = await db
          .select()
          .from(settings)
          .where(eq(settings.id, existingSettings.id))
          .limit(1);

        res.json(updatedSettings);
      } else {
        const [newSettings] = await db.insert(settings).values(updateData);

        const [createdSettings] = await db
          .select()
          .from(settings)
          .where(eq(settings.id, newSettings.insertId))
          .limit(1);

        res.json(createdSettings);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Erro ao atualizar configurações" });
    }
  });

  app.post("/api/settings/scripts", requireAuth, requireAdmin, async (req, res) => {
    try {
      const db = await getDb();
      const { facebookPixel, googleAnalytics } = req.body;

      const [existingSettings] = await db.select().from(settings).limit(1);

      if (existingSettings) {
        await db.update(settings)
          .set({
            facebookPixel: facebookPixel || null,
            googleAnalytics: googleAnalytics || null,
          })
          .where(eq(settings.id, existingSettings.id));

        const [updatedSettings] = await db
          .select()
          .from(settings)
          .where(eq(settings.id, existingSettings.id))
          .limit(1);

        res.json(updatedSettings);
      } else {
        const [newSettings] = await db.insert(settings).values({
          siteName: "MeuSaaS",
          facebookPixel: facebookPixel || null,
          googleAnalytics: googleAnalytics || null,
        });

        const [createdSettings] = await db
          .select()
          .from(settings)
          .where(eq(settings.id, newSettings.insertId))
          .limit(1);

        res.json(createdSettings);
      }
    } catch (error) {
      console.error("Error updating scripts:", error);
      res.status(500).json({ message: "Erro ao atualizar scripts" });
    }
  });

  app.get("/api/videos", async (req, res) => {
    try {
      const db = await getDb();
      const allVideos = await db.select().from(videos);
      res.json(allVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Erro ao buscar vídeos" });
    }
  });

  app.post("/api/videos", requireAuth, requireAdmin, async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const db = await getDb();

      // Se este vídeo for marcado como hero video, desmarcar todos os outros
      if (videoData.isHeroVideo === 1) {
        await db.update(videos).set({ isHeroVideo: 0 });
      }

      const [newVideo] = await db.insert(videos).values(videoData);

      const [createdVideo] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, newVideo.insertId))
        .limit(1);

      res.status(201).json(createdVideo);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(400).json({ message: "Erro ao criar vídeo" });
    }
  });

  app.delete("/api/videos/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const db = await getDb();

      await db.delete(videos).where(eq(videos.id, videoId));

      res.json({ message: "Vídeo deletado com sucesso" });
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Erro ao deletar vídeo" });
    }
  });

  app.get("/api/faqs", async (req, res) => {
    try {
      const db = await getDb();
      const allFaqs = await db.select().from(faqs).orderBy(faqs.displayOrder);
      res.json(allFaqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Erro ao buscar FAQs" });
    }
  });

  app.post("/api/faqs", requireAuth, requireAdmin, async (req, res) => {
    try {
      const faqData = insertFaqSchema.parse(req.body);
      const db = await getDb();

      const [newFaq] = await db.insert(faqs).values(faqData);

      const [createdFaq] = await db
        .select()
        .from(faqs)
        .where(eq(faqs.id, newFaq.insertId))
        .limit(1);

      res.status(201).json(createdFaq);
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(400).json({ message: "Erro ao criar FAQ" });
    }
  });

  app.put("/api/faqs/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const faqId = parseInt(req.params.id);
      const faqData = insertFaqSchema.parse(req.body);
      const db = await getDb();

      await db.update(faqs)
        .set(faqData)
        .where(eq(faqs.id, faqId));

      const [updatedFaq] = await db
        .select()
        .from(faqs)
        .where(eq(faqs.id, faqId))
        .limit(1);

      res.json(updatedFaq);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(400).json({ message: "Erro ao atualizar FAQ" });
    }
  });

  app.delete("/api/faqs/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const faqId = parseInt(req.params.id);
      const db = await getDb();

      await db.delete(faqs).where(eq(faqs.id, faqId));

      res.json({ message: "FAQ deletado com sucesso" });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({ message: "Erro ao deletar FAQ" });
    }
  });

  // Listar clientes com assinaturas
  app.get("/api/customers", requireAuth, requireAdmin, async (req, res) => {
    try {
      const db = await getDb();

      // Buscar todos os clientes
      const allCustomers = await db.select().from(customers);

      // Buscar todas as assinaturas
      const allSubscriptions = await db.select().from(subscriptions);

      // Combinar clientes com suas assinaturas
      const customersWithSubscriptions = allCustomers.map(customer => {
        const customerSubscriptions = allSubscriptions.filter(
          sub => sub.customerId === customer.id
        );

        const activeSubscription = customerSubscriptions.find(
          sub => sub.status === "ACTIVE"
        );

        return {
          ...customer,
          hasActiveSubscription: !!activeSubscription,
          activeSubscription: activeSubscription || null,
          totalSubscriptions: customerSubscriptions.length,
        };
      });

      res.json(customersWithSubscriptions);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Erro ao buscar clientes" });
    }
  });

  // Listar todas as assinaturas com dados do cliente
  app.get("/api/subscriptions", requireAuth, requireAdmin, async (req, res) => {
    try {
      const db = await getDb();

      // Buscar todas as assinaturas
      const allSubscriptions = await db.select().from(subscriptions);

      // Buscar todos os clientes
      const allCustomers = await db.select().from(customers);

      // Combinar assinaturas com dados do cliente
      const subscriptionsWithCustomer = allSubscriptions.map(subscription => {
        const customer = allCustomers.find(c => c.id === subscription.customerId);

        return {
          ...subscription,
          customer: customer || null,
        };
      });

      res.json(subscriptionsWithCustomer);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Erro ao buscar assinaturas" });
    }
  });

  // Cancelar assinatura
  app.delete("/api/subscriptions/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const subscriptionId = parseInt(req.params.id);
      const db = await getDb();

      // Buscar assinatura no banco
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, subscriptionId))
        .limit(1);

      if (!subscription) {
        return res.status(404).json({ message: "Assinatura não encontrada" });
      }

      // Cancelar assinatura no Asaas
      console.log(`Cancelando assinatura ${subscription.asaasSubscriptionId} no Asaas...`);
      await asaasService.cancelSubscription(subscription.asaasSubscriptionId);

      // Atualizar status no banco e salvar data de cancelamento
      await db
        .update(subscriptions)
        .set({
          status: "INACTIVE",
          canceledAt: new Date()
        })
        .where(eq(subscriptions.id, subscriptionId));

      res.json({ message: "Assinatura cancelada com sucesso" });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({
        message: "Erro ao cancelar assinatura",
        error: error.message
      });
    }
  });

  // Criar assinatura (cliente + subscription no Asaas)
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const subscriptionData = createSubscriptionSchema.parse(req.body);
      const db = await getDb();

      // 1. Criar cliente no Asaas
      console.log("Criando cliente no Asaas...");
      const asaasCustomer = await asaasService.createCustomer({
        name: subscriptionData.name,
        email: subscriptionData.email,
        cpfCnpj: subscriptionData.cpfCnpj,
        phone: subscriptionData.phone,
        postalCode: subscriptionData.postalCode,
        address: subscriptionData.address,
        addressNumber: subscriptionData.addressNumber,
        complement: subscriptionData.complement,
        province: subscriptionData.province,
        city: subscriptionData.city,
        state: subscriptionData.state,
      });

      // 2. Salvar cliente no banco
      console.log("Salvando cliente no banco...");
      const [newCustomer] = await db.insert(customers).values({
        asaasCustomerId: asaasCustomer.id,
        name: subscriptionData.name,
        email: subscriptionData.email,
        cpfCnpj: subscriptionData.cpfCnpj,
        phone: subscriptionData.phone,
        postalCode: subscriptionData.postalCode || null,
        address: subscriptionData.address || null,
        addressNumber: subscriptionData.addressNumber || null,
        complement: subscriptionData.complement || null,
        province: subscriptionData.province || null,
        city: subscriptionData.city || null,
        state: subscriptionData.state || null,
      });

      // 3. Criar assinatura no Asaas (já cobrando a primeira mensalidade)
      console.log("Criando assinatura no Asaas...");
      const today = new Date();
      const nextDueDate = new Date(today);
      nextDueDate.setDate(today.getDate() + 1); // Primeira cobrança amanhã

      const asaasSubscription = await asaasService.createSubscription({
        customer: asaasCustomer.id,
        billingType: "CREDIT_CARD",
        value: subscriptionData.value,
        nextDueDate: nextDueDate.toISOString().split('T')[0], // YYYY-MM-DD
        cycle: subscriptionData.cycle,
        creditCard: {
          holderName: subscriptionData.creditCard.holderName,
          number: subscriptionData.creditCard.number,
          expiryMonth: subscriptionData.creditCard.expiryMonth,
          expiryYear: subscriptionData.creditCard.expiryYear,
          ccv: subscriptionData.creditCard.ccv,
        },
        creditCardHolderInfo: {
          name: subscriptionData.name,
          email: subscriptionData.email,
          cpfCnpj: subscriptionData.cpfCnpj,
          postalCode: subscriptionData.postalCode || "00000000",
          addressNumber: subscriptionData.addressNumber || "SN",
          phone: subscriptionData.phone,
        },
      });

      // 4. Salvar assinatura no banco
      console.log("Salvando assinatura no banco...");
      const [newSubscription] = await db.insert(subscriptions).values({
        customerId: newCustomer.insertId,
        asaasSubscriptionId: asaasSubscription.id,
        status: asaasSubscription.status,
        value: subscriptionData.value,
        nextDueDate: new Date(asaasSubscription.nextDueDate),
        billingType: "CREDIT_CARD",
        cycle: subscriptionData.cycle,
      });

      console.log("Assinatura criada com sucesso!");

      res.status(201).json({
        message: "Assinatura criada com sucesso",
        customer: {
          id: newCustomer.insertId,
          asaasCustomerId: asaasCustomer.id,
        },
        subscription: {
          id: newSubscription.insertId,
          asaasSubscriptionId: asaasSubscription.id,
          status: asaasSubscription.status,
          nextDueDate: asaasSubscription.nextDueDate,
        },
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(400).json({
        message: "Erro ao criar assinatura",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
