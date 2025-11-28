import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const handleClick = () => {
    window.open(
      'https://wa.me/919527120377?text=Hello,%20I%20need%20help%20with%20Atropine%20TradingView%20Indicators.',
      '_blank'
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-neon transition-all duration-300 hover:scale-110 group"
      aria-label="WhatsApp Support"
    >
      <MessageCircle className="w-8 h-8 text-white" />
      <span className="absolute -top-12 right-0 bg-panel px-3 py-1 rounded-lg text-sm text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Need help?
      </span>
    </button>
  );
};
