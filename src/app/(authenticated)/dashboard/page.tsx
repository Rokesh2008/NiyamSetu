'use client';

import Link from 'next/link';
import {
  FileText,
  Settings2,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import {
  DEMO_APPLICATIONS,
  CURRENT_USER,
  getStatusLabel,
  getStatusColor,
  getStatusDot,
  type ApplicationStatus,
} from '@/lib/data';

function getNextAction(status: ApplicationStatus): { label: string; href: string } {
  switch (status) {
    case 'DRAFT':
      return { label: 'Complete details', href: '' };
    case 'PROCESSING':
      return { label: 'Await validation', href: '' };
    case 'NEEDS_CORRECTION':
      return { label: 'Resolve issues', href: '' };
    case 'PREFLIGHT_READY':
      return { label: 'Proceed to submit', href: '' };
    default:
      return { label: 'View', href: '' };
  }
}

export default function DashboardPage() {
  const apps = DEMO_APPLICATIONS;
  const drafts = apps.filter((a) => a.status === 'DRAFT').length;
  const processing = apps.filter((a) => a.status === 'PROCESSING' || a.status === 'VALIDATING').length;
  const needsReview = apps.filter((a) => a.status === 'NEEDS_CORRECTION' || a.status === 'MANUAL_REVIEW').length;
  const ready = apps.filter((a) => a.status === 'PREFLIGHT_READY').length;

  const attentionFindings = apps
    .flatMap((a) => a.findings.map((f) => ({ ...f, appId: a.id })))
    .filter((f) => f.status === 'Needs review' || f.status === 'Missing evidence');

  const summaryCards = [
    { label: 'Drafts', count: drafts, sub: 'Applications in progress', icon: FileText, color: 'text-gray-500', bg: 'bg-gray-50', status: 'DRAFT' as const },
    { label: 'Processing', count: processing, sub: 'Under validation', icon: Settings2, color: 'text-blue-500', bg: 'bg-blue-50', status: 'PROCESSING' as const },
    { label: 'Needs review', count: needsReview, sub: 'Issues to resolve', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', status: 'NEEDS_CORRECTION' as const },
    { label: 'Preflight ready', count: ready, sub: 'Ready for final submission', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', status: 'PREFLIGHT_READY' as const },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-ink)] tracking-tight">
            Good morning, {CURRENT_USER.name.split(' ')[0]}
          </h1>
          <p className="text-[var(--color-muted)] mt-1">Application readiness workspace</p>
        </div>
        <Link href="/applications/new" className="btn-primary">
          <Plus size={18} />
          New preflight
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <Link
            key={card.label}
            href={`/applications?status=${card.status}`}
            className="card flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className={`p-3 rounded-lg ${card.bg}`}>
              <card.icon size={24} className={card.color} />
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)] font-medium">{card.label}</p>
              <p className="text-3xl font-bold text-[var(--color-ink)] tabular-nums">{card.count}</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-[1fr_380px] gap-6">
        {/* Recent Applications Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">Recent applications</h2>
            <Link href="/applications" className="text-sm text-[var(--color-civic)] font-medium flex items-center gap-1 hover:underline">
              View all applications <ArrowRight size={14} />
            </Link>
          </div>

          <table>
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Type</th>
                <th>
                  <span className="flex items-center gap-1">
                    Last updated
                    <svg width="10" height="10" viewBox="0 0 10 10" className="text-[var(--color-muted)]"><path d="M5 2L8 5H2L5 2Z" fill="currentColor" /><path d="M5 8L2 5H8L5 8Z" fill="currentColor" /></svg>
                  </span>
                </th>
                <th>Validation status</th>
                <th>Next action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {apps.slice(0, 5).map((app) => {
                const next = getNextAction(app.status);
                return (
                  <tr key={app.id}>
                    <td>
                      <Link href={`/applications/${app.id}`} className="text-[var(--color-civic)] font-medium hover:underline">
                        {app.id}
                      </Link>
                      <div className="text-xs text-[var(--color-muted)]">AY {app.academicYear}</div>
                    </td>
                    <td className="text-sm">
                      {app.type === 'Extension of Approval' ? 'Extension of Approval (EoA)' : app.type}
                    </td>
                    <td className="text-sm tabular-nums">{app.lastUpdated}</td>
                    <td>
                      <span className={`badge ${getStatusColor(app.status)}`}>
                        <span className={`status-dot ${getStatusDot(app.status)}`}></span>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/applications/${app.id}`}
                        className="text-sm text-[var(--color-civic)] hover:underline"
                      >
                        {next.label}
                      </Link>
                    </td>
                    <td>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreHorizontal size={16} className="text-[var(--color-muted)]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Attention Needed Panel */}
        <div className="card border-l-4 border-l-amber-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">Attention needed</h2>
            {attentionFindings.length > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                {attentionFindings.length}
              </span>
            )}
          </div>

          {attentionFindings.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" />
              <p className="text-sm text-[var(--color-muted)]">No items need your attention right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attentionFindings.map((finding) => (
                <Link
                  key={finding.id}
                  href={`/findings/${finding.id}`}
                  className="block p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-civic)] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-civic)]">{finding.appId}</p>
                      <p className="text-sm font-medium text-[var(--color-ink)] mt-0.5">{finding.title}</p>
                      <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-2">{finding.description}</p>
                      <span
                        className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded ${
                          finding.status === 'Missing evidence'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {finding.status === 'Missing evidence' ? 'Required' : 'Please review'}
                      </span>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-[var(--color-muted)] mt-1 group-hover:text-[var(--color-civic)] transition-colors flex-shrink-0 ml-2"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-muted)]">
        <span>Demo workspace · synthetic records</span>
        <span>NiyamSetu v0.1.0 &nbsp;|&nbsp; Built for a more compliant higher education ecosystem</span>
      </div>
    </div>
  );
}
