'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Circle,
  Loader2,
  FileText,
  Layers,
  PenLine,
  Settings2,
  Shield,
  ClipboardList,
  Info,
  Trash2,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

interface Stage {
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  time: string;
}

interface ActivityEntry {
  icon: 'doc' | 'extract' | 'confirm' | 'rules';
  title: string;
  description: string;
  timestamp: string;
}

export default function ValidationProgressPage({
  params,
}: {
  params: Promise<{ applicationId: string; runId: string }>;
}) {
  const { applicationId, runId } = use(params);

  const [stages, setStages] = useState<Stage[]>([
    { name: 'Files checked', description: '4 documents accepted', status: 'completed', time: '00:03' },
    { name: 'Text extracted', description: '18 fields extracted', status: 'completed', time: '00:07' },
    { name: 'Fields normalized', description: '2 fields confirmed by user', status: 'completed', time: '00:12' },
    { name: 'Applying validation rules', description: '12 configured rules selected', status: 'in_progress', time: '00:18' },
    { name: 'Checking source responses', description: 'Verifying with official sources (where available)', status: 'pending', time: '–' },
    { name: 'Preparing report', description: 'Compiling results and evidence summary', status: 'pending', time: '–' },
  ]);

  const [activity, setActivity] = useState<ActivityEntry[]>([
    { icon: 'doc', title: '4 documents accepted', description: 'All files passed format and size checks.', timestamp: '10:24:11 AM' },
    { icon: 'extract', title: '18 fields extracted', description: 'Key information identified from documents.', timestamp: '10:24:16 AM' },
    { icon: 'confirm', title: '2 fields confirmed by user', description: 'User confirmed institute name and address.', timestamp: '10:24:21 AM' },
    { icon: 'rules', title: '12 configured rules selected', description: 'Rules from EOA 2026–27 v0.3 (demo) are being applied.', timestamp: '10:24:26 AM' },
  ]);

  const [elapsed, setElapsed] = useState(18);
  const [cancelled, setCancelled] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const activityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cancelled || completed) return;

    const timer = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cancelled, completed]);

  useEffect(() => {
    if (cancelled) return;

    const nextPending = stages.findIndex((s) => s.status === 'in_progress');
    if (nextPending === -1) return;

    const timeout = setTimeout(() => {
      setStages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((s) => s.status === 'in_progress');
        if (idx === -1) return prev;

        updated[idx] = { ...updated[idx], status: 'completed', time: formatTime(elapsed) };

        const nextIdx = idx + 1;
        if (nextIdx < updated.length) {
          updated[nextIdx] = { ...updated[nextIdx], status: 'in_progress' };
          setActivity((a) => [
            ...a,
            {
              icon: 'rules' as const,
              title: updated[nextIdx].name,
              description: updated[nextIdx].description,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
            },
          ]);
        } else {
          setCompleted(true);
          setActivity((a) => [
            ...a,
            {
              icon: 'doc' as const,
              title: 'Validation complete',
              description: '4 findings identified. Report is ready.',
              timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
            },
          ]);
        }
        return updated;
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, [stages, cancelled, elapsed]);

  useEffect(() => {
    if (activityRef.current) {
      activityRef.current.scrollTop = activityRef.current.scrollHeight;
    }
  }, [activity]);

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function handleCancel() {
    setCancelled(true);
    setShowCancelModal(false);
    setStages((prev) =>
      prev.map((s) =>
        s.status === 'in_progress' ? { ...s, status: 'pending' } : s
      )
    );
  }

  const stageIcons = [FileText, Layers, PenLine, Settings2, Shield, ClipboardList];
  const activityIcons = {
    doc: FileText,
    extract: Layers,
    confirm: PenLine,
    rules: Settings2,
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <div className="px-8 pt-5 pb-2 text-sm text-muted">
        <Link href="/applications" className="text-civic hover:underline">Applications</Link>
        <span className="mx-2">&gt;</span>
        <Link href={`/applications/${applicationId}`} className="text-civic hover:underline">{applicationId}</Link>
        <span className="mx-2">&gt;</span>
        <span>Validation</span>
      </div>

      {/* Title row */}
      <div className="px-8 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Validating application evidence</h1>
          <p className="text-muted text-sm mt-1">
            Run {runId || 'VAL-2026-041'} &middot; Rule pack EOA 2026–27 v0.3 (demo)
          </p>
        </div>
        <div className="card py-3 px-4 text-right">
          <div className="flex items-center gap-2">
            {completed ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : cancelled ? (
              <AlertTriangle size={18} className="text-red-500" />
            ) : (
              <Loader2 size={18} className="text-civic animate-spin" />
            )}
            <span className={`font-semibold text-sm ${completed ? 'text-green-700' : cancelled ? 'text-red-600' : 'text-civic'}`}>
              {completed ? 'Completed' : cancelled ? 'Cancelled' : 'Processing'}
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            {completed
              ? 'Finished'
              : cancelled
              ? 'Run was cancelled'
              : 'Started at 10:24 AM, 26 Apr 2026'}
          </p>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex-1 px-8 pb-4 grid grid-cols-[260px_1fr_300px] gap-5 min-h-0">
        {/* Left: Progress timeline */}
        <div className="card p-5">
          <div className="space-y-0">
            {stages.map((stage, i) => {
              const Icon = stageIcons[i];
              return (
                <div key={stage.name} className="flex gap-3">
                  {/* Vertical line + icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        stage.status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : stage.status === 'in_progress'
                          ? 'bg-civic/10 text-civic'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {stage.status === 'completed' ? (
                        <CheckCircle size={18} />
                      ) : stage.status === 'in_progress' ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </div>
                    {i < stages.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 min-h-[28px] ${
                          stage.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-5 pt-0.5">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          stage.status === 'pending' ? 'text-gray-400' : 'text-ink'
                        }`}
                      >
                        {stage.name}
                      </p>
                      <span className="text-xs text-muted tabular-nums">
                        {stage.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Live activity */}
        <div className="card p-0 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Live activity</h2>
            <span className="text-xs text-muted tabular-nums">
              Elapsed time: {formatTime(elapsed)}
            </span>
          </div>
          <div ref={activityRef} className="flex-1 overflow-auto p-5 space-y-4">
            {activity.map((entry, i) => {
              const Icon = activityIcons[entry.icon] || FileText;
              return (
                <div key={i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-civic/10 text-civic flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{entry.title}</p>
                      <span className="text-xs text-muted whitespace-nowrap tabular-nums">
                        {entry.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{entry.description}</p>
                  </div>
                </div>
              );
            })}
            {!completed && !cancelled && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <Loader2 size={14} className="animate-spin" />
                Processing...
              </div>
            )}
            {completed && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Validation completed successfully
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: What happens next */}
        <div className="card border-civic/20 bg-blue-50/30">
          <div className="flex items-center gap-2 mb-3">
            <Info size={18} className="text-civic" />
            <h3 className="font-bold text-sm text-ink">What happens next?</h3>
          </div>
          <div className="space-y-4 text-xs text-muted leading-relaxed">
            <p>
              We are now applying the relevant validation rules to your extracted
              information. This includes checks for completeness, consistency and
              applicability based on AICTE regulations (EOA 2026–27).
            </p>
            <p>
              After this, we will check responses from official sources (such as
              AICTE and other government portals) where available. Note that some
              sources may be unavailable at the moment, and those checks will be
              marked accordingly.
            </p>
            <p>
              Finally, we will prepare a detailed report with pass / fail /
              clarification status for each requirement. The results are advisory
              and should be reviewed before submission.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 bg-white border-t border-border px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="info-banner flex-1 mr-4">
            <Info size={16} className="text-civic shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sm">
                You can leave this page; processing continues
              </span>
              <span className="text-xs text-muted block mt-0.5">
                We will notify you here when the validation is complete. You can also
                check the status later from the Applications page.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {completed ? (
              <Link
                href={`/applications/${applicationId}/report/${runId || 'RUN-20250424-1032'}`}
                className="btn-primary"
              >
                View results <ArrowRight size={16} />
              </Link>
            ) : cancelled ? (
              <span className="text-sm text-muted">Run was cancelled.</span>
            ) : (
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn-danger"
              >
                <Trash2 size={16} /> Cancel run
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-ink mb-2">Cancel validation run?</h3>
            <p className="text-sm text-muted mb-6">
              This will stop the current validation. Any completed stages will be
              preserved, but no report will be generated. You can start a new run
              later.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCancelModal(false)} className="btn-secondary">
                Go back
              </button>
              <button onClick={handleCancel} className="btn-danger">
                Cancel run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
