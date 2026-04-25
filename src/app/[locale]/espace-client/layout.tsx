import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import DashboardNav from "@/components/espace-client/DashboardNav";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Link } from "@/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

function HelycaLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      <div className="w-8 h-8 bg-[#0F3D3E] rounded flex items-center justify-center">
        <Image 
          src="/logo-white.png" 
          alt="HelyaCare Logo" 
          width={20} 
          height={20} 
          className="object-contain" 
          unoptimized
        />
      </div>
      <span className={`text-[#0F3D3E] text-xl font-bold tracking-tight uppercase ${inter.className}`}>
        Helyacare
      </span>
    </Link>
  );
}

export default async function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Route Protection (now handled by middleware.ts, but we check here as fallback)
  if (!session?.medusa_token) {
    redirect("/connexion");
  }

  const token = session?.medusa_token as string;
  const customerId = (session.customer_id as string) || "";
  // @ts-ignore
  const firstName = session.first_name as string;
  const role = (session.role as string) || "customer";
  const displayId = firstName ? firstName : (customerId.includes('_') ? customerId.split('_')[1] : (customerId || "GUEST"));

  // Déterminé directement depuis le JWT — pas d'appel réseau supplémentaire
  const isAmbassador = role === "ambassadeur";

  return (
    <div className={`flex flex-col min-h-screen bg-[#F6F4F1] ${pjs.className}`}>
      {/* HEADER DASHBOARD */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <HelycaLogo />
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div>
            <span className="text-gray-500 text-sm font-medium tracking-wide">
              Espace <span className="font-bold text-[#E56B2D] capitalize">{displayId}</span>
            </span>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/boutique" className="text-sm font-semibold text-gray-600 hover:text-[#0F3D3E] transition-colors">Boutique</Link>
          <Link href="/espace-client/bilan" className="text-sm font-semibold text-[#E56B2D] hover:text-[#0F3D3E] transition-colors">Mon Bilan IA</Link>
          <div className="w-10 h-10 bg-[#0F3D3E] text-white rounded-full flex items-center justify-center font-bold shadow-md cursor-pointer hover:scale-105 transition-transform">
            {displayId.charAt(0).toUpperCase()}
          </div>
        </nav>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-10">
        <div className="mb-10">
          <h1 className={`text-4xl font-extrabold text-[#0F3D3E] mb-3 ${inter.className}`}>
            Laboratoire Personnel
          </h1>
          <p className="text-gray-500 text-lg">
            Bienvenue dans votre espace HelyaCare, <span className="font-semibold text-[#E56B2D] capitalize">{displayId}</span>.
          </p>
        </div>

        {/* Client-side Navigation Menu */}
        <DashboardNav isAmbassador={isAmbassador} />

        {/* Page Content */}
        <div className="w-full">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
