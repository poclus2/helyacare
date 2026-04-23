"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, RefreshCcw, ShoppingBag, ActivitySquare, Settings } from "lucide-react";

export default function DashboardNav({ locale }: { locale: string }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Vue d’ensemble", href: `/${locale}/espace-client`, icon: LayoutDashboard },
    { name: "Abonnement", href: `/${locale}/espace-client/abonnement`, icon: RefreshCcw },
    { name: "Commandes", href: `/${locale}/espace-client/commandes`, icon: ShoppingBag },
    { name: "Bilan", href: `/${locale}/espace-client/bilan`, icon: ActivitySquare },
    { name: "Paramètres", href: `/${locale}/espace-client/parametres`, icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}/espace-client`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="mb-10 overflow-x-auto hide-scrollbar">
      <ul className="flex items-center gap-2 border-b border-[#E8E3DC]/50 pb-1">
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
    </nav>
  );
}
