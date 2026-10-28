'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  AlertTriangle,
  ChevronRight,
  ArrowUpDown,
  Info,
  Copy,
  CheckCircle2,
  Clock,
  MinusCircle,
  Eye,
  Pencil,
  ShieldCheck,
} from 'lucide-react';
import { DEMO_RULES } from '@/lib/data';
import type { Rule } from '@/lib/data';

function getRuleStatusColor(status: string) {
  switch (status) {
    case 'Draft':
      return 'bg-gray-100 text-gray-700';
    case 'In review':
      return 'bg-blue-100 text-blue-700';
    case 'Active in demo':
      return 'bg-green-100 text-green-700';
    case 'Needs source confirmation':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getRuleStatusDot(status: string) {
  switch (status) {
    case 'Draft':
      return 'bg-gray-400';
    case 'In review':
      return 'bg-blue-500';
    case 'Active in demo':
      return 'bg-green-500';
    case 'Needs source confirmation':
      return 'bg-amber-500';
    default:
      return 'bg-gray-400';
  }
}

function getTestStatusColor(status: string) {
  switch (status) {
    case 'Passed':
      return 'text-green-600';
    case 'In review':
      return 'text-blue-600';
    case 'Not run':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
}

export default function RulesReferencePage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState<string>(DEMO_RULES[0]?.id ?? '');
  const [copiedId, setCopiedId] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    return DEMO_RULES.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.id.toLowerCase().includes(q) &&
          !r.check.toLowerCase().includes(q) &&
          !r.condition.toLowerCase().includes(q)
        )
          return false;
      }
      if (typeFilter && r.applicationType !== typeFilter) return false;
      if (yearFilter && r.academicYear !== yearFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    });
  }, [search, typeFilter, yearFilter, statusFilter]);

  const selectedRule: Rule | undefined =
    filtered.find((r) => r.id === selectedRuleId) ?? filtered[0];

  function handleCopyId() {
    if (selectedRule) {
      navigator.clipboard.writeText(selectedRule.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 1500);
    }
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-4 flex items-center gap-1.5">
        <Link href="/dashboard" className="hover:text-civic">Admin</Link>
        <span>/</span>
        <span className="text-ink font-medium">Rules reference</span>
      </nav>

      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-ink">Rules reference</h1>
          <p className="text-muted text-sm mt-1">
            Manage and review AICTE rules, checks and their implementation logic.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={16} />
          Add new rule
        </button>
      </div>

      {/* Warning banner */}
      <div className="warning-banner mb-5">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Only reviewed rule packs can be activated</p>
          <p className="text-sm text-muted">
            All rules must be verified against official AICTE documents before activation. This is a prototype and uses a limited set of sample rules for demonstration.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div>
          <label className="text-xs text-muted block mb-1">Application type</label>
          <select
            className="select-field text-sm"
            style={{ width: 200 }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All types</option>
            <option value="Extension of Approval (EOA)">Extension of Approval (EOA)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Academic year</label>
          <select
            className="select-field text-sm"
            style={{ width: 160 }}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All years</option>
            <option value="2024–25">2024–25</option>
            <option value="2025–26">2025–26</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Status</label>
          <select
            className="select-field text-sm"
            style={{ width: 180 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="In review">In review</option>
            <option value="Active in demo">Active in demo</option>
            <option value="Needs source confirmation">Needs source confirmation</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted block mb-1">&nbsp;</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search rules..."
              className="input-field text-sm pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Rules table */}
        <div className="flex-1 min-w-0">
          <div className="card p-0 overflow-hidden">
            <table>
              <thead>
                <tr>
                  <th className="pl-4">
                    <span className="flex items-center gap-1">
                      Rule ID <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th>
                    <span className="flex items-center gap-1">
                      Check <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th>Application type</th>
                  <th>Academic year</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted">
                      No rules match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((rule) => (
                    <tr
                      key={rule.id}
                      className={`cursor-pointer ${
                        selectedRule?.id === rule.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedRuleId(rule.id)}
                    >
                      <td className="pl-4 font-medium text-sm tabular-nums text-civic">
                        {rule.id}
                      </td>
                      <td className="text-sm">{rule.check}</td>
                      <td className="text-sm text-muted">{rule.applicationType}</td>
                      <td className="text-sm tabular-nums">{rule.academicYear}</td>
                      <td className="text-sm tabular-nums">{rule.version}</td>
                      <td>
                        <span className={`badge ${getRuleStatusColor(rule.status)}`}>
                          <span
                            className={`status-dot ${getRuleStatusDot(rule.status)}`}
                          />
                          {rule.status}
                        </span>
                      </td>
                      <td className="text-sm text-muted max-w-[150px] truncate">
                        {rule.source}
                      </td>
                      <td>
                        <ChevronRight size={16} className="text-muted" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted mt-4 flex items-center gap-1.5">
            <Info size={14} />
            NiyamSetu&nbsp;|&nbsp;AICTE Compliance Assistant (Prototype). Rule pack is incomplete. Synthetic data is used.
          </p>
        </div>

        {/* Rule detail panel */}
        {selectedRule && (
          <div className="w-[380px] shrink-0 space-y-4">
            <div className="card">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-ink text-lg leading-tight">
                  {selectedRule.id}
                </h3>
                <span className={`badge ${getRuleStatusColor(selectedRule.status)} text-xs`}>
                  <span
                    className={`status-dot ${getRuleStatusDot(selectedRule.status)}`}
                  />
                  {selectedRule.status}
                </span>
              </div>
              <p className="text-xs text-muted mb-3">
                {selectedRule.version}&nbsp;|&nbsp;Last edited{' '}
                {selectedRule.versionHistory[0]?.date}&nbsp;|&nbsp;By{' '}
                {selectedRule.versionHistory[0]?.by}
              </p>
              <p className="text-sm text-muted mb-4">{selectedRule.check}</p>

              <h4 className="font-semibold text-sm text-ink mb-2">Rule condition</h4>
              <div className="bg-gray-50 border border-border rounded p-3 text-sm font-mono whitespace-pre-wrap mb-4">
                {selectedRule.condition}
              </div>

              <h4 className="font-semibold text-sm text-ink mb-2">Required inputs</h4>
              <ul className="text-sm text-muted list-disc pl-5 space-y-1 mb-4">
                {selectedRule.requiredInputs.map((input, i) => (
                  <li key={i}>{input}</li>
                ))}
              </ul>

              <h4 className="font-semibold text-sm text-ink mb-2">
                Source clause (requires official verification)
              </h4>
              <div className="p-3 bg-green-50 border border-green-200 rounded text-sm flex items-start gap-2 mb-4">
                <Info size={14} className="text-green-700 shrink-0 mt-0.5" />
                <span className="text-green-800">{selectedRule.sourceClause}</span>
              </div>

              {/* Test cases */}
              {selectedRule.testCases.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-ink">
                      Test cases ({selectedRule.testCases.length})
                    </h4>
                    <button className="text-xs text-civic hover:underline">
                      View all ({selectedRule.testCases.length})
                    </button>
                  </div>
                  <table className="text-xs mb-4">
                    <thead>
                      <tr>
                        <th className="text-xs">#</th>
                        <th className="text-xs">Scenario</th>
                        <th className="text-xs">Expected result</th>
                        <th className="text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRule.testCases.map((tc) => (
                        <tr key={tc.id}>
                          <td className="tabular-nums">{tc.id}</td>
                          <td>{tc.scenario}</td>
                          <td>{tc.expectedResult}</td>
                          <td>
                            <span className={`flex items-center gap-1 ${getTestStatusColor(tc.status)}`}>
                              {tc.status === 'Passed' ? (
                                <CheckCircle2 size={12} />
                              ) : tc.status === 'In review' ? (
                                <Clock size={12} />
                              ) : (
                                <MinusCircle size={12} />
                              )}
                              {tc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Version history */}
              {selectedRule.versionHistory.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-ink">Version history</h4>
                    <button className="text-xs text-civic hover:underline">
                      View all versions
                    </button>
                  </div>
                  <table className="text-xs mb-4">
                    <thead>
                      <tr>
                        <th className="text-xs">Version</th>
                        <th className="text-xs">Date</th>
                        <th className="text-xs">Changes</th>
                        <th className="text-xs">By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRule.versionHistory.map((v) => (
                        <tr key={v.version}>
                          <td className="tabular-nums">{v.version}</td>
                          <td>{v.date}</td>
                          <td>{v.changes}</td>
                          <td>{v.by}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button className="btn-secondary text-sm flex-1">
                  <Eye size={14} />
                  View tests
                </button>
                <button className="btn-primary text-sm flex-1">
                  <Pencil size={14} />
                  Edit draft
                </button>
                <button
                  className="btn-secondary text-sm flex-1 opacity-50 cursor-not-allowed"
                  disabled
                  title="Rule source must be verified before activation"
                >
                  <ShieldCheck size={14} />
                  Activate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add rule modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-ink mb-1">Add new rule</h2>
            <p className="text-sm text-muted mb-4">
              Create a new validation rule. It will start in Draft status.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-ink block mb-1">Rule ID *</label>
                <input className="input-field text-sm" placeholder="e.g. EOA-NEW-CHECK" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">Check name *</label>
                <input className="input-field text-sm" placeholder="Describe the check" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">Application type *</label>
                <select className="select-field text-sm">
                  <option>Extension of Approval (EOA)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">Academic year *</label>
                <select className="select-field text-sm">
                  <option>2024–25</option>
                  <option>2025–26</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">
                  Rule condition *
                </label>
                <textarea
                  className="input-field text-sm"
                  rows={3}
                  placeholder="Describe the condition logic"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                }}
                className="btn-primary text-sm"
              >
                Create rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
