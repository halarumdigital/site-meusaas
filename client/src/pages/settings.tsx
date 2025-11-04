import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Home, Users, LogOut, Settings as SettingsIcon, Upload, Video, HelpCircle, UserCircle, CreditCard, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
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

const settingsFormSchema = z.object({
  siteName: z.string().min(1, "Nome do site é obrigatório"),
  whatsapp: z.string().regex(/^\d{10,15}$/, "WhatsApp deve conter apenas números (10-15 dígitos)").optional().or(z.literal("")),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      siteName: settings?.siteName || "MeuSaaS",
      whatsapp: settings?.whatsapp || "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName,
        whatsapp: settings.whatsapp || "",
      });
      if (settings.faviconPath) {
        setPreviewUrl(settings.faviconPath);
      }
    }
  }, [settings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SettingsFormValues & { favicon?: File }) => {
      const formData = new FormData();
      formData.append("siteName", data.siteName);
      formData.append("whatsapp", data.whatsapp || "");

      if (data.favicon) {
        formData.append("favicon", data.favicon);
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar configurações");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Configurações atualizadas",
        description: "As configurações foram salvas com sucesso",
      });
      setSelectedFile(null);
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar configurações",
        description: "Verifique os dados e tente novamente",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: SettingsFormValues) {
    updateSettingsMutation.mutate({
      ...data,
      favicon: selectedFile || undefined,
    });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            <h1 className="text-3xl font-bold" data-testid="text-settings-title">
              Configurações do Site
            </h1>
            <p className="text-muted-foreground">
              Configure as informações gerais do seu site
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Personalize o nome e ícone do seu site
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
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Site</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="MeuSaaS" data-testid="input-site-name" />
                          </FormControl>
                          <FormDescription>
                            Este nome aparecerá na aba do navegador e no rodapé do site
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="5511999999999" data-testid="input-whatsapp" />
                          </FormControl>
                          <FormDescription>
                            Digite apenas números com DDI e DDD (ex: 5511999999999)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Favicon</FormLabel>
                      <FormDescription>
                        Envie o ícone que aparecerá na aba do navegador (formatos: PNG, JPG, ICO, SVG - máx: 2MB)
                      </FormDescription>
                      <div className="flex items-center gap-4">
                        {previewUrl && (
                          <div className="w-16 h-16 border rounded flex items-center justify-center bg-white">
                            <img
                              src={previewUrl}
                              alt="Preview do favicon"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/gif,image/x-icon,image/svg+xml"
                            onChange={handleFileChange}
                            className="hidden"
                            data-testid="input-favicon"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            data-testid="button-upload-favicon"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {selectedFile ? selectedFile.name : "Selecionar arquivo"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={updateSettingsMutation.isPending}
                      data-testid="button-save-settings"
                    >
                      {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
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
