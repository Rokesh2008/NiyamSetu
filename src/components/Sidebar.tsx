'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  CheckSquare,
  BarChart3,
  BookOpen,
  Settings,
  Landmark,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: Home },
  { label: 'Applications', href: '/applications', icon: FileText },
  { label: 'Validation queue', href: '/validation-queue', icon: CheckSquare },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Rules reference', href: '/rules', icon: BookOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col bg-sidebar text-white z-30">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 no-underline">
          <Landmark className="w-8 h-8 text-amber-300 shrink-0" />
          <div>
            <div className="text-[20px] font-bold tracking-tight leading-tight text-white">
              NiyamSetu
            </div>
            <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
              Regulatory Document Preflight
              <br />
              for AICTE Filings
            </div>
          </div>
        </Link>
      </div>

      <div className="h-px bg-white/10 mx-4" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="h-px bg-white/10 mx-4" />

      {/* Footer */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-gray-300" />
          </div>
          <div>
            <div className="text-[13px] font-medium text-gray-200 leading-tight">
              Northstar Institute (Demo)
            </div>
            <div className="text-[11px] text-gray-500 leading-tight">
              AICTE Preflight Portal
            </div>
          </div>
        </div>
        <div className="text-[11px] text-gray-500">v0.1.0 (Demo)</div>
      </div>

      <div className="h-px bg-white/10 mx-4" />

      <div className="px-3 py-3">
        <Link href="/login" className="sidebar-link">
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <span>Log out</span>
        </Link>
      </div>
    </aside>
  );
}
