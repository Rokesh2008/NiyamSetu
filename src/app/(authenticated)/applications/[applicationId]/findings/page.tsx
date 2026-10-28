'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  XCircle,
  Info,
  Search,
  ChevronRight,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { DEMO_APPLICATIONS, getFindingStatusColor } from '@/lib/data';

export default function FindingsListPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const app = DEMO_APPLICATIONS.find((a) => a.id === applicationId);
  const findings = app?.findings ?? [];

  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [severityFilters, setSeverityFilters] = useState<string[]>([]);
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of findings) {
      counts[f.status] = (counts[f.status] || 0) + 1;
    }
    counts['Resolved'] = counts['Resolved'] || 0;
    return counts;
  }, [findings]);

  const severityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of findings) {
      counts[f.severity] = (counts[f.severity] || 0) + 1;
    }
    return counts;
  }, [findings]);

  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of findings) {
      counts[f.source] = (counts[f.source] || 0) + 1;
    }
    return counts;
  }, [findings]);

  const filtered = useMemo(() => {
    let result = [...findings];
    if (statusFilters.length > 0) {
      result = result.filter((f) => statusFilters.includes(f.status));
    }
    if (severityFilters.length > 0) {
      result = result.filter((f) => severityFilters.includes(f.severity));
    }
    if (sourceFilters.length > 0) {
      result = result.filter((f) => sourceFilters.includes(f.source));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.ruleId.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    }
    return result;
  }, [findings, statusFilters, severityFilters, sourceFilters, search, sortBy]);

  function toggleFilter(
    current: string[],
    setter: (v: string[]) => void,
    value: string
  ) {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value));
    } else {
      setter([...current, value]);
    }
  }

  function clearAll() {
    setStatusFilters([]);
    setSeverityFilters([]);
    setSourceFilters([]);
    setSearch('');
  }

  function getFindingIcon(status: string) {
    if (status === 'Missing evidence')
      return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
    if (status === 'Context check')
      return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    return (
      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
    );
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
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-muted mb-4 flex items-center gap-1.5">
        <Link href="/applications" className="hover:text-civic">
          Applications
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/applications/${applicationId}`}
          className="hover:text-civic"
        >
          {applicationId}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink">Validation findings</span>
      </div>

      {/* App header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{applicationId}</h1>
            <span className="badge bg-blue-100 text-blue-800">In review</span>
          </div>
          <p className="text-muted text-sm">
            {app.institution} &nbsp;|&nbsp; Submitted on 12 Mar 2025
          </p>
        </div>
        <Link
          href={`/applications/${applicationId}`}
          className="btn-secondary text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          View application
        </Link>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-1">Validation findings</h2>
      <p className="text-muted text-sm mb-6">
        Automated and manual checks on your application. Please review the
        findings and take the required action.
      </p>

      <div className="flex gap-6">
        {/* Left sidebar filters */}
        <div className="w-[220px] flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Filters</h3>
            <button
              onClick={clearAll}
              className="text-civic text-xs hover:underline"
            >
              Clear all
            </button>
          </div>

          {/* Status filter */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold mb-2">Status</h4>
            <label className="flex items-center justify-between text-sm mb-1.5 cursor-pointer">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={statusFilters.length === 0}
                  onChange={() => setStatusFilters([])}
                  className="accent-civic"
                />
                All
              </span>
              <span className="text-muted">{findings.length}</span>
            </label>
            {[
              'Needs review',
              'Missing evidence',
              'Manual review',
              'Context check',
              'Resolved',
            ].map((s) => (
              <label
                key={s}
                className="flex items-center justify-between text-sm mb-1.5 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={statusFilters.includes(s)}
                    onChange={() =>
                      toggleFilter(statusFilters, setStatusFilters, s)
                    }
                    className="accent-civic"
                  />
                  {s}
                </span>
                <span className="text-muted">{statusCounts[s] || 0}</span>
              </label>
            ))}
          </div>

          {/* Severity filter */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold mb-2">Severity</h4>
            <label className="flex items-center justify-between text-sm mb-1.5 cursor-pointer">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={severityFilters.length === 0}
                  onChange={() => setSeverityFilters([])}
                  className="accent-civic"
                />
                All
              </span>
              <span className="text-muted">{findings.length}</span>
            </label>
            {['High', 'Medium', 'Low'].map((s) => (
              <label
                key={s}
                className="flex items-center justify-between text-sm mb-1.5 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={severityFilters.includes(s)}
                    onChange={() =>
                      toggleFilter(severityFilters, setSeverityFilters, s)
                    }
                    className="accent-civic"
                  />
                  {s}
                </span>
                <span className="text-muted">{severityCounts[s] || 0}</span>
              </label>
            ))}
          </div>

          {/* Source filter */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold mb-2">Source</h4>
            <label className="flex items-center justify-between text-sm mb-1.5 cursor-pointer">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sourceFilters.length === 0}
                  onChange={() => setSourceFilters([])}
                  className="accent-civic"
                />
                All
              </span>
              <span className="text-muted">{findings.length}</span>
            </label>
            {['Automated check', 'Manual review', 'System check'].map((s) => (
              <label
                key={s}
                className="flex items-center justify-between text-sm mb-1.5 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sourceFilters.includes(s)}
                    onChange={() =>
                      toggleFilter(sourceFilters, setSourceFilters, s)
                    }
                    className="accent-civic"
                  />
                  {s}
                </span>
                <span className="text-muted">{sourceCounts[s] || 0}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search + Sort */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search findings by keyword, rule or document name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted flex-shrink-0">
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-field w-auto text-sm"
              >
                <option value="newest">Last updated (newest first)</option>
                <option value="oldest">Last updated (oldest first)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="card p-0 overflow-hidden">
            <table>
              <thead>
                <tr>
                  <th className="pl-4">Finding</th>
                  <th>Evidence</th>
                  <th>Rule reference</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Updated</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted">
                      No findings match your search or filters.
                      <button
                        onClick={clearAll}
                        className="text-civic ml-2 hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
                {filtered.map((f) => (
                  <tr key={f.id} className="group">
                    <td className="pl-4">
                      <Link
                        href={`/findings/${f.id}`}
                        className="flex items-start gap-3 no-underline text-inherit"
                      >
                        {getFindingIcon(f.status)}
                        <div>
                          <div className="font-medium text-sm leading-snug">
                            {f.title}
                          </div>
                          <div className="text-xs text-muted mt-0.5 leading-snug">
                            {f.description.length > 80
                              ? f.description.slice(0, 80) + '...'
                              : f.description}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td>
                      {f.evidence ? (
                        <span className="flex items-center gap-1.5 text-sm text-civic">
                          <FileText className="w-3.5 h-3.5" />
                          <span>
                            {f.evidence}
                            <br />
                            <span className="text-muted text-xs">
                              ({f.evidenceSize})
                            </span>
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="text-sm">{f.ruleSource}</td>
                    <td>
                      <span
                        className={`badge ${getFindingStatusColor(f.status)}`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="text-sm">{f.owner}</td>
                    <td className="text-sm text-muted tabular-nums">
                      {f.updatedAt}
                    </td>
                    <td>
                      <Link href={`/findings/${f.id}`}>
                        <ChevronRight className="w-4 h-4 text-muted group-hover:text-civic" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Disclaimer */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            Findings are advisory and do not constitute a final regulatory
            decision. Synthetic demonstration data.
          </div>
        </div>
      </div>
    </div>
  );
}
