import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();

  // Route protection
  if (!session?.medusa_token) {
    redirect(`/${locale}/connexion`);
  }

  // Ensure role is ambassador or handle accordingly
  // if (session.role !== "ambassadeur") {
  //   redirect(`/${locale}/espace-client`);
  // }

  return (
    <div className="flex min-h-screen bg-[#F6F4F1]">
      {/* Placeholder for Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E8E3DC] hidden md:block">
        <div className="p-6">
          <h2 className="font-bold text-[#0F3D3E] text-xl">Dashboard</h2>
        </div>
        <nav className="px-4 py-2 flex flex-col gap-2">
          {/* Nav Items */}
          <div className="p-3 bg-[#F6F4F1] rounded-lg text-sm font-semibold text-[#0F3D3E]">Vue d'ensemble</div>
          <div className="p-3 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors cursor-pointer">Mon Réseau</div>
          <div className="p-3 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors cursor-pointer">Revenus & Retraits</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Placeholder for top header */}
        <header className="h-[70px] bg-white border-b border-[#E8E3DC] flex items-center px-8">
          <h1 className="text-lg font-semibold text-[#0F3D3E]">Ambassadeur {session.customer_id}</h1>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
