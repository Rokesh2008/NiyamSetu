'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, AlertTriangle, CheckCircle2, Info, FileText,
  Eye, MoreHorizontal, Plus, ArrowRight, Play, Save,
  Clock, Upload, ShieldCheck, CircleAlert, X
} from 'lucide-react';
import {
  DEMO_APPLICATIONS, getStatusLabel, getStatusColor,
  type Application
} from '@/lib/data';

export default function ApplicationOverviewPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(true);

  const app = DEMO_APPLICATIONS.find((a) => a.id === applicationId);

  if (!app) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold mb-2">Application not found</h1>
        <p className="text-muted mb-4">
          No application with ID &ldquo;{applicationId}&rdquo; exists.
        </p>
        <Link href="/applications" className="btn-primary">
          Back to applications
        </Link>
      </div>
    );
  }

  const statusLabel = getStatusLabel(app.status);
  const statusColor = getStatusColor(app.status);

  const steps = [
    {
      label: 'Details complete',
      desc: 'Application information filled',
      done: true,
    },
    {
      label: 'Documents uploaded',
      desc: `${app.documents.length} of ${app.documents.length} required documents`,
      done: app.documents.length > 0,
    },
    {
      label: 'Fields reviewed',
      desc: 'Review extracted information',
      done: app.extractedFields.filter((f) => f.confirmed).length === app.extractedFields.length && app.extractedFields.length > 0,
    },
    {
      label: 'Validation run',
      desc: 'AICTE rule checks and cross-verification',
      done: app.validationRuns.length > 0 && app.validationRuns[0].status === 'Completed',
    },
  ];

  const currentStep = steps.findIndex((s) => !s.done);
  const discrepancies = app.findings.filter(
    (f) => f.status === 'Needs review'
  ).length;
  const confirmations = app.findings.filter(
    (f) => f.status === 'Manual review' || f.status === 'Context check'
  ).length;
  const sourceUnavailable = app.findings.filter(
    (f) =>
      f.title.toLowerCase().includes('source') ||
      f.title.toLowerCase().includes('could not be confirmed')
  ).length;

  const allFieldsReviewed =
    app.extractedFields.length > 0 &&
    app.extractedFields.every((f) => f.confirmed);
  const canRunValidation = app.documents.length > 0 && allFieldsReviewed;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted mb-4">
        <Link href="/applications" className="hover:text-civic">
          Applications
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">{app.id}</span>
      </div>

      {/* Title + Status */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-ink">
              Extension of Approval preflight
            </h1>
            <span className={`badge ${statusColor}`}>
              {statusLabel === 'Needs review' && (
                <AlertTriangle size={13} className="mr-1.5" />
              )}
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted flex-wrap">
            <span>Application ID: {app.id}</span>
            <span className="text-border">|</span>
            <span>Academic Year: {app.academicYear}</span>
            <span className="text-border">|</span>
            <span>Institute: {app.institution}</span>
            {app.programType && (
              <>
                <span className="text-border">|</span>
                <span>Program Type: {app.programType}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {showBanner && (
        <div className="warning-banner my-4 relative">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">
              Synthetic demo data — no live AICTE connection
            </p>
            <p className="text-sm text-muted mt-0.5">
              This is a prototype environment for demonstration purposes only.
              Validations, rules and data are simulated and may not reflect actual
              AICTE systems.
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-3 right-3 text-muted hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Progress Stepper */}
      <div className="card my-6">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    step.done
                      ? 'bg-civic text-white'
                      : i === currentStep
                        ? 'bg-civic text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.done ? <CheckCircle2 size={18} /> : i + 1}
                </div>
                <div>
                  <div
                    className={`text-sm font-semibold ${step.done || i === currentStep ? 'text-ink' : 'text-gray-400'}`}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-muted">{step.desc}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${step.done ? 'bg-civic' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents Table - spans 2 cols */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              Documents ({app.documents.length})
            </h2>
            <Link
              href={`/applications/${app.id}/documents`}
              className="btn-secondary text-sm"
            >
              <Plus size={15} />
              Add documents
            </Link>
          </div>
          {app.documents.length === 0 ? (
            <div className="text-center py-10 text-muted">
              <FileText size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No documents uploaded yet</p>
              <p className="text-sm mt-1">
                Upload the required documents to proceed.
              </p>
              <Link
                href={`/applications/${app.id}/documents`}
                className="btn-primary mt-4 inline-flex"
              >
                <Upload size={15} />
                Upload documents
              </Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document name</th>
                  <th>Type</th>
                  <th>Uploaded on</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {app.documents.map((doc, i) => (
                  <tr key={doc.id}>
                    <td className="tabular-nums text-muted">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FileText
                          size={16}
                          className="text-red-500 shrink-0"
                        />
                        {doc.name}
                      </div>
                    </td>
                    <td className="text-muted">{doc.category}</td>
                    <td className="text-muted tabular-nums">
                      {doc.uploadedOn}
                    </td>
                    <td>
                      <span
                        className={`badge ${doc.status === 'Processed' ? 'bg-green-50 text-green-700' : doc.status === 'Error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}
                      >
                        {doc.status === 'Processed' && (
                          <CheckCircle2 size={12} className="mr-1" />
                        )}
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="text-civic text-sm hover:underline flex items-center gap-1">
                          <Eye size={14} />
                          View
                        </button>
                        <button className="text-muted hover:text-ink">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Findings Summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Findings summary</h2>
            {app.findings.length > 0 && (
              <Link
                href={`/applications/${app.id}/findings`}
                className="text-sm text-civic hover:underline flex items-center gap-1"
              >
                View all findings <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {app.findings.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <ShieldCheck
                size={36}
                className="mx-auto mb-2 text-green-500 opacity-60"
              />
              <p className="font-medium text-green-700">
                No findings to review
              </p>
              <p className="text-sm mt-1">
                Run a validation to check for issues.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discrepancies > 0 && (
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={28}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold tabular-nums">
                        {discrepancies}
                      </span>
                      <span className="font-semibold text-sm">
                        Discrepancy found
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      Intake mentioned in application (120) does not match prior
                      approval (60).
                    </p>
                  </div>
                  <Link
                    href={`/findings/${app.findings.find((f) => f.status === 'Needs review')?.id || app.findings[0].id}`}
                    className="text-xs text-civic hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    View details <ArrowRight size={12} />
                  </Link>
                </div>
              )}

              {confirmations > 0 && (
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={28}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold tabular-nums">
                        {confirmations}
                      </span>
                      <span className="font-semibold text-sm">
                        Item needs confirmation
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      Land ownership document validity could not be confirmed
                      from available data.
                    </p>
                  </div>
                  <Link
                    href={`/findings/${app.findings.find((f) => f.status === 'Manual review' || f.status === 'Context check')?.id || app.findings[0].id}`}
                    className="text-xs text-civic hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    View details <ArrowRight size={12} />
                  </Link>
                </div>
              )}

              {sourceUnavailable > 0 && (
                <div className="flex items-start gap-3">
                  <Info
                    size={28}
                    className="text-blue-500 shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold tabular-nums">
                        {sourceUnavailable}
                      </span>
                      <span className="font-semibold text-sm">
                        Source unavailable
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      Could not verify institute affiliation status from AICTE
                      public data (service unavailable).
                    </p>
                  </div>
                  <Link
                    href={`/findings/${app.findings[app.findings.length - 1].id}`}
                    className="text-xs text-civic hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    View details <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card mt-6">
        <h2 className="text-lg font-bold mb-4">Activity timeline</h2>
        {app.activityTimeline.length === 0 ? (
          <p className="text-sm text-muted py-4">No activity recorded yet.</p>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-blue-200" />
            {app.activityTimeline.map((event, i) => (
              <div key={event.id} className="relative flex gap-4 pb-5 last:pb-0">
                <div
                  className={`absolute left-[-15px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                    i === app.activityTimeline.length - 1
                      ? 'bg-amber-400'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="text-sm text-muted tabular-nums whitespace-nowrap w-40">
                  {event.timestamp}
                </div>
                <div>
                  <div className="text-sm font-semibold">{event.title}</div>
                  <div className="text-sm text-muted">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <button
          onClick={() => router.push('/applications')}
          className="btn-secondary"
        >
          <Save size={15} />
          Save and exit
        </button>
        <div className="flex items-center gap-3">
          <Link
            href={`/applications/${app.id}/documents`}
            className="btn-secondary"
          >
            <Plus size={15} />
            Add documents
          </Link>
          <button
            disabled={!canRunValidation}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            title={
              !canRunValidation
                ? 'Complete field review to enable'
                : 'Run validation'
            }
            onClick={() => {
              if (canRunValidation && app.validationRuns.length > 0) {
                router.push(
                  `/applications/${app.id}/validation/${app.validationRuns[0].id}`
                );
              }
            }}
          >
            <Play size={15} />
            Run validation
          </button>
          {app.findings.length > 0 && (
            <Link
              href={`/applications/${app.id}/findings`}
              className="btn-primary"
            >
              Open findings
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
