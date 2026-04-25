"use client";

import { useState } from "react";
import {
  CreditCard, Loader2, CheckCircle2, Copy, Check,
  Smartphone, Building2, AlertCircle, X
} from "lucide-react";

const METHODS = [
  { id: "wave",         label: "Wave",          icon: "🌊", desc: "Sénégal",           available: true },
  { id: "orange_money", label: "Orange Money",  icon: "🍊", desc: "Sénégal / CI / Cameroun", available: true },
  { id: "mtn_momo",    label: "MTN MoMo",      icon: "📱", desc: "Cameroun",          available: true },
  { id: "bank",        label: "Virement",       icon: "🏦", desc: "Diaspora",          available: true },
];

interface DepositInstructions {
  method: string;
  target: string;
  reference_code: string;
  note: string;
  amount: string;
}

export function DepositRequestForm({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [instructions, setInstructions] = useState<DepositInstructions | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async () => {
    if (!method || !amount || Number(amount) <= 0) {
      setError("Veuillez sélectionner une méthode et entrer un montant valide.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/deposit/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          currency: "XOF",
          method,
          payer_phone: payerPhone || undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de la demande");
      }

      setInstructions(data.instructions);
      setStep("success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">Effectuer un dépôt</h3>
          <p className="text-white/40 text-sm">Rechargez votre portefeuille HelyaCare</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {step === "form" && (
        <>
          {/* Méthode de paiement */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              Méthode de paiement
            </label>
            <div className="grid grid-cols-2 gap-3">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                    method === m.id
                      ? "bg-[#CBF27A]/10 border-[#CBF27A]/50 text-white"
                      : "bg-white/3 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className="font-bold text-sm leading-tight">{m.label}</p>
                    <p className="text-xs text-white/30">{m.desc}</p>
                  </div>
                  {method === m.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#CBF27A] ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Montant */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
              Montant (XOF)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 25000"
                min="500"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold placeholder-white/20 focus:outline-none focus:border-[#CBF27A]/50 [appearance:textfield]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">XOF</span>
            </div>
            {/* Montants rapides */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {[5000, 10000, 25000, 50000].map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-bold rounded-lg border border-white/10 transition-all"
                >
                  {q.toLocaleString("fr-FR")}
                </button>
              ))}
            </div>
          </div>

          {/* Numéro expéditeur (optionnel) */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
              Numéro expéditeur <span className="text-white/20 normal-case font-normal">(optionnel)</span>
            </label>
            <input
              type="tel"
              value={payerPhone}
              onChange={(e) => setPayerPhone(e.target.value)}
              placeholder="+221 77 000 00 00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#CBF27A]/50"
            />
          </div>

          {/* Message (optionnel) */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
              Note <span className="text-white/20 normal-case font-normal">(optionnel)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Information complémentaire pour l'équipe"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#CBF27A]/50"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !method || !amount}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#CBF27A] hover:bg-[#b8d96e] text-[#0F3D3E] font-extrabold text-base rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            {loading ? "Traitement..." : "Générer ma référence de paiement"}
          </button>
        </>
      )}

      {step === "success" && instructions && (
        <div className="space-y-5">
          <div className="bg-[#CBF27A]/10 border border-[#CBF27A]/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-[#CBF27A]" />
              <p className="text-[#CBF27A] font-bold text-sm">Demande enregistrée !</p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Suivez les instructions ci-dessous pour finaliser votre dépôt. Votre portefeuille sera crédité sous <strong className="text-white">24–48h</strong> après réception du paiement.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-white/3 border border-white/10 rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-1">Envoyer via {instructions.method}</p>
              <div className="flex items-center justify-between">
                <p className="text-white font-bold text-lg">{instructions.target}</p>
                <button onClick={() => copyText(instructions.target, "target")}
                  className="text-white/40 hover:text-[#CBF27A] transition-colors">
                  {copied === "target" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="border-t border-white/5 pt-4">
              <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-1">Montant exact à envoyer</p>
              <p className="text-[#CBF27A] font-extrabold text-2xl">{instructions.amount}</p>
            </div>
            <div className="border-t border-white/5 pt-4">
              <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-1">Référence à mentionner</p>
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                <p className="text-white font-mono font-bold tracking-wider">{instructions.reference_code}</p>
                <button onClick={() => copyText(instructions.reference_code, "ref")}
                  className="text-white/40 hover:text-[#CBF27A] transition-colors">
                  {copied === "ref" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-orange-400/10 border border-orange-400/20 rounded-xl px-4 py-3">
            <p className="text-orange-300 text-sm leading-relaxed">
              <strong>⚠️ Important :</strong> {instructions.note}
            </p>
          </div>

          {onClose && (
            <button onClick={onClose}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 font-bold text-sm rounded-xl border border-white/10 transition-all">
              Fermer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
