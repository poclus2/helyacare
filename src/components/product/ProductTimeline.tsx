"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface TimelineProps {
  timeline: {
    title: string;
    subtitle: string;
    linkText: string;
    linkUrl: string;
    steps: Array<{
      duration: string;
      title: string;
      bullets: string[];
      is_faded: boolean;
    }>;
    usage: {
      icon: string;
      title: string;
      instruction: string;
    };
    media: {
      main: string;
      bottom_left: string;
      bottom_right: string;
    };
  } | null;
}

const MediaRenderer = ({ src, alt, fill, className, sizes, autoPlay = true }: any) => {
  if (!src) return <Image src="/placeholder.png" alt={alt} fill={fill} className={className} sizes={sizes} />;
  
  const isVideo = src.match(/\.(mp4|webm|ogg)$/i);
  if (isVideo) {
    return (
      <video 
        src={src} 
        autoPlay={autoPlay}
        loop 
        muted 
        playsInline 
        className={className} 
        style={fill ? { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } : {}}
      />
    );
  }
  return <Image src={src} alt={alt} fill={fill} className={className} sizes={sizes} />;
};

export default function ProductTimeline({ timeline }: TimelineProps) {
  if (!timeline || !timeline.steps || timeline.steps.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-gray-200">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className={`text-3xl md:text-[44px] font-medium text-gray-900 tracking-tight leading-[1.2] mb-4 ${inter.className}`}>
          {timeline.title}
        </h2>
        <p className={`text-[16px] text-gray-800 font-medium mb-2 ${inter.className}`}>
          {timeline.subtitle}
        </p>
        {timeline.linkText && (
          <a href={timeline.linkUrl || "#"} className={`inline-flex items-center text-[13px] font-bold text-[#1B3624] hover:underline underline-offset-4 decoration-1 ${inter.className}`}>
            {timeline.linkText} <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* LEFT COLUMN: Timeline */}
        <div className="lg:col-span-5 relative pl-4 md:pl-8">
          {/* Ligne verticale de la timeline */}
          <div className="absolute top-3 bottom-[200px] left-[19px] md:left-[35px] w-[1px] bg-gray-300"></div>

          <div className="space-y-12 mb-16 relative">
            {timeline.steps.map((step, idx) => (
              <div key={idx} className={`relative flex flex-col items-start ${step.is_faded ? "opacity-40" : "opacity-100"}`}>
                
                {/* Point sur la timeline */}
                <div className="absolute -left-[28px] md:-left-[24px] top-2 w-[5px] h-[5px] bg-[#1B3624] rounded-full"></div>

                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 bg-[#1B3624] text-white text-[11px] font-bold uppercase tracking-wider rounded-full ${inter.className}`}>
                    {step.duration}
                  </span>
                  <h3 className={`text-[16px] font-bold text-gray-900 ${inter.className}`}>
                    {step.title}
                  </h3>
                </div>
                
                <ul className="space-y-2 pl-4">
                  {step.bullets.filter(b => b.trim() !== "").map((bullet, bIdx) => (
                    <li key={bIdx} className={`text-[14px] text-gray-700 flex items-start gap-2 ${inter.className}`}>
                      <span className="text-[#1B3624] font-bold mt-[-2px]">•</span> 
                      <span className="leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Usage Box */}
          <div className="bg-[#FAF9F7] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {timeline.usage?.icon && (
              <div className="relative w-16 h-16 shrink-0">
                <Image src={timeline.usage.icon} alt="Usage icon" fill className="object-contain" />
              </div>
            )}
            <div>
              <h4 className={`text-[14px] font-bold text-gray-900 mb-1 ${inter.className}`}>{timeline.usage?.title || "Comment utiliser :"}</h4>
              <p className={`text-[14px] text-gray-600 leading-snug ${inter.className}`}>
                {timeline.usage?.instruction}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Media Collage */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-4">
            
            {/* Main Media (Top, spans both columns) */}
            <div className="col-span-2 relative aspect-[16/10] bg-gray-200 rounded-[24px] overflow-hidden group">
               <MediaRenderer src={timeline.media?.main} alt="Science" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
               <div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity group-hover:bg-black/20">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1 fill-white" />
                  </div>
               </div>
            </div>

            {/* Bottom Left Media */}
            <div className="relative aspect-[4/3] bg-gray-200 rounded-[24px] overflow-hidden">
               <MediaRenderer src={timeline.media?.bottom_left} alt="Microscopic" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
            </div>

            {/* Bottom Right Media */}
            <div className="relative aspect-square bg-gray-200 rounded-full overflow-hidden self-end w-[85%] mx-auto">
               <MediaRenderer src={timeline.media?.bottom_right} alt="Hand with pills" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
