import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Home, Users, LogOut, Settings as SettingsIcon, Video, HelpCircle, UserCircle, CreditCard, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Settings } from "@shared/schema";

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
    { title: "Configurações", icon: SettingsIcon, url: "/settings" },
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

const scriptsFormSchema = z.object({
  facebookPixel: z.string().optional().or(z.literal("")),
  googleAnalytics: z.string().optional().or(z.literal("")),
});

type ScriptsFormValues = z.infer<typeof scriptsFormSchema>;

export default function ScriptsPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: currentUser, isLoading: isLoadingUser, error: authError } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || authError)) {
      setLocation("/login");
    }
  }, [isLoadingUser, currentUser, authError, setLocation]);

  const form = useForm<ScriptsFormValues>({
    resolver: zodResolver(scriptsFormSchema),
    defaultValues: {
      facebookPixel: settings?.facebookPixel || "",
      googleAnalytics: settings?.googleAnalytics || "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        facebookPixel: settings.facebookPixel || "",
        googleAnalytics: settings.googleAnalytics || "",
      });
    }
  }, [settings, form]);

  const updateScriptsMutation = useMutation({
    mutationFn: async (data: ScriptsFormValues) => {
      return await apiRequest("POST", "/api/settings/scripts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Scripts atualizados",
        description: "Os scripts de tracking foram salvos com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar scripts",
        description: "Verifique os dados e tente novamente",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ScriptsFormValues) {
    updateScriptsMutation.mutate(data);
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold" data-testid="text-scripts-title">
              Scripts de Tracking
            </h1>
            <p className="text-muted-foreground">
              Configure os scripts de rastreamento para medir conversões
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuração de Scripts</CardTitle>
              <CardDescription>
                Adicione os IDs do Facebook Pixel e Google Analytics para rastrear as conversões do seu site
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSettings ? (
                <p>Carregando...</p>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="facebookPixel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Pixel ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="123456789012345" data-testid="input-facebook-pixel" />
                          </FormControl>
                          <FormDescription>
                            Cole o ID do seu Facebook Pixel. Exemplo: 123456789012345
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="googleAnalytics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Analytics ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="G-XXXXXXXXXX ou UA-XXXXXXXXX-X" data-testid="input-google-analytics" />
                          </FormControl>
                          <FormDescription>
                            Cole o ID do Google Analytics. Exemplo: G-XXXXXXXXXX (GA4) ou UA-XXXXXXXXX-X (Universal Analytics)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-2">Como configurar:</h3>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div>
                          <strong>Facebook Pixel:</strong>
                          <ol className="list-decimal ml-5 mt-1">
                            <li>Acesse o Gerenciador de Eventos do Facebook</li>
                            <li>Selecione seu Pixel</li>
                            <li>Copie o ID do Pixel (apenas números)</li>
                          </ol>
                        </div>
                        <div className="mt-3">
                          <strong>Google Analytics:</strong>
                          <ol className="list-decimal ml-5 mt-1">
                            <li>Acesse sua conta do Google Analytics</li>
                            <li>Vá em Administrador {'>'} Propriedade {'>'} Informações de acompanhamento</li>
                            <li>Copie o ID de acompanhamento (G-XXXXXXXXXX ou UA-XXXXXXXXX-X)</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={updateScriptsMutation.isPending}
                      data-testid="button-save-scripts"
                    >
                      {updateScriptsMutation.isPending ? "Salvando..." : "Salvar Scripts"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}
