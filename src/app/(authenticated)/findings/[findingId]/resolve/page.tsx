'use client';

import { use, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ExternalLink, FileText, Upload, X, Info,
  User, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { DEMO_APPLICATIONS } from '@/lib/data';

export default function ResolveFindinPage({
  params,
}: {
  params: Promise<{ findingId: string }>;
}) {
  const { findingId } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allFindings = DEMO_APPLICATIONS.flatMap(a => a.findings);
  const finding = allFindings.find(f => f.id === findingId) || allFindings[0];
  const app = DEMO_APPLICATIONS.find(a => a.findings.some(f => f.id === findingId)) || DEMO_APPLICATIONS[0];

  const [resolutionPath, setResolutionPath] = useState<string>('corrected');
  const [explanation, setExplanation] = useState('We have updated the intake to 120 as per the revised plan approved by the Governing Board. Please find the supporting document attached.');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>({
    name: 'Revised_Intake_Approval.pdf',
    size: '320 KB',
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile({
      name: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
    });
    e.target.value = '';
  };

  const handleSubmit = () => {
    setShowConfirmModal(false);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/findings/${findingId}`);
      }, 1500);
    }, 1000);
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Response submitted for review</h2>
          <p className="text-muted">Redirecting to finding details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Resolve finding</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-semibold text-sm">Finding {findingId}</span>
            <span className="badge bg-amber-100 text-amber-800">{finding.status}</span>
          </div>
          <p className="text-sm text-muted mt-1">
            Detected on 12 Jun 2024 · Engineering (B.Tech) · Academic Year 2024–25
          </p>
        </div>
        <Link href={`/applications/${app.id}`} className="btn-secondary">
          View application <ExternalLink size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          {/* Finding summary */}
          <div className="card">
            <h2 className="text-base font-bold mb-1">Finding summary</h2>
            <h3 className="font-semibold text-sm mb-2">{finding.title}</h3>
            <p className="text-sm text-muted mb-4">{finding.description}</p>

            {finding.currentValue && finding.priorValue && (
              <table className="text-sm">
                <thead>
                  <tr>
                    <th>Current request (2024–25)</th>
                    <th>Prior approval (2023–24)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold text-lg">{finding.currentValue}</td>
                    <td className="font-bold text-lg">{finding.priorValue}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Resolution form */}
          <div className="card">
            <h2 className="text-base font-bold mb-4">Resolution</h2>
            <label className="text-sm font-semibold block mb-3">
              Select how you are addressing this finding <span className="text-red-500">*</span>
            </label>

            <div className="space-y-3 mb-6">
              {[
                { value: 'corrected', label: 'Corrected evidence uploaded', desc: 'You have updated the intake details and attached supporting documents.' },
                { value: 'explanation', label: 'Legitimate change — explanation provided', desc: 'The change is valid and within regulatory norms.' },
                { value: 'official_review', label: 'Needs official review', desc: 'Requesting reviewer guidance on this finding.' },
              ].map(option => (
                <label key={option.value} className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="resolution"
                    value={option.value}
                    checked={resolutionPath === option.value}
                    onChange={() => setResolutionPath(option.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-sm">{option.label}</div>
                    <div className="text-xs text-muted">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Assigned reviewer */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6">
              <User size={20} className="text-muted" />
              <div>
                <div className="font-semibold text-sm">Assigned reviewer</div>
                <div className="text-xs text-muted">Pending assignment</div>
                <div className="text-xs text-muted">A reviewer from the respective council will be assigned after submission.</div>
              </div>
            </div>

            {/* Audit note */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <Info size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>Audit note</strong>
                <p className="text-xs mt-1">All responses and files are logged and auditable. You can make changes until you submit for review.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Explain response */}
          <div className="card">
            <label className="text-sm font-semibold block mb-2">
              Explain your response <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input-field min-h-[120px] resize-y"
              placeholder="Describe the correction or explanation..."
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              maxLength={1000}
            />
            <div className="text-xs text-muted text-right mt-1">{explanation.length}/1000</div>
          </div>

          {/* Supporting evidence */}
          <div className="card">
            <label className="text-sm font-semibold block mb-2">
              Add supporting evidence (PDF) <span className="text-red-500">*</span>
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={20} className="mx-auto text-muted mb-1" />
              <p className="text-xs">Drag and drop a file here, or <span className="text-civic font-semibold">click to upload</span></p>
              <p className="text-xs text-muted">PDF only · Max 10 MB</p>
            </div>

            {uploadedFile && (
              <div className="flex items-center gap-3 mt-3 p-3 border border-border rounded-lg">
                <FileText size={20} className="text-muted" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{uploadedFile.name}</div>
                  <div className="text-xs text-muted">{uploadedFile.size}</div>
                </div>
                <button onClick={() => setUploadedFile(null)} className="text-muted hover:text-red-500">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Relevant documents */}
          <div className="card">
            <h3 className="text-sm font-bold mb-3">Relevant documents</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-muted" />
                <div className="flex-1">
                  <div className="text-sm font-medium">EOA_2024_Programme_Details.pdf</div>
                  <div className="text-xs text-muted">Page 3 · Programme intake table</div>
                </div>
                <button className="text-civic text-xs font-semibold hover:underline">View</button>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-muted" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Approval_Letter_2023.pdf</div>
                  <div className="text-xs text-muted">Page 2 · Sanctioned intake</div>
                </div>
                <button className="text-civic text-xs font-semibold hover:underline">View</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
        <button className="btn-secondary" onClick={handleSaveDraft} disabled={saving}>
          {saving ? 'Saving...' : 'Save draft'}
        </button>
        <button
          className="btn-primary"
          onClick={() => setShowConfirmModal(true)}
          disabled={!explanation.trim()}
        >
          Submit for review
        </button>
      </div>

      {/* Confirmation modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3">Submit this response for review?</h3>
            <p className="text-sm text-muted mb-6">
              This records your response and sends it to an authorized reviewer. It does not approve the application.
            </p>
            <div className="flex gap-3 justify-end">
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>Go back</button>
              <button className="btn-primary" onClick={handleSubmit}>Submit for review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
