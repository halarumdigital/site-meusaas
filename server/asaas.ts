import axios, { AxiosInstance } from "axios";
import { config } from "dotenv";

// Carregar variáveis de ambiente
config();

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_ENVIRONMENT = process.env.ASAAS_ENVIRONMENT || "sandbox";

const ASAAS_BASE_URL = ASAAS_ENVIRONMENT === "production"
  ? "https://api.asaas.com/v3"
  : "https://sandbox.asaas.com/api/v3";

class AsaasService {
  private client: AxiosInstance;

  constructor() {
    if (!ASAAS_API_KEY) {
      throw new Error("ASAAS_API_KEY não configurada. Verifique o arquivo .env");
    }

    this.client = axios.create({
      baseURL: ASAAS_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "access_token": ASAAS_API_KEY,
      },
    });
  }

  // Criar cliente no Asaas
  async createCustomer(data: {
    name: string;
    email: string;
    cpfCnpj: string;
    phone: string;
    postalCode?: string;
    address?: string;
    addressNumber?: string;
    complement?: string;
    province?: string;
    city?: string;
    state?: string;
  }) {
    try {
      const response = await this.client.post("/customers", {
        name: data.name,
        email: data.email,
        cpfCnpj: data.cpfCnpj,
        phone: data.phone,
        mobilePhone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        addressNumber: data.addressNumber,
        complement: data.complement,
        province: data.province,
        city: data.city,
        state: data.state,
      });

      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar cliente no Asaas:", error.response?.data || error.message);
      throw new Error(error.response?.data?.errors?.[0]?.description || "Erro ao criar cliente no Asaas");
    }
  }

  // Criar assinatura no Asaas
  async createSubscription(data: {
    customer: string; // ID do cliente no Asaas
    billingType: "CREDIT_CARD";
    value: number;
    nextDueDate: string; // YYYY-MM-DD
    cycle: "MONTHLY" | "QUARTERLY" | "SEMIANNUALLY" | "YEARLY";
    creditCard: {
      holderName: string;
      number: string;
      expiryMonth: string;
      expiryYear: string;
      ccv: string;
    };
    creditCardHolderInfo: {
      name: string;
      email: string;
      cpfCnpj: string;
      postalCode: string;
      addressNumber: string;
      phone: string;
    };
  }) {
    try {
      const response = await this.client.post("/subscriptions", {
        customer: data.customer,
        billingType: data.billingType,
        value: data.value,
        nextDueDate: data.nextDueDate,
        cycle: data.cycle,
        description: "Assinatura Mensal - Sistema SaaS",
        creditCard: {
          holderName: data.creditCard.holderName,
          number: data.creditCard.number,
          expiryMonth: data.creditCard.expiryMonth,
          expiryYear: data.creditCard.expiryYear,
          ccv: data.creditCard.ccv,
        },
        creditCardHolderInfo: {
          name: data.creditCardHolderInfo.name,
          email: data.creditCardHolderInfo.email,
          cpfCnpj: data.creditCardHolderInfo.cpfCnpj,
          postalCode: data.creditCardHolderInfo.postalCode,
          addressNumber: data.creditCardHolderInfo.addressNumber,
          phone: data.creditCardHolderInfo.phone,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar assinatura no Asaas:", error.response?.data || error.message);
      throw new Error(error.response?.data?.errors?.[0]?.description || "Erro ao criar assinatura no Asaas");
    }
  }

  // Obter assinatura
  async getSubscription(subscriptionId: string) {
    try {
      const response = await this.client.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao obter assinatura no Asaas:", error.response?.data || error.message);
      throw new Error("Erro ao obter assinatura no Asaas");
    }
  }

  // Cancelar assinatura
  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await this.client.delete(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao cancelar assinatura no Asaas:", error.response?.data || error.message);
      throw new Error("Erro ao cancelar assinatura no Asaas");
    }
  }
}

export const asaasService = new AsaasService();
