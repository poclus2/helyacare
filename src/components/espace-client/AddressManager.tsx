"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { Plus, Pencil, Trash2, MapPin, Star, Loader2, Check, X } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface Address {
  id: string;
  first_name?: string;
  last_name?: string;
  address_1: string;
  address_2?: string;
  city: string;
  postal_code?: string;
  country_code: string;
  phone?: string;
  is_default_shipping?: boolean;
}

const COUNTRIES = [
  { code: "sn", label: "Sénégal" },
  { code: "ci", label: "Côte d'Ivoire" },
  { code: "ml", label: "Mali" },
  { code: "bf", label: "Burkina Faso" },
  { code: "cm", label: "Cameroun" },
  { code: "gn", label: "Guinée" },
  { code: "tg", label: "Togo" },
  { code: "bj", label: "Bénin" },
  { code: "ma", label: "Maroc" },
  { code: "fr", label: "France" },
  { code: "be", label: "Belgique" },
];

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  postal_code: "",
  country_code: "sn",
  phone: "",
};

interface Props {
  token?: string;
}

export default function AddressManager({ token }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";
  const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(pubKey && { "x-publishable-api-key": pubKey }),
  };

  // ── Charger les adresses ─────────────────────────────────────────────────
  const loadAddresses = async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch(`${backendUrl}/store/customers/me/addresses`, { headers });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadAddresses(); }, [token]);

  // ── Soumettre (create ou update) ─────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let res: Response;
      if (editId) {
        res = await fetch(`${backendUrl}/store/customers/me/addresses/${editId}`, {
          method: "POST",
          headers,
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch(`${backendUrl}/store/customers/me/addresses`, {
          method: "POST",
          headers,
          body: JSON.stringify(form),
        });
      }
      if (res.ok) {
        await loadAddresses();
        setShowForm(false);
        setEditId(null);
        setForm(EMPTY_FORM);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const d = await res.json();
        setError(d.message || "Erreur lors de la sauvegarde.");
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setSaving(false);
    }
  };

  // ── Supprimer ────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette adresse ?")) return;
    setDeleting(id);
    try {
      await fetch(`${backendUrl}/store/customers/me/addresses/${id}`, {
        method: "DELETE",
        headers,
      });
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch {}
    setDeleting(null);
  };

  // ── Éditer ───────────────────────────────────────────────────────────────
  const handleEdit = (addr: Address) => {
    setForm({
      first_name: addr.first_name || "",
      last_name: addr.last_name || "",
      address_1: addr.address_1 || "",
      address_2: addr.address_2 || "",
      city: addr.city || "",
      postal_code: addr.postal_code || "",
      country_code: addr.country_code || "sn",
      phone: addr.phone || "",
    });
    setEditId(addr.id);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const fieldClass = `w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[14px] 
    focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors ${inter.className}`;
  const labelClass = "text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block";

  // ── UI ────────────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        Connectez-vous pour gérer vos adresses.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${inter.className}`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F3D3E]">Mes adresses</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gérez vos adresses de livraison</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); setError(""); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F3D3E] text-white text-sm font-bold rounded-xl hover:bg-[#1a5556] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        )}
      </div>

      {/* Toast succès */}
      {saved && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold">
          <Check className="w-4 h-4" /> Adresse sauvegardée avec succès
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E8E3DC] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#0F3D3E] text-base">
              {editId ? "Modifier l'adresse" : "Nouvelle adresse"}
            </h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Prénom</label>
              <input className={fieldClass} value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                placeholder="Aminata" />
            </div>
            <div>
              <label className={labelClass}>Nom</label>
              <input className={fieldClass} value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                placeholder="Diallo" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Adresse *</label>
            <input className={fieldClass} value={form.address_1} required
              onChange={e => setForm(f => ({ ...f, address_1: e.target.value }))}
              placeholder="14 Avenue Cheikh Anta Diop" />
          </div>

          <div>
            <label className={labelClass}>Complément d'adresse</label>
            <input className={fieldClass} value={form.address_2}
              onChange={e => setForm(f => ({ ...f, address_2: e.target.value }))}
              placeholder="Appartement, bâtiment, étage..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ville *</label>
              <input className={fieldClass} value={form.city} required
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="Dakar" />
            </div>
            <div>
              <label className={labelClass}>Code postal</label>
              <input className={fieldClass} value={form.postal_code}
                onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))}
                placeholder="10700" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Pays *</label>
              <select className={fieldClass} value={form.country_code} required
                onChange={e => setForm(f => ({ ...f, country_code: e.target.value }))}>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Téléphone</label>
              <input className={fieldClass} value={form.phone} type="tel"
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+221 77 000 00 00" />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl border border-red-200">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-[#0F3D3E] text-white font-bold text-sm rounded-xl hover:bg-[#1a5556] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</> : <><Check className="w-4 h-4" /> Sauvegarder</>}
            </button>
            <button type="button" onClick={handleCancel}
              className="px-5 py-3 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste des adresses */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#0F3D3E] animate-spin" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-14 bg-white border border-dashed border-[#E8E3DC] rounded-2xl">
          <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-medium">Aucune adresse enregistrée</p>
          <p className="text-gray-400 text-xs mt-1">Ajoutez une adresse pour accélérer vos commandes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id}
              className="bg-white border border-[#E8E3DC] rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-[#0F3D3E]/30 transition-colors">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#F2F0EB] rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#0F3D3E]" />
                </div>
                <div>
                  {(addr.first_name || addr.last_name) && (
                    <p className="font-bold text-[#0F3D3E] text-sm mb-0.5">
                      {[addr.first_name, addr.last_name].filter(Boolean).join(" ")}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">{addr.address_1}</p>
                  {addr.address_2 && <p className="text-gray-500 text-sm">{addr.address_2}</p>}
                  <p className="text-gray-600 text-sm">
                    {[addr.postal_code, addr.city].filter(Boolean).join(" ")} · {COUNTRIES.find(c => c.code === addr.country_code)?.label || addr.country_code}
                  </p>
                  {addr.phone && <p className="text-gray-400 text-xs mt-1">{addr.phone}</p>}
                  {addr.is_default_shipping && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-200">
                      <Star className="w-3 h-3" /> Adresse principale
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(addr)}
                  className="p-2 text-gray-400 hover:text-[#0F3D3E] hover:bg-[#F2F0EB] rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(addr.id)} disabled={deleting === addr.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  {deleting === addr.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
