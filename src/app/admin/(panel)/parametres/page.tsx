"use client";

import { useEffect, useState } from "react";
import { Save, Phone, ShoppingBag, CreditCard, DollarSign } from "lucide-react";

export default function ParametresPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [minQty, setMinQty] = useState(5);
  const [prices, setPrices] = useState<Record<string, number>>({
    "crave-control": 0,
    "pack-bien-etre": 0,
    "apple-satiety-shot": 0,
    "helya-hydrate": 0,
    "helya-vigor": 0,
  });

  const [binarySettings, setBinarySettings] = useState({
    percentage: 10,
    bv_to_xof_rate: 1,
    auto_execution: false,
    execution_interval: "monthly",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [matching, setMatching] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setWhatsapp(data.whatsapp_number || "");
        if (data.ambassador_settings) {
          setMinQty(data.ambassador_settings.min_qty || 5);
          setPrices((prev) => ({ ...prev, ...data.ambassador_settings.prices }));
        }
        if (data.binary_bonus_settings) {
          setBinarySettings(data.binary_bonus_settings);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp_number: whatsapp,
          ambassador_settings: {
            min_qty: minQty,
            prices,
          },
          binary_bonus_settings: binarySettings,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Paramètres enregistrés avec succès." });
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de l'enregistrement." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Erreur de connexion." });
    } finally {
      setSaving(false);
    }
  };

  const handleRunBinaryMatch = async () => {
    if (!confirm("Êtes-vous sûr ? Cela va calculer les commissions sur la patte faible pour tous les ambassadeurs et déduire les points correspondants.")) return;
    setMatching(true);
    try {
      const res = await fetch("/api/admin/mlm/binary-match", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(`Succès ! ${data.processed} ambassadeurs traités. Total payé: ${data.total_paid} XOF.`);
      } else {
        alert("Erreur: " + data.error);
      }
    } catch (err) {
      alert("Erreur de connexion.");
    } finally {
      setMatching(false);
    }
  };

  const handlePriceChange = (key: string, val: string) => {
    const num = parseInt(val, 10);
    setPrices((prev) => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#CBF27A] border-t-transparent rounded-full" />
      </div>
    );
  }

  const productsList = [
    { key: "crave-control", label: "Crave Control" },
    { key: "pack-bien-etre", label: "Pack Bien-Être Essentiel" },
    { key: "apple-satiety-shot", label: "Apple Satiety Shot" },
    { key: "helya-hydrate", label: "Helya Hydrate" },
    { key: "helya-vigor", label: "Helya Vigor" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Paramètres du Site</h1>
        <p className="text-white/50 text-sm">Gérez les configurations générales de la plateforme HelyaCare.</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Section WhatsApp */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="w-10 h-10 bg-[#25D366]/20 rounded-xl flex items-center justify-center">
            <Phone className="w-5 h-5 text-[#25D366]" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Contact WhatsApp</h2>
            <p className="text-white/40 text-xs">Numéro utilisé pour le widget de support</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 block">
              Numéro WhatsApp (avec indicatif)
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="ex: +33612345678"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#CBF27A] focus:ring-1 focus:ring-[#CBF27A] transition-all"
            />
            <p className="text-xs text-white/40">
              Assurez-vous d'inclure le signe + et le code du pays (par ex. +33 pour la France).
            </p>
          </div>
        </div>
      </div>

      {/* Section Boutique Ambassadeur */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="w-10 h-10 bg-[#E56B2D]/20 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-[#E56B2D]" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Boutique Ambassadeurs</h2>
            <p className="text-white/40 text-xs">Prix réduits et quantité minimale pour le programme ambassadeurs</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-medium text-white/70 block">
              Quantité Minimale d'Achat (par lot)
            </label>
            <input
              type="number"
              min="1"
              value={minQty}
              onChange={(e) => setMinQty(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#E56B2D] focus:ring-1 focus:ring-[#E56B2D] transition-all"
            />
            <p className="text-xs text-white/40">
              C'est le nombre minimum d'unités qu'un ambassadeur doit ajouter au panier pour chaque produit.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-white/70 block border-b border-white/5 pb-2">
              Prix unitaire pour les ambassadeurs (XOF)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {productsList.map((prod) => (
                <div key={prod.key} className="space-y-1">
                  <label className="text-xs text-white/50 truncate block">{prod.label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={prices[prod.key] || 0}
                      onChange={(e) => handlePriceChange(prod.key, e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-2 text-white focus:outline-none focus:border-[#E56B2D] focus:ring-1 focus:ring-[#E56B2D] transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">FCFA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section MLM & Bonus Binaire */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold">MLM & Bonus Binaire</h2>
            <p className="text-white/40 text-xs">Configuration des paiements sur la patte faible</p>
          </div>
          <button
            onClick={handleRunBinaryMatch}
            disabled={matching}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-sm font-medium hover:bg-purple-500/20 transition-colors disabled:opacity-50"
          >
            {matching ? "Calcul en cours..." : "Calculer & Payer Manuellement"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 block">
              Commission Patte Faible (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={binarySettings.percentage}
              onChange={(e) => setBinarySettings({ ...binarySettings, percentage: parseInt(e.target.value) || 0 })}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 block">
              Valeur d'1 BV (en XOF)
            </label>
            <input
              type="number"
              min="0"
              value={binarySettings.bv_to_xof_rate}
              onChange={(e) => setBinarySettings({ ...binarySettings, bv_to_xof_rate: parseInt(e.target.value) || 0 })}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          
          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-white/70 flex items-center gap-2">
              <input
                type="checkbox"
                checked={binarySettings.auto_execution}
                onChange={(e) => setBinarySettings({ ...binarySettings, auto_execution: e.target.checked })}
                className="w-4 h-4 rounded bg-black/20 border-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
              />
              Exécution Automatique
            </label>
            <p className="text-xs text-white/40">Si activé, le calcul se fera automatiquement à minuit selon l'intervalle choisi.</p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-white/70 block">
              Intervalle d'exécution
            </label>
            <select
              value={binarySettings.execution_interval}
              onChange={(e) => setBinarySettings({ ...binarySettings, execution_interval: e.target.value })}
              disabled={!binarySettings.auto_execution}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire (Dimanche)</option>
              <option value="monthly">Mensuel (Le 1er du mois)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end sticky bottom-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#CBF27A] text-[#0F3D3E] font-semibold rounded-xl hover:bg-[#b8e563] shadow-[0_0_20px_rgba(203,242,122,0.2)] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin w-4 h-4 border-2 border-[#0F3D3E] border-t-transparent rounded-full" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
}
