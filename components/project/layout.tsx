"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/project/header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Dumbbell, Menu, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    }

    getUser();
  }, []);

  const menuItems = [
    { href: "/admin", label: "Início", icon: Home },
    { href: "/manage-users", label: "Gerenciar Usuários", icon: Users },
    { href: "/manage-workouts", label: "Gerenciar Treinos", icon: Calendar },
    {
      href: "/manage-exercises",
      label: "Gerenciar Exercícios",
      icon: Dumbbell,
    },
  ];

  return (
    <div className="flex h-screen">
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        } flex flex-col`}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex justify-center"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav className="space-y-2 mt-4 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${
                pathname === item.href ? "bg-gray-700" : ""
              } ${isExpanded ? "px-4" : "justify-center"}`}
            >
              <item.icon className="h-5 w-5" />
              {isExpanded && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-col flex-1">
        <nav className="w-full border-b border-b-foreground/10 h-16 flex items-center">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm mx-auto">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Next.js Supabase Starter</Link>
            </div>
            <Header user={user} setUser={setUser} isLoading={isLoading} />
          </div>
        </nav>

        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
