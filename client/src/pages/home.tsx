import { motion } from "framer-motion";
import { Check, ChevronDown, Rocket, DollarSign, Code, TrendingUp, Zap, Briefcase, ArrowRight, Sparkles, ChevronRight, Monitor, CreditCard, Globe, Server, KeyRound, Palette, ShoppingCart, Target, Calculator, Users, BarChart3, CheckCircle2, Repeat, MapPin, BadgeDollarSign, Layers, Database, Paintbrush, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Settings, Video, Faq } from "@shared/schema";
import { SubscriptionModal } from "@/components/SubscriptionModal";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 }
};

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const { data: videos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const { data: faqs } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
  });

  // Buscar vídeo hero
  const heroVideo = videos?.find(v => v.isHeroVideo === 1);

  const handleCTA = () => {
    setIsSubscriptionModalOpen(true);
  };

  function extractYoutubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  function handleVideoClick(video: Video) {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-20 md:py-32">
        <div className="absolute inset-0">
          <img
            src="/uploads/background.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-black/80 to-blue-700/80"></div>
        </div>
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
                {heroVideo && extractYoutubeId(heroVideo.youtubeUrl) ? (
                  <div className="relative bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${extractYoutubeId(heroVideo.youtubeUrl)}`}
                        title={heroVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        data-testid="hero-video-iframe"
                      />
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                      <h3 className="text-white font-semibold text-lg">{heroVideo.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{heroVideo.description}</p>
                    </div>
                  </div>
                ) : (
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
                )}
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

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CreditCard,
                title: "Faça sua assinatura",
                description: "Você faz sua assinatura mensal pelo Asaas no valor de R$ 297,00.",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                icon: Globe,
                title: "Configure seu domínio",
                description: "Nos envie o seu domínio, e nós configuramos tudo na Cloudflare.",
                gradient: "from-green-500 to-teal-600",
              },
              {
                icon: Server,
                title: "Criamos sua conta",
                description: "Criamos sua conta em nossos servidores (utilizamos Hostinger Brasil).",
                gradient: "from-purple-500 to-pink-600",
              },
              {
                icon: KeyRound,
                title: "Receba o acesso",
                description: "Em até 48 horas, você recebe o acesso ao painel administrativo do sistema.",
                gradient: "from-orange-500 to-red-600",
              },
              {
                icon: Palette,
                title: "Personalize sua marca",
                description: "Dentro do painel, você personaliza logo, cores, nome do sistema e site.",
                gradient: "from-cyan-500 to-blue-600",
              },
              {
                icon: ShoppingCart,
                title: "Venda e lucre",
                description: "A partir daí, sua função é apenas vender e ficar com 100% do lucro, cobrando diretamente no seu Asaas.",
                gradient: "from-yellow-500 to-orange-600",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover-elevate border-2 border-border" data-testid={`card-step-${idx}`}>
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground" data-testid={`text-step-title-${idx}`}>{step.title}</h3>
                    <p className="text-base text-muted-foreground" data-testid={`text-step-description-${idx}`}>{step.description}</p>
                  </CardContent>
                </Card>
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

      <section id="pricing-section" className="py-16 md:py-24 bg-gradient-to-br from-black via-blue-600 to-black text-white">
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
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Exemplo Real: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Como Faturar R$ 2.970/mês</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-3">
              Veja como um membro está faturando vendendo apenas UM dos nossos sistemas para um nicho específico na cidade dele.
            </p>
            <p className="text-base text-muted-foreground">
              Este é apenas um exemplo. Você pode escolher qualquer nicho e replicar o processo.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Target,
                step: "PASSO 1",
                title: "Escolha o Nicho",
                subtitle: "Sistema de Gestão para Barbearias",
                description: "Mercado aquecido com 500+ mil estabelecimentos no Brasil",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                icon: BadgeDollarSign,
                step: "PASSO 2",
                title: "Defina o Preço",
                subtitle: "R$ 297/mês por barbearia",
                description: "Preço justo comparado aos R$ 5.000+ que custaria desenvolver",
                gradient: "from-purple-500 to-pink-600",
              },
              {
                icon: Users,
                step: "PASSO 3",
                title: "Encontre Clientes",
                subtitle: "10 barbearias na sua cidade",
                description: "Meta realista para começar em 90 dias",
                gradient: "from-cyan-500 to-blue-600",
              },
              {
                icon: Calculator,
                step: "PASSO 4",
                title: "Calcule o Resultado",
                subtitle: "R$ 2.970/mês recorrente",
                description: "10 clientes × R$ 297 = renda mensal garantida",
                gradient: "from-green-500 to-emerald-600",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover-elevate border-2 border-border">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-xs font-bold text-blue-600 mb-2">{step.step}</div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{step.title}</h3>
                    <p className="text-base font-semibold text-blue-600 mb-2">{step.subtitle}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="max-w-5xl mx-auto">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                      <h3 className="text-2xl font-bold text-foreground">Resultado em Números</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: "Faturamento Mensal:", value: "R$ 2.970", color: "text-blue-600" },
                        { label: "Faturamento Anual:", value: "R$ 35.640", color: "text-purple-600" },
                        { label: "Investimento Inicial:", value: "R$ 297", color: "text-green-600" },
                        { label: "ROI em 30 dias:", value: "997%", color: "text-orange-600" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-3">
                          <span className="text-base font-medium text-muted-foreground">{item.label}</span>
                          <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <h3 className="text-2xl font-bold text-foreground">Por que Funciona?</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { icon: Target, text: "Nicho específico com dor real" },
                        { icon: Repeat, text: "Modelo de assinatura recorrente" },
                        { icon: MapPin, text: "Fácil de encontrar clientes localmente" },
                        { icon: BadgeDollarSign, text: "Preço justo pelo valor entregue" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="text-base text-foreground pt-1">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                  <p className="text-base text-foreground">
                    <strong>Imagine replicar isso com outros nichos:</strong> salões, clínicas, restaurantes, academias...{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
                      O potencial é ilimitado!
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {videos && videos.filter(v => v.isHeroVideo !== 1).length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-foreground" data-testid="text-section-title-videos">Veja o Sistema em Ação</h2>
              <p className="text-lg text-muted-foreground" data-testid="text-section-description-videos">
                Confira nossos vídeos de demonstração e veja como é fácil gerenciar seu SaaS white label
              </p>
            </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.filter(v => v.isHeroVideo !== 1).map((video, idx) => (
                <motion.div key={video.id} {...fadeInUp} transition={{ delay: idx * 0.1, duration: 0.5 }}>
                  <Card
                    className="overflow-hidden hover-elevate border-2 border-border cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleVideoClick(video)}
                    data-testid={`card-video-${idx + 1}`}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 relative">
                        <img
                          src={`https://img.youtube.com/vi/${extractYoutubeId(video.youtubeUrl)}/maxresdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${extractYoutubeId(video.youtubeUrl)}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-1 text-foreground line-clamp-2" data-testid={`text-video-title-${idx + 1}`}>
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-video-description-${idx + 1}`}>
                          {video.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-4">
            <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">Tecnologia dos Projetos</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Stack</span> Tecnológico dos Projetos
            </h2>
            <p className="text-lg text-muted-foreground">
              Conheça as tecnologias modernas e poderosas como React, Node.js, MySQL e Tailwind CSS que utilizamos nos projetos do Club do Software
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              {
                icon: Layers,
                name: "React",
                category: "Frontend",
                description: "Biblioteca JavaScript para criar interfaces de usuário modernas e interativas",
                bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
                iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
                borderColor: "border-blue-200",
              },
              {
                icon: Server,
                name: "Node.js",
                category: "Backend",
                description: "Runtime JavaScript para desenvolvimento de aplicações server-side escaláveis",
                bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
                iconBg: "bg-gradient-to-br from-green-600 to-emerald-700",
                borderColor: "border-green-200",
              },
              {
                icon: Code,
                name: "Express.js",
                category: "Backend",
                description: "Framework web minimalista e flexível para Node.js com recursos robustos",
                bgColor: "bg-gradient-to-br from-gray-50 to-slate-50",
                iconBg: "bg-gradient-to-br from-gray-700 to-slate-800",
                borderColor: "border-gray-300",
              },
              {
                icon: Database,
                name: "MySQL",
                category: "Database",
                description: "Sistema de gerenciamento de banco de dados relacional rápido e confiável",
                bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
                iconBg: "bg-gradient-to-br from-orange-600 to-amber-600",
                borderColor: "border-orange-200",
              },
              {
                icon: Paintbrush,
                name: "Tailwind CSS",
                category: "Styling",
                description: "Framework CSS utility-first para criação rápida de interfaces modernas",
                bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50",
                iconBg: "bg-gradient-to-br from-cyan-600 to-blue-600",
                borderColor: "border-cyan-200",
              },
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className={`h-full hover-elevate border-2 ${tech.borderColor} ${tech.bgColor}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${tech.iconBg} flex items-center justify-center shadow-lg`}>
                      <tech.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{tech.name}</h3>
                    <p className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wide">{tech.category}</p>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
              <CardContent className="p-8 md:p-10 text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Stack Moderno e Escalável
                </h3>
                <p className="text-base md:text-lg text-foreground leading-relaxed">
                  Utilizamos as tecnologias mais atuais e demandadas pelo mercado para garantir que você aprenda com ferramentas que realmente são usadas em projetos reais. Nosso stack é escolhido pensando em{" "}
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    performance, escalabilidade e facilidade de manutenção.
                  </span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground" data-testid="text-section-title-faq">Dúvidas mais comuns</h2>
          </motion.div>

          {faqs && faqs.length > 0 && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs
                    .filter((_, idx) => idx % 2 === 0)
                    .map((faq, idx) => (
                      <AccordionItem key={faq.id} value={`item-col1-${faq.id}`} className="border-2 border-border rounded-lg px-6 bg-card" data-testid={`accordion-item-${idx * 2}`}>
                        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline py-6 text-left" data-testid={`accordion-trigger-${idx * 2}`}>
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground pb-6 text-left" data-testid={`accordion-content-${idx * 2}`}>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </motion.div>

              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs
                    .filter((_, idx) => idx % 2 === 1)
                    .map((faq, idx) => (
                      <AccordionItem key={faq.id} value={`item-col2-${faq.id}`} className="border-2 border-border rounded-lg px-6 bg-card" data-testid={`accordion-item-${idx * 2 + 1}`}>
                        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline py-6 text-left" data-testid={`accordion-trigger-${idx * 2 + 1}`}>
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground pb-6 text-left" data-testid={`accordion-content-${idx * 2 + 1}`}>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Faça parte da comunidade</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Assinando o MeuSaas.Dev você entra em nossa comunidade exclusiva e terá acesso aos seguintes benefícios:
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: "WhatsApp de proprietários de empresas para prospectar",
                description: "Acesso exclusivo a grupos de empresários interessados em soluções SaaS",
              },
              {
                icon: BadgeDollarSign,
                title: "Técnicas de formação de preço",
                description: "Aprenda a criar suas mensalidades de forma correta e lucrativa",
              },
              {
                icon: Target,
                title: "Campanhas na Meta e Google",
                description: "Acesso a técnicas para criar campanhas eficazes e divulgar seu SaaS",
              },
              {
                icon: BarChart3,
                title: "Técnicas e materiais de prospecção",
                description: "Ferramentas e estratégias comprovadas para conquistar novos clientes",
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover-elevate border-2 border-blue-200 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mt-10">
            <Button
              onClick={handleCTA}
              size="lg"
              className="rounded-full text-lg font-bold gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Quero fazer parte da comunidade
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-black via-blue-600 to-black text-white">
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
              © 2026 {settings?.siteName || "SaaS White Label"}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {settings?.whatsapp && (
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Fale conosco pelo WhatsApp"
          data-testid="button-whatsapp-float"
        >
          <MessageCircle className="w-8 h-8" />
        </a>
      )}

      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${extractYoutubeId(selectedVideo.youtubeUrl)}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        value={297}
      />
    </div>
  );
}
