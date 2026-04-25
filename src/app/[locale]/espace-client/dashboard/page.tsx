import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { auth } from "@/auth";
import AmbassadorDashboardClient from "@/components/espace-client/AmbassadorDashboardClient";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default async function AmbassadorDashboardPage() {
  const session = await auth();
  const token = session?.medusa_token as string;
  const customerId = session?.customer_id as string;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
  const role = (session?.role as string) || "customer";
  // @ts-ignore
  const firstName = (session?.first_name as string) || "AMB";

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(publishableKey && { "x-publishable-api-key": publishableKey }),
  };

  let ambassador: any = null;
  let stats: any = null;

  if (token && customerId) {
    // 1. Try to fetch existing ambassador record
    try {
      const res = await fetch(`${backendUrl}/store/ambassadors/${customerId}`, {
        headers,
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        ambassador = data.ambassador;
        stats = data.stats;
      }
    } catch (e) {
      console.error("Failed to fetch ambassador:", e);
    }

    // 2. If role is ambassadeur but no MLM record exists → auto-provision
    if (!ambassador && role === "ambassadeur") {
      try {
        const generatedCode = `HELYA-${firstName.toUpperCase().slice(0, 8)}`;
        const createRes = await fetch(`${backendUrl}/store/ambassadors`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            customer_id: customerId,
            referral_code: generatedCode,
          }),
        });
        if (createRes.ok || createRes.status === 201) {
          const data = await createRes.json();
          ambassador = data.ambassador;
          stats = null; // Fresh account — no stats yet
        }
      } catch (e) {
        console.error("Failed to auto-provision ambassador:", e);
      }
    }
  }

  // If still no ambassador (and not role ambassadeur) → show CTA
  if (!ambassador) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 ${pjs.className}`}>
        <div className="w-16 h-16 bg-[#F2F0EB] rounded-full flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F3D3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h2 className={`text-2xl font-bold text-[#0F3D3E] ${inter.className}`}>Programme Ambassadeur</h2>
        <p className="text-gray-500 max-w-md">Rejoignez le programme HelyaCare pour accéder à votre tableau de bord MLM et commencer à générer des commissions.</p>
        <a href="/ambassadeur" className="px-6 py-3 bg-[#0F3D3E] text-white rounded-xl font-semibold text-sm hover:bg-[#1a5556] transition-colors">
          Devenir Ambassadeur
        </a>
      </div>
    );
  }

  const balance = ambassador?.wallet?.balance || 0;
  const referralCode = ambassador?.referral_code || "—";
  const downlines = ambassador?.downlines || [];
  const transactions = ambassador?.wallet?.transactions || [];

  return (
    <AmbassadorDashboardClient
      balance={balance}
      referralCode={referralCode}
      downlines={downlines}
      transactions={transactions}
      stats={stats}
      inter={inter.className}
      pjs={pjs.className}
    />
  );
}

