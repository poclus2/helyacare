import { auth } from "@/auth";
import { CommandesClient } from "@/components/espace-client/CommandesClient";

export default async function CommandesPage() {
  const session = await auth();

  let medusaOrders: any[] = [];
  let manualDeposits: any[] = [];

  const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
  const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
  const ADMIN_KEY = process.env.MEDUSA_API_KEY || "";
  const adminAuth = `Basic ${Buffer.from(`${ADMIN_KEY}:`).toString("base64")}`;

  if (session?.customer_id) {

    // ── 1. Commandes Medusa (Flutterwave complétées) ──
    try {
      const medusaToken = session.medusa_token as string | undefined;
      const res = await fetch(`${BACKEND}/store/orders`, {
        headers: {
          ...(medusaToken && { Authorization: `Bearer ${medusaToken}` }),
          ...(PUBLISHABLE_KEY && { "x-publishable-api-key": PUBLISHABLE_KEY }),
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        medusaOrders = data.orders || [];
      }
    } catch {}

    // ── 2. Dépôts & commandes manuelles (metadata Medusa via Admin API) ──
    try {
      const res = await fetch(`${BACKEND}/admin/customers/${session.customer_id}`, {
        headers: { "Content-Type": "application/json", Authorization: adminAuth },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const meta = data.customer?.metadata || {};
        manualDeposits = meta.deposit_requests
          ? JSON.parse(meta.deposit_requests)
          : [];
        // Trier par date décroissante
        manualDeposits.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    } catch {}
  }

  return (
    <CommandesClient
      medusaOrders={medusaOrders}
      manualDeposits={manualDeposits}
    />
  );
}
