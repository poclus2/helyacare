"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { Loader2, ArrowLeft, PackagePlus, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function NouveauProduitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    handle: "",
    price: "",
    status: "published" as "published" | "draft",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Préparation du payload pour Medusa (v1 / v2 compatible basique)
      // Note: Le prix en XOF est souvent géré avec 2 décimales implicites dans Medusa, donc on multiplie par 100.
      const priceAmount = Math.round(parseFloat(formData.price || "0") * 100);

      const payload = {
        title: formData.title,
        description: formData.description,
        handle: formData.handle || undefined, // Laisser Medusa générer si vide
        status: formData.status,
        // En Medusa, un produit a besoin d'au moins une option pour avoir des variantes
        options: [{ title: "Défaut", values: ["Unique"] }],
        variants: [
          {
            title: "Standard",
            manage_inventory: false,
            prices: [
              {
                currency_code: "xof",
                amount: priceAmount,
              },
            ],
            options: { "Défaut": "Unique" },
          },
        ],
      };

      const res = await fetch("/api/admin/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erreur ${res.status}`);
      }

      // Succès
      router.push("/admin/produits");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-3xl mx-auto space-y-6 ${inter.className}`}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/produits" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Nouveau Produit</h1>
          <p className="text-white/40 text-sm mt-0.5">Ajouter un produit au catalogue HelyaCare</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Titre */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Titre du produit *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="ex: Crave Control"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all"
            />
          </div>

          {/* Handle */}
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Identifiant URL (Handle)</label>
            <input
              type="text"
              value={formData.handle}
              onChange={e => setFormData({ ...formData, handle: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              placeholder="ex: crave-control (optionnel)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all font-mono"
            />
          </div>

          {/* Prix */}
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Prix (XOF) *</label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                step="1"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="ex: 20000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-16 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">XOF</span>
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Statut de publication</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                formData.status === "published" ? "bg-[#CBF27A]/10 border-[#CBF27A]/30 text-[#CBF27A]" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}>
                <input type="radio" name="status" className="hidden" checked={formData.status === "published"} onChange={() => setFormData({ ...formData, status: "published" })} />
                <span className="font-bold text-sm">Publié sur la boutique</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                formData.status === "draft" ? "bg-white/10 border-white/30 text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}>
                <input type="radio" name="status" className="hidden" checked={formData.status === "draft"} onChange={() => setFormData({ ...formData, status: "draft" })} />
                <span className="font-bold text-sm">Brouillon (Caché)</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée du produit..."
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
          <Link href="/admin/produits" className="px-6 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-sm font-bold transition-all">
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#CBF27A] text-[#0F3D3E] hover:bg-[#b8e060] text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#CBF27A]/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Créer le produit
          </button>
        </div>
      </form>
    </div>
  );
}
