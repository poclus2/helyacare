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
  let debugError = "";
  let customerMeta: Record<string, any> = {};

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
      } else {
        debugError += `[GET] Status: ${res.status} | `;
        try { debugError += await res.text(); } catch(e){}
      }
    } catch (e: any) {
      console.error("Failed to fetch ambassador:", e);
      debugError += `[GET] Exception: ${e.message} | `;
    }

    // Fetch customer metadata to get the HL- referral code (source of truth)
    try {
      const custRes = await fetch(`${backendUrl}/store/customers/me`, {
        headers,
        cache: "no-store",
      });
      if (custRes.ok) {
        const custData = await custRes.json();
        customerMeta = custData.customer?.metadata || {};
      }
    } catch (e: any) {
      console.error("Failed to fetch customer metadata:", e);
    }

    // 2. If role is ambassadeur but no ambassador record exists → auto-provision
    if (!ambassador && role === "ambassadeur") {
      try {
        const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
        const generatedCode = `HL-${randomSuffix}`;
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
        } else {
           debugError += `\n[POST] Status: ${createRes.status} | `;
           try { debugError += await createRes.text(); } catch(e){}
        }
      } catch (e: any) {
        console.error("Failed to auto-provision ambassador:", e);
        debugError += `\n[POST] Exception: ${e.message} | `;
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
        <p className="text-gray-500 max-w-md">Rejoignez le programme HelyaCare pour accéder à votre tableau de bord ambassadeur et commencer à générer des commissions.</p>
        {debugError && (
          <div className="text-left w-full max-w-2xl bg-red-50 text-red-700 text-xs p-4 rounded-xl font-mono mt-4 overflow-auto">
            <span className="font-bold">Info Diagnostic (à envoyer au dev) :</span>
            <pre className="mt-2 whitespace-pre-wrap">{debugError}</pre>
          </div>
        )}
        <a href="/ambassadeur" className="px-6 py-3 bg-[#0F3D3E] text-white rounded-xl font-semibold text-sm hover:bg-[#1a5556] transition-colors mt-4">
          Devenir Ambassadeur
        </a>
      </div>
    );
  }

  const balance = ambassador?.wallet?.balance || 0;

  // Normalise referral code: always prefer HL-XXXXXX format.
  // Priority: (1) customer metadata if HL- format, (2) MLM module code if HL- format,
  // (3) generate a fresh one and store it in customer metadata.
  const mlmCode: string = ambassador?.referral_code || "";
  const metaCode: string = customerMeta?.referral_code || "";
  let referralCode: string;
  if (metaCode.startsWith("HL-")) {
    referralCode = metaCode;
  } else if (mlmCode.startsWith("HL-")) {
    referralCode = mlmCode;
  } else {
    // Generate a fresh HL- code and persist it in customer metadata
    const newCode = `HL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    referralCode = newCode;
    // Persist asynchronously (non-blocking)
    try {
      const adminToken = await import("@/lib/medusa-admin-auth").then(m => m.getMedusaAdminToken());
      fetch(`${backendUrl}/admin/customers/${customerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
        body: JSON.stringify({ metadata: { ...customerMeta, referral_code: newCode } }),
      }).catch(() => {});
    } catch {}
  }
  const downlines = ambassador?.downlines || [];
  const transactions = ambassador?.wallet?.transactions || [];

  const leftBv = Number(ambassador?.left_bv || 0);
  const rightBv = Number(ambassador?.right_bv || 0);
  const placementPreference = ambassador?.placement_preference || "AUTOMATIC";

  return (
    <AmbassadorDashboardClient
      balance={balance}
      referralCode={referralCode}
      downlines={downlines}
      transactions={transactions}
      stats={stats}
      inter={inter.className}
      pjs={pjs.className}
      ambassadorId={ambassador?.id || ""}
      leftBv={leftBv}
      rightBv={rightBv}
      placementPreference={placementPreference}
    />
  );
}

