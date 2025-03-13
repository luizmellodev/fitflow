"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/project/form-message";
import { SubmitButton } from "@/components/project/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
  const [isClient, setIsClient] = useState(false);

  // Só usa o `useSearchParams` no lado do cliente
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null
  );

  useEffect(() => {
    setIsClient(true); // Certifica-se de que estamos no lado do cliente
    setSearchParams(new URLSearchParams(window.location.search)); // Obtém os parâmetros de URL
  }, []);

  // Lógica de mensagem e tipo de erro
  const type = searchParams?.get("error") ? "error" : searchParams?.get("type");
  const message = searchParams?.get("error") || searchParams?.get("message");

  useEffect(() => {
    if (message) {
      if (type === "error") {
        toast.error(message);
      } else {
        toast.success(message);
      }
    }
  }, [message, type]);

  let formMessage: Message;
  if (message) {
    formMessage = type === "error" ? { error: message } : { message };
  } else {
    formMessage = { message: "" };
  }

  // Evita renderizar o componente até o cliente ser carregado
  if (!isClient) {
    return null;
  }

  return (
    <main className="min-h-screen flex justify-center items-center w-full">
      <div className="w-full max-w-md flex flex-col gap-12">
        <form className="w-full flex flex-col" action={signInAction}>
          <h1 className="text-2xl font-medium text-center">Entrar</h1>
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex flex-col gap-1">
              <Label htmlFor="email" className="text-left">
                Email
              </Label>
              <Input
                className="h-14 text-lg px-4"
                name="email"
                placeholder="teste@email.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-left">
                  Senha
                </Label>
                <Link
                  className="text-xs text-foreground underline"
                  href="/forgot-password"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                className="h-14 text-lg px-4"
                type="password"
                name="password"
                placeholder="Sua senha"
                required
              />
            </div>
            <SubmitButton pendingText="Entrando...">Sign in</SubmitButton>
            <FormMessage message={formMessage} />
          </div>
        </form>
      </div>
    </main>
  );
}
