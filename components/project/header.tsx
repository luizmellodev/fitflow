"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Header({
  user,
  setUser,
  isLoading,
}: {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/");
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-6 w-32 bg-gray-300 animate-pulse rounded" />
        <div className="h-8 w-20 bg-gray-300 animate-pulse rounded" />
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span>Hey, {user.email}!</span>
      <Button onClick={handleSignOut} variant="outline">
        Sair
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Entrar</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Registrar</Link>
      </Button>
    </div>
  );
}
