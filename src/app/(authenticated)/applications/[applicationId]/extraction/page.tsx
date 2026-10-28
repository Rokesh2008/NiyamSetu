'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  FileText,
  AlertTriangle,
  CheckCircle,
  Pencil,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { DEMO_APPLICATIONS } from '@/lib/data';

interface FieldState {
  id: string;
  field: string;
  value: string;
  source: string;
  sourcePage: number;
  confidence: 'High' | 'Medium' | 'Low';
  confirmed: boolean;
  editing: boolean;
  editValue: string;
}

export default function ExtractionPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const app = DEMO_APPLICATIONS.find((a) => a.id === applicationId);

  const initialFields: FieldState[] = (app?.extractedFields ?? []).map((f) => ({
    id: f.id,
    field: f.field,
    value: f.value,
    source: f.source,
    sourcePage: f.sourcePage,
    confidence: f.confidence,
    confirmed: f.confirmed,
    editing: false,
    editValue: f.value,
  }));

  const [fields, setFields] = useState<FieldState[]>(initialFields);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [saved, setSaved] = useState(false);
  const totalPages = 3;

  const unconfirmedCount = fields.filter((f) => !f.confirmed).length;

  function confirmField(id: string) {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, confirmed: true, editing: false } : f
      )
    );
  }

  function startEdit(id: string) {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, editing: true, editValue: f.value } : f
      )
    );
  }

  function cancelEdit(id: string) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, editing: false } : f))
    );
  }

  function saveEdit(id: string) {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, value: f.editValue, editing: false, confirmed: false }
          : f
      )
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!app) {
    return (
      <div className="p-8">
        <p className="text-muted">Application not found.</p>
        <Link href="/applications" className="text-civic underline mt-4 inline-block">
          Back to applications
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <div className="px-8 pt-5 pb-2 text-sm text-muted">
        <Link href="/applications" className="text-civic hover:underline">
          Applications
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/applications/${applicationId}`}
          className="text-civic hover:underline"
        >
          {applicationId}
        </Link>
        <span className="mx-2">/</span>
        <span>Evidence extraction</span>
      </div>

      {/* Title */}
      <div className="px-8 pb-2">
        <h1 className="text-2xl font-bold text-ink">Review extracted fields</h1>
        <p className="text-muted text-sm mt-1">
          Verify the information extracted from the document. Confirm or edit each
          field before saving.
        </p>
      </div>

      {/* Warning banner */}
      {unconfirmedCount > 0 && (
        <div className="mx-8 mb-4">
          <div className="warning-banner">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-800">
                {unconfirmedCount} field{unconfirmedCount > 1 ? 's' : ''} need
                confirmation
              </span>
              <span className="text-amber-700 ml-2 text-sm">
                Please review the highlighted fields below and confirm or edit them
                as needed.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Three-column layout */}
      <div className="flex-1 px-8 pb-4 grid grid-cols-[1fr_340px_260px] gap-5 min-h-0">
        {/* Left: PDF viewer */}
        <div className="card flex flex-col p-0 overflow-hidden">
          {/* PDF header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-red-500" />
              <span className="font-semibold text-sm">
                AICTE_Approval_Letter.pdf
              </span>
              <span className="text-muted text-xs ml-2">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm tabular-nums">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
              <span className="mx-2 text-border">|</span>
              <select
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="text-sm border border-border rounded px-2 py-1"
              >
                <option value={75}>75%</option>
                <option value={100}>100%</option>
                <option value={125}>125%</option>
                <option value={150}>150%</option>
              </select>
              <button className="p-1 rounded hover:bg-gray-100">
                <ExternalLink size={16} />
              </button>
              <button className="p-1 rounded hover:bg-gray-100">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Mock PDF content */}
          <div
            className="flex-1 overflow-auto bg-gray-50 p-6"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          >
            <div className="bg-white shadow-md max-w-[600px] mx-auto p-8 text-sm leading-relaxed border border-gray-200">
              {/* AICTE header */}
              <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-4">
                <div>
                  <p className="font-bold text-base">
                    अखिल भारतीय तकनीकी शिक्षा परिषद
                  </p>
                  <p className="font-bold">
                    All India Council for Technical Education
                  </p>
                  <p className="text-xs text-muted">
                    (A Statutory Body of the Government of India)
                  </p>
                </div>
                <div className="text-right text-xs text-muted">
                  <p>Nelson Mandela Marg</p>
                  <p>Vasant Kunj, New Delhi – 110070</p>
                  <p>Tel: 011-26131576-80</p>
                  <p>Website: www.aicte-india.org</p>
                </div>
              </div>

              <p className="text-xs mb-4">
                F.No. AICTE/APPROVAL/2025-26/INST-DEMO-001
                <span className="float-right">Date: 12 May 2025</span>
              </p>

              <p className="text-center font-bold text-base mb-4 underline">
                APPROVAL LETTER
              </p>

              <div className="mb-4">
                <p>To,</p>
                <p>The Principal</p>
                <p>Demo Institute of Technology</p>
                <p>123 Education Road</p>
                <p>Bengaluru, Karnataka – 560001</p>
              </div>

              <p className="mb-4">
                <strong>Subject:</strong> Approval for conduct of following
                programme(s) for the academic year 2025-26.
              </p>

              <p className="mb-4 text-sm">
                In continuation of the earlier approval, the All India Council for
                Technical Education (AICTE) is pleased to convey the approval for
                the following programme(s) with the intake indicated below:
              </p>

              {/* Table */}
              <table className="w-full border border-gray-300 text-xs mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                      Programme
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                      Level
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold bg-civic/10">
                      Approved Intake
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                      Academic Year
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">
                      Computer Science &amp; Engineering
                    </td>
                    <td className="border border-gray-300 px-3 py-2">UG</td>
                    <td className="border border-gray-300 px-3 py-2 font-semibold">
                      60
                    </td>
                    <td className="border border-gray-300 px-3 py-2">2025-26</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-xs mb-6">
                This approval is subject to the terms and conditions mentioned in the
                AICTE norms and guidelines.
              </p>

              <div className="mb-2">
                <p className="text-sm">Yours faithfully,</p>
                <p className="italic text-muted mt-4 mb-1 font-serif text-lg">
                  Signature
                </p>
                <p className="text-xs">(Member Secretary)</p>
                <p className="text-xs">AICTE</p>
              </div>

              <div className="flex justify-between text-xs text-muted mt-6 pt-3 border-t border-gray-200">
                <span>All India Council for Technical Education</span>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Extracted fields */}
        <div className="card flex flex-col p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-ink">Extracted fields</h2>
            <p className="text-xs text-muted mt-0.5">
              {fields.length} fields found
            </p>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-xs px-4 py-2">Field</th>
                  <th className="text-xs px-4 py-2">Value</th>
                  <th className="text-xs px-4 py-2">Source</th>
                  <th className="text-xs px-4 py-2">Confidence</th>
                  <th className="text-xs px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f) => (
                  <tr
                    key={f.id}
                    className={
                      !f.confirmed && !f.editing
                        ? 'bg-amber-50/50'
                        : ''
                    }
                  >
                    <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                      {f.field}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {f.editing ? (
                        <div className="flex flex-col gap-1.5">
                          <input
                            type="text"
                            value={f.editValue}
                            onChange={(e) =>
                              setFields((prev) =>
                                prev.map((p) =>
                                  p.id === f.id
                                    ? { ...p, editValue: e.target.value }
                                    : p
                                )
                              )
                            }
                            className="input-field text-sm py-1.5 px-2"
                            autoFocus
                          />
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => saveEdit(f.id)}
                              className="text-xs bg-civic text-white px-2.5 py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => cancelEdit(f.id)}
                              className="text-xs text-muted px-2.5 py-1 rounded border border-border"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="font-medium">{f.value}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setCurrentPage(f.sourcePage)}
                        className="text-civic text-xs hover:underline flex items-center gap-1"
                      >
                        <span>📄</span> Page {f.sourcePage}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`status-dot ${
                            f.confidence === 'High'
                              ? 'bg-green-500'
                              : f.confidence === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="text-xs">{f.confidence}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {!f.editing && (
                        <div className="flex gap-1.5">
                          {f.confirmed ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded font-medium">
                              <CheckCircle size={12} /> Confirmed
                            </span>
                          ) : (
                            <button
                              onClick={() => confirmField(f.id)}
                              className="text-xs bg-civic text-white px-3 py-1.5 rounded font-medium hover:bg-civic-dark"
                            >
                              Confirm
                            </button>
                          )}
                          <button
                            onClick={() => startEdit(f.id)}
                            className="text-xs text-muted border border-border px-3 py-1.5 rounded hover:bg-gray-50"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Extraction method */}
        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-civic" />
              <h3 className="font-bold text-sm">Extraction method</h3>
            </div>
            <p className="text-sm font-semibold text-ink mb-1">
              AI + Rule-based Hybrid
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Uses document understanding (OCR + LLM) with validation rules to
              extract structured fields.
            </p>
          </div>

          <div className="card border-amber-200 bg-amber-50/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <h3 className="font-semibold text-sm text-amber-800">
                Confidence caveat
              </h3>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Confidence scores are estimates and may not always be 100% accurate.
              Always verify critical fields, especially numeric values and dates.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 bg-white border-t border-border px-8 py-4 flex items-center justify-between">
        <Link
          href={`/applications/${applicationId}/documents`}
          className="btn-secondary"
        >
          Back to documents
        </Link>

        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-700 flex items-center gap-1">
              <CheckCircle size={14} /> Fields saved successfully
            </span>
          )}
          <button onClick={handleSave} className="btn-primary bg-amber-700 hover:bg-amber-800">
            Save reviewed fields
          </button>
        </div>
      </div>
    </div>
  );
}
