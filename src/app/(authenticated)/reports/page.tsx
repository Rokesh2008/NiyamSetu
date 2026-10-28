'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowUpDown,
  FileText,
  Download,
  ExternalLink,
  Filter,
  Info,
  BarChart3,
} from 'lucide-react';
import { DEMO_APPLICATIONS } from '@/lib/data';

interface ReportEntry {
  applicationId: string;
  institution: string;
  runId: string;
  rulePackVersion: string;
  date: string;
  documentsAnalysed: number;
  status: string;
  findingsCount: number;
}

const REPORTS: ReportEntry[] = DEMO_APPLICATIONS.filter(
  (a) => a.validationRuns.length > 0
).flatMap((a) =>
  a.validationRuns.map((run) => ({
    applicationId: a.id,
    institution: a.institution,
    runId: run.id,
    rulePackVersion: run.rulePackVersion,
    date: run.startedAt ?? run.completedAt ?? a.lastUpdated,
    documentsAnalysed: run.documentsAnalysed,
    status: run.status,
    findingsCount: a.findings.length,
  }))
);

const ADDITIONAL_REPORTS: ReportEntry[] = [
  {
    applicationId: 'EOA-DEMO-013',
    institution: 'Northstar Institute (Demo)',
    runId: 'RUN-20250810-0900',
    rulePackVersion: 'v1.2.0 (AY 2025–26)',
    date: '10 Aug 2025, 09:00 AM',
    documentsAnalysed: 3,
    status: 'Completed',
    findingsCount: 0,
  },
  {
    applicationId: 'EOA-DEMO-012',
    institution: 'Sample Technical Institute',
    runId: 'RUN-20250809-1430',
    rulePackVersion: 'v1.1.0 (AY 2025–26)',
    date: '09 Aug 2025, 02:30 PM',
    documentsAnalysed: 4,
    status: 'Completed',
    findingsCount: 2,
  },
];

const ALL_REPORTS = [...REPORTS, ...ADDITIONAL_REPORTS];

export default function ReportsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let items = [...ALL_REPORTS];

    if (statusFilter !== 'all') {
      items = items.filter((r) => r.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.applicationId.toLowerCase().includes(q) ||
          r.runId.toLowerCase().includes(q) ||
          r.institution.toLowerCase().includes(q)
      );
    }

    items.sort((a, b) =>
      sortDir === 'desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );

    return items;
  }, [search, statusFilter, sortDir]);

  function handleExportJSON(report: ReportEntry) {
    const data = {
      applicationId: report.applicationId,
      runId: report.runId,
      rulePackVersion: report.rulePackVersion,
      date: report.date,
      documentsAnalysed: report.documentsAnalysed,
      status: report.status,
      findingsCount: report.findingsCount,
      mode: 'Synthetic demo data',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NiyamSetu_Report_${report.runId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <nav className="text-sm text-muted mb-4 flex items-center gap-1.5">
        <Link href="/dashboard" className="hover:text-civic">Home</Link>
        <span>/</span>
        <span className="text-ink font-medium">Reports</span>
      </nav>

      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-3">
            <BarChart3 size={24} className="text-civic" />
            Reports
          </h1>
          <p className="text-muted text-sm mt-1">
            View and download completed validation reports.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted" />
          <select
            className="select-field text-sm"
            style={{ width: 180 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by application ID, run ID, or institution..."
            className="input-field text-sm pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table>
          <thead>
            <tr>
              <th className="pl-4">Application ID</th>
              <th>Institution</th>
              <th>Run ID</th>
              <th>
                <button
                  className="flex items-center gap-1 hover:text-ink"
                  onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                >
                  Date <ArrowUpDown size={12} />
                </button>
              </th>
              <th>Documents</th>
              <th>Findings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <div className="text-muted">
                    <FileText size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="font-medium">No reports found</p>
                    <p className="text-sm mt-1">
                      No validation reports match your search criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((report) => (
                <tr key={report.runId}>
                  <td className="pl-4">
                    <Link
                      href={`/applications/${report.applicationId}`}
                      className="font-medium text-civic hover:underline tabular-nums"
                    >
                      {report.applicationId}
                    </Link>
                  </td>
                  <td className="text-sm">{report.institution}</td>
                  <td className="text-sm tabular-nums font-medium">{report.runId}</td>
                  <td className="text-sm text-muted tabular-nums">{report.date}</td>
                  <td className="text-sm tabular-nums">{report.documentsAnalysed}</td>
                  <td>
                    {report.findingsCount > 0 ? (
                      <span className="badge bg-amber-100 text-amber-700 text-xs">
                        {report.findingsCount} findings
                      </span>
                    ) : (
                      <span className="badge bg-green-100 text-green-700 text-xs">
                        Clear
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge text-xs ${
                        report.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/applications/${report.applicationId}/report/${report.runId}`}
                        className="flex items-center gap-1 text-civic text-sm hover:underline"
                      >
                        <ExternalLink size={14} />
                        View
                      </Link>
                      <button
                        onClick={() => handleExportJSON(report)}
                        className="flex items-center gap-1 text-muted text-sm hover:text-ink"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 text-sm text-muted border-t border-border">
          Showing {filtered.length} of {ALL_REPORTS.length} reports
        </div>
      </div>

      <p className="text-xs text-muted mt-4 flex items-center gap-1.5">
        <Info size={14} />
        Reports are advisory preflight summaries. Synthetic demonstration data; no live authority
        connection.
      </p>
    </div>
  );
}
