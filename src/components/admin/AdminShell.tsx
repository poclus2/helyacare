"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import {
  LayoutDashboard, ShoppingBag, Users, Wallet,
  LogOut, ShieldCheck, Menu, ChevronRight, Package, CreditCard
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/depots", label: "Dépôts Manuels", icon: CreditCard },
  { href: "/admin/retraits", label: "Retraits MLM", icon: Wallet },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="flex flex-col h-full bg-[#0A1628] border-r border-white/5 w-64">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#CBF27A] rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#0F3D3E]" />
          </div>
          <div>
            <p className={`text-white font-extrabold text-base tracking-tight uppercase ${inter.className}`}>
              HelyaCare
            </p>
            <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-[#CBF27A] text-[#0F3D3E]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-white/5 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/30 hover:text-white/50 hover:bg-white/5 transition-all mb-1"
        >
          Voir le site →
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage = navItems.find(n => pathname === n.href || pathname.startsWith(n.href + "/"))?.label || "Admin";

  return (
    <div className={`flex min-h-screen bg-[#0D1B2E] ${inter.className}`}>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-64 h-full shrink-0">
            <SidebarContent onLinkClick={() => setMobileOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[#0A1628]/90 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-white/50 hover:text-white transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-white/40 text-sm font-medium">{currentPage}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#CBF27A]/15 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#CBF27A]" />
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
