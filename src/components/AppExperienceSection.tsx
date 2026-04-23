"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/* ── SVG Score Ring ── */
function ScoreRing({ score = 84 }: { score?: number }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx="80" cy="80" r={r} fill="none" stroke="#E2DDD6" strokeWidth="8" />
        {/* Progress */}
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke="#0F3D3E" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${filled} ${circ - filled}`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2.4rem] font-bold text-[#0F3D3E] leading-none">{score}</span>
        <span className="text-[0.65rem] font-semibold text-[#0F3D3E]/40 uppercase tracking-[1.5px] mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

/* ── Mini AI Chat Bubbles ── */
function ChatPreview() {
  const t = useTranslations("AppExperience");

  return (
    <div className="flex flex-col gap-4 w-full pt-2">
      {/* User */}
      <div className="flex justify-end">
        <div className="bg-[#0F3D3E] text-white text-[0.85rem] font-medium leading-[1.5] px-5 py-3.5 rounded-[18px] rounded-br-[6px] max-w-[85%] shadow-sm">
          {t("chatMsg1")}
        </div>
      </div>
      {/* AI */}
      <div className="flex justify-start gap-3 items-end">
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-[#0F3D3E] shadow-sm mb-1"
          style={{ background: "linear-gradient(135deg, #CBF27A, #3CA0A0)" }}
        >
          H
        </div>
        <div className="bg-[#F6F5F2] text-[#0F3D3E] text-[0.85rem] font-medium leading-[1.5] px-5 py-3.5 rounded-[18px] rounded-bl-[6px] max-w-[85%] border border-[#E2DDD6]/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {t("chatMsg2")}
        </div>
      </div>
      {/* User again */}
      <div className="flex justify-end">
        <div className="bg-[#0F3D3E] text-white text-[0.85rem] font-medium leading-[1.5] px-5 py-3.5 rounded-[18px] rounded-br-[6px] max-w-[85%] shadow-sm">
          {t("chatMsg3")}
        </div>
      </div>
      {/* Typing indicator */}
      <div className="flex justify-start gap-3 items-end">
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-[#0F3D3E] shadow-sm mb-1"
          style={{ background: "linear-gradient(135deg, #CBF27A, #3CA0A0)" }}
        >
          H
        </div>
        <div className="bg-[#F6F5F2] px-5 py-4 rounded-[18px] rounded-bl-[6px] flex gap-2 items-center border border-[#E2DDD6]/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D3E]/40 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D3E]/40 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D3E]/40 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Sparkline SVG ── */
function Sparkline() {
  const points = "0,40 26,32 52,36 78,18 104,24 130,10 156,6";
  return (
    <svg 
      viewBox="0 0 160 48" 
      preserveAspectRatio="xMinYMid meet"
      className="w-full overflow-visible drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" 
      style={{ height: 48, overflow: 'visible' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="156" cy="6" r="5" fill="white" />
      <circle cx="156" cy="6" r="10" fill="white" fillOpacity="0.2" />
    </svg>
  );
}

export default function AppExperienceSection() {
  const t = useTranslations("AppExperience");

  return (
    <section className="w-full bg-[#0F3D3E] py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">

        {/* Section eyebrow */}
        <div className="mb-6 md:mb-8 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#CBF27A] mb-2 block text-center md:text-left">
              {t("eyebrow")}
            </span>
            <h2 className="text-3xl md:text-[2rem] font-bold text-white leading-[1.1] tracking-tight text-center md:text-left">
              {t("title")}
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-white/60 text-sm font-semibold hover:opacity-60 transition-opacity">
            {t("downloadApp")}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* ─── Bento Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1fr] gap-4 md:gap-5 auto-rows-auto">

          {/* ── CARD A: Hero — phone + title (col 1, spans 2 rows) ── */}
          <div
            className="relative rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between border border-[#CBF27A]/10 shadow-2xl lg:col-[1] lg:row-[1_/_3]"
            style={{
              background: "linear-gradient(180deg, #09191A 0%, #050d0e 100%)",
              minHeight: 500,
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(203,242,122,0.12) 0%, transparent 60%)",
              }}
            />

            {/* Capsules image — fills bottom 65% of card */}
            <div className="absolute bottom-0 left-0 right-0 h-[65%] z-10">
              <Image
                src="/hero-capsules.png"
                alt="HelyaCare capsules"
                fill
                className="object-cover object-bottom"
                unoptimized
              />
            </div>

            {/* Gradient: opaque at top for text legibility, fades to transparent to reveal image */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#071314] via-[#071314]/70 to-transparent z-20" />

            {/* Content */}
            <div className="relative z-20 p-6 md:p-10 flex flex-col h-full justify-between">
              <div>
                <span className="inline-block bg-[#CBF27A] text-[#173620] text-[10px] font-bold uppercase tracking-[1.5px] px-3.5 py-1.5 rounded-full mb-4 md:mb-6 shadow-[0_0_15px_rgba(203,242,122,0.2)]">
                  {t("heroBadge")}
                </span>
                <h3 className="text-white text-3xl md:text-[2rem] font-extrabold leading-[1.15] tracking-tight max-w-[240px]">
                  {t("heroTitle1")}<br />{t("heroTitle2")}
                </h3>
                <p className="text-white/60 text-[0.85rem] leading-[1.65] mt-3 md:mt-4 max-w-[220px]">
                  {t("heroDesc")}
                </p>
              </div>

              {/* App store badges */}
              <div className="flex flex-wrap md:flex-nowrap gap-3 mt-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-colors cursor-pointer px-4 py-2.5 rounded-[12px]">
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z" />
                    <path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                  <span className="text-white text-[0.78rem] font-semibold tracking-wide">App Store</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-colors cursor-pointer px-4 py-2.5 rounded-[12px]">
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M3.18 23.76c.3.18.65.19.99.04l12.45-7.2-2.79-2.79zM.33 1.5A1.69 1.69 0 0 0 0 2.55v18.9c0 .38.11.73.33 1.02l.06.05L10.58 12.3v-.23L.39 1.44z" />
                    <path d="M14.1 15.85l-3.52-3.52V12.1l3.52-3.52 3.97 2.3c1.14.65 1.14 1.71 0 2.35z" />
                    <path d="M14.1 8.14L3.18.24C2.84.1 2.48.11 2.18.29L10.58 8.7z" />
                  </svg>
                  <span className="text-white text-[0.78rem] font-semibold tracking-wide">Play Store</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD B: Score Santé — glass (col 2, row 1) ── */}
          <div className="rounded-[24px] md:rounded-[32px] flex flex-col items-center justify-center p-8 md:p-10 gap-6 md:gap-7 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#0F3D3E]/5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-shadow duration-500 lg:col-[2] lg:row-[1]">
            <div className="scale-100 md:scale-105 transform origin-center">
              <ScoreRing score={84} />
            </div>
            <div className="text-center mt-[-10px]">
              <p className="text-[#0F3D3E] text-xl md:text-[1.15rem] font-black mb-1.5 tracking-tight">{t("scoreTitle")}</p>
              <p className="text-[#0F3D3E]/60 text-[13px] md:text-[0.85rem] leading-[1.5] max-w-[200px] font-medium mx-auto">
                {t("scoreDesc")}
              </p>
            </div>
            <div className="flex gap-10 mt-1 border-t border-[#0F3D3E]/10 pt-6 w-[85%] justify-center">
              {[
                { label: t("scoreEnergy"), val: "91%" },
                { label: t("scoreSleep"), val: "78%" },
              ].map((m) => (
                <div key={m.label} className="flex flex-col items-center">
                  <span className="text-[1.3rem] font-black tracking-tight text-[#0F3D3E]">{m.val}</span>
                  <span className="text-[10px] md:text-[0.65rem] uppercase tracking-[1.5px] text-[#0F3D3E]/50 font-bold mt-1">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── CARD C: Résultat stat — orange (col 3, row 1) ── */}
          <div
            className="rounded-[24px] md:rounded-[32px] flex flex-col justify-between p-8 md:p-10 relative overflow-hidden shadow-[0_8px_30px_rgba(229,107,45,0.25)] hover:shadow-[0_12px_45px_rgba(229,107,45,0.35)] transition-shadow duration-500 lg:col-[3] lg:row-[1]"
            style={{ background: "linear-gradient(135deg, #EF7437 0%, #D8561C 100%)" }}
          >
            {/* Subtle light leak for depth */}
            <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-white opacity-10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col">
              <span className="text-white/90 text-[10px] md:text-[0.7rem] font-extrabold uppercase tracking-[2px] block mb-5">
                {t("resultsBadge")}
              </span>
              <div className="mb-4 md:mb-6">
                <span className="text-white text-7xl md:text-[6rem] font-black leading-none tracking-[-0.04em] block drop-shadow-sm">
                  {t("resultsStat")}
                </span>
              </div>
              <p className="text-white text-[15px] md:text-[1.15rem] leading-[1.35] max-w-[200px] font-medium tracking-tight">
                {t("resultsDesc")}
              </p>
            </div>
            <div className="relative z-10 mt-6 md:mt-8">
              <Sparkline />
              <p className="text-white/70 text-[13px] md:text-[0.85rem] mt-4 font-medium">{t("resultsEvolution")}</p>
            </div>
          </div>

          {/* ── CARD D: Chat IA — glass (col 2, row 2) ── */}
          <div className="rounded-[24px] md:rounded-[32px] flex flex-col p-8 md:p-10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#0F3D3E]/5 lg:col-[2] lg:row-[2]">
            <div className="flex items-center gap-3.5 mb-6 md:mb-7 pb-5 border-b border-[#0F3D3E]/5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-[#0F3D3E] flex-shrink-0 shadow-sm"
                style={{ background: "linear-gradient(135deg, #CBF27A, #3ca0a0)" }}
              >
                H
              </div>
              <div className="flex flex-col">
                <span className="text-[#0F3D3E] text-[1rem] font-black leading-tight tracking-tight">{t("chatName")}</span>
                <span className="text-[#0F3D3E]/50 text-[10px] md:text-[0.7rem] font-semibold mt-0.5 uppercase tracking-[1px]">Assistant</span>
              </div>
              <span className="ml-auto w-2.5 h-2.5 rounded-full bg-[#CBF27A] flex-shrink-0 shadow-[0_0_8px_rgba(203,242,122,0.8)]" />
            </div>
            <ChatPreview />
          </div>

          {/* ── CARD E: Checklist — glass (col 3, row 2) ── */}
          <div className="rounded-[24px] md:rounded-[32px] flex flex-col justify-between p-8 md:p-10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#0F3D3E]/5 lg:col-[3] lg:row-[2]">
            <div className="pb-5 border-b border-[#0F3D3E]/5 mb-5">
              <span className="text-[#0F3D3E]/50 text-[10px] md:text-[0.7rem] font-extrabold uppercase tracking-[2px]">
                {t("checkListTitle")}
              </span>
            </div>
            <div className="flex flex-col gap-4 md:gap-5 flex-1 justify-center px-1">
              {[
                t("check1"),
                t("check2"),
                t("check3"),
                t("check4"),
              ].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-[#CBF27A] flex-shrink-0 flex items-center justify-center shadow-sm">
                    <svg width="10" height="10" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#173620" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[#0F3D3E] text-[15px] md:text-[0.9rem] font-medium leading-snug pt-0.5">{item}</span>
                </div>
              ))}
            </div>
            <button className="mt-6 md:mt-8 w-full bg-[#0F3D3E] hover:bg-[#071F1F] text-white text-[15px] md:text-[0.9rem] font-bold py-4 rounded-[16px] transition-all duration-300 hover:shadow-xl hover:shadow-[#0F3D3E]/30 hover:-translate-y-1 active:translate-y-0">
              {t("startBtn")}
            </button>
          </div>

        </div>
        {/* End Bento Grid */}

      </div>
    </section>
  );
}
