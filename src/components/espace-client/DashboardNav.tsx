"use client";

import { Link, usePathname } from "@/navigation";
import { LayoutDashboard, RefreshCcw, ShoppingBag, ActivitySquare, Settings, Users, Wallet, LogOut, Store } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardNav({ isAmbassador = false }: { isAmbassador?: boolean }) {
  const navLinks = [
    { name: isAmbassador ? "Boutique" : "Vue d'ensemble", href: "/espace-client", icon: isAmbassador ? Store : LayoutDashboard },
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
    <nav className="mb-6 md:mb-10 overflow-x-auto hide-scrollbar border-b border-[#E8E3DC]/50 pb-1">
      <div className="flex items-center gap-2 md:gap-4 min-w-max pr-4 md:pr-0">
        <ul className="flex items-center gap-1 md:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 px-4 md:px-5 py-3 rounded-xl md:rounded-t-xl md:rounded-b-none text-[14px] md:text-[15px] transition-colors whitespace-nowrap ${
                    active
                      ? "font-semibold text-[#0F3D3E] md:border-b-2 md:border-[#0F3D3E] bg-[#0F3D3E]/5 md:bg-white/40"
                      : "font-medium text-gray-500 hover:text-[#0F3D3E] hover:bg-black/5"
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-4 md:h-4 shrink-0" />
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>
        <button 
          onClick={() => signOut({ callbackUrl: '/connexion' })}
          className="flex items-center gap-2 px-4 md:px-5 py-3 rounded-xl md:rounded-t-xl md:rounded-b-none text-[14px] md:text-[15px] transition-colors whitespace-nowrap font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
