import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Home, Users as UsersIcon, LogOut, Settings, Video, HelpCircle, UserCircle, CreditCard, XCircle, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Customer, Subscription } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function AppSidebar() {
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
      setLocation("/login");
    },
  });

  const menuItems = [
    { title: "Dashboard", icon: Home, url: "/dashboard" },
    { title: "Usuários", icon: UsersIcon, url: "/dashboard" },
    { title: "Clientes", icon: UserCircle, url: "/customers" },
    { title: "Assinaturas", icon: CreditCard, url: "/subscriptions" },
    { title: "Vídeos", icon: Video, url: "/videos" },
    { title: "FAQ", icon: HelpCircle, url: "/faqs" },
    { title: "Scripts", icon: Code2, url: "/scripts" },
    { title: "Configurações", icon: Settings, url: "/settings" },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-testid={`nav-${item.title.toLowerCase()}`}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => logoutMutation.mutate()}
                  data-testid="button-logout"
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

type AuthUser = {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
};

type SubscriptionWithCustomer = Subscription & {
  customer: Customer | null;
};

export default function SubscriptionsPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<SubscriptionWithCustomer | null>(null);

  const { data: currentUser, isLoading: isLoadingUser, error: authError } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
  });

  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery<SubscriptionWithCustomer[]>({
    queryKey: ["/api/subscriptions"],
    enabled: !!currentUser?.user,
  });

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || authError)) {
      setLocation("/login");
    }
  }, [isLoadingUser, currentUser, authError, setLocation]);

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      await apiRequest("DELETE", `/api/subscriptions/${subscriptionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Assinatura cancelada",
        description: "A assinatura foi cancelada com sucesso no Asaas",
      });
      setSubscriptionToCancel(null);
    },
    onError: () => {
      toast({
        title: "Erro ao cancelar assinatura",
        description: "Não foi possível cancelar a assinatura",
        variant: "destructive",
      });
    },
  });

  if (isLoadingUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!currentUser?.user) {
    return null;
  }

  if (currentUser.user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar esta página</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const activeSubscriptions = subscriptions?.filter(s => s.status === "ACTIVE") || [];
  const totalValue = activeSubscriptions.reduce((sum, sub) => sum + sub.value, 0);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold" data-testid="text-subscriptions-title">
              Gerenciamento de Assinaturas
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todas as assinaturas ativas e canceladas
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total de Assinaturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscriptions?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {activeSubscriptions.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Valor Total (Ativas)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  R$ {totalValue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assinaturas Cadastradas</CardTitle>
              <CardDescription>
                Lista completa de todas as assinaturas e seus status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSubscriptions ? (
                <p>Carregando...</p>
              ) : subscriptions && subscriptions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Ciclo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Próx. Vencimento / Cancelamento</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription) => (
                      <TableRow key={subscription.id} data-testid={`row-subscription-${subscription.id}`}>
                        <TableCell className="font-medium" data-testid={`text-name-${subscription.id}`}>
                          {subscription.customer?.name || "N/A"}
                        </TableCell>
                        <TableCell data-testid={`text-email-${subscription.id}`}>
                          {subscription.customer?.email || "N/A"}
                        </TableCell>
                        <TableCell data-testid={`text-value-${subscription.id}`}>
                          R$ {subscription.value.toFixed(2)}
                        </TableCell>
                        <TableCell data-testid={`text-cycle-${subscription.id}`}>
                          {subscription.cycle === "MONTHLY" && "Mensal"}
                          {subscription.cycle === "QUARTERLY" && "Trimestral"}
                          {subscription.cycle === "SEMIANNUALLY" && "Semestral"}
                          {subscription.cycle === "YEARLY" && "Anual"}
                        </TableCell>
                        <TableCell data-testid={`badge-status-${subscription.id}`}>
                          {subscription.status === "ACTIVE" ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              Ativa
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Cancelada
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell data-testid={`text-due-date-${subscription.id}`}>
                          {subscription.status === "ACTIVE" ? (
                            format(new Date(subscription.nextDueDate), "dd/MM/yyyy", { locale: ptBR })
                          ) : subscription.canceledAt ? (
                            <span className="text-red-600">
                              Cancelada: {format(new Date(subscription.canceledAt), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell data-testid={`text-created-${subscription.id}`}>
                          {format(new Date(subscription.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSubscriptionToCancel(subscription)}
                            disabled={subscription.status !== "ACTIVE"}
                            data-testid={`button-cancel-${subscription.id}`}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma assinatura cadastrada ainda
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <AlertDialog open={!!subscriptionToCancel} onOpenChange={() => setSubscriptionToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Assinatura</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a assinatura de{" "}
              <strong>{subscriptionToCancel?.customer?.name}</strong>?
              <br />
              <br />
              Esta ação irá cancelar a assinatura no Asaas e não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (subscriptionToCancel) {
                  cancelSubscriptionMutation.mutate(subscriptionToCancel.id);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
