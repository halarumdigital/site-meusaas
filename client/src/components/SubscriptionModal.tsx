import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check, CreditCard, User, MessageCircle, CheckCircle2 } from "lucide-react";
import type { Settings } from "@shared/schema";

const personalDataSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ é obrigatório"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  postalCode: z.string().optional(),
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  complement: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

const creditCardSchema = z.object({
  holderName: z.string().min(3, "Nome do titular é obrigatório"),
  number: z.string().min(13, "Número do cartão inválido"),
  expiryMonth: z.string().length(2, "Mês deve ter 2 dígitos"),
  expiryYear: z.string().length(4, "Ano deve ter 4 dígitos"),
  ccv: z.string().min(3, "CVV deve ter 3 ou 4 dígitos"),
});

type PersonalData = z.infer<typeof personalDataSchema>;
type CreditCardData = z.infer<typeof creditCardSchema>;

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  value?: number;
}

export function SubscriptionModal({ isOpen, onClose, value = 297 }: SubscriptionModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 'success'>(1);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const personalForm = useForm<PersonalData>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      name: "",
      email: "",
      cpfCnpj: "",
      phone: "",
      postalCode: "",
      address: "",
      addressNumber: "",
      complement: "",
      province: "",
      city: "",
      state: "",
    },
  });

  const creditCardForm = useForm<CreditCardData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      holderName: "",
      number: "",
      expiryMonth: "",
      expiryYear: "",
      ccv: "",
    },
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: PersonalData & { creditCard: CreditCardData }) => {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          value: value,
          cycle: "MONTHLY",
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao criar assinatura");
      }

      return await res.json();
    },
    onSuccess: () => {
      setStep('success');
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar assinatura",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function handleClose() {
    setTimeout(() => {
      setStep(1);
      setPersonalData(null);
      personalForm.reset();
      creditCardForm.reset();
    }, 300); // Aguarda animação de fechamento
    onClose();
  }

  function onPersonalDataSubmit(data: PersonalData) {
    setPersonalData(data);
    setStep(2);
  }

  function onCreditCardSubmit(data: CreditCardData) {
    if (personalData) {
      createSubscriptionMutation.mutate({
        ...personalData,
        creditCard: data,
      });
    }
  }

  function handleBack() {
    setStep(1);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        {step !== 'success' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {step === 1 ? (
                  <>
                    <User className="w-5 h-5" />
                    Dados Pessoais
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Dados do Cartão
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {step === 1
                  ? "Preencha seus dados pessoais para continuar"
                  : "Informe os dados do cartão de crédito para finalizar"}
              </DialogDescription>
            </DialogHeader>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 py-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"}`}>
                {step === 1 ? "1" : <Check className="w-4 h-4" />}
              </div>
              <div className={`w-16 h-1 ${step === 2 ? "bg-primary" : "bg-gray-200"}`} />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"}`}>
                2
              </div>
            </div>
          </>
        ) : null}

        {/* Step 1: Personal Data */}
        {step === 1 && (
          <Form {...personalForm}>
            <form onSubmit={personalForm.handleSubmit(onPersonalDataSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={personalForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="João da Silva" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="joao@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="cpfCnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="000.000.000-00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(11) 99999-9999" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="00000-000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Rua, Avenida..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="addressNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="São Paulo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SP" maxLength={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Próximo
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {/* Success Screen */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-green-600">
                Sua assinatura foi feita com sucesso!
              </h2>
              <p className="text-lg text-gray-700">
                Obrigado por confiar em nós!
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg text-center max-w-md space-y-4">
              <p className="text-gray-800">
                Você está a <strong>um passo</strong> de ter seu próprio <strong>SAAS</strong>!
              </p>
              <p className="text-gray-700">
                Para continuarmos, entre em contato pelo WhatsApp com a nossa equipe para fazermos a configuração do seu sistema.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white gap-2"
              onClick={() => {
                const whatsapp = settings?.whatsapp || "5511999999999";
                const message = encodeURIComponent("Olá! Acabei de assinar o sistema e gostaria de fazer a configuração.");
                window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Entrar em Contato no WhatsApp
            </Button>

            <Button
              variant="outline"
              onClick={handleClose}
              className="mt-4"
            >
              Fechar
            </Button>
          </div>
        )}

        {/* Step 2: Credit Card */}
        {step === 2 && (
          <Form {...creditCardForm}>
            <form onSubmit={creditCardForm.handleSubmit(onCreditCardSubmit)} className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Valor da Assinatura:</strong> R$ {value.toFixed(2)}/mês
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  A primeira cobrança será processada após a confirmação
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={creditCardForm.control}
                  name="holderName"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nome do Titular do Cartão *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="NOME COMO NO CARTÃO" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={creditCardForm.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Número do Cartão *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0000 0000 0000 0000" maxLength={16} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={creditCardForm.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mês de Validade *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MM" maxLength={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={creditCardForm.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano de Validade *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="AAAA" maxLength={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={creditCardForm.control}
                  name="ccv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123" maxLength={4} />
                      </FormControl>
                      <FormDescription>
                        Código de segurança no verso do cartão
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 w-4 h-4" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={createSubscriptionMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createSubscriptionMutation.isPending ? "Processando..." : "Finalizar Assinatura"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
