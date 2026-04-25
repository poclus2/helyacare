"use client";

import { Link, usePathname } from "@/navigation";
import { LayoutDashboard, RefreshCcw, ShoppingBag, ActivitySquare, Settings, Users, Wallet, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardNav({ isAmbassador = false }: { isAmbassador?: boolean }) {
  const navLinks = [
    { name: "Vue d'ensemble", href: "/espace-client", icon: LayoutDashboard },
    ...(isAmbassador ? [
      { name: "Réseau MLM", href: "/espace-client/dashboard", icon: Users },
      { name: "Wallet", href: "/espace-client/ambassadeur", icon: Wallet },
    ] : []),
    { name: "Abonnement", href: "/espace-client/abonnement", icon: RefreshCcw },
    { name: "Commandes", href: "/espace-client/commandes", icon: ShoppingBag },
    { name: "Bilan", href: "/espace-client/bilan", icon: ActivitySquare },
    { name: "Paramètres", href: "/espace-client/parametres", icon: Settings },
  ];



  const pathname = usePathname(); // retourne le chemin sans préfixe de locale

  const isActive = (href: string) => {
    if (href === "/espace-client") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="mb-10 overflow-x-auto hide-scrollbar flex items-center justify-between border-b border-[#E8E3DC]/50 pb-1">
      <ul className="flex items-center gap-2">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          const Icon = link.icon;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-[15px] transition-colors whitespace-nowrap ${
                  active
                    ? "font-semibold text-[#0F3D3E] border-b-2 border-[#0F3D3E] bg-white/40"
                    : "font-medium text-gray-400 hover:text-[#0F3D3E] hover:bg-black/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <button 
        onClick={() => signOut({ callbackUrl: '/connexion' })}
        className="flex items-center gap-2 px-5 py-3 rounded-t-xl text-[15px] transition-colors whitespace-nowrap font-medium text-red-400 hover:text-red-600 hover:bg-red-50/50"
      >
        <LogOut className="w-4 h-4" />
        Déconnexion
      </button>
    </nav>
  );
}
