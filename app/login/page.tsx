"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { login } from "@/app/login/actions";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Usuário</Label>
              <Input
                id="email"
                name="email"
                type="text"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
              />
            </div>
            <Button formAction={login} type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <Dialog>
            <DialogTrigger>Esqueci minha senha</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Informe seu email:</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    E-mail
                  </Label>
                  <Input id="email" placeholder="Insira aqui seu e-mail" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
              <Button type="submit">Enviar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </div>
  );
}