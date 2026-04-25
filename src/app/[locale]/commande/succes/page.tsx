"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { CheckCircle2, Package, ArrowRight, Share2, Sparkles, Loader2 } from "lucide-react";
import { Link } from "@/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCurrency } from "@/contexts/CurrencyContext";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function SuccessContent() {
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();

  const tx_ref = searchParams.get("tx_ref");
  const amount = searchParams.get("amount");
  const transaction_id = searchParams.get("transaction_id");

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderRef] = useState(() => tx_ref || `HC-${Date.now().toString(36).toUpperCase()}`);
  const [emailSent, setEmailSent] = useState(false);

  const sendConfirmationEmail = async (ref: string, amt: string | null) => {
    if (emailSent) return;
    try {
      // Récupérer les données du panier depuis localStorage
      const cartRaw = localStorage.getItem("helyacare_cart");
      const cartData = cartRaw ? JSON.parse(cartRaw) : null;
      const items = cartData?.items || [];

      // Récupérer l'email depuis la session stockée
      const sessionRaw = localStorage.getItem("helyacare_checkout_session");
      const session = sessionRaw ? JSON.parse(sessionRaw) : null;
      const email = session?.email;
      const name = session?.firstName ? `${session.firstName} ${session.lastName || ""}`.trim() : null;

      if (!email) return; // Pas d'email disponible, l'email sera envoyé via webhook

      await fetch("/api/email/order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          customerName: name,
          orderRef: ref,
          amount: amt || "0",
          currency: "XOF",
          items,
        }),
      });
      setEmailSent(true);
      // Nettoyer les données temporaires
      localStorage.removeItem("helyacare_checkout_session");
    } catch (e) {
      console.error("[success] Email error:", e);
    }
  };

  useEffect(() => {
    if (!transaction_id && !tx_ref) {
      setVerificationStatus("success");
      sendConfirmationEmail(orderRef, amount);
      return;
    }

    if (transaction_id) {
      fetch(`/api/payment/verify?transaction_id=${transaction_id}&tx_ref=${tx_ref}&status=successful`)
        .then(r => r.json())
        .then(data => {
          const status = data.success ? "success" : "error";
          setVerificationStatus(status);
          if (status === "success") sendConfirmationEmail(orderRef, amount);
        })
        .catch(() => {
          setVerificationStatus("success");
          sendConfirmationEmail(orderRef, amount);
        });
    } else {
      setVerificationStatus("success");
      sendConfirmationEmail(orderRef, amount);
    }
  }, [transaction_id, tx_ref]);


  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#F6F4F1] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0F3D3E] mx-auto mb-4" />
          <p className={`text-[#0F3D3E] font-semibold ${pjs.className}`}>Confirmation de votre paiement...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <>
        <Header />
        <main className={`min-h-screen bg-[#F6F4F1] flex items-center justify-center px-4 ${pjs.className}`}>
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center border border-[#E8E3DC] shadow-sm">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className={`text-2xl font-bold text-[#0F3D3E] mb-3 ${inter.className}`}>
              Paiement non confirmé
            </h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Nous n'avons pas pu confirmer votre paiement. Si vous avez été débité, contactez-nous avec la référence <strong>{tx_ref}</strong>.
            </p>
            <a
              href="mailto:care@helyacare.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F3D3E] text-white rounded-xl font-bold text-sm hover:bg-[#1a5556] transition-colors"
            >
              Contacter le support
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={`min-h-screen bg-[#F6F4F1] ${pjs.className}`}>
        <div className="max-w-[700px] mx-auto px-4 md:px-8 py-16 md:py-24">

          {/* Success Hero */}
          <div className="bg-[#0F3D3E] rounded-3xl p-10 md:p-14 text-center text-white mb-8 relative overflow-hidden shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#CBF27A]/5 rounded-full" />

            <div className="relative z-10">
              {/* Animated checkmark */}
              <div className="w-20 h-20 bg-[#CBF27A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-[#0F3D3E]" strokeWidth={2.5} />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#CBF27A]/20 text-[#CBF27A] border border-[#CBF27A]/30 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Paiement confirmé
              </div>

              <h1 className={`text-3xl md:text-4xl font-extrabold mb-3 ${inter.className}`}>
                Merci pour votre commande !
              </h1>

              <p className="text-white/70 text-[15px] leading-relaxed max-w-md mx-auto mb-8">
                Votre protocole HelyaCare est en cours de préparation. Vous recevrez une confirmation par email et WhatsApp dans quelques minutes.
              </p>

              {/* Order details pill */}
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4">
                <div className="text-left">
                  <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">Référence</p>
                  <p className={`text-white font-black text-lg tracking-wider font-mono ${inter.className}`}>
                    {orderRef}
                  </p>
                </div>
                {amount && (
                  <>
                    <div className="w-px h-10 bg-white/20" />
                    <div className="text-left">
                      <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">Montant</p>
                      <p className={`text-[#CBF27A] font-black text-lg ${inter.className}`}>
                        {formatPrice(Number(amount))}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-3xl border border-[#E8E3DC] shadow-sm p-8 mb-6">
            <h2 className={`text-lg font-bold text-[#0F3D3E] mb-6 ${inter.className}`}>
              Les prochaines étapes
            </h2>
            <div className="space-y-5">
              {[
                {
                  icon: "📧",
                  title: "Email de confirmation",
                  desc: "Un récapitulatif détaillé vous a été envoyé à votre adresse email.",
                },
                {
                  icon: "📦",
                  title: "Préparation sous 24h",
                  desc: "Votre cure HelyaCare est préparée et expédiée dans les meilleurs délais.",
                },
                {
                  icon: "💬",
                  title: "Suivi WhatsApp",
                  desc: "Votre coach IA HelyaCare vous contactera pour démarrer votre protocole personnalisé.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F2F0EB] rounded-xl flex items-center justify-center shrink-0 text-xl">
                    {icon}
                  </div>
                  <div>
                    <p className={`font-bold text-[#0F3D3E] text-sm ${inter.className}`}>{title}</p>
                    <p className="text-gray-500 text-[13px] mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/espace-client"
              className={`flex items-center justify-center gap-2 py-4 bg-[#0F3D3E] text-white rounded-2xl font-bold text-[15px] hover:bg-[#1a5556] transition-all shadow-lg ${inter.className}`}
            >
              <Package className="w-5 h-5" />
              Voir ma commande
            </Link>
            <Link
              href="/boutique"
              className={`flex items-center justify-center gap-2 py-4 bg-white border border-[#E8E3DC] text-[#0F3D3E] rounded-2xl font-bold text-[15px] hover:bg-[#F6F4F1] transition-all ${pjs.className}`}
            >
              <ArrowRight className="w-5 h-5" />
              Continuer mes achats
            </Link>
          </div>

          {/* Share */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-3">Partagez votre expérience HelyaCare</p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#E8E3DC] rounded-full text-sm font-semibold text-[#0F3D3E] hover:bg-[#F6F4F1] transition-colors">
              <Share2 className="w-4 h-4" />
              Partager sur WhatsApp
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F6F4F1] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#0F3D3E]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
