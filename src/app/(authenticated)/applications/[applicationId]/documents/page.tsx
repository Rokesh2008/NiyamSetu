'use client';

import { use, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Upload, Eye, RefreshCw, Trash2, FileText, CheckCircle2,
  AlertCircle, Cloud, ChevronRight, Save, ArrowRight, Info, Copy
} from 'lucide-react';
import { DEMO_APPLICATIONS } from '@/lib/data';

interface DocSlot {
  id: string;
  label: string;
  description: string;
  required: boolean;
  file: { name: string; pages: number; size: string } | null;
}

export default function DocumentsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const app = DEMO_APPLICATIONS.find(a => a.id === applicationId);

  const [slots, setSlots] = useState<DocSlot[]>([
    { id: 'prev-approval', label: 'Previous approval record', description: 'Copy of the last approval letter or order from the concerned authority.', required: true, file: { name: 'previous_approval.pdf', pages: 2, size: '480 KB' } },
    { id: 'inst-cert', label: 'Institutional certificate', description: 'Valid certificate of the institution (e.g. UGC/AICTE/State).', required: true, file: null },
    { id: 'prog-details', label: 'Programme details', description: 'Detailed note on the proposed programme, including curriculum, intake and duration.', required: true, file: { name: 'programme_details.pdf', pages: 4, size: '1.2 MB' } },
    { id: 'additional', label: 'Additional supporting evidence', description: 'Any other relevant document (optional).', required: false, file: null },
  ]);

  const uploadedCount = slots.filter(s => s.file !== null).length;
  const requiredCount = slots.filter(s => s.required).length;
  const uploadedRequired = slots.filter(s => s.required && s.file !== null).length;

  const handleFileSelect = useCallback((slotId: string) => {
    setUploadTarget(slotId);
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are accepted.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('File must be under 20 MB.');
      return;
    }

    setSlots(prev => prev.map(s =>
      s.id === uploadTarget
        ? { ...s, file: { name: file.name, pages: Math.ceil(file.size / 50000), size: `${(file.size / 1024).toFixed(0)} KB` } }
        : s
    ));
    setUploadTarget(null);
    e.target.value = '';
  }, [uploadTarget]);

  const handleRemove = useCallback((slotId: string) => {
    setSlots(prev => prev.map(s =>
      s.id === slotId ? { ...s, file: null } : s
    ));
    setShowRemoveConfirm(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are accepted.');
      return;
    }
    const emptySlot = slots.find(s => !s.file);
    if (!emptySlot) {
      alert('All document slots are filled.');
      return;
    }
    setSlots(prev => prev.map(s =>
      s.id === emptySlot.id
        ? { ...s, file: { name: file.name, pages: Math.ceil(file.size / 50000), size: `${(file.size / 1024).toFixed(0)} KB` } }
        : s
    ));
  }, [slots]);

  const handleSaveDraft = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <Link href={`/applications/${applicationId}`} className="inline-flex items-center gap-1 text-civic text-sm mb-4 hover:underline">
        <ArrowLeft size={16} /> Back to application
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Add supporting documents</h1>
          <p className="text-muted mt-1">Upload the required documents to support your application. Ensure the files are clear, complete and in PDF format.</p>
        </div>
        <div className="card text-sm flex items-center gap-3">
          <div>
            <div className="text-muted text-xs">Application ID</div>
            <div className="font-bold flex items-center gap-2">
              {applicationId}
              <button onClick={() => navigator.clipboard.writeText(applicationId)} className="text-muted hover:text-ink">
                <Copy size={14} />
              </button>
            </div>
          </div>
          <span className="badge bg-gray-100 text-gray-700">Draft</span>
        </div>
      </div>

      {/* Wizard steps */}
      <div className="flex items-center gap-4 mb-8 text-sm">
        {[
          { num: 1, label: 'Basic details', status: 'done' },
          { num: 2, label: 'Documents', status: 'active' },
          { num: 3, label: 'Review', status: 'pending' },
          { num: 4, label: 'Submit', status: 'pending' },
        ].map((step) => (
          <div key={step.num} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step.status === 'done' ? 'bg-green-500 text-white' :
              step.status === 'active' ? 'bg-civic text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {step.status === 'done' ? '✓' : step.num}
            </div>
            <span className={step.status === 'active' ? 'font-semibold text-ink' : 'text-muted'}>
              {step.label}
            </span>
            {step.status === 'done' && <span className="text-green-600 text-xs">Completed</span>}
            {step.status === 'active' && <span className="text-civic text-xs">In progress</span>}
            {step.status === 'pending' && <span className="text-muted text-xs">Pending</span>}
            {step.num < 4 && <ChevronRight size={16} className="text-gray-300 ml-2" />}
          </div>
        ))}
      </div>

      {/* Documents section */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Required documents</h2>
            <p className="text-sm text-muted">Upload the documents listed below. Items marked as optional can be added if applicable.</p>
          </div>
          <div className="text-sm text-right">
            <span className="text-muted">{uploadedRequired} of {requiredCount} required documents uploaded</span>
            <div className="w-48 h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-civic rounded-full transition-all"
                style={{ width: `${(uploadedRequired / requiredCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {slots.map(slot => (
            <div key={slot.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <FileText size={24} className="text-muted flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{slot.label}</div>
                <div className="text-xs text-muted">{slot.description}</div>
              </div>
              <span className={`badge ${slot.required ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                {slot.required ? 'Required' : 'Optional'}
              </span>

              {slot.file ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <FileText size={16} className="text-red-500" />
                    </div>
                    <div>
                      <div className="font-medium text-xs">{slot.file.name}</div>
                      <div className="text-xs text-muted">{slot.file.pages} pages · {slot.file.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary text-xs !px-3 !py-1.5" title="View document">
                      <Eye size={14} /> View
                    </button>
                    <button
                      className="btn-secondary text-xs !px-3 !py-1.5"
                      onClick={() => handleFileSelect(slot.id)}
                    >
                      <RefreshCw size={14} /> Replace
                    </button>
                    <button
                      className="btn-danger text-xs !px-3 !py-1.5"
                      onClick={() => setShowRemoveConfirm(slot.id)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <AlertCircle size={16} className="text-amber-500" />
                    Not uploaded
                  </div>
                  <button
                    className="btn-secondary text-xs !px-3 !py-1.5"
                    onClick={() => handleFileSelect(slot.id)}
                  >
                    <Upload size={14} /> Upload file
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Drop zone */}
        <div
          className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-amber-50/30 hover:bg-amber-50/50 transition-colors cursor-pointer"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => {
            const emptySlot = slots.find(s => !s.file);
            if (emptySlot) handleFileSelect(emptySlot.id);
          }}
        >
          <Cloud size={32} className="mx-auto text-muted mb-2" />
          <p className="text-sm">
            Drop PDF files here or{' '}
            <span className="text-civic font-semibold cursor-pointer">browse files</span>
          </p>
          <p className="text-xs text-muted mt-1">PDF only · 20 MB per file · 100 pages max</p>
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs text-muted">
          <Info size={14} />
          Files are stored privately. Uploading does not submit the application.
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between">
        <button className="btn-secondary" onClick={handleSaveDraft}>
          <Save size={16} />
          {saved ? 'Saved!' : 'Save draft'}
        </button>
        <Link
          href={`/applications/${applicationId}/extraction`}
          className={`btn-primary ${uploadedRequired < requiredCount ? 'opacity-50 pointer-events-none' : ''}`}
        >
          Continue to review <ArrowRight size={16} />
        </Link>
      </div>

      {/* Remove confirmation modal */}
      {showRemoveConfirm && (
        <div className="modal-overlay" onClick={() => setShowRemoveConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Remove document?</h3>
            <p className="text-sm text-muted mb-4">
              This will remove the uploaded file. If this is a required document, it will need to be re-uploaded before continuing.
            </p>
            <div className="flex gap-3 justify-end">
              <button className="btn-secondary" onClick={() => setShowRemoveConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleRemove(showRemoveConfirm)}>
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
