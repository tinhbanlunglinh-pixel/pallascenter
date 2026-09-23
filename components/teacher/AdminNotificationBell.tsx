import React, { useState, useEffect, useRef } from 'react';
import {
  AdminNotificationItem,
  getAdminNotifications,
  markNotificationsAsRead,
  clearAdminNotifications,
  subscribeToSync,
  isBellSoundMuted,
  setBellSoundMuted,
  testNotificationSound
} from '../../services/assignmentService';

interface AdminNotificationBellProps {
  onSelectSubmission?: (submissionId: string) => void;
}

export const AdminNotificationBell: React.FC<AdminNotificationBellProps> = ({ onSelectSubmission }) => {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(() => getAdminNotifications());
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => isBellSoundMuted());
  const [activeToast, setActiveToast] = useState<AdminNotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<any>(null);
  const shownToastSubIdsRef = useRef<Set<string>>(new Set());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const refreshList = () => {
    setNotifications(getAdminNotifications());
  };

  const showToastOnce = (subId: string, item: AdminNotificationItem) => {
    if (subId && shownToastSubIdsRef.current.has(subId)) return;
    if (subId) shownToastSubIdsRef.current.add(subId);
    setActiveToast(item);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 7000);
  };

  useEffect(() => {
    refreshList();
    setIsMuted(isBellSoundMuted());

    const unsubscribe = subscribeToSync((event) => {
      if (event.type === 'new_admin_notification') {
        refreshList();
        if (event.data) {
          const item = event.data as AdminNotificationItem;
          showToastOnce(item.submissionId, item);
        }
      } else if (event.type === 'submission_created') {
        refreshList();
        // If the event carries student data (e.g. from SSE realtime handler),
        // display a toast only if this submission hasn't already toasted
        if (event.data && (event.data as any).studentName) {
          const raw = event.data as any;
          const subId = raw.id || '';
          if (!subId || !shownToastSubIdsRef.current.has(subId)) {
            const toastItem: AdminNotificationItem = {
              id: `notif_toast_${Date.now()}`,
              submissionId: subId,
              studentName: raw.studentName || '',
              studentClass: raw.studentClass || '',
              assignmentTitle: raw.assignmentTitle || raw.topic || 'Bài tập',
              score: typeof raw.score === 'number' ? raw.score : 0,
              rawScore: typeof raw.rawScore === 'number' ? raw.rawScore : undefined,
              isLate: !!raw.isLate,
              totalCorrect: raw.totalCorrect ?? 0,
              totalQuestions: raw.totalQuestions ?? 55,
              submittedAt: raw.submittedAt || new Date().toISOString(),
              isRead: false,
              createdAt: raw.submittedAt ? new Date(raw.submittedAt).getTime() : Date.now()
            };
            showToastOnce(subId, toastItem);
          }
        }
      } else if (event.type === 'admin_notifications_read' || event.type === 'admin_notifications_updated') {
        refreshList();
      } else if (event.type === 'bell_sound_toggle') {
        setIsMuted(isBellSoundMuted());
      }
    });

    return () => {
      unsubscribe();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && unreadCount > 0) {
      markNotificationsAsRead();
    }
    setIsOpen(prev => !prev);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearAdminNotifications();
    setNotifications([]);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    setBellSoundMuted(next);
    setIsMuted(next);
  };

  const handleTestSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    testNotificationSound();
  };

  const formatExactSubmissionTime = (submittedAt?: string, createdAt?: number) => {
    const raw = submittedAt || (createdAt ? new Date(createdAt).toISOString() : '');
    if (!raw) return '—';
    const d = new Date(raw);
    if (isNaN(d.getTime())) return '—';

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${hours}:${minutes}:${seconds} • ${day}/${month}/${year}`;
  };

  const formatTimeAgo = (submittedAt?: string, createdAt?: number) => {
    const raw = submittedAt || (createdAt ? new Date(createdAt).toISOString() : '');
    if (!raw) return '';
    const d = new Date(raw);
    const time = d.getTime();
    if (isNaN(time) || time <= 0) return '';
    const diff = Math.floor((Date.now() - time) / 1000);
    if (diff < 15) return 'Vừa mới nộp';
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer border border-white/15 ${
          isMuted ? 'ring-1 ring-amber-400/50' : ''
        }`}
        title={
          isMuted
            ? "Thông báo bài nộp (Đang TẮT tiếng chuông - Bấm để mở menu/bật lại)"
            : "Thông báo bài nộp của học sinh (Chuông đang BẬT)"
        }
      >
        <span className="text-lg">{isMuted ? '🔕' : '🔔'}</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg ring-2 ring-brand-700 animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Toast Notification on new submission */}
      {activeToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border-2 border-brand-500 p-4 animate-slide-in text-slate-800">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-pulse">🎉</span>
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-brand-700">
                  Học Sinh Vừa Nộp Bài!
                </h4>
                <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                  ⏰ {formatExactSubmissionTime(activeToast.submittedAt, activeToast.createdAt)}
                </p>
                <p className="text-[10px] text-brand-600 font-semibold">
                  {formatTimeAgo(activeToast.submittedAt, activeToast.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 font-bold text-xs flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs space-y-1">
            <p className="font-black text-slate-900 text-sm">
              {activeToast.studentName} {activeToast.studentClass ? `(${activeToast.studentClass})` : ''}
            </p>
            <p className="text-slate-600 truncate" title={activeToast.assignmentTitle}>
              📝 {activeToast.assignmentTitle}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className={`font-black px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${
                activeToast.isLate
                  ? 'text-amber-800 bg-amber-50 border-amber-300'
                  : 'text-brand-700 bg-brand-50 border-brand-200'
              }`}>
                <span>⭐ {activeToast.score.toFixed(1)}/10 điểm ({activeToast.totalCorrect}/{activeToast.totalQuestions} câu)</span>
                {activeToast.isLate && (
                  <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full">
                    Quá hạn (-2đ)
                  </span>
                )}
              </span>
              <button
                onClick={() => {
                  setActiveToast(null);
                  if (onSelectSubmission) onSelectSubmission(activeToast.submissionId);
                }}
                className="text-[11px] font-black text-brand-600 hover:text-brand-800 underline cursor-pointer"
              >
                Xem chi tiết →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border-2 border-brand-200 z-50 overflow-hidden animate-scale-up text-slate-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{isMuted ? '🔕' : '🔔'}</span>
              <span className="font-black text-sm uppercase tracking-wide">
                Thông Báo Bài Nộp ({notifications.length})
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-bold text-brand-100 hover:text-white underline cursor-pointer"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Sound Setting Controls Bar */}
          <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Âm chuông:</span>
              <button
                type="button"
                onClick={handleToggleMute}
                className={`px-2.5 py-1 rounded-lg font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isMuted
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300'
                    : 'bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-300'
                }`}
                title={isMuted ? "Bấm để BẬT âm thanh chuông khi có bài nộp" : "Bấm để TẮT chuông nếu không muốn kêu"}
              >
                <span>{isMuted ? '🔕 Đang Tắt' : '🔔 Đang Bật'}</span>
                <span className="text-[10px] font-normal underline">
                  ({isMuted ? 'Bấm để Bật' : 'Bấm để Tắt'})
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleTestSound}
              className="px-2.5 py-1 rounded-lg font-bold text-[11px] text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              title="Phát thử âm thanh chuông thông báo"
            >
              <span>🔊 Thử chuông</span>
            </button>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <span className="text-4xl block">📭</span>
                <p className="text-xs font-semibold">Chưa có thông báo bài nộp mới nào</p>
                <p className="text-[10px] text-slate-400">
                  Khi học sinh nộp bài, thông báo theo giờ thực tế sẽ hiển thị tại đây!
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onSelectSubmission) onSelectSubmission(item.submissionId);
                    setIsOpen(false);
                  }}
                  className={`p-3 hover:bg-brand-50/70 transition-all cursor-pointer flex items-start gap-2.5 ${
                    !item.isRead ? 'bg-brand-50/50 border-l-4 border-l-brand-600' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                    {item.score >= 8 ? '🌟' : item.score >= 5 ? '👍' : '📝'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5">
                      <p className="font-black text-xs text-slate-900 truncate">
                        {item.studentName} {item.studentClass ? `(${item.studentClass})` : ''}
                      </p>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-black text-brand-700 block">
                          ⏰ {formatExactSubmissionTime(item.submittedAt, item.createdAt)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold block">
                          {formatTimeAgo(item.submittedAt, item.createdAt)}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 truncate mt-0.5" title={item.assignmentTitle}>
                      📝 {item.assignmentTitle}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        item.isLate
                          ? 'text-amber-800 bg-amber-100 border border-amber-300'
                          : 'text-brand-700 bg-brand-50 border border-brand-200'
                      }`}>
                        {item.score.toFixed(1)}/10 điểm
                      </span>
                      {item.isLate && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          Quá hạn (-2đ)
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Đúng {item.totalCorrect}/{item.totalQuestions} câu
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
