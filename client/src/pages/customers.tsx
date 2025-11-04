import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Home, Users as UsersIcon, LogOut, Settings, Video, HelpCircle, UserCircle, CreditCard, Code2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer, Subscription } from "@shared/schema";

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

type CustomerWithSubscription = Customer & {
  hasActiveSubscription: boolean;
  activeSubscription: Subscription | null;
  totalSubscriptions: number;
};

export default function CustomersPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [editingCustomer, setEditingCustomer] = useState<CustomerWithSubscription | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const { data: currentUser, isLoading: isLoadingUser, error: authError } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
  });

  const { data: customers, isLoading: isLoadingCustomers } = useQuery<CustomerWithSubscription[]>({
    queryKey: ["/api/customers"],
    enabled: !!currentUser?.user,
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async ({ id, email, password }: { id: number; email?: string; password?: string }) => {
      const updateData: { email?: string; password?: string } = {};
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      return await apiRequest("PATCH", `/api/customers/${id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso",
      });
      handleCloseEditDialog();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar os dados do cliente",
        variant: "destructive",
      });
    },
  });

  const handleEditClick = (customer: CustomerWithSubscription) => {
    setEditingCustomer(customer);
    setEditEmail(customer.email);
    setEditPassword("");
  };

  const handleCloseEditDialog = () => {
    setEditingCustomer(null);
    setEditEmail("");
    setEditPassword("");
  };

  const handleSaveEdit = () => {
    if (!editingCustomer) return;

    if (!editEmail && !editPassword) {
      toast({
        title: "Erro de validação",
        description: "Preencha pelo menos um campo para atualizar",
        variant: "destructive",
      });
      return;
    }

    updateCustomerMutation.mutate({
      id: editingCustomer.id,
      email: editEmail !== editingCustomer.email ? editEmail : undefined,
      password: editPassword || undefined,
    });
  };

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || authError)) {
      setLocation("/login");
    }
  }, [isLoadingUser, currentUser, authError, setLocation]);

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
            <h1 className="text-3xl font-bold" data-testid="text-customers-title">
              Gerenciamento de Clientes
            </h1>
            <p className="text-muted-foreground">
              Visualize todos os clientes cadastrados e suas assinaturas
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {customers?.filter(c => c.hasActiveSubscription).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Sem Assinatura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {customers?.filter(c => !c.hasActiveSubscription).length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Cadastrados</CardTitle>
              <CardDescription>
                Lista completa de todos os clientes e status de assinatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCustomers ? (
                <p>Carregando...</p>
              ) : customers && customers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF/CNPJ</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id} data-testid={`row-customer-${customer.id}`}>
                        <TableCell className="font-medium" data-testid={`text-name-${customer.id}`}>
                          {customer.name}
                        </TableCell>
                        <TableCell data-testid={`text-email-${customer.id}`}>
                          {customer.email}
                        </TableCell>
                        <TableCell data-testid={`text-cpf-${customer.id}`}>
                          {customer.cpfCnpj}
                        </TableCell>
                        <TableCell data-testid={`text-phone-${customer.id}`}>
                          {customer.phone}
                        </TableCell>
                        <TableCell data-testid={`text-created-${customer.id}`}>
                          {format(new Date(customer.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(customer)}
                            data-testid={`button-edit-${customer.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum cliente cadastrado ainda
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && handleCloseEditDialog()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
                <DialogDescription>
                  Atualize o email e/ou senha do cliente {editingCustomer?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password">Nova Senha</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Deixe em branco para não alterar"
                  />
                  <p className="text-sm text-muted-foreground">
                    Mínimo de 6 caracteres
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseEditDialog}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={updateCustomerMutation.isPending}
                >
                  {updateCustomerMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
