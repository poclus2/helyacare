import { auth } from "@/auth";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Package, Download, Eye, ChevronRight } from "lucide-react";
import { Link } from "@/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function getStatusStyle(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "completed" || s === "livré") return "bg-green-100 text-green-700";
  if (s === "cancelled" || s === "annulé") return "bg-red-100 text-red-700";
  if (s === "pending" || s === "en attente") return "bg-amber-100 text-amber-700";
  if (s === "processing" || s === "en cours") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-600";
}

function translateStatus(status: string) {
  const map: Record<string, string> = {
    completed: "Livré",
    cancelled: "Annulé",
    pending: "En attente",
    processing: "En cours",
    shipped: "Expédié",
    requires_action: "Action requise",
  };
  return map[status?.toLowerCase()] || status || "En cours";
}

export default async function CommandesPage() {
  const session = await auth();
  const token = session?.medusa_token as string;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

  let orders: any[] = [];

  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/orders`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          ...(publishableKey && { "x-publishable-api-key": publishableKey }),
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        orders = data.orders || [];
      }
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    }
  }

  return (
    <div className={`space-y-8 ${pjs.className}`}>
      <div className="bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm">

        <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-6 mb-6">
          <div>
            <h2 className={`text-2xl font-bold text-[#0F3D3E] mb-1 ${inter.className}`}>
              Historique des Commandes
            </h2>
            <p className="text-gray-500 text-sm">
              {orders.length > 0
                ? `${orders.length} commande${orders.length > 1 ? "s" : ""} trouvée${orders.length > 1 ? "s" : ""}`
                : "Consultez vos commandes passées et téléchargez vos factures."}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className={`text-xl font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>
              Aucune commande pour l'instant
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Vos commandes apparaîtront ici après votre premier achat sur la boutique HelyaCare.
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F3D3E] text-white rounded-xl text-sm font-bold hover:bg-[#1a5556] transition-colors"
            >
              Découvrir la boutique
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E3DC] text-gray-500 text-xs uppercase tracking-wider">
                  <th className="pb-4 font-semibold">Commande</th>
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold">Articles</th>
                  <th className="pb-4 font-semibold">Total</th>
                  <th className="pb-4 font-semibold">Statut</th>
                  <th className="pb-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DC]/60">
                {orders.map((order: any) => {
                  const itemCount = order.items?.length || 0;
                  const firstItem = order.items?.[0]?.title || "Produit HelyaCare";
                  const itemLabel = itemCount > 1 ? `${firstItem} +${itemCount - 1}` : firstItem;
                  const total = order.total
                    ? new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: order.currency_code || "XOF",
                        maximumFractionDigits: 0,
                      }).format(order.total / 100)
                    : "—";
                  const dateStr = order.created_at
                    ? new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";
                  const displayId = order.display_id
                    ? `#HC-${order.display_id}`
                    : `#${order.id?.slice(-6).toUpperCase()}`;

                  return (
                    <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F6F4F1] flex items-center justify-center">
                            <Package className="w-5 h-5 text-[#0F3D3E]" />
                          </div>
                          <span className="font-bold text-[#0F3D3E]">{displayId}</span>
                        </div>
                      </td>
                      <td className="py-5 text-gray-600 text-[15px]">{dateStr}</td>
                      <td className="py-5 text-gray-600 text-[15px] max-w-[200px] truncate">{itemLabel}</td>
                      <td className="py-5 font-bold text-[#0F3D3E]">{total}</td>
                      <td className="py-5">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                          {translateStatus(order.status)}
                        </span>
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-gray-400 hover:text-[#0F3D3E] hover:bg-gray-100 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-[#0F3D3E] hover:bg-gray-100 rounded-lg transition-colors"
                            title="Télécharger la facture"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
