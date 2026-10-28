'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import NotificationDrawer from '@/components/NotificationDrawer';
import SearchModal from '@/components/SearchModal';
import { Info } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/dashboard' }];

  if (parts[0] === 'dashboard') {
    return [];
  }

  if (parts[0] === 'applications') {
    crumbs.push({ label: 'Applications', href: '/applications' });
    if (parts[1] && parts[1] !== 'new') {
      crumbs.push({ label: parts[1], href: `/applications/${parts[1]}` });
      if (parts[2] === 'documents') crumbs.push({ label: 'Add documents' });
      if (parts[2] === 'extraction') crumbs.push({ label: 'Evidence extraction' });
      if (parts[2] === 'validation') crumbs.push({ label: 'Validation' });
      if (parts[2] === 'findings') crumbs.push({ label: 'Validation findings' });
      if (parts[2] === 'report') crumbs.push({ label: 'Report' });
    }
    if (parts[1] === 'new') {
      crumbs.push({ label: 'New preflight' });
    }
  }

  if (parts[0] === 'findings') {
    crumbs.push({ label: 'Applications', href: '/applications' });
    if (parts[1]) {
      crumbs.push({ label: `Finding ${parts[1]}`, href: `/findings/${parts[1]}` });
      if (parts[2] === 'verification') crumbs.push({ label: 'Source verification' });
      if (parts[2] === 'resolve') crumbs.push({ label: 'Resolve finding' });
    }
  }

  if (parts[0] === 'rules') crumbs.push({ label: 'Rules reference' });
  if (parts[0] === 'settings') crumbs.push({ label: 'Settings' });
  if (parts[0] === 'reports') crumbs.push({ label: 'Reports' });
  if (parts[0] === 'validation-queue') crumbs.push({ label: 'Validation queue' });

  return crumbs;
}

export default function AuthenticatedShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <TopBar />

        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2.5 text-sm">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-amber-800">
            <strong>Demo workspace</strong> — synthetic records; not connected to the live AICTE portal.
          </span>
        </div>

        {breadcrumbs.length > 0 && (
          <div className="px-6 pt-4 pb-0">
            <nav className="text-sm text-muted flex items-center gap-1.5">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-gray-300">/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="text-civic hover:underline">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-600">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        )}

        <main className="flex-1 px-6 py-5">{children}</main>

        <footer className="px-6 py-3 border-t border-border text-xs text-muted flex items-center justify-between">
          <span>Demo workspace &middot; synthetic records</span>
          <span>
            NiyamSetu v0.1.0 &nbsp;|&nbsp; Built for a more compliant higher education ecosystem
          </span>
        </footer>
      </div>

      <NotificationDrawer />
      <SearchModal />
    </div>
  );
}
