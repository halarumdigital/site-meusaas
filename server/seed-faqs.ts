import { config } from "dotenv";
config();

import { getDb } from "./db";
import { faqs } from "@shared/schema";

const initialFaqs = [
  {
    question: "O sistema fica com a minha marca, minhas logo e minhas cores?",
    answer: "Sim! O sistema vai ficar com seu domínio e toda sua marca, o sistema será seu.",
    displayOrder: 0,
  },
  {
    question: "Como funciona com os pagamentos do Asaas?",
    answer: "Você deve criar uma conta no asaas e aprovar, então nós vamos configurar a sua conta no sistema e todo pagamento de mensalidade que o cliente pagar irá para a sua conta direto.",
    displayOrder: 1,
  },
  {
    question: "Quais são as formas de pagamento pelo cliente?",
    answer: "Atualmente apenas cartão de crédito para evitar a inadimplência.",
    displayOrder: 2,
  },
  {
    question: "Posso hospedar o sistema na minha hospedagem?",
    answer: "Sim! Porém precisa de um vps, não serve hospedagem compartilhada como hostinger, hostgator e outras, precisa de um vps.",
    displayOrder: 3,
  },
  {
    question: "Tenho acesso ao código para alterações?",
    answer: "Não, o acesso ao código é bloqueado e ofuscado para evitar pirataria.",
    displayOrder: 4,
  },
  {
    question: "Como funciona o suporte e atualizações?",
    answer: "Nós vamos prestar suporte no sistema garantindo que o sistema fique sempre online com backup diário, correções de erro.",
    displayOrder: 5,
  },
  {
    question: "Posso solicitar novas funções?",
    answer: "Sim! Você pode solicitar novas funções no sistema sem pagar a mais por isso, porém elas irão entrar na fila de desenvolvimento.",
    displayOrder: 6,
  },
  {
    question: "Quanto eu preciso pagar para ter acesso ao sistema?",
    answer: "Você vai pagar apenas a assinatura mensal de R$ 297,00 no cartão.",
    displayOrder: 7,
  },
  {
    question: "Vou ter acesso aos sistemas que forem lançados?",
    answer: "Sim! Em breve vamos lançar o sistema completo de imobiliária com agente de atendimento que irá mostrar os imóveis e qualificar os leads passando para o corretor.",
    displayOrder: 8,
  },
  {
    question: "Posso sugerir novos sistemas?",
    answer: "Sim! Pode nos dar sugestão de sistemas para desenvolvermos.",
    displayOrder: 9,
  },
  {
    question: "Quais as tecnologias que o sistema foi feito?",
    answer: "Front end - React, Back end - Node com Express, Banco - MySQL, API - Node.",
    displayOrder: 10,
  },
  {
    question: "O sistema tem app mobile para os profissionais?",
    answer: "Ainda não mas está no roadmap.",
    displayOrder: 11,
  },
  {
    question: "Posso revender o sistema para quantos clientes quiser?",
    answer: "Sim! Você pode cadastrar e vender para quantos clientes quiser. Não há limite de usuários ou empresas ativas.",
    displayOrder: 12,
  },
  {
    question: "Posso definir meus próprios preços e planos?",
    answer: "Sim! Você tem total liberdade para definir o valor dos planos e criar sua estratégia comercial.",
    displayOrder: 13,
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim! O cancelamento pode ser feito a qualquer momento, sem multa ou fidelidade.",
    displayOrder: 14,
  },
  {
    question: "Há algum custo de setup ou taxa inicial?",
    answer: "Não! Você paga apenas a mensalidade de R$ 297,00 — sem taxa de ativação.",
    displayOrder: 15,
  },
  {
    question: "O sistema é white label?",
    answer: "Sim! Ele é totalmente white label. O cliente nunca verá o nome da nossa empresa, apenas o da sua marca.",
    displayOrder: 16,
  },
  {
    question: "Vocês fornecem algum material de vendas ou treinamento?",
    answer: "Sim! Após ativar sua licença, você recebe vídeos de demonstração para apresentar o sistema aos seus clientes.",
    displayOrder: 17,
  },
  {
    question: "Qual o prazo para entrega após o pagamento?",
    answer: "Em até 48 horas o seu sistema é entregue com sua marca, cores e domínio configurado. Necessário domínio no Cloudflare.",
    displayOrder: 18,
  },
  {
    question: "Posso usar meu próprio domínio personalizado (ex: sistema.minhamarca.com)?",
    answer: "Sim! Nós configuramos o sistema para o domínio que você escolher.",
    displayOrder: 19,
  },
  {
    question: "Vocês oferecem a Evolution para meus clientes?",
    answer: "Sim! Oferecemos também a Evolution para usar no sistema.",
    displayOrder: 20,
  },
  {
    question: "Vocês fornecem lista de empresas para prospecção?",
    answer: "Sim! Fornecemos lista das empresas de todo o Brasil com o celular do proprietário para você prospectar.",
    displayOrder: 21,
  },
];

async function seedFaqs() {
  try {
    const db = await getDb();

    console.log("Populando tabela de FAQs...");

    for (const faq of initialFaqs) {
      await db.insert(faqs).values({
        question: faq.question,
        answer: faq.answer,
        displayOrder: faq.displayOrder,
      });
    }

    console.log(`${initialFaqs.length} FAQs inseridos com sucesso!`);

    process.exit(0);
  } catch (error) {
    console.error("Erro ao popular FAQs:", error);
    process.exit(1);
  }
}

seedFaqs();
