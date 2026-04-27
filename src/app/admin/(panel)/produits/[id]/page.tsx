"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Inter } from "next/font/google";
import {
  Loader2, ArrowLeft, Save, AlertCircle, CheckCircle2,
  Trash2, Eye, EyeOff, Tag, Package, FileText, DollarSign,
  ImagePlus, X, Upload, Link2, GripVertical, Star
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface ProductForm {
  title: string;
  description: string;
  handle: string;
  status: "published" | "draft";
  price: string;          // Prix achat unique (XOF)
  price_subscription: string; // Prix abonnement mensuel (XOF)
}

export default function ModifierProduitPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Images ────────────────────────────────────────────────────────────────
  const [thumbnail, setThumbnail] = useState("");       // URL image principale
  const [galleryImages, setGalleryImages] = useState<string[]>([]); // URLs galerie
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");    // Saisie URL manuelle
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [productData, setProductData] = useState<any>(null);
  const [form, setForm] = useState<ProductForm>({
    title: "",
    description: "",
    handle: "",
    status: "published",
    price: "",
    price_subscription: "",
  });

  // — Chargement initial du produit
  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      try {
        const res = await fetch(`/api/admin/produits/${id}`);
        if (!res.ok) throw new Error("Produit introuvable");
        const data = await res.json();
        const product = data.product;
        setProductData(product);

        // Prix
        const priceNormal = product.price_normal
          ? product.price_normal
          : (() => {
              const variant = product.variants?.[0];
              const prices: any[] = Array.isArray(variant?.prices) ? variant.prices : [];
              const xofPrice = prices.find((p: any) => p.currency_code === "xof") || prices[0];
              return xofPrice ? Math.round(Number(xofPrice.amount) / 100) : 0;
            })();
        const priceSub = product.price_subscription || 0;

        // Images
        setThumbnail(product.thumbnail || "");
        setGalleryImages(Array.isArray(product.images) ? product.images : [
          ...(product.thumbnail ? [product.thumbnail] : [])
        ]);

        setForm({
          title: product.title || "",
          description: product.description || "",
          handle: product.handle || "",
          status: product.status || "published",
          price: priceNormal > 0 ? String(priceNormal) : "",
          price_subscription: priceSub > 0 ? String(priceSub) : "",
        });
      } catch (err: any) {
        setError(err.message || "Impossible de charger le produit");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const priceNormal = form.price ? parseFloat(form.price) : 0;
      const priceSub = form.price_subscription ? parseFloat(form.price_subscription) : 0;

      const res = await fetch(`/api/admin/produits/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            title: form.title,
            description: form.description,
            status: form.status,
            thumbnail,
          },
          price: priceNormal,
          price_subscription: priceSub || undefined,
          images: galleryImages,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erreur ${res.status}`);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/produits/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la suppression");
      }
      router.push("/admin/produits");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (fetching) {
    return (
      <div className={`flex items-center justify-center py-32 ${inter.className}`}>
        <Loader2 className="w-8 h-8 text-[#CBF27A] animate-spin" />
      </div>
    );
  }

  if (!productData && !fetching) {
    return (
      <div className={`max-w-3xl mx-auto text-center py-24 ${inter.className}`}>
        <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/40">Produit introuvable.</p>
        <Link href="/admin/produits" className="mt-4 inline-block text-[#CBF27A] text-sm font-bold hover:underline">
          ← Retour aux produits
        </Link>
      </div>
    );
  }

  const variant = productData?.variants?.[0];

  // ── Helpers upload ────────────────────────────────────────────────────────
  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Erreur lors de l'upload");
      return null;
    }
    const { url } = await res.json();
    return url as string;
  };

  const handleThumbFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    const url = await uploadFile(file);
    if (url) {
      setThumbnail(url);
      setGalleryImages(prev => prev.includes(url) ? prev : [url, ...prev]);
    }
    setUploadingThumb(false);
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const handleGalleryFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) setGalleryImages(prev => prev.includes(url) ? prev : [...prev, url]);
    }
    setUploadingGallery(false);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const addImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url || galleryImages.includes(url)) return;
    setGalleryImages(prev => [...prev, url]);
    setNewImageUrl("");
  };

  const removeGalleryImage = (url: string) => {
    setGalleryImages(prev => prev.filter(u => u !== url));
    if (thumbnail === url) {
      const remaining = galleryImages.filter(u => u !== url);
      setThumbnail(remaining[0] || "");
    }
  };

  const setAsThumbnail = (url: string) => setThumbnail(url);

  return (
    <div className={`max-w-3xl mx-auto space-y-6 ${inter.className}`}>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/produits"
          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-white truncate">
            Modifier — {productData?.title}
          </h1>
          <p className="text-white/40 text-sm mt-0.5 font-mono">{productData?.handle}</p>
        </div>
        {/* Statut badge */}
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
          form.status === "published"
            ? "bg-green-500/10 text-green-400 border-green-500/20"
            : "bg-white/5 text-white/40 border-white/10"
        }`}>
          {form.status === "published" ? "● Publié" : "○ Brouillon"}
        </span>
      </div>

      {/* ── SECTION IMAGES ── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <ImagePlus className="w-4 h-4 text-[#CBF27A]" />
          <h2 className="text-white font-bold text-sm">Images du produit</h2>
        </div>

        {/* Image principale */}
        <div className="space-y-3">
          <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Image principale (Thumbnail)</p>
          <div className="flex items-start gap-4">
            {/* Prévisualisation grande */}
            <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-white/5 border-2 border-[#CBF27A]/30 flex items-center justify-center">
              {thumbnail ? (
                <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <Package className="w-8 h-8 text-white/20" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              {/* Upload fichier */}
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbFile}
              />
              <button
                type="button"
                onClick={() => thumbInputRef.current?.click()}
                disabled={uploadingThumb}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#CBF27A]/30 text-white/60 hover:text-white text-xs font-bold rounded-xl transition-all w-full justify-center"
              >
                {uploadingThumb
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Upload en cours...</>
                  : <><Upload className="w-4 h-4" /> Uploader une image</>}
              </button>
              {/* Ou saisir une URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={thumbnail}
                  onChange={e => setThumbnail(e.target.value)}
                  placeholder="https://... ou /uploads/image.jpg"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (thumbnail && !galleryImages.includes(thumbnail))
                      setGalleryImages(prev => [thumbnail, ...prev]);
                  }}
                  title="Ajouter aussi à la galerie"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-[#CBF27A] transition-colors text-xs"
                >
                  +Galerie
                </button>
              </div>
              <p className="text-white/20 text-[10px]">JPG, PNG, WebP · Max 5 MB · Affiché sur la carte boutique et en image hero</p>
            </div>
          </div>
        </div>

        {/* Galerie */}
        <div className="space-y-3">
          <p className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            Galerie ({galleryImages.length} image{galleryImages.length !== 1 ? "s" : ""})
            <span className="text-white/20 font-normal normal-case text-[10px]">— affichée sur la page produit</span>
          </p>

          {/* Grid des images existantes */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {galleryImages.map((url, idx) => (
                <div key={url + idx} className="relative group">
                  <div className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    thumbnail === url
                      ? "border-[#CBF27A] ring-2 ring-[#CBF27A]/20"
                      : "border-white/10 hover:border-white/30"
                  }`}>
                    <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                  {/* Badge principale */}
                  {thumbnail === url && (
                    <span className="absolute top-1.5 left-1.5 bg-[#CBF27A] text-[#0F3D3E] text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      PRINCIPALE
                    </span>
                  )}
                  {/* Actions au survol */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                    {thumbnail !== url && (
                      <button
                        type="button"
                        onClick={() => setAsThumbnail(url)}
                        title="Définir comme image principale"
                        className="w-8 h-8 bg-[#CBF27A] text-[#0F3D3E] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(url)}
                      title="Supprimer"
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ajouter via fichier */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleGalleryFile}
          />
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploadingGallery}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-[#CBF27A]/40 text-white/50 hover:text-white text-xs font-bold rounded-xl transition-all w-full justify-center"
          >
            {uploadingGallery
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Upload en cours...</>
              : <><ImagePlus className="w-4 h-4" /> Ajouter des images (sélection multiple)</>}
          </button>

          {/* Ajouter via URL */}
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
              placeholder="Coller une URL d'image..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all"
            />
            <button
              type="button"
              onClick={addImageUrl}
              disabled={!newImageUrl.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-[#CBF27A]/20 border border-white/10 hover:border-[#CBF27A]/30 text-white/60 hover:text-[#CBF27A] text-xs font-bold rounded-xl transition-all disabled:opacity-30"
            >
              <Link2 className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
          <p className="text-white/20 text-[10px]">⭐ Survol d&apos;une image → cliquer l&apos;étoile pour la définir comme image principale</p>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>Produit mis à jour avec succès !</p>
          </div>
        )}

        {/* Champs principaux */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-[#CBF27A]" />
            <h2 className="text-white font-bold text-sm">Informations générales</h2>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">
              Titre du produit *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="ex: Crave Control"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
                placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all"
            />
          </div>

          {/* Handle (lecture seule) */}
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block flex items-center gap-2">
              Identifiant URL (Handle)
              <span className="text-white/20 text-[10px] font-normal normal-case">— non modifiable</span>
            </label>
            <input
              type="text"
              value={form.handle}
              readOnly
              className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-white/30 text-sm font-mono cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description détaillée du produit..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
                placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all resize-none"
            />
          </div>
        </div>

        {/* Prix */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#CBF27A]" />
            <h2 className="text-white font-bold text-sm">Prix & Tarification</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prix achat unique */}
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">
                Achat Unique (XOF)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="ex: 20000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-16 text-white text-sm
                    placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">XOF</span>
              </div>
              <p className="text-white/20 text-[11px]">Prix affiché barré quand l&apos;abonnement est actif</p>
            </div>

            {/* Prix abonnement mensuel */}
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">
                Abonnement Mensuel (XOF)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price_subscription}
                  onChange={e => setForm({ ...form, price_subscription: e.target.value })}
                  placeholder="ex: 17000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-16 text-white text-sm
                    placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">XOF</span>
              </div>
              {/* Indicateur de remise calculée */}
              {form.price && form.price_subscription && parseFloat(form.price) > 0 && (
                <p className="text-[11px] font-semibold"
                  style={{
                    color: parseFloat(form.price_subscription) < parseFloat(form.price)
                      ? "#CBF27A"
                      : "#f87171"
                  }}
                >
                  {parseFloat(form.price_subscription) < parseFloat(form.price)
                    ? `↓ ${Math.round((1 - parseFloat(form.price_subscription) / parseFloat(form.price)) * 100)}% de remise vs achat unique`
                    : "⚠ Prix abo ≥ prix unique — vérifiez les valeurs"
                  }
                </p>
              )}
            </div>
          </div>

          {/* Aperçu comparatif */}
          {form.price && form.price_subscription && (
            <div className="flex items-center gap-4 bg-white/5 rounded-xl px-5 py-3 text-sm">
              <span className="text-white/40">Aperçu boutique :</span>
              <span className="font-black text-[#CBF27A]">
                {parseInt(form.price_subscription).toLocaleString("fr-FR")} XOF
                <span className="text-[10px] font-semibold text-white/30 ml-1">/mois</span>
              </span>
              <span className="text-white/20 line-through text-xs">
                {parseInt(form.price).toLocaleString("fr-FR")} XOF
              </span>
            </div>
          )}
        </div>

        {/* Publication */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            {form.status === "published" ? (
              <Eye className="w-4 h-4 text-[#CBF27A]" />
            ) : (
              <EyeOff className="w-4 h-4 text-white/40" />
            )}
            <h2 className="text-white font-bold text-sm">Statut de publication</h2>
          </div>

          <div className="flex gap-4">
            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
              form.status === "published"
                ? "bg-[#CBF27A]/10 border-[#CBF27A]/30 text-[#CBF27A]"
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
            }`}>
              <input
                type="radio"
                name="status"
                className="hidden"
                checked={form.status === "published"}
                onChange={() => setForm({ ...form, status: "published" })}
              />
              <Eye className="w-4 h-4" />
              <span className="font-bold text-sm">Publié sur la boutique</span>
            </label>

            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
              form.status === "draft"
                ? "bg-white/10 border-white/30 text-white"
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
            }`}>
              <input
                type="radio"
                name="status"
                className="hidden"
                checked={form.status === "draft"}
                onChange={() => setForm({ ...form, status: "draft" })}
              />
              <EyeOff className="w-4 h-4" />
              <span className="font-bold text-sm">Brouillon (Caché)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {/* Supprimer */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-red-400 hover:text-red-300
              hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40
              text-sm font-bold transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer le produit
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/produits"
              className="px-5 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-sm font-bold transition-all"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#CBF27A] text-[#0F3D3E]
                hover:bg-[#b8e060] text-sm font-bold rounded-xl transition-all
                shadow-lg shadow-[#CBF27A]/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </form>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`bg-[#0c2a2b] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl ${inter.className}`}>
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-white font-extrabold text-lg text-center mb-2">
              Supprimer ce produit ?
            </h3>
            <p className="text-white/40 text-sm text-center mb-6">
              <strong className="text-white/70">{productData?.title}</strong> sera définitivement supprimé de Medusa et disparaîtra de la boutique.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/10 text-sm font-bold transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
