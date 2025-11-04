import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LogOut, User, CreditCard, Mail, Phone, FileText, CheckCircle, XCircle, Home, ShoppingBag } from "lucide-react";
import type { Customer, Subscription } from "@shared/schema";

type CustomerDashboardData = {
  customer: Customer;
  subscriptions: Subscription[];
  activeSubscription: Subscription | null;
  hasActiveSubscription: boolean;
};

type AuthCustomer = {
  customer: {
    id: number;
    email: string;
    name: string;
    cpfCnpj: string;
    phone: string;
  };
};

interface CustomerSidebarProps {
  activeMenu: "inicio" | "assinatura" | "pedidos";
  onMenuChange: (menu: "inicio" | "assinatura" | "pedidos") => void;
}

function CustomerSidebar({ activeMenu, onMenuChange }: CustomerSidebarProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      setLocation("/customer/login");
    },
  });

  const menuItems = [
    { title: "Início", icon: Home, value: "inicio" as const },
    { title: "Assinatura", icon: CreditCard, value: "assinatura" as const },
    { title: "Pedidos", icon: ShoppingBag, value: "pedidos" as const },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onMenuChange(item.value)}
                    className={activeMenu === item.value ? "bg-accent" : ""}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function CustomerDashboardPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeMenu, setActiveMenu] = useState<"inicio" | "assinatura" | "pedidos">("inicio");

  const { data: currentCustomer, isLoading: isLoadingAuth, error: authError } = useQuery<AuthCustomer>({
    queryKey: ["/api/customer/auth/me"],
  });

  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery<CustomerDashboardData>({
    queryKey: ["/api/customer/dashboard"],
    enabled: !!currentCustomer?.customer,
  });

  useEffect(() => {
    if (!isLoadingAuth && (!currentCustomer || authError)) {
      setLocation("/customer/login");
    }
  }, [isLoadingAuth, currentCustomer, authError, setLocation]);

  if (isLoadingAuth || isLoadingDashboard) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!currentCustomer?.customer || !dashboardData) {
    return null;
  }

  const { customer, activeSubscription, hasActiveSubscription } = dashboardData;

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <CustomerSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeMenu === "inicio" && "Meu Dashboard"}
                  {activeMenu === "assinatura" && "Minha Assinatura"}
                  {activeMenu === "pedidos" && "Meus Pedidos"}
                </h1>
                <p className="text-sm text-gray-500">Bem-vindo, {customer.name}!</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {/* Menu Início */}
            {activeMenu === "inicio" && (
              <div className="grid gap-6 md:grid-cols-2">
          {/* Card de Status da Assinatura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Status da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasActiveSubscription && activeSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-lg font-semibold text-green-700">
                      Assinatura Ativa
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor Mensal:</span>
                      <span className="font-semibold">
                        R$ {activeSubscription.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Próximo Vencimento:</span>
                      <span className="font-semibold">
                        {format(new Date(activeSubscription.nextDueDate), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ciclo:</span>
                      <span className="font-semibold">
                        {activeSubscription.cycle === "MONTHLY" ? "Mensal" : activeSubscription.cycle}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Forma de Pagamento:</span>
                      <span className="font-semibold">
                        {activeSubscription.billingType === "CREDIT_CARD" ? "Cartão de Crédito" : activeSubscription.billingType}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-lg font-semibold text-red-700">
                    Sem Assinatura Ativa
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Meus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Nome Completo</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">CPF/CNPJ</p>
                  <p className="font-medium">{customer.cpfCnpj}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Histórico */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Histórico de Assinaturas</CardTitle>
              <CardDescription>
                Todas as suas assinaturas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.subscriptions.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            Assinatura #{sub.id}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              sub.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {sub.status === "ACTIVE" ? "Ativa" : "Inativa"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Criada em {format(new Date(sub.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          R$ {sub.value.toFixed(2)}/mês
                        </div>
                        {sub.status === "ACTIVE" && (
                          <div className="text-sm text-gray-600">
                            Próx: {format(new Date(sub.nextDueDate), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma assinatura encontrada
                </p>
              )}
            </CardContent>
          </Card>
              </div>
            )}

            {/* Menu Assinatura */}
            {activeMenu === "assinatura" && (
              <div className="grid gap-6 md:grid-cols-2">
          {/* Card de Status da Assinatura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Status da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasActiveSubscription && activeSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-lg font-semibold text-green-700">
                      Assinatura Ativa
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor Mensal:</span>
                      <span className="font-semibold">
                        R$ {activeSubscription.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Próximo Vencimento:</span>
                      <span className="font-semibold">
                        {format(new Date(activeSubscription.nextDueDate), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ciclo:</span>
                      <span className="font-semibold">
                        {activeSubscription.cycle === "MONTHLY" ? "Mensal" : activeSubscription.cycle}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Forma de Pagamento:</span>
                      <span className="font-semibold">
                        {activeSubscription.billingType === "CREDIT_CARD" ? "Cartão de Crédito" : activeSubscription.billingType}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-lg font-semibold text-red-700">
                    Sem Assinatura Ativa
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Meus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Nome Completo</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">CPF/CNPJ</p>
                  <p className="font-medium">{customer.cpfCnpj}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Histórico */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Histórico de Assinaturas</CardTitle>
              <CardDescription>
                Todas as suas assinaturas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.subscriptions.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            Assinatura #{sub.id}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              sub.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {sub.status === "ACTIVE" ? "Ativa" : "Inativa"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Criada em {format(new Date(sub.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          R$ {sub.value.toFixed(2)}/mês
                        </div>
                        {sub.status === "ACTIVE" && (
                          <div className="text-sm text-gray-600">
                            Próx: {format(new Date(sub.nextDueDate), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma assinatura encontrada
                </p>
              )}
            </CardContent>
          </Card>
              </div>
            )}

            {/* Menu Pedidos */}
            {activeMenu === "pedidos" && (
              <div className="max-w-6xl">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Histórico de Pedidos
                    </CardTitle>
                    <CardDescription>
                      Todos os seus pedidos e transações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.subscriptions.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardData.subscriptions.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  Pedido #{sub.id}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    sub.status === "ACTIVE"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {sub.status === "ACTIVE" ? "Ativa" : "Inativa"}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Criado em {format(new Date(sub.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                ID: {sub.asaasSubscriptionId}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-lg">
                                R$ {sub.value.toFixed(2)}
                              </div>
                              {sub.status === "ACTIVE" && (
                                <div className="text-sm text-gray-600">
                                  Próximo: {format(new Date(sub.nextDueDate), "dd/MM/yyyy", { locale: ptBR })}
                                </div>
                              )}
                              {sub.canceledAt && (
                                <div className="text-sm text-red-600">
                                  Cancelado em {format(new Date(sub.canceledAt), "dd/MM/yyyy", { locale: ptBR })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-lg">
                          Nenhum pedido encontrado
                        </p>
                        <p className="text-gray-400 text-sm">
                          Seus pedidos aparecerão aqui quando você fizer uma compra
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
