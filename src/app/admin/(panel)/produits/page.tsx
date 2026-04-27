"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { Loader2, Search, Package, RefreshCcw, Tag, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/produits?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.handle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`space-y-6 ${inter.className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Produits</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold rounded-xl transition-all border border-white/10">
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link href="/admin/produits/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-[#CBF27A] text-[#0F3D3E] hover:bg-[#b8e060] text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#CBF27A]/20">
            <Package className="w-4 h-4" />
            Nouveau Produit
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/20
            focus:outline-none focus:border-[#CBF27A]/40 transition-all" />
      </div>

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#CBF27A] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">{search ? "Aucun résultat" : "Aucun produit trouvé"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Produit", "Handle", "Catégorie", "Variantes", "Statut", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-white/30 text-[11px] font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                          {product.thumbnail ? (
                            <Image src={product.thumbnail} alt={product.title} width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <Tag className="w-4 h-4 text-white/20" />
                          )}
                        </div>
                        <p className="text-white font-bold">{product.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-white/50 text-xs">{product.handle}</td>
                    <td className="px-4 py-4 text-white/40 text-xs">
                      {product.collection?.title || "—"}
                    </td>
                    <td className="px-4 py-4 text-white/40 text-xs">
                      {product.variants?.length || 0} variante{(product.variants?.length || 0) !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        product.status === "published"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-white/5 text-white/40 border-white/10"
                      }`}>
                        {product.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/produits/${product.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-[#CBF27A]/10
                          text-white/40 hover:text-[#CBF27A] border border-white/10 hover:border-[#CBF27A]/30
                          rounded-lg text-xs font-bold transition-all"
                      >
                        <Pencil className="w-3 h-3" />
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
