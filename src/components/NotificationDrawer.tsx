'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Bell, BellOff } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function NotificationDrawer() {
  const { notifications, notificationsOpen, toggleNotifications, markNotificationRead } = useApp();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && notificationsOpen) toggleNotifications();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [notificationsOpen, toggleNotifications]);

  if (!notificationsOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={toggleNotifications}
      />
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 w-[380px] bg-white shadow-xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-ink">Notifications</h2>
          <button
            onClick={toggleNotifications}
            className="p-1.5 rounded hover:bg-gray-100 text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <BellOff className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-sm text-muted">No notifications</p>
              <p className="text-xs text-gray-400 mt-1">
                You're all caught up. New notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.findingId) {
                      router.push(`/findings/${n.findingId}`);
                    } else {
                      router.push(`/applications/${n.applicationId}`);
                    }
                    toggleNotifications();
                  }}
                  className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-civic'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ink">{n.title}</div>
                      <div className="text-sm text-muted mt-0.5">{n.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-civic font-medium">{n.action}</span>
                        <span className="text-xs text-gray-400">{n.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
