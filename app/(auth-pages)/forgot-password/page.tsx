import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/project/form-message";
import { SubmitButton } from "@/components/project/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main className="min-h-screen flex justify-center items-center w-full">
      <div className="w-full max-w-md flex flex-col items-center">
        <form className="w-full flex flex-col gap-6 text-foreground">
          <div className="text-center">
            <h1 className="text-2xl font-medium">Mudar sua senha</h1>
            <p className="text-sm text-secondary-foreground">
              Já tem uma conta?{" "}
              <Link className="text-primary underline" href="/">
                Entrar com sua conta.
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="email" className="text-left">
              Email
            </Label>
            <Input
              className="h-14 text-lg px-4"
              name="email"
              placeholder="you@example.com"
              required
            />
            <SubmitButton formAction={forgotPasswordAction}>
              Mudar a senha
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </main>
  );
}
