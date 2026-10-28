'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  Info,
  RefreshCw,
  ExternalLink,
  Shield,
  Loader2,
} from 'lucide-react';
import { DEMO_APPLICATIONS } from '@/lib/data';
import type { VerificationAttempt } from '@/lib/data';

export default function SourceVerificationPage({
  params,
}: {
  params: Promise<{ findingId: string }>;
}) {
  const { findingId } = use(params);

  const app = DEMO_APPLICATIONS.find((a) =>
    a.findings.some((f) => f.id === findingId)
  );
  const finding = app?.findings.find((f) => f.id === findingId);
  const attempts = finding?.verificationAttempts ?? [];

  const [retrying, setRetrying] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  function handleRetry(id: string) {
    setRetrying(id);
    setTimeout(() => setRetrying(null), 2000);
  }

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }

  function getStatusIcon(status: VerificationAttempt['status']) {
    switch (status) {
      case 'Verified':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'Mismatch':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Source unavailable':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'Not supported':
        return <MinusCircle className="w-5 h-5 text-gray-400" />;
      case 'Pending':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  }

  function getStatusBadge(status: VerificationAttempt['status']) {
    const styles: Record<string, string> = {
      Verified: 'bg-green-50 text-green-700',
      Mismatch: 'bg-red-50 text-red-700',
      'Source unavailable': 'bg-amber-50 text-amber-700',
      'Not supported': 'bg-gray-100 text-gray-500',
      Pending: 'bg-blue-50 text-blue-700',
      'Manual review': 'bg-amber-50 text-amber-700',
      Expired: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  }

  if (!finding || !app) {
    return (
      <div className="p-8">
        <p className="text-muted">Finding not found.</p>
        <Link href="/applications" className="text-civic underline mt-2 inline-block">
          Back to applications
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-muted mb-4 flex items-center gap-1.5">
        <Link href="/applications" className="hover:text-civic">
          Applications
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/applications/${app.id}`}
          className="hover:text-civic"
        >
          {app.id}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/findings/${findingId}`}
          className="hover:text-civic"
        >
          Finding {findingId}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink">Source verification</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-1">Source verification</h1>
      <p className="text-muted mb-5">
        Verify information against official sources and records.
      </p>

      {/* Warning banner */}
      <div className="warning-banner mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">
            Prototype mode — responses below are simulated; no live authority
            connection.
          </p>
          <p className="text-xs text-muted mt-1">
            This is a prototype for demonstration purposes only. In production,
            only approved and authorised connectors to government sources will
            be used.
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="card">
            <h2 className="text-lg font-semibold mb-2">
              Verification attempts
            </h2>
            <p className="text-sm text-muted mb-4">
              The following sources were checked for this finding. Results help
              assess the reliability of the information.
            </p>

            <table>
              <thead>
                <tr>
                  <th>Source / Check</th>
                  <th>Provider / Method</th>
                  <th>Checked on</th>
                  <th>Reference number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attempts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted">
                      No verification attempts recorded for this finding.
                    </td>
                  </tr>
                )}
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="font-medium text-sm">
                        {a.source}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {a.description}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">{a.provider}</div>
                      <div className="text-xs text-muted">{a.method}</div>
                    </td>
                    <td className="text-sm tabular-nums">{a.checkedOn}</td>
                    <td className="text-sm font-mono">
                      {a.referenceNumber}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(a.status)}
                        <span
                          className={`text-sm font-medium ${
                            a.status === 'Verified'
                              ? 'text-green-700'
                              : a.status === 'Source unavailable'
                              ? 'text-amber-700'
                              : 'text-gray-500'
                          }`}
                        >
                          {a.status}
                          {a.status === 'Verified' && (
                            <span className="text-xs font-normal block">
                              (simulated)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      {a.status === 'Verified' && (
                        <button className="btn-secondary text-xs py-1.5 px-3">
                          View response
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                      {a.status === 'Source unavailable' && (
                        <button
                          onClick={() => handleRetry(a.id)}
                          disabled={retrying === a.id}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          {retrying === a.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Retrying...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3" />
                              Retry
                            </>
                          )}
                        </button>
                      )}
                      {a.status === 'Not supported' && (
                        <button
                          disabled
                          className="btn-secondary text-xs py-1.5 px-3 opacity-50 cursor-not-allowed"
                        >
                          Not available
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between mt-6">
            <Link
              href={`/findings/${findingId}`}
              className="btn-secondary text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to finding
            </Link>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-primary text-sm"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh status
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-[320px] flex-shrink-0 space-y-5">
          {/* Understanding results */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-civic" />
              <h3 className="font-semibold">Understanding the results</h3>
            </div>

            <div className="info-banner mb-4 text-xs">
              <Info className="w-4 h-4 text-civic flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Source unavailable is not the same as mismatch.
                </p>
                <p className="mt-1 text-muted">
                  A source may be unavailable due to the authority system being
                  offline, restricted access, or the source not supporting this
                  type of check. It does not necessarily mean the information is
                  incorrect.
                </p>
              </div>
            </div>

            <h4 className="text-sm font-semibold mb-3">Status meaning</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Verified</p>
                  <p className="text-xs text-muted">
                    Information matched with the authoritative source
                    (simulated in prototype mode).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Source unavailable</p>
                  <p className="text-xs text-muted">
                    The source could not be reached or did not return a result.
                    You may retry later.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MinusCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Not supported</p>
                  <p className="text-xs text-muted">
                    This source does not support this type of verification at
                    present.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Approved connectors */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-civic" />
              <h3 className="font-semibold text-sm">
                Approved connectors only
              </h3>
            </div>
            <p className="text-xs text-muted">
              In production, NiyamSetu will use only approved and authorised
              connectors to government systems (such as AICTE). Unauthorised or
              unofficial sources will not be used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
