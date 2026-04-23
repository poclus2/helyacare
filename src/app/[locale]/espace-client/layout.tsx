import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import DashboardNav from "@/components/espace-client/DashboardNav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default async function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Route Protection (TEMPORARILY DISABLED FOR TESTING)
  /*
  if (!session?.medusa_token || !session?.customer_id) {
    redirect(`/${locale}/connexion`);
  }
  */

  const customerId = session?.customer_id || "cus_test_user123";

  return (
    <div className={`flex flex-col min-h-screen bg-[#F6F4F1] ${pjs.className}`}>
      <div className="flex-1 p-6 md:p-12 lg:p-16 text-[#0F3D3E]">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 border-b border-[#E8E3DC] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-3 ${inter.className}`}>
                Laboratoire Personnel
              </h1>
              <p className="text-gray-500 text-lg">
                Bienvenue dans votre espace HelyaCare, <span className="font-semibold text-[#E56B2D] uppercase">{customerId.split('_')[1] || customerId}</span>.
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#E8E3DC] shadow-sm text-sm font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              Mode Client
            </div>
          </header>

          {/* Client-side Navigation Menu */}
          <DashboardNav />

          {/* Page Content */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
