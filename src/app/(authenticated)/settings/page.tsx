'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  UserPlus,
  MoreVertical,
  Shield,
  CheckCircle2,
  Info,
  X,
  Building2,
} from 'lucide-react';
import { USERS, CURRENT_USER } from '@/lib/data';
import type { User } from '@/lib/data';

function getRoleBadgeColor(role: string) {
  switch (role) {
    case 'Administrator':
      return 'bg-red-100 text-red-700 border border-red-200';
    case 'Application Editor':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'Compliance Reviewer':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'Viewer':
      return 'bg-gray-100 text-gray-600 border border-gray-200';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'security'>('users');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [auditRetention, setAuditRetention] = useState('12');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Viewer' as string,
  });

  const [users, setUsers] = useState<User[]>(USERS);

  function handleSave() {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  function handleInvite() {
    if (!inviteForm.name || !inviteForm.email) return;
    const newUser: User = {
      id: `U-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role as User['role'],
      institutionAccess: 'All departments',
      status: 'Active',
      lastActive: 'Just now',
      avatar: inviteForm.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };
    setUsers([...users, newUser]);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', role: 'Viewer' });
  }

  function handleDeactivate(userId: string) {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      ) as User[]
    );
    setShowActionsMenu(null);
  }

  const tabs = [
    { id: 'profile' as const, label: 'Institution profile' },
    { id: 'users' as const, label: 'Users & roles' },
    { id: 'security' as const, label: 'Security & audit' },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold text-ink">Settings</h1>
      <p className="text-muted text-sm mt-1 mb-5">
        Manage access and workspace safeguards.
      </p>

      {/* Warning banner */}
      <div className="warning-banner mb-5">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">
            Demo environment — synthetic users only; no live AICTE connection.
          </p>
          <p className="text-sm text-muted">
            This is a training environment with sample data. No information is submitted to AICTE.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-civic text-civic'
                : 'border-transparent text-muted hover:text-ink'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'users' && (
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">Users &amp; roles</h2>
                <p className="text-sm text-muted">
                  Manage who can access NiyamSetu and what they can do.
                </p>
              </div>
              <button onClick={() => setShowInviteModal(true)} className="btn-primary text-sm">
                <UserPlus size={16} />
                Invite user
              </button>
            </div>

            <div className="card p-0 overflow-hidden">
              <table>
                <thead>
                  <tr>
                    <th className="pl-4">Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Institution access</th>
                    <th>Status</th>
                    <th>Last active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-civic text-white text-xs font-semibold flex items-center justify-center">
                            {user.avatar}
                          </div>
                          <div>
                            <span className="font-medium text-sm">{user.name}</span>
                            {user.id === CURRENT_USER.id && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge text-xs ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="text-sm text-muted">{user.email}</td>
                      <td className="text-sm">{user.institutionAccess}</td>
                      <td>
                        <span className="flex items-center gap-1.5 text-sm">
                          <span
                            className={`status-dot ${
                              user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          {user.status}
                        </span>
                      </td>
                      <td className="text-sm text-muted">{user.lastActive}</td>
                      <td>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActionsMenu(
                                showActionsMenu === user.id ? null : user.id
                              )
                            }
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <MoreVertical size={16} className="text-muted" />
                          </button>
                          {showActionsMenu === user.id && (
                            <div className="absolute right-0 top-8 bg-white border border-border rounded-lg shadow-lg py-1 z-10 w-48">
                              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                Edit access
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                                onClick={() => handleDeactivate(user.id)}
                              >
                                {user.status === 'Active'
                                  ? 'Deactivate account'
                                  : 'Reactivate account'}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 text-sm text-muted border-t border-border">
                Showing {users.length} of {users.length} users
              </div>
            </div>

            {/* Security & access config */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-ink mb-1">
                Security &amp; access configuration
              </h2>
              <p className="text-sm text-muted mb-4">
                Configure workspace safeguards for your institution.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-ink">Audit log retention</span>
                    <Info size={14} className="text-muted" />
                  </div>
                  <p className="text-xs text-muted mb-3">
                    Keep a record of user actions for compliance.
                  </p>
                  <select
                    className="select-field text-sm"
                    value={auditRetention}
                    onChange={(e) => setAuditRetention(e.target.value)}
                  >
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                  </select>
                </div>
                <div className="card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-ink">Session timeout</span>
                    <Info size={14} className="text-muted" />
                  </div>
                  <p className="text-xs text-muted mb-3">
                    Automatically sign out inactive users.
                  </p>
                  <select
                    className="select-field text-sm"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div className="card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-ink">
                      Two-factor authentication (2FA)
                    </span>
                    <Info size={14} className="text-muted" />
                  </div>
                  <p className="text-xs text-muted mb-3">
                    Add an extra layer of security for administrator accounts.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-sm text-green-700">
                      <CheckCircle2 size={14} />
                      Enabled for all administrators
                    </span>
                    <button className="btn-secondary text-xs ml-auto">Manage 2FA</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button onClick={handleSave} className="btn-primary">
                Save changes
              </button>
              {saveSuccess && (
                <span className="text-sm text-green-700 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  Settings saved successfully.
                </span>
              )}
            </div>
          </div>

          {/* About roles panel */}
          <div className="w-[300px] shrink-0">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} className="text-muted" />
                <h3 className="font-semibold text-ink">About roles</h3>
              </div>
              <p className="text-sm text-muted mb-4">
                Use roles to give the right level of access based on a person&apos;s responsibility.
                Follow the principle of least privilege.
              </p>
              <div className="space-y-4">
                <div>
                  <span className={`badge text-xs mb-1 ${getRoleBadgeColor('Administrator')}`}>
                    Administrator
                  </span>
                  <p className="text-xs text-muted mt-1">
                    Full access to all features, user management and settings.
                  </p>
                </div>
                <div>
                  <span className={`badge text-xs mb-1 ${getRoleBadgeColor('Application Editor')}`}>
                    Application Editor
                  </span>
                  <p className="text-xs text-muted mt-1">
                    Can create and edit applications, upload documents and run validations.
                  </p>
                </div>
                <div>
                  <span className={`badge text-xs mb-1 ${getRoleBadgeColor('Compliance Reviewer')}`}>
                    Compliance Reviewer
                  </span>
                  <p className="text-xs text-muted mt-1">
                    Can review validation results, add comments and mark items for recheck.
                  </p>
                </div>
                <div>
                  <span className={`badge text-xs mb-1 ${getRoleBadgeColor('Viewer')}`}>
                    Viewer
                  </span>
                  <p className="text-xs text-muted mt-1">
                    Read-only access to applications, reports and rules reference.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-muted" />
                  <h4 className="font-semibold text-sm text-ink">Best practices</h4>
                </div>
                <ul className="text-xs text-muted space-y-1.5 list-disc pl-4">
                  <li>Give only the minimum access needed.</li>
                  <li>Review user access regularly.</li>
                  <li>Remove access when someone leaves.</li>
                  <li>Use two-factor authentication for all administrators.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-ink mb-1">Institution profile</h2>
          <p className="text-sm text-muted mb-4">
            View and update your institution details.
          </p>
          <div className="card space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-civic/10 flex items-center justify-center">
                <Building2 size={24} className="text-civic" />
              </div>
              <div>
                <p className="font-semibold text-ink">Northstar Institute (Demo)</p>
                <p className="text-xs text-muted">INST-DEMO-001</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink block mb-1">
                  Institution name
                </label>
                <input
                  className="input-field text-sm bg-gray-50"
                  defaultValue="Northstar Institute (Demo)"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">
                  Institution ID
                </label>
                <input
                  className="input-field text-sm bg-gray-50"
                  defaultValue="INST-DEMO-001"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">Address</label>
                <input
                  className="input-field text-sm"
                  defaultValue="123 Education Road, Bengaluru, Karnataka"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">Phone</label>
                <input className="input-field text-sm" defaultValue="+91 80 1234 5678" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">
                  Contact email
                </label>
                <input
                  className="input-field text-sm"
                  defaultValue="admin@northstar.edu.in"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">
                  AICTE reference
                </label>
                <input
                  className="input-field text-sm bg-gray-50"
                  defaultValue="Not linked (demo mode)"
                  readOnly
                />
              </div>
            </div>
            <div className="pt-2">
              <button onClick={handleSave} className="btn-primary text-sm">
                Save changes
              </button>
              {saveSuccess && (
                <span className="ml-3 text-sm text-green-700">Saved.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-ink mb-1">Security &amp; audit</h2>
          <p className="text-sm text-muted mb-4">
            View security settings and audit history.
          </p>
          <div className="space-y-5">
            <div className="card">
              <h3 className="font-semibold text-ink mb-3">Session settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-ink block mb-1">
                    Session timeout
                  </label>
                  <select
                    className="select-field text-sm"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-ink block mb-1">
                    Password policy
                  </label>
                  <select className="select-field text-sm" defaultValue="strong">
                    <option value="strong">Strong (min 12 chars, mixed)</option>
                    <option value="standard">Standard (min 8 chars)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-ink mb-3">Audit log</h3>
              <p className="text-sm text-muted mb-3">
                Recent security-related events in this workspace.
              </p>
              <table className="text-sm">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium">User login</td>
                    <td>Admin User</td>
                    <td className="tabular-nums text-muted">Today, 10:24 AM</td>
                    <td className="text-muted">Successful authentication</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Settings updated</td>
                    <td>Admin User</td>
                    <td className="tabular-nums text-muted">Yesterday, 03:15 PM</td>
                    <td className="text-muted">Session timeout changed to 30 min</td>
                  </tr>
                  <tr>
                    <td className="font-medium">User invited</td>
                    <td>Admin User</td>
                    <td className="tabular-nums text-muted">Mar 10, 2025</td>
                    <td className="text-muted">
                      Meera Thomas added as Compliance Reviewer
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium">User deactivated</td>
                    <td>Admin User</td>
                    <td className="tabular-nums text-muted">Mar 10, 2025</td>
                    <td className="text-muted">
                      Meera Thomas account deactivated
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3 className="font-semibold text-ink mb-3">Export</h3>
              <p className="text-sm text-muted mb-3">
                Download audit logs for compliance reporting.
              </p>
              <div className="flex gap-3">
                <button className="btn-secondary text-sm">Export last 30 days (CSV)</button>
                <button className="btn-secondary text-sm">Export full log (CSV)</button>
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary text-sm">
              Save changes
            </button>
            {saveSuccess && (
              <span className="ml-3 text-sm text-green-700">Saved.</span>
            )}
          </div>
        </div>
      )}

      {/* Invite modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink">Invite user</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-ink block mb-1">Full name *</label>
                <input
                  className="input-field text-sm"
                  placeholder="Enter full name"
                  value={inviteForm.name}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">Email *</label>
                <input
                  className="input-field text-sm"
                  type="email"
                  placeholder="name@institution.edu.in"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1">Role *</label>
                <select
                  className="select-field text-sm"
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, role: e.target.value })
                  }
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Application Editor">Application Editor</option>
                  <option value="Compliance Reviewer">Compliance Reviewer</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowInviteModal(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button onClick={handleInvite} className="btn-primary text-sm">
                <UserPlus size={16} />
                Send invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
