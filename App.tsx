import React, { useState, useEffect } from 'react';
import { UserRole, AuthUser } from './types';
import { hasApiKey } from './services/geminiService';
import { initCloudSync, forceCloudSyncNow } from './services/assignmentService';
import { isFirebaseConfigured } from './services/firebaseService';
import { getCurrentUser, logout } from './services/authService';
import { LoginScreen } from './components/LoginScreen';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { SettingsModal } from './components/SettingsModal';
import { LearningHistory } from './components/LearningHistory';
import { VisitCounter } from './components/VisitCounter';
import { PallasContactBlock } from './components/PallasContactBlock';

export const PallasLogo = ({ className = "w-16 h-16", alt = "Trung Tâm Ngoại Ngữ Pallas" }: { className?: string; alt?: string; color?: string }) => (
  <div className={`relative ${className} flex items-center justify-center shrink-0`}>
    <img
      src="https://i.postimg.cc/2S2xgbmX/logo.png"
      alt={alt}
      className="w-full h-full object-contain rounded-full"
      crossOrigin="anonymous"
    />
  </div>
);

function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const user = getCurrentUser();
    if (user) return user.role;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mrs_dung_user_role') as UserRole;
      if (saved === 'teacher' || saved === 'student') return saved;
    }
    return 'teacher'; // default role
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [isHeaderSyncing, setIsHeaderSyncing] = useState(false);

  useEffect(() => {
    const cleanupCloudSync = initCloudSync();
    return () => {
      cleanupCloudSync();
    };
  }, []);

  useEffect(() => {
    const valid = hasApiKey();
    setHasKey(valid);
    if (!valid && currentRole === 'teacher' && currentUser) {
      // Prompt settings on launch for teacher if no key configured
      setShowSettings(true);
    }
  }, [currentRole, currentUser]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('mrs_dung_user_role', role);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'student' && user.name) {
      if (user.username !== 'hocsinh' && user.name !== 'Học Sinh') {
        localStorage.setItem('mrs_dung_selected_student', user.name);
        localStorage.setItem('mrs_dung_active_student_name', user.name);
        if (user.className) {
          localStorage.setItem('mrs_dung_selected_class', user.className);
          localStorage.setItem('mrs_dung_active_class_name', user.className);
        }
      }
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col font-serif text-slate-900">
      {/* Header */}
      <header className="bg-[#480b13] border-b-2 border-[#7d4118] sticky top-0 z-50 shadow-xl font-sans">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl p-1 shadow-lg flex items-center justify-center shrink-0 border border-[#e5a93c]/50">
              <PallasLogo className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-lg md:text-xl font-black text-[#e5a93c] uppercase tracking-tight font-display leading-tight drop-shadow-sm">
                TRUNG TÂM NGOẠI NGỮ PALLAS
              </h1>
              <span className="text-[8px] sm:text-[10px] font-black text-white/90 uppercase tracking-[0.08em] sm:tracking-[0.15em] hidden xs:block">
                Đồng hành cùng học sinh chinh phục tri thức
              </span>
            </div>
          </div>

          {/* Center: Role Switcher / Student Identity */}
          {currentUser.role === 'teacher' ? (
            <div className="flex items-center bg-[#32060d]/90 p-1 rounded-2xl border border-[#7d4118]/60 shadow-inner">
              <button
                onClick={() => handleRoleChange('teacher')}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                  currentRole === 'teacher'
                    ? 'bg-[#6b111c] text-white shadow-lg scale-102 ring-2 ring-[#e5a93c]/50'
                    : 'text-amber-100/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base">👩‍🏫</span>
                <span>Giáo Viên</span>
              </button>

              <button
                onClick={() => handleRoleChange('student')}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                  currentRole === 'student'
                    ? 'bg-[#d98b1a] text-white shadow-lg scale-102 ring-2 ring-[#e5a93c]/50'
                    : 'text-amber-100/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base">🎒</span>
                <span>Xem giao diện HS</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#32060d]/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-[#7d4118]/60 text-white shadow-inner">
              <span className="text-base">{currentUser.avatar || '⭐'}</span>
              <span className="text-xs sm:text-sm font-black tracking-wide text-[#e5a93c]">Học Sinh: {currentUser.name}</span>
              {currentUser.className && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold hidden sm:inline-block">
                  {currentUser.className}
                </span>
              )}
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Compact Visit Counter */}
            <div className="hidden lg:block">
              <VisitCounter compact={true} />
            </div>

            {/* Firebase Connected / Cloud Sync Button */}
            {isFirebaseConfigured() && (
              <button
                onClick={async () => {
                  if (isHeaderSyncing) return;
                  setIsHeaderSyncing(true);
                  try {
                    await forceCloudSyncNow();
                  } finally {
                    setTimeout(() => setIsHeaderSyncing(false), 700);
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Đã kết nối Firebase Realtime Database. Bấm để đồng bộ ngay dữ liệu mới nhất từ đám mây!"
              >
                <span className={`text-xs ${isHeaderSyncing ? 'animate-spin inline-block' : 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse'}`} />
                <span className="hidden md:inline">{isHeaderSyncing ? 'Đang đồng bộ...' : '🔥 Cloud Sync'}</span>
                <span className="md:hidden">{isHeaderSyncing ? '...' : '🔥 Sync'}</span>
              </button>
            )}

            {/* History Button */}
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all"
              title="Xem lịch sử học tập"
            >
              <span className="text-base">📊</span>
              <span className="hidden sm:inline">Lịch sử</span>
            </button>

            {/* Settings Button (For teacher) */}
            {currentUser.role === 'teacher' && (
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all"
                title="Cài đặt API & Đồng bộ"
              >
                <span className="text-base">⚙️</span>
                <span className="hidden sm:inline">Cài đặt</span>
                {!hasKey && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" title="Chưa có API key" />
                )}
              </button>
            )}

            {/* User Profile Info & Logout */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
              <div className="hidden sm:flex flex-col text-right text-white leading-tight">
                <span className="text-xs font-black truncate max-w-[120px]">{currentUser.name}</span>
                <span className="text-[9px] text-brand-200 uppercase font-semibold">
                  {currentUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-rose-500/80 hover:bg-rose-600 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1 shadow-sm"
                title="Đăng xuất khỏi hệ thống"
              >
                <span>🚪</span>
                <span className="hidden md:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace based on Active Role */}
      <main className="max-w-[1500px] mx-auto px-3 sm:px-6 py-6 sm:py-10 flex-grow w-full relative">
        {currentRole === 'teacher' ? (
          <TeacherDashboard
            onOpenSettings={() => setShowSettings(true)}
            onSwitchToStudent={() => handleRoleChange('student')}
          />
        ) : (
          <StudentDashboard />
        )}
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSaved={() => setHasKey(hasApiKey())}
      />

      {showHistory && (
        <LearningHistory onClose={() => setShowHistory(false)} />
      )}
      {/* Footer with Pallas Branding from Image */}
      <footer className="bg-[#36060c] text-white border-t-4 border-[#7d4118] pt-14 pb-8 font-sans">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start mb-10">
            {/* Column 1: Brand Info */}
            <div className="space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="bg-white p-2.5 rounded-2xl w-24 h-24 shadow-2xl border-2 border-[#e5a93c] flex items-center justify-center">
                <PallasLogo className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-black text-xl sm:text-2xl text-[#e5a93c] uppercase tracking-tight font-display leading-tight">
                  TRUNG TÂM NGOẠI NGỮ PALLAS
                </h3>
                <p className="text-white/90 font-bold text-xs uppercase tracking-wider mt-1.5">
                  ĐỒNG HÀNH CÙNG HỌC SINH CHINH PHỤC TRI THỨC
                </p>
                <p className="text-amber-200/95 font-semibold text-sm italic mt-2">
                  "Xây nền từ móng, chinh phục đỉnh cao"
                </p>
              </div>
            </div>

            {/* Column 2: Liên Hệ (From Official Pallas Contact Card) */}
            <PallasContactBlock variant="flat" />

            {/* Column 3: Sứ Mệnh */}
            <div className="space-y-3.5 text-left md:col-span-2 lg:col-span-1">
              <h4 className="font-black text-[#e5a93c] text-lg uppercase tracking-wider border-b border-[#7d4118]/80 pb-2">
                SỨ MỆNH
              </h4>
              <div className="bg-[#480b13]/90 border border-[#6b212f] rounded-2xl p-5 shadow-2xl space-y-3">
                <p className="text-[#e5a93c] font-black text-base italic leading-snug">
                  "Xây nền từ móng, chinh phục đỉnh cao"
                </p>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                  Pallas không chỉ là nơi học tập, mà còn là nơi các con được nuôi dưỡng ước mơ, bồi đắp khát vọng và phát triển từ kiến thức đến kỹ năng sống.
                </p>
                <div className="flex items-center gap-2 pt-2.5 border-t border-white/10">
                  <div className="w-6 h-6 rounded-full bg-white p-0.5 shrink-0 shadow-sm">
                    <PallasLogo className="w-full h-full" />
                  </div>
                  <span className="text-[11px] font-black text-[#e5a93c] tracking-wide uppercase">
                    TRUNG TÂM NGOẠI NGỮ PALLAS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar with Visit Counter & Copyright */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs text-amber-200/80 font-medium">
              © 2026 Trung Tâm Ngoại Ngữ Pallas. Phát triển trên nền tảng Gemini 3.6 & Google Agent Platform. Đồng hành cùng học sinh chinh phục tri thức.
            </p>
            <div>
              <VisitCounter compact={true} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
