'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  ArrowRight,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  Info,
} from 'lucide-react';
import {
  DEMO_APPLICATIONS,
  INSTITUTIONS,
  getStatusLabel,
  getStatusColor,
  getStatusDot,
  type ApplicationStatus,
} from '@/lib/data';

type SortKey = 'id' | 'institution' | 'type' | 'academicYear' | 'lastUpdated' | 'status';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 6;

const STATUS_OPTIONS: ApplicationStatus[] = [
  'DRAFT',
  'UPLOAD_COMPLETE',
  'PROCESSING',
  'EXTRACTION_REVIEW',
  'VALIDATING',
  'VALIDATION_COMPLETE',
  'NEEDS_CORRECTION',
  'MANUAL_REVIEW',
  'PREFLIGHT_READY',
];

export default function ApplicationsListPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [institutionFilter, setInstitutionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastUpdated');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  const uniqueTypes = [...new Set(DEMO_APPLICATIONS.map((a) => a.type))];
  const uniqueYears = [...new Set(DEMO_APPLICATIONS.map((a) => a.academicYear))];

  const filteredApps = useMemo(() => {
    let result = [...DEMO_APPLICATIONS];

    if (institutionFilter) {
      result = result.filter((a) => a.institutionId === institutionFilter);
    }
    if (typeFilter) {
      result = result.filter((a) => a.type === typeFilter);
    }
    if (yearFilter) {
      result = result.filter((a) => a.academicYear === yearFilter);
    }
    if (statusFilter) {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.institution.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [institutionFilter, typeFilter, yearFilter, statusFilter, searchQuery, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredApps.length / PAGE_SIZE));
  const pagedApps = filteredApps.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = institutionFilter || typeFilter || yearFilter || statusFilter || searchQuery;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  function clearFilters() {
    setInstitutionFilter('');
    setTypeFilter('');
    setYearFilter('');
    setStatusFilter('');
    setSearchQuery('');
    setPage(1);
  }

  const SortHeader = ({ label, sortField }: { label: string; sortField: SortKey }) => (
    <th
      className="cursor-pointer select-none hover:text-[var(--color-ink)]"
      onClick={() => handleSort(sortField)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={12} className={sortKey === sortField ? 'text-[var(--color-civic)]' : ''} />
      </span>
    </th>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--color-muted)] mb-4">
        <Link href="/dashboard" className="hover:text-[var(--color-civic)]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-ink)] font-medium">Applications</span>
      </div>

      {/* Warning Banner */}
      <div className="info-banner mb-6">
        <Info size={18} className="text-[var(--color-civic)] flex-shrink-0 mt-0.5" />
        <span>
          <strong>Demo workspace</strong> — synthetic records; not connected to the live AICTE portal.
        </span>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-ink)] tracking-tight">Applications</h1>
          <p className="text-[var(--color-muted)] mt-1">Review and manage preflight cases</p>
        </div>
        <Link href="/applications/new" className="btn-primary">
          <Plus size={18} />
          New preflight
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-ink)] mb-1.5">Institution</label>
            <select
              className="select-field"
              value={institutionFilter}
              onChange={(e) => { setInstitutionFilter(e.target.value); setPage(1); }}
            >
              <option value="">All institutions</option>
              {INSTITUTIONS.map((inst) => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-ink)] mb-1.5">Application type</label>
            <select
              className="select-field"
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            >
              <option value="">All types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-ink)] mb-1.5">Academic year</label>
            <select
              className="select-field"
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
            >
              <option value="">All years</option>
              {uniqueYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-ink)] mb-1.5">Status</label>
            <select
              className="select-field"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{getStatusLabel(s)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="text"
              className="input-field pl-9"
              placeholder="Search by application ID, institution name or remarks..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary whitespace-nowrap">
              <RotateCcw size={14} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-muted)] mb-2">No applications match your search.</p>
            <button onClick={clearFilters} className="text-[var(--color-civic)] text-sm font-medium hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <SortHeader label="Application ID" sortField="id" />
                  <SortHeader label="Institution" sortField="institution" />
                  <th>Type</th>
                  <SortHeader label="Academic year" sortField="academicYear" />
                  <SortHeader label="Last updated" sortField="lastUpdated" />
                  <SortHeader label="Status" sortField="status" />
                  <th>Open</th>
                </tr>
              </thead>
              <tbody>
                {pagedApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <Link href={`/applications/${app.id}`} className="text-[var(--color-civic)] font-medium hover:underline">
                        {app.id}
                      </Link>
                    </td>
                    <td className="text-sm">{app.institution}</td>
                    <td>
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 font-medium whitespace-nowrap">
                        {app.type}
                      </span>
                    </td>
                    <td className="text-sm tabular-nums">{app.academicYear}</td>
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
                        className="inline-flex items-center gap-1 text-sm text-[var(--color-civic)] font-medium hover:underline"
                      >
                        Open <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-muted)]">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredApps.length)} of {filteredApps.length} applications
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded border border-[var(--color-border)] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      p === page
                        ? 'bg-[var(--color-civic)] text-white'
                        : 'border border-[var(--color-border)] hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded border border-[var(--color-border)] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div className="mt-6 flex items-center justify-between text-xs text-[var(--color-muted)]">
        <div className="flex items-center gap-2">
          <span>Demo Institution</span>
          <span>·</span>
          <span>v0.1.0 (Demo)</span>
        </div>
      </div>
    </div>
  );
}
