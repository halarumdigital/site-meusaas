import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Home, Users, LogOut, Settings, Video, HelpCircle, Trash2, Plus, Edit, UserCircle, CreditCard, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFaqSchema, type InsertFaq, type Faq } from "@shared/schema";

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
    { title: "Usuários", icon: Users, url: "/dashboard" },
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

export default function FaqsPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  const { data: currentUser, isLoading: isLoadingUser, error: authError } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
  });

  const { data: faqs, isLoading: isLoadingFaqs } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
    enabled: !!currentUser?.user,
  });

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || authError)) {
      setLocation("/login");
    }
  }, [isLoadingUser, currentUser, authError, setLocation]);

  const createForm = useForm<InsertFaq>({
    resolver: zodResolver(insertFaqSchema),
    defaultValues: {
      question: "",
      answer: "",
      displayOrder: 0,
    },
  });

  const editForm = useForm<InsertFaq>({
    resolver: zodResolver(insertFaqSchema),
    defaultValues: {
      question: "",
      answer: "",
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (editingFaq) {
      editForm.reset({
        question: editingFaq.question,
        answer: editingFaq.answer,
        displayOrder: editingFaq.displayOrder,
      });
    }
  }, [editingFaq, editForm]);

  const createFaqMutation = useMutation({
    mutationFn: async (data: InsertFaq) => {
      const res = await apiRequest("POST", "/api/faqs", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({
        title: "FAQ criado",
        description: "A pergunta foi adicionada com sucesso",
      });
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao criar FAQ",
        description: "Verifique os dados e tente novamente",
        variant: "destructive",
      });
    },
  });

  const updateFaqMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertFaq }) => {
      const res = await apiRequest("PUT", `/api/faqs/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({
        title: "FAQ atualizado",
        description: "A pergunta foi atualizada com sucesso",
      });
      setIsEditDialogOpen(false);
      setEditingFaq(null);
      editForm.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar FAQ",
        description: "Verifique os dados e tente novamente",
        variant: "destructive",
      });
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (faqId: number) => {
      await apiRequest("DELETE", `/api/faqs/${faqId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({
        title: "FAQ deletado",
        description: "A pergunta foi removida com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao deletar FAQ",
        description: "Não foi possível remover a pergunta",
        variant: "destructive",
      });
    },
  });

  function onCreateSubmit(data: InsertFaq) {
    createFaqMutation.mutate(data);
  }

  function onEditSubmit(data: InsertFaq) {
    if (editingFaq) {
      updateFaqMutation.mutate({ id: editingFaq.id, data });
    }
  }

  function handleEdit(faq: Faq) {
    setEditingFaq(faq);
    setIsEditDialogOpen(true);
  }

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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-faqs-title">
                Gerenciamento de FAQ
              </h1>
              <p className="text-muted-foreground">
                Gerencie as perguntas frequentes exibidas na página inicial
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              data-testid="button-create-faq"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Pergunta
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Perguntas Cadastradas</CardTitle>
              <CardDescription>
                Perguntas exibidas na seção "Dúvidas mais comuns"
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFaqs ? (
                <p>Carregando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Ordem</TableHead>
                      <TableHead>Pergunta</TableHead>
                      <TableHead>Resposta</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faqs?.map((faq) => (
                      <TableRow key={faq.id} data-testid={`row-faq-${faq.id}`}>
                        <TableCell className="font-medium" data-testid={`text-order-${faq.id}`}>
                          {faq.displayOrder}
                        </TableCell>
                        <TableCell className="max-w-md" data-testid={`text-question-${faq.id}`}>
                          {faq.question}
                        </TableCell>
                        <TableCell className="max-w-lg truncate" data-testid={`text-answer-${faq.id}`}>
                          {faq.answer}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(faq)}
                              data-testid={`button-edit-${faq.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteFaqMutation.mutate(faq.id)}
                              data-testid={`button-delete-${faq.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Pergunta</DialogTitle>
            <DialogDescription>
              Adicione uma nova pergunta frequente para ser exibida na página inicial
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pergunta</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Digite a pergunta..." rows={2} data-testid="input-question" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resposta</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Digite a resposta..."
                        rows={4}
                        data-testid="input-answer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem de Exibição</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        placeholder="0"
                        data-testid="input-order"
                      />
                    </FormControl>
                    <FormDescription>
                      Define a ordem em que a pergunta será exibida (0 = primeira)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createFaqMutation.isPending}
                  data-testid="button-submit"
                >
                  {createFaqMutation.isPending ? "Adicionando..." : "Adicionar Pergunta"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pergunta</DialogTitle>
            <DialogDescription>
              Edite a pergunta frequente
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pergunta</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Digite a pergunta..." rows={2} data-testid="input-edit-question" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resposta</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Digite a resposta..."
                        rows={4}
                        data-testid="input-edit-answer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem de Exibição</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        placeholder="0"
                        data-testid="input-edit-order"
                      />
                    </FormControl>
                    <FormDescription>
                      Define a ordem em que a pergunta será exibida (0 = primeira)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingFaq(null);
                  }}
                  data-testid="button-edit-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateFaqMutation.isPending}
                  data-testid="button-edit-submit"
                >
                  {updateFaqMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
