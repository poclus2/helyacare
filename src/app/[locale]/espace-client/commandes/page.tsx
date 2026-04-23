"use client";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Package, Download, Eye, ExternalLink } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const mockOrders = [
  { id: "#HC-9034", date: "15 Avr 2026", total: "20 000 FCFA", items: "1x Crave Control", status: "Livré", color: "bg-green-100 text-green-700" },
  { id: "#HC-8210", date: "15 Mar 2026", total: "20 000 FCFA", items: "1x Crave Control", status: "Livré", color: "bg-green-100 text-green-700" },
  { id: "#HC-7145", date: "15 Fév 2026", total: "40 000 FCFA", items: "2x Crave Control", status: "Livré", color: "bg-green-100 text-green-700" },
  { id: "#HC-6022", date: "15 Jan 2026", total: "20 000 FCFA", items: "1x Crave Control", status: "Annulé", color: "bg-red-100 text-red-700" },
];

export default function CommandesPage() {
  return (
    <div className={`space-y-8 ${pjs.className}`}>
      <div className="bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm">
        
        <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-6 mb-6">
          <div>
            <h2 className={`text-2xl font-bold text-[#0F3D3E] mb-1 ${inter.className}`}>
              Historique des Commandes
            </h2>
            <p className="text-gray-500 text-sm">Consultez vos commandes passées et téléchargez vos factures.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E3DC] text-gray-500 text-xs uppercase tracking-wider">
                <th className="pb-4 font-semibold">Commande</th>
                <th className="pb-4 font-semibold">Date</th>
                <th className="pb-4 font-semibold">Articles</th>
                <th className="pb-4 font-semibold">Total</th>
                <th className="pb-4 font-semibold">Statut</th>
                <th className="pb-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]/60">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors group">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F6F4F1] flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#0F3D3E]" />
                      </div>
                      <span className="font-bold text-[#0F3D3E]">{order.id}</span>
                    </div>
                  </td>
                  <td className="py-5 text-gray-600 text-[15px]">{order.date}</td>
                  <td className="py-5 text-gray-600 text-[15px]">{order.items}</td>
                  <td className="py-5 font-bold text-[#0F3D3E]">{order.total}</td>
                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${order.color}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#0F3D3E] hover:bg-gray-100 rounded-lg transition-colors tooltip" title="Voir les détails">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#0F3D3E] hover:bg-gray-100 rounded-lg transition-colors tooltip" title="Télécharger la facture">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
