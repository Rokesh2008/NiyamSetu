import { Suspense, type ReactNode } from 'react';
import AuthenticatedShell from '@/components/AuthenticatedShell';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="text-center">
          <div className="text-xl font-bold text-ink mb-2">NiyamSetu</div>
          <div className="text-muted text-sm">Loading...</div>
        </div>
      </div>
    }>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </Suspense>
  );
}
