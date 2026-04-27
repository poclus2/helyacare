"use client";

import { useState, useEffect } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import {
  ArrowLeft, ArrowRight, ShieldCheck, Lock, MapPin, User,
  Phone, Mail, CheckCircle2, Loader2, CreditCard,
  Smartphone, Zap, Building2, AlertCircle
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useSession } from "next-auth/react";
import { Link } from "@/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

declare global {
  interface Window {
    FlutterwaveCheckout: (config: Record<string, any>) => void;
  }
}

export default function CheckoutPage() {
  const { cart, itemCount, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { data: session } = useSession();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flwLoaded, setFlwLoaded] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"flutterwave" | "wave" | "orange_money" | "mtn_momo" | "bank" | "">("flutterwave");
  const [manualDone, setManualDone] = useState<{ ref: string; target: string; amount: string } | null>(null);

  const [form, setForm] = useState({
    first_name: (session?.user?.name?.split(" ")[0]) || "",
    last_name: (session?.user?.name?.split(" ")[1]) || "",
    email: session?.user?.email || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    country: "Sénégal",
    zip: "",
  });

  const subtotal = cart.items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const total = subtotal; // Livraison offerte

  // Load Flutterwave script
  useEffect(() => {
    if (document.getElementById("flutterwave-script")) {
      setFlwLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "flutterwave-script";
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.onload = () => setFlwLoaded(true);
    document.head.appendChild(script);
  }, []);

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const isStep1Valid = form.first_name && form.last_name && form.email && form.phone;
  const isStep2Valid = form.line1 && form.city && form.country;
  const isStep3Valid = !!paymentMethod;

  // Labels/icônes par méthode
  const PAYMENT_METHODS = [
    { id: "flutterwave", label: "Carte bancaire", sub: "Visa, Mastercard — paiement immédiat", icon: "💳", badge: "Recommandé", badgeColor: "bg-[#CBF27A]/20 text-[#0F3D3E]" },
    { id: "wave",         label: "Wave",          sub: "Sénégal — paiement manuel", icon: "🌊", badge: null },
    { id: "orange_money", label: "Orange Money",  sub: "Sénégal, CI, Cameroun",    icon: "🍊", badge: null },
    { id: "mtn_momo",    label: "MTN MoMo",      sub: "Cameroun",                 icon: "📱", badge: null },
    { id: "bank",        label: "Virement",       sub: "Diaspora · 2–3 jours",    icon: "🏦", badge: null },
  ] as const;

  const handlePay = async () => {
    setIsProcessing(true);
    setError("");

    // ── Paiements manuels Mobile Money / Virement ──────────────────────────
    if (paymentMethod !== "flutterwave") {
      try {
        const res = await fetch("/api/deposit/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            currency: "XOF",
            method: paymentMethod,
            payer_phone: form.phone,
            notes: `Commande panier — ${form.first_name} ${form.last_name}`,
            cart_id: cart.id || null,
            cart_items: cart.items?.map((item: any) => ({
              title: item.title,
              quantity: item.quantity,
              unit_price: item.unit_price,
              variant_id: item.variant_id,
            })) || [],
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Erreur");
        setManualDone({
          ref: data.instructions.reference_code,
          target: data.instructions.target,
          amount: data.instructions.amount,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // ── Flutterwave (carte / mobile money automatique) ─────────────────────
    if (!flwLoaded) { setError("Le module de paiement charge, veuillez patienter..."); setIsProcessing(false); return; }

    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: { id: cart.id, items: cart.items },
          customer: { first_name: form.first_name, last_name: form.last_name, email: form.email, phone: form.phone },
          address: { line1: form.line1, line2: form.line2, city: form.city, country: form.country, zip: form.zip },
          amount: total,
          currency: "XOF",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Erreur d'initiation");

      localStorage.setItem("helyacare_checkout_session", JSON.stringify({
        email: form.email, firstName: form.first_name, lastName: form.last_name, phone: form.phone,
      }));

      window.FlutterwaveCheckout({
        ...data.flutterwaveConfig,
        callback: async (response: any) => {
          if (response.status === "successful" || response.status === "completed") {
            const verifyRes = await fetch(`/api/payment/verify?transaction_id=${response.transaction_id}&tx_ref=${response.tx_ref}&status=${response.status}`);
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              window.location.href = `/commande/succes?tx_ref=${response.tx_ref}&amount=${total}`;
            } else {
              setError("Vérification échouée. Contactez le support.");
              setIsProcessing(false);
            }
          } else {
            setError("Le paiement n'a pas abouti. Veuillez réessayer.");
            setIsProcessing(false);
          }
        },
        onclose: () => setIsProcessing(false),
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      setIsProcessing(false);
    }
  };

  if (itemCount === 0) {
    return (
      <>
        <Header />
        <main className={`min-h-screen bg-[#F6F4F1] flex items-center justify-center ${pjs.className}`}>
          <div className="text-center py-20">
            <h2 className={`text-2xl font-bold text-[#0F3D3E] mb-4 ${inter.className}`}>
              Votre panier est vide
            </h2>
            <Link href="/boutique" className="px-6 py-3 bg-[#0F3D3E] text-white rounded-xl font-bold text-sm hover:bg-[#1a5556] transition-colors">
              Retour à la boutique
            </Link>
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
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-10 md:py-16">

          {/* Back */}
          <Link
            href="/panier"
            className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0F3D3E] transition-colors mb-8 ${inter.className}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au panier
          </Link>

          {/* Page Title */}
          <div className="mb-10">
            <h1 className={`text-4xl font-extrabold text-[#0F3D3E] mb-2 ${inter.className}`}>
              Finaliser la commande
            </h1>
            <p className="text-gray-500 text-sm">Paiement sécurisé · Livraison offerte</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Form ─────────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Step Indicator */}
              <div className="flex items-center gap-0">
                {[
                  { n: 1, label: "Informations" },
                  { n: 2, label: "Livraison" },
                  { n: 3, label: "Paiement" },
                ].map(({ n, label }, idx) => (
                  <div key={n} className="flex items-center">
                    <button
                      onClick={() => {
                        if (n === 1) setStep(1);
                        if (n === 2 && isStep1Valid) setStep(2);
                        if (n === 3 && isStep1Valid && isStep2Valid) setStep(3);
                      }}
                      className="flex items-center gap-2.5"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
                        step > n ? "bg-green-600 border-green-600 text-white" :
                        step === n ? "bg-[#0F3D3E] border-[#0F3D3E] text-white" :
                        "bg-white border-gray-200 text-gray-400"
                      }`}>
                        {step > n ? <CheckCircle2 className="w-4 h-4" /> : n}
                      </div>
                      <span className={`text-sm font-semibold hidden sm:block ${
                        step === n ? "text-[#0F3D3E]" : "text-gray-400"
                      }`}>{label}</span>
                    </button>
                    {idx < 2 && <div className="h-px w-6 sm:w-10 bg-gray-200 mx-2" />}
                  </div>
                ))}
              </div>

              {/* Step 1: Contact */}
              {step === 1 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E3DC] shadow-sm space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-[#F2F0EB] rounded-xl flex items-center justify-center">
                      <User className="w-4 h-4 text-[#0F3D3E]" />
                    </div>
                    <h2 className={`text-lg font-bold text-[#0F3D3E] ${inter.className}`}>Informations personnelles</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Prénom *</label>
                      <input name="first_name" value={form.first_name} onChange={handleField}
                        className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                        placeholder="Aminata" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nom *</label>
                      <input name="last_name" value={form.last_name} onChange={handleField}
                        className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                        placeholder="Diallo" required />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email *
                    </label>
                    <input name="email" type="email" value={form.email} onChange={handleField}
                      className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                      placeholder="aminata@exemple.com" required />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Téléphone (WhatsApp) *
                    </label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleField}
                      className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                      placeholder="+221 77 000 00 00" required />
                    <p className="text-[11px] text-gray-400">Utilisé pour le suivi de livraison et les notifications WhatsApp.</p>
                  </div>

                  <button
                    onClick={() => { if (isStep1Valid) setStep(2); }}
                    disabled={!isStep1Valid}
                    className={`w-full py-4 text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${inter.className} ${
                      isStep1Valid
                        ? "bg-[#0F3D3E] text-white hover:bg-[#1a5556] shadow-lg"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Continuer
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E3DC] shadow-sm space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-[#F2F0EB] rounded-xl flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#0F3D3E]" />
                    </div>
                    <h2 className={`text-lg font-bold text-[#0F3D3E] ${inter.className}`}>Adresse de livraison</h2>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Adresse *</label>
                    <input name="line1" value={form.line1} onChange={handleField}
                      className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                      placeholder="14 Avenue Cheikh Anta Diop" required />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Complément d'adresse</label>
                    <input name="line2" value={form.line2} onChange={handleField}
                      className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                      placeholder="Appartement, bâtiment, étage..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ville *</label>
                      <input name="city" value={form.city} onChange={handleField}
                        className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                        placeholder="Dakar" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Code postal</label>
                      <input name="zip" value={form.zip} onChange={handleField}
                        className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                        placeholder="10700" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pays *</label>
                    <select name="country" value={form.country} onChange={handleField}
                      className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                    >
                      {["Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Guinée", "Cameroun", "Maroc", "France", "Belgique", "Autre"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => { if (isStep2Valid) setStep(3); }}
                    disabled={!isStep2Valid}
                    className={`w-full py-4 text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${inter.className} ${
                      isStep2Valid
                        ? "bg-[#0F3D3E] text-white hover:bg-[#1a5556] shadow-lg"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Choisir le paiement
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── Step 3: Paiement ───────────────────────────────────────── */}
              {step === 3 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E3DC] shadow-sm space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-[#F2F0EB] rounded-xl flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-[#0F3D3E]" />
                    </div>
                    <h2 className={`text-lg font-bold text-[#0F3D3E] ${inter.className}`}>Moyen de paiement</h2>
                  </div>

                  {/* Résultat paiement manuel réussi */}
                  {manualDone ? (
                    <div className="space-y-4">
                      <div className="bg-[#CBF27A]/15 border border-[#CBF27A]/40 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <p className={`font-bold text-[#0F3D3E] ${inter.className}`}>Demande enregistrée !</p>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          Envoyez exactement <strong>{manualDone.amount}</strong> au numéro ci-dessous et mentionnez votre référence.
                          Votre commande sera validée sous <strong>24–48h</strong>.
                        </p>
                        <div className="bg-white rounded-xl p-4 space-y-3 border border-[#E8E3DC]">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Numéro à créditer</p>
                            <p className={`font-bold text-[#0F3D3E] text-lg ${inter.className}`}>{manualDone.target}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Référence obligatoire</p>
                            <p className={`font-mono font-bold text-[#E56B2D] text-base ${inter.className}`}>{manualDone.ref}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Montant exact</p>
                            <p className={`font-extrabold text-[#0F3D3E] text-xl ${inter.className}`}>{manualDone.amount}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-orange-700 text-xs leading-relaxed">
                          Mentionnez impérativement la référence <strong>{manualDone.ref}</strong> dans le libellé du virement. Sans référence, le crédit ne peut être effectué.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Grille de sélection */}
                      <div className="space-y-3">
                        {PAYMENT_METHODS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setPaymentMethod(m.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                              paymentMethod === m.id
                                ? "border-[#0F3D3E] bg-[#0F3D3E]/5"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <span className="text-2xl shrink-0">{m.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`font-bold text-[#0F3D3E] text-sm ${inter.className}`}>{m.label}</p>
                                {m.badge && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                                    {m.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                              paymentMethod === m.id ? "border-[#0F3D3E] bg-[#0F3D3E]" : "border-gray-300"
                            }`}>
                              {paymentMethod === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Info méthode sélectionnée */}
                      {paymentMethod && paymentMethod !== "flutterwave" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <p className="text-blue-700 text-xs leading-relaxed">
                            Paiement manuel — une référence unique vous sera générée. Envoyez le montant et mentionnez-la obligatoirement.
                          </p>
                        </div>
                      )}

                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">
                          ⚠️ {error}
                        </div>
                      )}

                      <button
                        onClick={handlePay}
                        disabled={!isStep3Valid || isProcessing}
                        className={`w-full py-4 text-[15px] font-bold rounded-xl flex items-center justify-center gap-3 transition-all ${inter.className} ${
                          isStep3Valid && !isProcessing
                            ? "bg-[#E56B2D] text-white hover:bg-[#cf5c22] shadow-xl"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isProcessing ? (
                          <><Loader2 className="w-5 h-5 animate-spin" />Traitement...</>
                        ) : paymentMethod === "flutterwave" ? (
                          <><CreditCard className="w-5 h-5" />Payer {formatPrice(total)}<Lock className="w-4 h-4 opacity-70" /></>
                        ) : (
                          <><Smartphone className="w-5 h-5" />Générer ma référence · {formatPrice(total)}</>
                        )}
                      </button>

                      <p className="text-center text-[11px] text-gray-400">
                        🔒 Vos données sont chiffrées et sécurisées
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── Right: Order Summary (sticky) ─────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-[#E8E3DC] shadow-sm overflow-hidden sticky top-28">

                <div className="px-6 py-5 border-b border-[#E8E3DC]">
                  <h2 className={`text-lg font-bold text-[#0F3D3E] ${inter.className}`}>
                    Récapitulatif
                  </h2>
                </div>

                {/* Items */}
                <div className="px-6 py-4 space-y-4 max-h-64 overflow-y-auto">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F6F4F1] overflow-hidden shrink-0 relative border border-[#E8E3DC]">
                        {item.thumbnail ? (
                          <Image src={item.thumbnail} alt={item.title} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold text-[#0F3D3E] truncate ${inter.className}`}>{item.title}</p>
                        {item.subtitle && <p className="text-[11px] text-gray-400">{item.subtitle}</p>}
                        <p className="text-[11px] text-gray-400">x{item.quantity}</p>
                      </div>
                      <p className={`text-sm font-black text-[#0F3D3E] shrink-0 ${inter.className}`}>
                        {formatPrice(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="px-6 py-4 space-y-3 border-t border-[#E8E3DC]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sous-total</span>
                    <span className={`font-bold text-[#0F3D3E] ${inter.className}`}>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Livraison</span>
                    <span className="font-bold text-green-600">Offerte</span>
                  </div>
                  <div className="h-px bg-[#E8E3DC]" />
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-[#0F3D3E] ${inter.className}`}>Total</span>
                    <span className={`text-xl font-black text-[#0F3D3E] ${inter.className}`}>
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Payment methods */}
                <div className="px-6 pb-5">
                  <p className="text-[11px] text-gray-400 text-center mb-3">Moyens de paiement acceptés</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {["Visa", "MasterCard", "Wave", "Orange Money", "MTN MoMo"].map(pm => (
                      <span key={pm} className="px-2.5 py-1 bg-[#F6F4F1] text-[10px] font-bold text-gray-600 rounded-lg border border-[#E8E3DC]">
                        {pm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom band */}
                <div className="bg-[#0F3D3E] px-6 py-4 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#CBF27A] shrink-0" />
                  <p className="text-[12px] text-white/80 leading-snug">
                    Satisfait ou remboursé 30 jours sans condition
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
