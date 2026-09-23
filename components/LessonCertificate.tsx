
import React, { useRef, useEffect, useState } from 'react';
import { toPng } from 'html-to-image';

interface LessonCertificateProps {
  studentName: string;
  topic: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  evaluation: { text: string; emoji: string; praise: string };
  onClose: () => void;
}

export const LessonCertificate: React.FC<LessonCertificateProps> = ({
  studentName,
  topic,
  score,
  totalCorrect,
  totalQuestions,
  evaluation,
  onClose
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [fullDateStr, setFullDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setFullDateStr(`${day}/${month}/${year}`);
  }, []);

  const downloadCert = async () => {
    if (!certRef.current) return;
    try {
      const originalTransform = certRef.current.style.transform;
      certRef.current.style.transform = 'none';

      const dataUrl = await toPng(certRef.current, {
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        width: 900,
        height: 640
      });

      certRef.current.style.transform = originalTransform;

      const link = document.createElement('a');
      link.download = `ChungNhan-${studentName || 'HocSinh'}-${fullDateStr}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert("Lỗi tải chứng nhận, vui lòng thử lại!");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      {/* Control Bar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <h2 className="text-white font-bold text-xl">📜 Giấy chứng nhận</h2>
        <div className="flex gap-3">
          <button onClick={downloadCert} className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-brand-500 transition-all flex items-center gap-2">
            💾 Tải về
          </button>
          <button onClick={onClose} className="bg-slate-700 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-600 transition-all">
            ✕
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div className="relative flex items-center justify-center w-full overflow-hidden">
        <div
          ref={certRef}
          className="w-[900px] h-[640px] bg-white shadow-2xl shrink-0 origin-center scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.85] xl:scale-100 overflow-hidden relative"
        >
          {/* Border Frame - Sang trọng với viền Vàng Kim & Đỏ Hoàng Gia */}
          <div className="absolute inset-3 border-[4px] border-amber-400 pointer-events-none rounded-sm"></div>
          <div className="absolute inset-5 border-[2px] border-brand-700 pointer-events-none"></div>

          {/* Góc trang trí hoàng gia */}
          <div className="absolute top-6 left-6 text-amber-500 text-xl pointer-events-none select-none">⚜️</div>
          <div className="absolute top-6 right-6 text-amber-500 text-xl pointer-events-none select-none">⚜️</div>
          <div className="absolute bottom-6 left-6 text-amber-500 text-xl pointer-events-none select-none">⚜️</div>
          <div className="absolute bottom-6 right-6 text-amber-500 text-xl pointer-events-none select-none">⚜️</div>

          {/* Content Container - Nằm trọn vẹn bên trong khung viền */}
          <div className="absolute inset-8 flex flex-col items-center justify-between px-12 py-7">

            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white p-1 mx-auto mb-1.5 shadow-xl border-2 border-amber-400 flex items-center justify-center">
                <img
                  src="https://i.postimg.cc/2S2xgbmX/logo.png"
                  alt="Logo Pallas"
                  className="w-full h-full object-contain rounded-full"
                  crossOrigin="anonymous"
                />
              </div>
              <p className="text-xs font-black text-brand-700 uppercase tracking-[0.25em] mb-0.5">TRUNG TÂM NGOẠI NGỮ PALLAS</p>
              <h1 className="text-3xl font-black text-brand-800 uppercase tracking-wide">GIẤY CHỨNG NHẬN</h1>
              <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">"Xây nền từ móng, chinh phục đỉnh cao"</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Hoàn thành xuất sắc bài học</p>
            </div>

            {/* Student Name */}
            <div className="text-center">
              <p className="text-xs text-slate-400 italic mb-0.5">Vinh danh học viên:</p>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">{studentName || "Học sinh giỏi"}</h2>
              <div className="w-44 h-1 bg-gradient-to-r from-amber-400 via-brand-600 to-amber-400 mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Topic */}
            <div className="text-center px-8">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">Chủ đề học tập</p>
              <p className="text-base font-bold text-brand-700 italic max-w-md leading-tight mx-auto">"{topic}"</p>
            </div>

            {/* Score Section - Centered and Prominent */}
            <div className="flex items-center justify-center gap-10">
              {/* Score Circle */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-xl border-2 border-amber-300">
                  <div className="text-center">
                    <span className="text-3xl font-black text-white leading-none">{score.toFixed(1)}</span>
                    <span className="text-sm text-white/80 font-bold">/10</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-500 uppercase mt-1 tracking-wider">Điểm số</p>
              </div>

              {/* Evaluation Badge */}
              <div className="text-center">
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl px-5 py-2.5 shadow-md">
                  <p className="text-2xl mb-0.5">{evaluation?.emoji || '⭐'}</p>
                  <p className="text-sm font-black text-amber-800">{evaluation?.text || 'Đạt'}</p>
                  {(() => {
                    const safeTotalQ = totalQuestions > 0 ? totalQuestions : 55;
                    const displayCorr = (totalCorrect === 0 && score > 0) ? Math.round((score / 10) * safeTotalQ) : totalCorrect;
                    return (
                      <p className="text-xs text-slate-500 mt-0.5">Đúng {displayCorr}/{safeTotalQ} câu</p>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="w-full flex justify-between items-end px-4">
              <div className="text-left text-[11px] text-slate-500 leading-tight">
                <p className="text-xs text-slate-400 font-medium">Ngày cấp: {fullDateStr}</p>
                <p className="mt-0.5"><span className="font-bold text-amber-700">CS1:</span> SN 31 ngõ 77 Nguyễn Trãi, Kinh Môn, HP</p>
                <p><span className="font-bold text-amber-700">CS2:</span> SN 347 Vũ Mạnh Hùng, Nhị Chiểu, HP</p>
                <p className="text-xs font-bold text-brand-700 mt-1">Hotline: 0979.2222.10 • Pallas English 🌟</p>
              </div>
              <div className="text-right">
                <div className="w-28 h-0.5 bg-slate-800 mb-2 ml-auto"></div>
                <p className="text-xl font-black text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>Ms. Trang</p>
                <p className="text-xs text-brand-700 font-bold mt-0.5">Giám đốc Trung tâm</p>
                <p className="text-[10px] text-slate-400">Trung Tâm Ngoại Ngữ Pallas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
