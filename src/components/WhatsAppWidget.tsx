"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppWidget() {
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    // Fetch the whatsapp number on mount
    fetch("/api/settings/whatsapp")
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp_number) {
          // Format number (remove + and spaces for the link)
          const formattedNumber = data.whatsapp_number.replace(/\D/g, "");
          setWhatsappNumber(formattedNumber);
        }
      })
      .catch(console.error);

    // Show after a slight delay instead of relying strictly on scroll
    const timer = setTimeout(() => {
      setShowWidget(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!whatsappNumber || !showWidget) return null;

  const handleWhatsAppClick = () => {
    // Message par défaut encodé
    const message = encodeURIComponent("Bonjour, j'ai besoin d'aide concernant HelyaCare.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      {/* Tooltip / Bubble */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 max-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Support HelyaCare</p>
              <p className="text-xs text-green-600 font-medium">En ligne</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl rounded-tl-none">
            Bonjour 👋<br/>Comment pouvons-nous vous aider aujourd'hui ?
          </p>
          
          <button
            onClick={handleWhatsAppClick}
            className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
          >
            <MessageCircle className="w-4 h-4" />
            Démarrer la discussion
          </button>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => isOpen ? handleWhatsAppClick() : setIsOpen(true)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 transition-all hover:scale-105 group relative"
        aria-label="Chat sur WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        
        {/* Unread badge indicator */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>
    </div>
  );
}
