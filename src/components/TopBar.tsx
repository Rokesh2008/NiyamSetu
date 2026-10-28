'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  CircleHelp,
  ChevronDown,
  Building2,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { INSTITUTIONS } from '@/lib/data';

export default function TopBar() {
  const {
    user,
    currentInstitution,
    setCurrentInstitution,
    unreadCount,
    toggleSearch,
    toggleNotifications,
  } = useApp();
  const router = useRouter();

  const [instOpen, setInstOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const instRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (instRef.current && !instRef.current.contains(e.target as Node)) setInstOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setHelpOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        toggleSearch();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return (
    <header className="h-[56px] bg-white border-b border-border flex items-center px-5 gap-4 sticky top-0 z-20">
      {/* Institution Switcher */}
      <div ref={instRef} className="relative">
        <button
          onClick={() => setInstOpen(!instOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-50 text-sm font-medium text-ink transition-colors"
        >
          <Building2 className="w-4 h-4 text-muted" />
          <span>{currentInstitution.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted" />
        </button>
        {instOpen && (
          <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-border rounded-lg shadow-lg py-1 z-50">
            {INSTITUTIONS.map(inst => (
              <button
                key={inst.id}
                onClick={() => { setCurrentInstitution(inst); setInstOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${inst.id === currentInstitution.id ? 'bg-blue-50 text-civic font-medium' : 'text-ink'}`}
              >
                {inst.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto">
        <button
          onClick={toggleSearch}
          className="w-full flex items-center gap-2 px-3.5 py-2 border border-border rounded-lg text-sm text-muted hover:border-gray-400 transition-colors bg-gray-50/50"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search applications, rules, or help...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] text-gray-500 font-mono">
            /
          </kbd>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Help */}
        <div ref={helpRef} className="relative">
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className="p-2 rounded-md hover:bg-gray-100 text-muted transition-colors relative"
            title="Help"
          >
            <CircleHelp className="w-5 h-5" />
          </button>
          {helpOpen && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-border rounded-lg shadow-lg p-4 z-50">
              <h3 className="font-semibold text-sm mb-2">Help & Support</h3>
              <div className="space-y-2 text-sm">
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-civic">
                  User guide
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-civic">
                  Contact support
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-civic">
                  Report an issue
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted">
                NiyamSetu v0.1.0 — Prototype
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          onClick={toggleNotifications}
          className="p-2 rounded-md hover:bg-gray-100 text-muted transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div ref={profileRef} className="relative ml-2">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-civic text-white rounded-full flex items-center justify-center text-xs font-bold">
              {user.avatar}
            </div>
            <span className="text-sm font-medium text-ink hidden lg:inline">
              {user.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted hidden lg:inline" />
          </button>
          {profileOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-border rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-border">
                <div className="text-sm font-semibold text-ink">{user.name}</div>
                <div className="text-xs text-muted">{user.role}</div>
                <div className="text-xs text-muted mt-0.5">{user.email}</div>
              </div>
              <button
                onClick={() => { router.push('/settings'); setProfileOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 text-ink"
              >
                <User className="w-4 h-4 text-muted" />
                Account settings
              </button>
              <button
                onClick={() => { router.push('/settings'); setProfileOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 text-ink"
              >
                <Settings className="w-4 h-4 text-muted" />
                Workspace settings
              </button>
              <div className="h-px bg-border mx-2" />
              <button
                onClick={() => { router.push('/login'); setProfileOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
