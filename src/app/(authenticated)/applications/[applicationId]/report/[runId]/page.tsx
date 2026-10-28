'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Download,
  Code2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { DEMO_APPLICATIONS, getStatusLabel, getStatusColor } from '@/lib/data';

export default function ValidationReportPage({
  params,
}: {
  params: Promise<{ applicationId: string; runId: string }>;
}) {
  const { applicationId, runId } = use(params);

  const app = useMemo(
    () => DEMO_APPLICATIONS.find((a) => a.id === applicationId),
    [applicationId]
  );
  const run = useMemo(
    () => app?.validationRuns.find((r) => r.id === runId),
    [app, runId]
  );

  const checks = [
    {
      icon: FileText,
      check: 'Required documents present',
      status: 'Pass',
      ok: true,
      details: `${app?.documents.length ?? 4} of ${app?.documents.length ?? 4} required documents found`,
    },
    {
      icon: CheckCircle2,
      check: 'Extracted fields confirmed',
      status: 'Pass',
      ok: true,
      details: '22 of 22 key fields confirmed',
    },
    {
      icon: AlertTriangle,
      check: 'Cross-document consistency',
      status: 'Needs review',
      ok: false,
      details: '1 inconsistency found',
    },
    {
      icon: CheckCircle2,
      check: 'Rule checks',
      status: 'Pass',
      ok: true,
      details: 'All applicable rules satisfied (18/18)',
    },
    {
      icon: AlertCircle,
      check: 'Source verification',
      status: 'Not verified',
      ok: false,
      details: 'No live API connection (demo mode)',
    },
  ];

  function handleDownloadPDF() {
    const content = `NIYAMSETU — VALIDATION REPORT
=============================
Application ID: ${app?.id ?? applicationId}
Run ID: ${run?.id ?? runId}
Rule Pack: ${run?.rulePackVersion ?? 'v1.2.0 (AY 2025-26)'}
Executed: ${run?.startedAt ?? '24 Apr 2025, 10:32 AM'}
Documents: ${run?.documentsAnalysed ?? 4}
Mode: Synthetic demo data

VALIDATION SUMMARY
------------------
${checks.map((c) => `${c.ok ? '[PASS]' : '[REVIEW]'} ${c.check}: ${c.details}`).join('\n')}

KEY FINDINGS
------------
${(app?.findings ?? []).map((f) => `- ${f.title}: ${f.description}`).join('\n') || 'None'}

DISCLAIMER
----------
Advisory preflight report — not an AICTE approval or final regulatory decision.
Synthetic data; no live authority connection.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NiyamSetu_Report_${applicationId}_${runId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportJSON() {
    const data = {
      applicationId: app?.id,
      runId: run?.id,
      rulePackVersion: run?.rulePackVersion,
      executedAt: run?.startedAt,
      documentsAnalysed: run?.documentsAnalysed,
      mode: 'Synthetic demo data',
      checks: checks.map((c) => ({
        check: c.check,
        status: c.status,
        details: c.details,
      })),
      findings: app?.findings.map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        severity: f.severity,
        status: f.status,
        ruleId: f.ruleId,
      })),
      documents: app?.documents.map((d) => ({
        name: d.name,
        category: d.category,
        size: d.size,
        status: d.status,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NiyamSetu_Report_${applicationId}_${runId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!app) {
    return (
      <div className="p-8">
        <p className="text-muted">Application not found.</p>
        <Link href="/applications" className="text-civic underline mt-2 inline-block">
          Back to applications
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-4 flex items-center gap-1.5">
        <Link href="/applications" className="hover:text-civic">Applications</Link>
        <span>/</span>
        <Link href={`/applications/${applicationId}`} className="hover:text-civic">{applicationId}</Link>
        <span>/</span>
        <span className="text-ink font-medium">Report</span>
      </nav>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1">Validation report</h1>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-ink">{app.id}</span>
            <span className={`badge ${getStatusColor(app.status)}`}>
              {getStatusLabel(app.status)}
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            B.Tech in Computer Science and Engineering&nbsp;|&nbsp;{app.academicYear}&nbsp;|&nbsp;{app.institution}
          </p>
        </div>
        <Link
          href={`/applications/${applicationId}/findings`}
          className="btn-secondary text-sm"
        >
          <ArrowLeft size={16} />
          Return to findings
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Validation summary */}
          <div className="card">
            <h2 className="text-lg font-semibold text-ink mb-4">Validation summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-3">
                        <c.icon size={18} className="text-muted" />
                        <span className="font-medium">{c.check}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {c.ok ? (
                          <CheckCircle2 size={16} className="text-green-600" />
                        ) : c.status === 'Needs review' ? (
                          <AlertTriangle size={16} className="text-amber-500" />
                        ) : (
                          <AlertCircle size={16} className="text-amber-500" />
                        )}
                        <span
                          className={
                            c.ok
                              ? 'text-green-700 font-medium'
                              : 'text-amber-700 font-medium'
                          }
                        >
                          {c.status}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted">{c.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key findings */}
          {app.findings.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-ink mb-4">Key findings</h2>
              {app.findings
                .filter((f) => f.status !== 'Resolved')
                .slice(0, 2)
                .map((f) => (
                  <div
                    key={f.id}
                    className="border border-border rounded-lg p-4 mb-3 flex items-start justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-ink">{f.title}</p>
                        <p className="text-sm text-muted mt-1">{f.description}</p>
                        {f.id === 'F-001' && (
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-muted">Source locations:</span>
                            <span className="flex items-center gap-1 text-civic">
                              <FileText size={14} /> Application form p.4
                            </span>
                            <span className="flex items-center gap-1 text-civic">
                              <FileText size={14} /> Prior approval p.2
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/findings/${f.id}`}
                      className="btn-secondary text-sm shrink-0 ml-4"
                    >
                      Open evidence
                    </Link>
                  </div>
                ))}
            </div>
          )}

          {/* Unresolved items */}
          <div className="card">
            <h2 className="text-lg font-semibold text-ink mb-4">Unresolved items</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Issue</th>
                  <th>Severity</th>
                  <th>Owner</th>
                  <th>Next action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {app.findings
                  .filter((f) => f.status !== 'Resolved')
                  .map((f, i) => (
                    <tr key={f.id}>
                      <td className="tabular-nums">{i + 1}</td>
                      <td className="font-medium">{f.title}</td>
                      <td>
                        <span
                          className={`badge ${
                            f.severity === 'High'
                              ? 'bg-red-100 text-red-700'
                              : f.severity === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {f.severity}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-gray-100 text-gray-700">{f.owner}</span>
                      </td>
                      <td className="text-sm text-muted">
                        {f.status === 'Needs review'
                          ? 'Confirm intended intake or provide approval for the increase'
                          : f.status === 'Missing evidence'
                            ? 'Upload required document'
                            : 'Review and confirm'}
                      </td>
                      <td>
                        <span className="badge bg-amber-100 text-amber-700">Pending</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={handleDownloadPDF} className="btn-primary">
              <Download size={16} />
              Download PDF
            </button>
            <button onClick={handleExportJSON} className="btn-secondary">
              <Code2 size={16} />
              Export JSON
            </button>
            <Link
              href={`/applications/${applicationId}/findings`}
              className="btn-secondary"
            >
              <ArrowLeft size={16} />
              Return to findings
            </Link>
          </div>

          <p className="text-xs text-muted flex items-center gap-1.5 mt-2">
            <Info size={14} />
            Advisory preflight report — not an AICTE approval or final regulatory decision. Synthetic data; no live authority connection.
          </p>
        </div>

        {/* Right sidebar */}
        <div className="w-[320px] shrink-0 space-y-5">
          <div className="card">
            <h3 className="font-semibold text-ink mb-3">Run details</h3>
            <dl className="text-sm space-y-2.5">
              <div className="flex justify-between">
                <dt className="text-muted">Run ID</dt>
                <dd className="font-medium tabular-nums">{run?.id ?? 'RUN-20250424-1032'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Rule pack version</dt>
                <dd className="font-medium">{run?.rulePackVersion ?? 'v1.2.0 (AY 2025–26)'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Executed at</dt>
                <dd className="font-medium">{run?.startedAt ?? '24 Apr 2025, 10:32 AM'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Documents analysed</dt>
                <dd className="font-medium">{run?.documentsAnalysed ?? 4}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Mode</dt>
                <dd className="font-medium">Synthetic demo data</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Status</dt>
                <dd>
                  <span className="badge bg-amber-100 text-amber-700">Completed with issues</span>
                </dd>
              </div>
            </dl>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 flex items-start gap-2">
              <Info size={14} className="shrink-0 mt-0.5" />
              This is a demonstration using synthetic data. No live connection to AICTE or any government system is made.
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink">
                Documents ({app.documents.length})
              </h3>
              <button className="text-sm text-civic hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {app.documents.map((doc, i) => (
                <div key={doc.id} className="flex items-center gap-3">
                  <FileText size={18} className="text-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {i + 1}. {doc.name}
                    </p>
                    <p className="text-xs text-muted">{doc.size}</p>
                  </div>
                  <span className="badge bg-green-50 text-green-700 text-xs">Processed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
