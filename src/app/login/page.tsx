'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  FileText,
  CheckCircle2,
  ClipboardCheck,
  Landmark,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = 'Work email is required';
    if (!password.trim()) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAuthError('');
      return;
    }

    setErrors({});
    setAuthError('');
    setLoading(true);

    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col justify-between relative overflow-hidden"
        style={{ background: '#14283D' }}
      >
        <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
              <Landmark className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">NIYAMSETU</div>
              <div className="text-[11px] tracking-[0.15em] text-amber-300/80 uppercase font-medium">
                Compliance Today&nbsp;&nbsp;|&nbsp;&nbsp;Smoother Approvals Tomorrow
              </div>
            </div>
          </div>

          {/* Main heading */}
          <div className="flex-1 flex flex-col justify-center max-w-xl">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              Check the evidence<br />before you submit.
            </h1>
            <p className="text-lg text-slate-300 mb-14 leading-relaxed">
              Pre-submission validation for AICTE<br />approval applications.
            </p>

            {/* Steps */}
            <div className="flex items-start gap-4">
              <StepCard
                icon={<FileText className="w-8 h-8 text-slate-300" />}
                number="1"
                label="Upload / Enter Application Details"
              />
              <div className="flex items-center pt-8">
                <ArrowRight className="w-6 h-6 text-slate-500" />
              </div>
              <StepCard
                icon={<CheckCircle2 className="w-8 h-8 text-slate-300" />}
                number="2"
                label="Automated Compliance Checks"
              />
              <div className="flex items-center pt-8">
                <ArrowRight className="w-6 h-6 text-slate-500" />
              </div>
              <StepCard
                icon={<ClipboardCheck className="w-8 h-8 text-slate-300" />}
                number="3"
                label="Review Issues and Resolve"
              />
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="text-[11px] tracking-[0.2em] text-slate-400 uppercase font-medium">
              Supporting Higher Technical Education Through Clearer Compliance
            </p>
          </div>
        </div>

        {/* Background pattern / subtle buildings silhouette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.06]"
          style={{
            background:
              'repeating-linear-gradient(90deg, #fff 0px, #fff 2px, transparent 2px, transparent 40px), ' +
              'linear-gradient(to top, #fff 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Right sign-in panel */}
      <div className="flex-1 flex flex-col bg-white min-h-screen">
        {/* AICTE header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-500">
            An initiative to support<br />AICTE regulatory processes
          </p>
          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-[10px] text-gray-500 leading-tight">
                All India Council for Technical Education
              </div>
              <div className="text-[10px] text-gray-400 leading-tight">
                Ministry of Education, Government of India
              </div>
            </div>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-[#14283D] mb-8">Sign in to NiyamSetu</h2>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-semibold text-[#14283D] mb-1.5">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@organization.gov.in"
                  className={`input-field ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-5">
                <label htmlFor="password" className="block text-sm font-semibold text-[#14283D] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Enter your password"
                    className={`input-field pr-11 ${errors.password ? 'border-red-400 focus:border-red-400' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember */}
              <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#24638F] focus:ring-[#24638F] cursor-pointer"
                />
                <span className="text-sm text-gray-700">Remember this device</span>
              </label>

              {/* Auth error */}
              {authError && (
                <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                  {authError}
                </div>
              )}

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold text-base transition-colors disabled:opacity-60"
                style={{ background: '#24638F' }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget.style.background = '#1a4f73');
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget.style.background = '#24638F');
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Forgot */}
            <div className="mt-4">
              <button
                type="button"
                className="text-[#24638F] text-sm font-medium hover:underline"
                onClick={() => alert('Password recovery is not available in this prototype.')}
              >
                Forgot password?
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />

            {/* Contact admin */}
            <p className="text-sm text-gray-600">
              Need access?{' '}
              <button
                type="button"
                className="text-[#24638F] font-medium hover:underline"
                onClick={() => alert('Please contact your institution administrator for access.')}
              >
                Contact your administrator.
              </button>
            </p>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="px-8 py-4 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authorized users only. Access is logged.
          </div>
          <p className="text-xs text-gray-400">
            Prototype environment&nbsp;&nbsp;&middot;&nbsp;&nbsp;No connection to the live AICTE portal
          </p>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  icon,
  number,
  label,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center w-32">
      <div className="w-16 h-16 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center mb-2.5">
        {icon}
      </div>
      <p className="text-xs text-slate-400 leading-snug">
        {number}. {label}
      </p>
    </div>
  );
}
