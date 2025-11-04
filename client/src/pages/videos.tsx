import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Home, Users, LogOut, Settings, Video as VideoIcon, Trash2, Plus, HelpCircle, UserCircle, CreditCard, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVideoSchema, type InsertVideo, type Video } from "@shared/schema";

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
    { title: "Vídeos", icon: VideoIcon, url: "/videos" },
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

export default function VideosPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: currentUser, isLoading: isLoadingUser, error: authError } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
  });

  const { data: videos, isLoading: isLoadingVideos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
    enabled: !!currentUser?.user,
  });

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || authError)) {
      setLocation("/login");
    }
  }, [isLoadingUser, currentUser, authError, setLocation]);

  const form = useForm<InsertVideo>({
    resolver: zodResolver(insertVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      youtubeUrl: "",
      isHeroVideo: 0,
    },
  });

  const createVideoMutation = useMutation({
    mutationFn: async (data: InsertVideo) => {
      const res = await apiRequest("POST", "/api/videos", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "Vídeo criado",
        description: "O vídeo foi adicionado com sucesso",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao criar vídeo",
        description: "Verifique os dados e tente novamente",
        variant: "destructive",
      });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: number) => {
      await apiRequest("DELETE", `/api/videos/${videoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "Vídeo deletado",
        description: "O vídeo foi removido com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao deletar vídeo",
        description: "Não foi possível remover o vídeo",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: InsertVideo) {
    createVideoMutation.mutate(data);
  }

  function extractYoutubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
              <h1 className="text-3xl font-bold" data-testid="text-videos-title">
                Gerenciamento de Vídeos
              </h1>
              <p className="text-muted-foreground">
                Gerencie os vídeos exibidos na página inicial
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              data-testid="button-create-video"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Vídeo
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vídeos Cadastrados</CardTitle>
              <CardDescription>
                Vídeos exibidos na seção "Veja o Sistema em Ação"
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingVideos ? (
                <p>Carregando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos?.map((video) => (
                      <TableRow key={video.id} data-testid={`row-video-${video.id}`}>
                        <TableCell className="font-medium" data-testid={`text-title-${video.id}`}>
                          {video.title}
                        </TableCell>
                        <TableCell className="max-w-md truncate" data-testid={`text-description-${video.id}`}>
                          {video.description}
                        </TableCell>
                        <TableCell>
                          <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden">
                            {extractYoutubeId(video.youtubeUrl) && (
                              <img
                                src={`https://img.youtube.com/vi/${extractYoutubeId(video.youtubeUrl)}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {video.isHeroVideo === 1 ? (
                            <Badge className="bg-purple-500 hover:bg-purple-600">
                              Vídeo Hero
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Normal
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell data-testid={`text-date-${video.id}`}>
                          {format(new Date(video.createdAt), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteVideoMutation.mutate(video.id)}
                            data-testid={`button-delete-${video.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
            <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
            <DialogDescription>
              Adicione um vídeo do YouTube para ser exibido na página inicial
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Demonstração Completa do Sistema" data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Veja todas as funcionalidades do painel administrativo..."
                        rows={3}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do YouTube</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://www.youtube.com/watch?v=..."
                        data-testid="input-youtube-url"
                      />
                    </FormControl>
                    <FormDescription>
                      Cole o link completo do vídeo no YouTube
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isHeroVideo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value === 1}
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                        data-testid="checkbox-hero-video"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Exibir na Hero Section
                      </FormLabel>
                      <FormDescription>
                        Este vídeo será exibido na seção principal da página inicial
                      </FormDescription>
                    </div>
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
                  disabled={createVideoMutation.isPending}
                  data-testid="button-submit"
                >
                  {createVideoMutation.isPending ? "Adicionando..." : "Adicionar Vídeo"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
