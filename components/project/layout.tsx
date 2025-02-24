"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Dumbbell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/manage-users", label: "Gerenciar Usuários", icon: Users },
    { href: "/manage-workouts", label: "Gerenciar Exercícios", icon: Dumbbell },
  ];

  return (
    <div className="flex h-screen">
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        }`}
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
        <nav className="space-y-2 mt-4">
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
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
