import { motion } from "framer-motion";
import { Check, ChevronDown, Rocket, DollarSign, Code, TrendingUp, Zap, Briefcase, ArrowRight, Sparkles, ChevronRight, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 }
};

export default function Home() {
  const handleCTA = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
                Tenha seu próprio SaaS agora mesmo
              </h1>
              <p className="text-2xl md:text-3xl font-semibold mb-4 text-blue-100" data-testid="text-hero-subtitle">
                Receba um sistema pronto, 100% com a sua marca, para revender e faturar como se fosse seu!
              </p>
              <p className="text-lg md:text-xl mb-12 text-blue-50 leading-relaxed" data-testid="text-hero-description">
                Transforme sua ideia em um negócio SaaS real, sem precisar programar nada.
                Você recebe o sistema completo, com sua marca, domínio e integração de pagamentos via Asaas — pronto para revender e lucrar.
              </p>
              <Button
                onClick={handleCTA}
                size="lg"
                variant="secondary"
                className="rounded-full text-lg font-semibold gap-2"
                data-testid="button-cta-hero"
              >
                Quero meu SaaS agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
            
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-2xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 shadow-2xl">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 shadow-xl">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Monitor className="w-8 h-8 text-blue-400" />
                        <div className="flex-1">
                          <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"></div>
                        <div className="h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30"></div>
                        <div className="h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-700 rounded w-full"></div>
                        <div className="h-2 bg-gray-700 rounded w-4/5"></div>
                        <div className="h-2 bg-gray-700 rounded w-3/5"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-white/80 text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span data-testid="text-hero-mockup-label">100% Personalizável</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground" data-testid="text-section-title-howworks">Como funciona na prática</h2>
            <p className="text-lg text-muted-foreground" data-testid="text-section-description-howworks">
              É simples, rápido e sem complicação. Veja como você terá o seu próprio SaaS rodando em até 48 horas:
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              { num: "1", text: "Você faz sua assinatura mensal pelo Asaas no valor de R$ 297,00." },
              { num: "2", text: "Nos envia o seu domínio, e nós configuramos tudo na Cloudflare." },
              { num: "3", text: "Criamos sua conta em nossos servidores (utilizamos Hostinger Brasil)." },
              { num: "4", text: "Em até 48 horas, você recebe o acesso ao painel administrativo do sistema." },
              { num: "5", text: "Dentro do painel, você personaliza logo, cores, nome do sistema e site." },
              { num: "6", text: "A partir daí, sua função é apenas vender e ficar com 100% do lucro, cobrando diretamente no seu Asaas." },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-wrap gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg" data-testid={`badge-step-${step.num}`}>
                  {step.num}
                </div>
                <p className="text-lg text-foreground pt-2 flex-1" data-testid={`text-step-${step.num}`}>{step.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-12">
            <Button
              onClick={handleCTA}
              size="lg"
              variant="default"
              className="rounded-full text-lg font-semibold gap-2"
              data-testid="button-cta-steps"
            >
              <Rocket className="w-5 h-5" />
              Quero começar agora
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground" data-testid="text-section-title-included">O que está incluso</h2>
            <p className="text-lg text-muted-foreground" data-testid="text-section-description-included">
              Tudo isso em um único valor mensal. Você foca nas vendas — nós cuidamos de toda a estrutura.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Infraestrutura completa (hospedagem, Cloudflare e backups a cada 2h)",
              "Monitoramento do servidor 24h",
              "Suporte via WhatsApp (texto), de segunda a sexta, das 09h às 22h",
              "Painel administrativo completo",
              "Painel exclusivo para salão e barbearia",
              "Acesso profissional otimizado para celular",
              "Site para divulgação com rastreio de Google e Meta",
              "Integração com Evolution, permitindo conectar números ilimitados para agentes responderem",
              "Sistema 100% ilimitado — você pode vender quantas assinaturas quiser, no preço que quiser",
              "Solicitação de novas funções incluída (entra no roadmap de desenvolvimento)",
              "Desconto em novos SaaS lançados (como o imobiliário, já em 80% de conclusão)",
            ].map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="flex flex-wrap gap-4 items-start bg-white p-4 rounded-lg shadow-sm hover-elevate"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-base text-foreground flex-1" data-testid={`text-included-${idx}`}>{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground" data-testid="text-section-title-benefits">Por que vale a pena?</h2>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: "100% White Label",
                description: "Seu cliente só vê a sua marca.",
              },
              {
                icon: DollarSign,
                title: "Lucro recorrente",
                description: "Cobranças automáticas direto no seu Asaas.",
              },
              {
                icon: Code,
                title: "Zero código",
                description: "Tudo pronto e configurado.",
              },
              {
                icon: TrendingUp,
                title: "Escalável",
                description: "Venda ilimitada de assinaturas.",
              },
              {
                icon: Rocket,
                title: "Suporte e atualizações incluídos",
                description: "Você não se preocupa com nada técnico.",
              },
              {
                icon: Zap,
                title: "Entrega rápida",
                description: "Seu sistema ativo em até 48h.",
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover-elevate border-2 border-border" data-testid={`card-benefit-${idx}`}>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-foreground" data-testid={`text-benefit-title-${idx}`}>{benefit.title}</h3>
                    <p className="text-base text-muted-foreground" data-testid={`text-benefit-description-${idx}`}>{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6" data-testid="text-pricing-title">Comece hoje por apenas</h2>
            <div className="mb-8">
              <div className="text-7xl md:text-8xl font-bold mb-2" data-testid="text-pricing-amount">R$ 297</div>
              <div className="text-3xl font-semibold text-blue-100" data-testid="text-pricing-period">/mês</div>
            </div>
            <div className="space-y-3 mb-12 max-w-md mx-auto">
              {[
                "Sem taxa de ativação",
                "Sem limite de clientes",
                "Sem fidelidade",
                "Cancele quando quiser",
              ].map((item, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-3 justify-center text-lg">
                  <Check className="w-6 h-6 text-green-300" />
                  <span className="text-blue-50" data-testid={`text-pricing-benefit-${idx}`}>{item}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={handleCTA}
              size="lg"
              variant="secondary"
              className="rounded-full text-xl font-bold gap-2"
              data-testid="button-cta-pricing"
            >
              <Sparkles className="w-6 h-6" />
              Quero meu SaaS agora
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground" data-testid="text-section-title-faq">Dúvidas mais comuns</h2>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "O sistema fica com minha marca e domínio?",
                  a: "Sim! O sistema é 100% seu, com domínio, logo e cores personalizadas.",
                },
                {
                  q: "Como funcionam os pagamentos pelo Asaas?",
                  a: "Você cria sua conta e nós integramos ao sistema. Todo pagamento vai direto para a sua conta.",
                },
                {
                  q: "Posso hospedar por conta própria?",
                  a: "Sim, desde que use um servidor VPS. Hospedagens compartilhadas não são recomendadas.",
                },
                {
                  q: "Tenho acesso ao código-fonte?",
                  a: "Não. O código é protegido para evitar pirataria e manter a segurança.",
                },
                {
                  q: "Posso sugerir novas funções?",
                  a: "Sim! As sugestões entram no roadmap de desenvolvimento.",
                },
                {
                  q: "Posso cancelar quando quiser?",
                  a: "Sim! Sem multa e sem fidelidade.",
                },
                {
                  q: "Há taxa de setup?",
                  a: "Não. Apenas a mensalidade.",
                },
              ].map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-2 border-border rounded-lg px-6 bg-card" data-testid={`accordion-item-${idx}`}>
                  <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline py-6" data-testid={`accordion-trigger-${idx}`}>
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pb-6" data-testid={`accordion-content-${idx}`}>
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-final-cta-title">
              Pronto para transformar sua ideia em realidade?
            </h2>
            <p className="text-xl mb-10 text-blue-100" data-testid="text-final-cta-description">
              Comece hoje mesmo e tenha seu próprio SaaS funcionando em até 48 horas!
            </p>
            <Button
              onClick={handleCTA}
              size="lg"
              variant="secondary"
              className="rounded-full text-xl font-bold gap-2"
              data-testid="button-cta-final"
            >
              <ChevronRight className="w-6 h-6" />
              Quero começar agora
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-sm" data-testid="text-footer-support">
              <strong className="text-white">Suporte:</strong> WhatsApp (texto), segunda a sexta, das 09h às 22h
            </p>
            <p className="text-xs text-gray-500" data-testid="text-footer-copyright">
              © 2024 SaaS White Label. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
