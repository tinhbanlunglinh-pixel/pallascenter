import React from 'react';

interface PallasContactBlockProps {
  className?: string;
  variant?: 'card' | 'flat';
}

export const PallasContactBlock: React.FC<PallasContactBlockProps> = ({
  className = '',
  variant = 'card'
}) => {
  return (
    <div
      className={`font-sans text-white select-none ${
        variant === 'card'
          ? 'bg-[#480b13] border border-[#6b212f]/60 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden'
          : 'bg-transparent'
      } ${className}`}
    >
      {/* Subtle corner glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d98b1a]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header: LIÊN HỆ */}
      <div className="mb-5 pb-3 border-b border-[#7d4118]/80">
        <h3 className="text-xl sm:text-2xl font-black text-[#e5a93c] tracking-wider uppercase font-display drop-shadow-xs">
          LIÊN HỆ
        </h3>
      </div>

      {/* Contact List */}
      <div className="space-y-4 text-left">
        {/* Cơ sở 1 */}
        <div className="flex items-start gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-[#511314] border border-[#6b212f] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-lg">📍</span>
          </div>
          <div className="pt-0.5">
            <p className="text-xs sm:text-sm font-bold text-[#e5a93c] uppercase tracking-wider">
              CƠ SỞ 1
            </p>
            <p className="text-sm sm:text-base font-medium text-white/95 leading-snug mt-0.5">
              SN 31 ngõ 77 Nguyễn Trãi, Phường Kinh Môn, TP Hải Phòng
            </p>
          </div>
        </div>

        {/* Cơ sở 2 */}
        <div className="flex items-start gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-[#511314] border border-[#6b212f] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-lg">📍</span>
          </div>
          <div className="pt-0.5">
            <p className="text-xs sm:text-sm font-bold text-[#e5a93c] uppercase tracking-wider">
              CƠ SỞ 2
            </p>
            <p className="text-sm sm:text-base font-medium text-white/95 leading-snug mt-0.5">
              SN 347 Đường Vũ Mạnh Hùng, Phường Nhị Chiểu, TP Hải Phòng
            </p>
          </div>
        </div>

        {/* Hotline */}
        <div className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-[#511314] border border-[#6b212f] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-lg">📞</span>
          </div>
          <div>
            <a
              href="tel:0979222210"
              className="text-sm sm:text-base font-medium text-white hover:text-[#e5a93c] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Hotline:</span>
              <span className="font-black text-[#e5a93c] text-base sm:text-lg tracking-wide hover:underline">
                0979.2222.10
              </span>
            </a>
          </div>
        </div>

        {/* Fanpage */}
        <div className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-[#511314] border border-[#6b212f] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-lg text-sky-400">🌐</span>
          </div>
          <div>
            <a
              href="https://www.facebook.com/trang.phan.9461799"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base font-medium text-white hover:text-[#e5a93c] transition-colors inline-flex items-center gap-1.5 flex-wrap"
            >
              <span>Fanpage:</span>
              <span className="font-bold text-white hover:text-[#e5a93c] underline decoration-[#e5a93c] decoration-2 underline-offset-4">
                Trung Tâm Ngoại Ngữ Pallas
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
