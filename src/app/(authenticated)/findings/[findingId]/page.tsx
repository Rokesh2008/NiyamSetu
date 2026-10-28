'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  Info,
  ChevronRight,
  UserPlus,
  Mail,
  ClipboardList,
  FileText,
  Minus,
  Plus,
  Search,
} from 'lucide-react';
import { DEMO_APPLICATIONS, getFindingStatusColor } from '@/lib/data';

export default function FindingDetailPage({
  params,
}: {
  params: Promise<{ findingId: string }>;
}) {
  const { findingId } = use(params);

  const app = DEMO_APPLICATIONS.find((a) =>
    a.findings.some((f) => f.id === findingId)
  );
  const finding = app?.findings.find((f) => f.id === findingId);

  const [copied, setCopied] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [zoom1, setZoom1] = useState(100);
  const [zoom2, setZoom2] = useState(100);

  function copyRuleId() {
    if (!finding) return;
    navigator.clipboard.writeText(finding.ruleId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const comparisonData = finding.comparisonData ?? [];
  const totals = comparisonData.reduce(
    (acc, r) => ({
      current: acc.current + r.currentValue,
      prior: acc.prior + r.priorValue,
    }),
    { current: 0, prior: 0 }
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-muted mb-3 flex items-center gap-1.5">
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
        <span className="text-ink">Finding {findingId}</span>
      </div>

      {/* Back link */}
      <Link
        href={`/applications/${app.id}`}
        className="inline-flex items-center gap-1.5 text-civic text-sm mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to application overview
      </Link>

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <span className="text-sm font-semibold text-muted uppercase tracking-wide">
              FINDING {findingId}
            </span>
            <span className={`badge ${getFindingStatusColor(finding.status)}`}>
              {finding.status}
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-3">{finding.title}</h1>
          <p className="text-muted mb-6">{finding.description}</p>

          {/* Comparison table */}
          {comparisonData.length > 0 && (
            <div className="card mb-6">
              <h3 className="font-semibold mb-4">
                Intake comparison (synthetic example data)
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Programme</th>
                    <th className="text-center">
                      Current application
                      <br />
                      <span className="font-normal text-xs">
                        (AY 2025–26) Requested intake
                      </span>
                    </th>
                    <th className="text-center">
                      Prior approval
                      <br />
                      <span className="font-normal text-xs">
                        (AY 2024–25) Approved intake
                      </span>
                    </th>
                    <th className="text-center">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr key={row.programme}>
                      <td className="text-sm">{row.programme}</td>
                      <td className="text-center tabular-nums font-medium">
                        {row.currentValue}
                      </td>
                      <td className="text-center tabular-nums">
                        {row.priorValue}
                      </td>
                      <td className="text-center tabular-nums">
                        {row.difference === 0 || row.difference === null ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <span className="text-amber-600 font-medium">
                            +{row.difference}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2 border-border">
                    <td>Total</td>
                    <td className="text-center tabular-nums">
                      {totals.current}
                    </td>
                    <td className="text-center tabular-nums">
                      {totals.prior}
                    </td>
                    <td className="text-center tabular-nums text-amber-600">
                      +{totals.current - totals.prior}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Source documents */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Source documents</h3>
            <p className="text-sm text-muted mb-4">
              See the extracted values in the original documents. Click to open
              full document.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Doc 1 */}
              <div className="card p-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">
                      Application form · Page 4
                    </span>
                  </div>
                  <Link
                    href="#"
                    className="text-civic text-xs flex items-center gap-1 hover:underline"
                  >
                    Open full document
                  </Link>
                </div>
                <div className="p-4 bg-gray-50 min-h-[200px]">
                  <div className="text-xs font-bold mb-2 text-center">
                    2. PROGRAMMES AND INTAKE DETAILS
                  </div>
                  <table className="text-xs">
                    <thead>
                      <tr>
                        <th className="text-xs p-1.5">S. No.</th>
                        <th className="text-xs p-1.5">Programme</th>
                        <th className="text-xs p-1.5">Level</th>
                        <th className="text-xs p-1.5">
                          Requested Intake (AY 2025-26)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1.5">1</td>
                        <td className="p-1.5">
                          B.Tech – Computer Science and Engineering
                        </td>
                        <td className="p-1.5">UG</td>
                        <td className="p-1.5 font-bold">240</td>
                      </tr>
                      <tr>
                        <td className="p-1.5">2</td>
                        <td className="p-1.5">
                          B.Tech – Electronics and Communication Engineering
                        </td>
                        <td className="p-1.5">UG</td>
                        <td className="p-1.5 font-bold">180</td>
                      </tr>
                      <tr>
                        <td className="p-1.5">3</td>
                        <td className="p-1.5">
                          B.Tech – Mechanical Engineering
                        </td>
                        <td className="p-1.5">UG</td>
                        <td className="p-1.5 font-bold">180</td>
                      </tr>
                      <tr className="font-bold border-t">
                        <td colSpan={3} className="p-1.5">
                          Total
                        </td>
                        <td className="p-1.5">600</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted">
                  <span>Page 4 of 12</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom1(Math.max(50, zoom1 - 25))}
                      className="p-0.5 hover:text-ink"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span>{zoom1}%</span>
                    <button
                      onClick={() => setZoom1(Math.min(200, zoom1 + 25))}
                      className="p-0.5 hover:text-ink"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Doc 2 */}
              <div className="card p-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">
                      Prior approval · Page 2
                    </span>
                  </div>
                  <Link
                    href="#"
                    className="text-civic text-xs flex items-center gap-1 hover:underline"
                  >
                    Open full document
                  </Link>
                </div>
                <div className="p-4 bg-gray-50 min-h-[200px]">
                  <div className="text-xs font-bold mb-2 text-center">
                    APPROVED INTAKE
                  </div>
                  <table className="text-xs">
                    <thead>
                      <tr>
                        <th className="text-xs p-1.5">S. No.</th>
                        <th className="text-xs p-1.5">Programme</th>
                        <th className="text-xs p-1.5">Level</th>
                        <th className="text-xs p-1.5">
                          Approved Intake (AY 2024-25)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1.5">1</td>
                        <td className="p-1.5">
                          B.Tech – Computer Science and Engineering
                        </td>
                        <td className="p-1.5">UG</td>
                        <td className="p-1.5 font-bold">240</td>
                      </tr>
                      <tr>
                        <td className="p-1.5">2</td>
                        <td className="p-1.5">
                          B.Tech – Electronics and Communication Engineering
                        </td>
                        <td className="p-1.5">UG</td>
                        <td className="p-1.5 font-bold">120</td>
                      </tr>
                      <tr>
                        <td className="p-1.5">3</td>
                        <td className="p-1.5">
                          B.Tech – Mechanical Engineering
                        </td>
                        <td className="p-1.5">UG</td>
                        <td className="p-1.5 font-bold">120</td>
                      </tr>
                      <tr className="font-bold border-t">
                        <td colSpan={3} className="p-1.5">
                          Total
                        </td>
                        <td className="p-1.5">480</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted">
                  <span>Page 2 of 6</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom2(Math.max(50, zoom2 - 25))}
                      className="p-0.5 hover:text-ink"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span>{zoom2}%</span>
                    <button
                      onClick={() => setZoom2(Math.min(200, zoom2 + 25))}
                      className="p-0.5 hover:text-ink"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-center gap-2 text-xs text-muted mt-4">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            Advisory finding; not a final regulatory decision. Synthetic data.
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-[300px] flex-shrink-0 space-y-5">
          {/* Status */}
          <div className="card">
            <h3 className="font-semibold mb-3">Status</h3>
            <span className={`badge ${getFindingStatusColor(finding.status)}`}>
              {finding.status}
            </span>
            <p className="text-xs text-muted mt-2">
              Identified by system on 12 Mar 2025, 10:24 AM
            </p>
          </div>

          {/* Rule info */}
          <div className="card">
            <h3 className="font-semibold mb-3">Rule information</h3>
            <p className="text-xs text-muted mb-1">Rule ID</p>
            <div className="flex items-center gap-2 bg-gray-50 rounded px-3 py-2 mb-3">
              <code className="text-sm flex-1 font-mono">
                {finding.ruleId}
              </code>
              <button onClick={copyRuleId} className="text-muted hover:text-ink">
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-xs font-semibold mb-1">
              Applicable rule source
            </p>
            <div className="info-banner text-xs mb-3">
              <Info className="w-4 h-4 text-civic flex-shrink-0 mt-0.5" />
              <span>
                Verified rule reference required before activation
              </span>
            </div>

            <h4 className="text-xs font-semibold mb-2">What this means</h4>
            <p className="text-xs text-muted">
              The requested intake in the current application does not match the
              intake in the prior approval for the same programme(s). This may
              require justification or revised documents. A numeric mismatch has
              been detected, but this alone is not enough to prove
              non-compliance.
            </p>
          </div>

          {/* Extraction details */}
          <div className="card">
            <h4 className="text-xs font-semibold mb-3 flex items-center gap-1">
              Extraction details
              <Info className="w-3 h-3 text-muted" />
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">
                  Current application intake ({totals.current})
                </span>
                <span className="badge bg-green-50 text-green-700 text-[10px]">
                  High confidence
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">
                  Prior approval intake ({totals.prior})
                </span>
                <span className="badge bg-green-50 text-green-700 text-[10px]">
                  High confidence
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Programme mapping</span>
                <span className="badge bg-amber-50 text-amber-700 text-[10px]">
                  Medium confidence
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <h4 className="text-xs font-semibold mb-3">Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => setAssignModal(true)}
                className="btn-primary w-full justify-center text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Assign reviewer
              </button>
              <Link
                href={`/findings/${findingId}/resolve`}
                className="btn-secondary w-full justify-center text-sm"
              >
                <Mail className="w-4 h-4" />
                Request correction from institute
              </Link>
              <button className="btn-secondary w-full justify-center text-sm">
                <ClipboardList className="w-4 h-4" />
                Mark for manual review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assign modal */}
      {assignModal && (
        <div
          className="modal-overlay"
          onClick={() => setAssignModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">Assign reviewer</h3>
            <p className="text-sm text-muted mb-4">
              Select a reviewer to assign this finding to.
            </p>
            <select className="select-field mb-4">
              <option>Select a reviewer...</option>
              <option>Priya Sharma — Application Editor</option>
              <option>Rahul Khanna — Viewer</option>
              <option>Meera Thomas — Compliance Reviewer</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setAssignModal(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAssignModal(false);
                  alert('Reviewer assigned successfully.');
                }}
                className="btn-primary text-sm"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
