import { auth } from "@/auth";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Package, Calendar, CreditCard, Clock, PauseCircle, ArrowRight, ShieldCheck, MapPin, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default async function AbonnementPage() {
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

  // Dernière commande = abonnement "actif" de référence
  const latestOrder = orders[0] || null;
  const hasSubscription = latestOrder !== null;

  // Prochaine livraison estimée = date commande + 30 jours
  const nextDelivery = latestOrder?.created_at
    ? new Date(new Date(latestOrder.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const productName = latestOrder?.items?.[0]?.title || "Cure HelyaCare";
  const productImage = latestOrder?.items?.[0]?.thumbnail || null;
  const monthlyAmount = latestOrder?.total
    ? new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: latestOrder.currency_code || "XOF",
        maximumFractionDigits: 0,
      }).format(latestOrder.total / 100)
    : null;

  return (
    <div className={`space-y-8 ${pjs.className}`}>
      <div className="bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E3DC] pb-6 mb-8">
          <div>
            <h2 className={`text-2xl font-bold text-[#0F3D3E] mb-1 ${inter.className}`}>
              Abonnement
            </h2>
            <p className="text-gray-500 text-sm">Gérez la fréquence de vos livraisons et vos paramètres de cure.</p>
          </div>
          {hasSubscription ? (
            <div className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Statut : Actif
            </div>
          ) : (
            <div className="px-4 py-2 bg-gray-50 text-gray-500 border border-gray-200 rounded-full text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Aucun abonnement
            </div>
          )}
        </div>

        {hasSubscription ? (
          <>
            {/* Subscription Info Card */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 flex flex-col lg:flex-row gap-8 items-center mb-8">
              <div className="relative w-full lg:w-48 aspect-square bg-[#F2F0EB] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {productImage ? (
                  <Image src={productImage} alt={productName} fill className="object-cover rounded-xl" />
                ) : (
                  <Package className="w-12 h-12 text-gray-300" />
                )}
              </div>

              <div className="flex-1 w-full">
                <h3 className={`text-xl font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>{productName} (30 Jours)</h3>
                <p className="text-gray-500 text-[15px] mb-6">Renouvellement automatique chaque mois. Vous avez le contrôle total sur votre cure.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nextDelivery && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#E56B2D]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Prochaine Livraison</p>
                        <p className="text-[15px] font-bold text-[#0F3D3E]">{nextDelivery}</p>
                      </div>
                    </div>
                  )}

                  {monthlyAmount && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Montant Mensuel</p>
                        <p className="text-[15px] font-bold text-[#0F3D3E]">{monthlyAmount}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-[#E8E3DC] rounded-2xl hover:border-[#E56B2D] hover:bg-orange-50/50 transition-all group">
                <Clock className="w-8 h-8 text-gray-400 group-hover:text-[#E56B2D] transition-colors" />
                <div className="text-center">
                  <p className="font-bold text-[#0F3D3E] text-sm mb-1">Décaler d'un mois</p>
                  <p className="text-xs text-gray-500">Repousser la livraison</p>
                </div>
              </button>

              <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-[#E8E3DC] rounded-2xl hover:border-[#0F3D3E] hover:bg-[#F6F4F1] transition-all group">
                <MapPin className="w-8 h-8 text-gray-400 group-hover:text-[#0F3D3E] transition-colors" />
                <div className="text-center">
                  <p className="font-bold text-[#0F3D3E] text-sm mb-1">Modifier l'adresse</p>
                  <p className="text-xs text-gray-500">Changer le point de relais</p>
                </div>
              </button>

              <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-[#E8E3DC] rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all group">
                <PauseCircle className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition-colors" />
                <div className="text-center">
                  <p className="font-bold text-[#0F3D3E] text-sm mb-1">Mettre en pause</p>
                  <p className="text-xs text-gray-500">Suspendre temporairement</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className={`text-xl font-bold text-[#0F3D3E] mb-3 ${inter.className}`}>
              Aucun abonnement actif
            </h3>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Commencez votre cure HelyaCare et bénéficiez d'une livraison automatique chaque mois, sans engagement.
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F3D3E] text-white rounded-xl text-sm font-bold hover:bg-[#1a5556] transition-colors shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Démarrer ma cure
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Reassurance */}
      <div className="bg-[#0F3D3E] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-[#CBF27A] shrink-0" />
          <div>
            <h4 className={`text-white font-bold text-lg mb-1 ${inter.className}`}>Garantie HelyaCare</h4>
            <p className="text-white/70 text-sm">Annulation ou modification en 1 clic. Aucun engagement caché.</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-[#CBF27A] text-[#0A192F] text-sm font-bold rounded-xl hover:bg-[#b8dd6e] transition-colors flex items-center gap-2 whitespace-nowrap">
          Contacter le support <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
