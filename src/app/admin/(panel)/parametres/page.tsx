"use client";

import { useEffect, useState } from "react";
import { Save, Phone } from "lucide-react";

export default function ParametresPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setWhatsapp(data.whatsapp_number || "");
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
        body: JSON.stringify({ whatsapp_number: whatsapp }),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#CBF27A] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Paramètres du Site</h1>
        <p className="text-white/50 text-sm">Gérez les configurations générales de la plateforme HelyaCare.</p>
      </div>

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

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#CBF27A] text-[#0F3D3E] font-semibold rounded-xl hover:bg-[#b8e563] transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin w-4 h-4 border-2 border-[#0F3D3E] border-t-transparent rounded-full" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
