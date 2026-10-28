'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowUpDown,
  ChevronRight,
  AlertTriangle,
  Clock,
  Filter,
  Info,
} from 'lucide-react';
import {
  DEMO_APPLICATIONS,
  getStatusLabel,
  getStatusColor,
  getStatusDot,
} from '@/lib/data';

export default function ValidationQueuePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'lastUpdated' | 'id'>('lastUpdated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const queueItems = useMemo(() => {
    const reviewStatuses = ['NEEDS_CORRECTION', 'MANUAL_REVIEW', 'EXTRACTION_REVIEW', 'VALIDATION_COMPLETE'] as const;
    let items = DEMO_APPLICATIONS.filter((a) =>
      reviewStatuses.includes(a.status as (typeof reviewStatuses)[number])
    );

    if (statusFilter !== 'all') {
      items = items.filter((a) => a.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.institution.toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => {
      if (sortField === 'id') {
        return sortDir === 'asc'
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      }
      return sortDir === 'asc'
        ? a.lastUpdated.localeCompare(b.lastUpdated)
        : b.lastUpdated.localeCompare(a.lastUpdated);
    });

    return items;
  }, [search, statusFilter, sortField, sortDir]);

  function toggleSort(field: 'lastUpdated' | 'id') {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  const allReviewCount = DEMO_APPLICATIONS.filter((a) =>
    ['NEEDS_CORRECTION', 'MANUAL_REVIEW', 'EXTRACTION_REVIEW', 'VALIDATION_COMPLETE'].includes(a.status)
  ).length;

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <nav className="text-sm text-muted mb-4 flex items-center gap-1.5">
        <Link href="/dashboard" className="hover:text-civic">Home</Link>
        <span>/</span>
        <span className="text-ink font-medium">Validation queue</span>
      </nav>

      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink">Validation queue</h1>
            <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">
              {allReviewCount}
            </span>
          </div>
          <p className="text-muted text-sm mt-1">
            Applications that need review, correction, or manual verification.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted" />
          <select
            className="select-field text-sm"
            style={{ width: 220 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All review statuses</option>
            <option value="NEEDS_CORRECTION">Needs correction</option>
            <option value="MANUAL_REVIEW">Manual review</option>
            <option value="EXTRACTION_REVIEW">Extraction review</option>
            <option value="VALIDATION_COMPLETE">Validation complete</option>
          </select>
        </div>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by application ID or institution..."
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
              <th className="pl-4">
                <button
                  className="flex items-center gap-1 hover:text-ink"
                  onClick={() => toggleSort('id')}
                >
                  Application ID <ArrowUpDown size={12} />
                </button>
              </th>
              <th>Institution</th>
              <th>Type</th>
              <th>Academic year</th>
              <th>
                <button
                  className="flex items-center gap-1 hover:text-ink"
                  onClick={() => toggleSort('lastUpdated')}
                >
                  Last updated <ArrowUpDown size={12} />
                </button>
              </th>
              <th>Status</th>
              <th>Priority</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {queueItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <div className="text-muted">
                    <Clock size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="font-medium">No items in the review queue</p>
                    <p className="text-sm mt-1">
                      {statusFilter !== 'all'
                        ? 'No applications match the selected filter.'
                        : 'All applications are up to date.'}
                    </p>
                    {statusFilter !== 'all' && (
                      <button
                        className="text-civic text-sm mt-2 hover:underline"
                        onClick={() => setStatusFilter('all')}
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              queueItems.map((app) => (
                <tr key={app.id}>
                  <td className="pl-4">
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-medium text-civic hover:underline"
                    >
                      {app.id}
                    </Link>
                  </td>
                  <td className="text-sm">{app.institution}</td>
                  <td>
                    <span className="badge bg-gray-100 text-gray-700 text-xs">
                      {app.type}
                    </span>
                  </td>
                  <td className="text-sm tabular-nums">{app.academicYear}</td>
                  <td className="text-sm text-muted tabular-nums">{app.lastUpdated}</td>
                  <td>
                    <span className={`badge ${getStatusColor(app.status)}`}>
                      <span className={`status-dot ${getStatusDot(app.status)}`} />
                      {getStatusLabel(app.status)}
                    </span>
                  </td>
                  <td>
                    {app.findings.length > 0 ? (
                      <span className="flex items-center gap-1 text-sm text-amber-600">
                        <AlertTriangle size={14} />
                        {app.findings.filter((f) => f.status !== 'Resolved').length} findings
                      </span>
                    ) : (
                      <span className="text-sm text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <Link
                      href={`/applications/${app.id}`}
                      className="flex items-center gap-1 text-civic text-sm hover:underline"
                    >
                      Review <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted mt-4 flex items-center gap-1.5">
        <Info size={14} />
        Validation queue shows applications requiring human review. Findings are advisory.
        Synthetic demonstration data.
      </p>
    </div>
  );
}
