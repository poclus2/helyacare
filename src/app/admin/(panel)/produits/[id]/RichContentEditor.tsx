"use client";

import { Inter } from "next/font/google";
import { Plus, Trash2, GripVertical, FileText, Settings, Image as ImageIcon, Loader2, Package } from "lucide-react";
import { useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface RichContentEditorProps {
  richData: any;
  setRichData: (data: any) => void;
  timelineSection: any;
  setTimelineSection: (data: any) => void;
  uploadFile: (file: File) => Promise<string | null>;
}

export default function RichContentEditor({ richData, setRichData, timelineSection, setTimelineSection, uploadFile }: RichContentEditorProps) {
  
  const handleTimelineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: 'main' | 'bottom_left' | 'bottom_right') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) {
      setTimelineSection({
        ...timelineSection,
        media: { ...timelineSection.media, [key]: url }
      });
    }
  };

  const handleUsageIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) {
      setTimelineSection({
        ...timelineSection,
        usage: { ...timelineSection.usage, icon: url }
      });
    }
  };

  return (
    <div className={`space-y-6 ${inter.className}`}>
      {/* ── INFO GENERALES ── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#CBF27A]" />
          <h2 className="text-white font-bold text-sm">Informations Générales (Marketing)</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Badge</label>
            <input type="text" value={richData.badge} onChange={e => setRichData({...richData, badge: e.target.value})} placeholder="ex: Nouveau" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Label SKU</label>
            <input type="text" value={richData.sku_label} onChange={e => setRichData({...richData, sku_label: e.target.value})} placeholder="ex: crave-control-01" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Note (ex: 4.8)</label>
            <input type="number" step="0.1" value={richData.rating} onChange={e => setRichData({...richData, rating: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Nombre d'avis</label>
            <input type="number" value={richData.reviews_count} onChange={e => setRichData({...richData, reviews_count: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          </div>
        </div>
      </div>

      {/* ── BIENFAITS ── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#CBF27A]" />
            <h2 className="text-white font-bold text-sm">Bienfaits (Accordéon)</h2>
          </div>
          <button type="button" onClick={() => setRichData({...richData, benefits: [...richData.benefits, ""]})} className="text-xs font-bold text-[#CBF27A] hover:underline">+ Ajouter</button>
        </div>
        <div className="space-y-3">
          {richData.benefits.map((b: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={b} onChange={e => {
                const newB = [...richData.benefits];
                newB[i] = e.target.value;
                setRichData({...richData, benefits: newB});
              }} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" placeholder="ex: Réduit les ballonnements" />
              <button type="button" onClick={() => {
                const newB = richData.benefits.filter((_: any, idx: number) => idx !== i);
                setRichData({...richData, benefits: newB});
              }} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
          {richData.benefits.length === 0 && <p className="text-white/40 text-xs text-center py-2">Aucun bienfait. Ajoutez-en un !</p>}
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#CBF27A]" />
          <h2 className="text-white font-bold text-sm">Section Évolution (Timeline)</h2>
        </div>
        
        {/* Entêtes Timeline */}
        <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl">
          <div className="col-span-2 space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Titre principal</label>
            <input type="text" value={timelineSection.title} onChange={e => setTimelineSection({...timelineSection, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Sous-titre</label>
            <input type="text" value={timelineSection.subtitle} onChange={e => setTimelineSection({...timelineSection, subtitle: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Texte lien clinique</label>
            <input type="text" value={timelineSection.linkText} onChange={e => setTimelineSection({...timelineSection, linkText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">URL lien clinique</label>
            <input type="text" value={timelineSection.linkUrl} onChange={e => setTimelineSection({...timelineSection, linkUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          </div>
        </div>

        {/* Étapes Timeline */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white/80 font-bold text-sm">Étapes Temporelles</h3>
            <button type="button" onClick={() => setTimelineSection({
              ...timelineSection, steps: [...timelineSection.steps, { duration: "", title: "", bullets: [""], is_faded: false }]
            })} className="text-xs font-bold text-[#CBF27A] hover:underline">+ Ajouter Étape</button>
          </div>
          
          {timelineSection.steps.map((step: any, i: number) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3">
              <div className="flex gap-4">
                <input type="text" value={step.duration} onChange={e => {
                  const s = [...timelineSection.steps]; s[i].duration = e.target.value; setTimelineSection({...timelineSection, steps: s});
                }} placeholder="Durée (ex: 7 Jours)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                <input type="text" value={step.title} onChange={e => {
                  const s = [...timelineSection.steps]; s[i].title = e.target.value; setTimelineSection({...timelineSection, steps: s});
                }} placeholder="Titre (ex: Réduit les ballonnements)" className="flex-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                <label className="flex items-center gap-2 text-white/60 text-xs">
                  <input type="checkbox" checked={step.is_faded} onChange={e => {
                    const s = [...timelineSection.steps]; s[i].is_faded = e.target.checked; setTimelineSection({...timelineSection, steps: s});
                  }} className="rounded bg-white/10 border-white/20 text-[#CBF27A]" /> Grisé
                </label>
                <button type="button" onClick={() => {
                  const s = timelineSection.steps.filter((_: any, idx: number) => idx !== i);
                  setTimelineSection({...timelineSection, steps: s});
                }} className="text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
              </div>
              <div className="pl-4 border-l-2 border-white/10 space-y-2">
                {step.bullets.map((b: string, j: number) => (
                  <div key={j} className="flex gap-2">
                    <input type="text" value={b} onChange={e => {
                      const s = [...timelineSection.steps]; s[i].bullets[j] = e.target.value; setTimelineSection({...timelineSection, steps: s});
                    }} placeholder="Point clé (bullet)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs" />
                    <button type="button" onClick={() => {
                      const s = [...timelineSection.steps]; s[i].bullets = s[i].bullets.filter((_: any, idx: number) => idx !== j); setTimelineSection({...timelineSection, steps: s});
                    }} className="text-red-400 p-2"><Trash2 className="w-3 h-3"/></button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const s = [...timelineSection.steps]; s[i].bullets.push(""); setTimelineSection({...timelineSection, steps: s});
                }} className="text-[10px] uppercase font-bold text-white/40 hover:text-white">+ Puce</button>
              </div>
            </div>
          ))}
        </div>

        {/* Conseil d'utilisation (Usage) */}
        <div className="bg-white/5 p-4 rounded-xl space-y-3 border border-[#CBF27A]/20">
          <h3 className="text-[#CBF27A] font-bold text-sm mb-2">Conseil d'utilisation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Icône (Image)</label>
                <div className="flex gap-2 items-center">
                  {timelineSection.usage?.icon && <img src={timelineSection.usage.icon} className="w-10 h-10 object-contain bg-black/20 rounded" />}
                  <label className="px-3 py-2 bg-white/10 rounded-xl text-xs text-white cursor-pointer hover:bg-white/20 transition">Upload <input type="file" className="hidden" accept="image/*" onChange={handleUsageIconUpload}/></label>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Titre</label>
                <input type="text" value={timelineSection.usage?.title} onChange={e => setTimelineSection({...timelineSection, usage: {...timelineSection.usage, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Instruction</label>
                <input type="text" value={timelineSection.usage?.instruction} onChange={e => setTimelineSection({...timelineSection, usage: {...timelineSection.usage, instruction: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
             </div>
          </div>
        </div>

        {/* Collage Médias */}
        <div className="space-y-3">
          <h3 className="text-white/80 font-bold text-sm">Médias Collage (Droite)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['main', 'bottom_left', 'bottom_right'].map((key) => (
              <div key={key} className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider block">{key.replace('_', ' ')}</label>
                {timelineSection.media?.[key] && <img src={timelineSection.media[key]} className="w-full h-24 object-cover bg-black/20 rounded mb-2" />}
                <label className="block w-full text-center px-3 py-2 bg-white/10 rounded-xl text-xs text-white cursor-pointer hover:bg-white/20 transition">
                  Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleTimelineImageUpload(e, key as any)} />
                </label>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── INGREDIENTS ── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#CBF27A]" />
            <h2 className="text-white font-bold text-sm">Ingrédients</h2>
          </div>
          <button type="button" onClick={() => setRichData({...richData, ingredients: [...richData.ingredients, { title: "", description: "", icon: "Flower2" }]})} className="text-xs font-bold text-[#CBF27A] hover:underline">+ Ajouter</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {richData.ingredients.map((ing: any, i: number) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex gap-4">
              <select value={ing.icon} onChange={e => {
                const newI = [...richData.ingredients]; newI[i].icon = e.target.value; setRichData({...richData, ingredients: newI});
              }} className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm h-min">
                <option value="Flower2">Fleur</option>
                <option value="Pill">Pilule</option>
                <option value="Dna">ADN</option>
                <option value="Microscope">Microscope</option>
              </select>
              <div className="flex-1 space-y-2">
                <input type="text" value={ing.title} onChange={e => {
                  const newI = [...richData.ingredients]; newI[i].title = e.target.value; setRichData({...richData, ingredients: newI});
                }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-bold" placeholder="Titre (ex: Extrait de Menthe)" />
                <textarea value={ing.description} onChange={e => {
                  const newI = [...richData.ingredients]; newI[i].description = e.target.value; setRichData({...richData, ingredients: newI});
                }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm resize-none" rows={2} placeholder="Description..." />
              </div>
              <button type="button" onClick={() => {
                const newI = richData.ingredients.filter((_: any, idx: number) => idx !== i);
                setRichData({...richData, ingredients: newI});
              }} className="text-red-400 p-2 h-min"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
        </div>
      </div>

      {/* ── CROSS SELL ── */}
      <div className="bg-white/3 border border-[#E56B2D]/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Package className="w-24 h-24 text-[#E56B2D]"/></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-white font-bold text-sm">Pack Complémentaire (Cross-Sell)</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Identifiant Produit (Handle)</label>
              <input type="text" value={richData.cross_sell_handle} onChange={e => setRichData({...richData, cross_sell_handle: e.target.value})} placeholder="ex: crave-control" className="w-full bg-white/5 border border-[#E56B2D]/20 rounded-xl px-4 py-3 text-white text-sm font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Texte d'accroche</label>
              <input type="text" value={richData.cross_sell_text} onChange={e => setRichData({...richData, cross_sell_text: e.target.value})} placeholder="ex: Ajoutez ce produit et économisez" className="w-full bg-white/5 border border-[#E56B2D]/20 rounded-xl px-4 py-3 text-white text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQS ── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#CBF27A]" />
            <h2 className="text-white font-bold text-sm">Foire Aux Questions (FAQ)</h2>
          </div>
          <button type="button" onClick={() => setRichData({...richData, faqs: [...richData.faqs, { question: "", answer: "" }]})} className="text-xs font-bold text-[#CBF27A] hover:underline">+ Ajouter Question</button>
        </div>
        <div className="space-y-4">
          {richData.faqs.map((faq: any, i: number) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex gap-4">
              <div className="flex-1 space-y-2">
                <input type="text" value={faq.question} onChange={e => {
                  const newF = [...richData.faqs]; newF[i].question = e.target.value; setRichData({...richData, faqs: newF});
                }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[#CBF27A] text-sm font-bold" placeholder="Question ?" />
                <textarea value={faq.answer} onChange={e => {
                  const newF = [...richData.faqs]; newF[i].answer = e.target.value; setRichData({...richData, faqs: newF});
                }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm resize-none" rows={3} placeholder="Réponse..." />
              </div>
              <button type="button" onClick={() => {
                const newF = richData.faqs.filter((_: any, idx: number) => idx !== i);
                setRichData({...richData, faqs: newF});
              }} className="text-red-400 p-2 h-min"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
