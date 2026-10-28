'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Info, ArrowLeft } from 'lucide-react';
import { INSTITUTIONS } from '@/lib/data';

export default function CreatePreflightPage() {
  const router = useRouter();

  const [institution, setInstitution] = useState('');
  const [appType, setAppType] = useState('Extension of Approval (EoA)');
  const [academicYear, setAcademicYear] = useState('');
  const [institutionRef, setInstitutionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleInstitutionChange = (val: string) => {
    setInstitution(val);
    const inst = INSTITUTIONS.find((i) => i.id === val);
    if (inst) {
      setInstitutionRef(val);
    } else {
      setInstitutionRef('');
    }
    if (errors.institution) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.institution;
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!institution) errs.institution = 'Please select an institution.';
    if (!appType) errs.appType = 'Please select an application type.';
    if (!academicYear)
      errs.academicYear = 'Please select an academic year with an available rule package.';
    if (!institutionRef)
      errs.institutionRef = 'Institution reference is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);

    const newId = `EOA-DEMO-${String(15 + Math.floor(Math.random() * 85)).padStart(3, '0')}`;
    setTimeout(() => {
      router.push(`/applications/${newId}/documents`);
    }, 500);
  };

  const steps = [
    { num: 1, label: 'Application details', active: true },
    { num: 2, label: 'Documents', active: false },
    { num: 3, label: 'Review details', active: false },
    { num: 4, label: 'Validate', active: false },
  ];

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted mb-4">
        <Link href="/applications" className="hover:text-civic">
          Applications
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">New preflight</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-ink mb-1">
        Create a preflight case
      </h1>
      <p className="text-muted mb-6">
        Set the context before adding evidence.
      </p>

      {/* Wizard Stepper */}
      <div className="flex items-center justify-center mb-8 gap-0">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.active
                    ? 'bg-civic text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.num}
              </div>
              <span
                className={`text-sm font-medium ${step.active ? 'text-ink' : 'text-gray-400'}`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-20 h-0.5 bg-gray-200 mx-3" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="space-y-5">
            {/* Institution */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Institution <span className="text-red-500">*</span>
              </label>
              <select
                className="select-field"
                value={institution}
                onChange={(e) => handleInstitutionChange(e.target.value)}
              >
                <option value="">Select institution...</option>
                {INSTITUTIONS.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
              {errors.institution && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.institution}
                </p>
              )}
            </div>

            {/* Application Type */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Application type <span className="text-red-500">*</span>
              </label>
              <select
                className="select-field"
                value={appType}
                onChange={(e) => {
                  setAppType(e.target.value);
                  if (errors.appType) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.appType;
                      return next;
                    });
                  }
                }}
              >
                <option value="Extension of Approval (EoA)">
                  Extension of Approval (EoA)
                </option>
              </select>
              {errors.appType && (
                <p className="text-red-600 text-xs mt-1">{errors.appType}</p>
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Academic year <span className="text-red-500">*</span>
              </label>
              <select
                className="select-field"
                value={academicYear}
                onChange={(e) => {
                  setAcademicYear(e.target.value);
                  if (errors.academicYear) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.academicYear;
                      return next;
                    });
                  }
                }}
              >
                <option value="">Select academic year...</option>
                <option value="2026–27">2026–27</option>
                <option value="2025–26">2025–26</option>
                <option value="2024–25">2024–25</option>
              </select>
              {errors.academicYear && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.academicYear}
                </p>
              )}
            </div>

            {/* Institution Reference */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Institution reference <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="INST-DEMO-001"
                value={institutionRef}
                onChange={(e) => {
                  setInstitutionRef(e.target.value);
                  if (errors.institutionRef) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.institutionRef;
                      return next;
                    });
                  }
                }}
              />
              {errors.institutionRef && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.institutionRef}
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Notes <span className="text-muted font-normal">(optional)</span>
              </label>
              <textarea
                className="input-field min-h-[100px] resize-y"
                placeholder="Add any relevant notes about this application..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Info Banner */}
            <div className="info-banner">
              <Info size={16} className="text-civic shrink-0 mt-0.5" />
              <span className="text-sm">
                Prototype workspace · Uses synthetic institutional records
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={() => router.back()}
              className="btn-secondary"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save and continue'}
            </button>
          </div>
        </div>

        {/* Right Panel - Tips */}
        <div>
          <div className="border-l-4 border-civic pl-5">
            <h2 className="text-lg font-bold mb-5">Before you begin</h2>
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold shrink-0">
                  1
                </div>
                <p className="text-sm">
                  Choose the correct application category.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold shrink-0">
                  2
                </div>
                <p className="text-sm">
                  Use the academic year that matches your case.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold shrink-0">
                  3
                </div>
                <p className="text-sm">You can save and return later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
