export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Application Editor' | 'Compliance Reviewer' | 'Viewer';
  institutionAccess: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatar: string;
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
}

export interface Application {
  id: string;
  institutionId: string;
  institution: string;
  type: string;
  academicYear: string;
  status: ApplicationStatus;
  lastUpdated: string;
  programType?: string;
  institutionRef?: string;
  notes?: string;
  documents: Document[];
  findings: Finding[];
  validationRuns: ValidationRun[];
  activityTimeline: ActivityEvent[];
  extractedFields: ExtractedField[];
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'UPLOAD_COMPLETE'
  | 'PROCESSING'
  | 'EXTRACTION_REVIEW'
  | 'VALIDATING'
  | 'VALIDATION_COMPLETE'
  | 'NEEDS_CORRECTION'
  | 'MANUAL_REVIEW'
  | 'PREFLIGHT_READY';

export interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadedOn: string;
  status: 'Pending' | 'Uploaded' | 'Processed' | 'Error';
  size: string;
  pages?: number;
  required: boolean;
  file?: File;
}

export interface ExtractedField {
  id: string;
  documentId: string;
  field: string;
  value: string;
  source: string;
  sourcePage: number;
  confidence: 'High' | 'Medium' | 'Low';
  confirmed: boolean;
  edited: boolean;
  editReason?: string;
}

export interface Finding {
  id: string;
  applicationId: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Needs review' | 'Missing evidence' | 'Manual review' | 'Context check' | 'Resolved' | 'Under review';
  source: 'Automated check' | 'Manual review' | 'System check';
  ruleId: string;
  ruleSource: string;
  evidence?: string;
  evidenceSize?: string;
  owner: string;
  updatedAt: string;
  currentValue?: string;
  priorValue?: string;
  comparisonData?: ComparisonRow[];
  verificationAttempts: VerificationAttempt[];
  resolution?: Resolution;
}

export interface ComparisonRow {
  programme: string;
  currentValue: number;
  priorValue: number;
  difference: number | null;
}

export interface VerificationAttempt {
  id: string;
  source: string;
  description: string;
  provider: string;
  method: string;
  checkedOn: string;
  referenceNumber: string;
  status: 'Verified' | 'Mismatch' | 'Expired' | 'Pending' | 'Source unavailable' | 'Manual review' | 'Not supported';
}

export interface Resolution {
  path: 'corrected' | 'explanation' | 'official_review';
  explanation: string;
  evidenceFile?: string;
  evidenceSize?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'returned';
  submittedAt?: string;
}

export interface ValidationRun {
  id: string;
  applicationId: string;
  rulePackVersion: string;
  startedAt: string;
  completedAt?: string;
  status: 'Processing' | 'Completed' | 'Failed' | 'Cancelled';
  stages: ValidationStage[];
  documentsAnalysed: number;
}

export interface ValidationStage {
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  timestamp?: string;
  details?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'create' | 'upload' | 'validation' | 'finding' | 'review' | 'system';
}

export interface Rule {
  id: string;
  check: string;
  applicationType: string;
  academicYear: string;
  version: string;
  status: 'Draft' | 'In review' | 'Active in demo' | 'Needs source confirmation';
  source: string;
  condition: string;
  requiredInputs: string[];
  sourceClause: string;
  testCases: TestCase[];
  versionHistory: VersionHistoryEntry[];
}

export interface TestCase {
  id: string;
  scenario: string;
  expectedResult: string;
  status: 'Passed' | 'In review' | 'Not run';
}

export interface VersionHistoryEntry {
  version: string;
  date: string;
  changes: string;
  by: string;
}

export interface Notification {
  id: string;
  applicationId: string;
  findingId?: string;
  title: string;
  description: string;
  action: string;
  timestamp: string;
  read: boolean;
}

export const CURRENT_USER: User = {
  id: 'U-001',
  name: 'Admin User',
  email: 'admin@northstar.edu.in',
  role: 'Administrator',
  institutionAccess: 'All departments',
  status: 'Active',
  lastActive: 'Today, 10:24 AM',
  avatar: 'AD',
};

export const INSTITUTIONS: Institution[] = [
  { id: 'INST-001', name: 'Northstar Institute (Demo)', shortName: 'NI' },
  { id: 'INST-002', name: 'Rivermount College of Engineering (Demo)', shortName: 'RCE' },
  { id: 'INST-003', name: 'Sample Technical Institute', shortName: 'STI' },
  { id: 'INST-004', name: 'Greenfield Institute of Technology (Demo)', shortName: 'GIT' },
  { id: 'INST-005', name: 'Maple Leaf College (Demo)', shortName: 'MLC' },
  { id: 'INST-006', name: 'Sunrise Institute of Management (Demo)', shortName: 'SIM' },
];

export const USERS: User[] = [
  CURRENT_USER,
  {
    id: 'U-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@northstar.edu.in',
    role: 'Application Editor',
    institutionAccess: 'Engineering',
    status: 'Active',
    lastActive: 'Today, 09:12 AM',
    avatar: 'PS',
  },
  {
    id: 'U-003',
    name: 'Rahul Khanna',
    email: 'rahul.khanna@northstar.edu.in',
    role: 'Viewer',
    institutionAccess: 'All departments',
    status: 'Active',
    lastActive: 'Yesterday, 04:38 PM',
    avatar: 'RK',
  },
  {
    id: 'U-004',
    name: 'Meera Thomas',
    email: 'meera.thomas@northstar.edu.in',
    role: 'Compliance Reviewer',
    institutionAccess: 'All departments',
    status: 'Inactive',
    lastActive: 'Mar 10, 2025',
    avatar: 'MT',
  },
];

const DEMO_FINDINGS: Finding[] = [
  {
    id: 'F-001',
    applicationId: 'EOA-DEMO-014',
    title: 'Requested intake differs from prior approval',
    description: 'The total requested intake in the current application (600) is different from the intake in the prior approval (480) for the same programme(s).',
    severity: 'High',
    status: 'Needs review',
    source: 'Automated check',
    ruleId: 'EOA-INTAKE-CONSISTENCY v1.0',
    ruleSource: 'UGC (Establishment) Regulations 2023 Reg. 5(2)',
    evidence: 'intake-comparison.pdf',
    evidenceSize: '245 KB',
    owner: 'Applicant',
    updatedAt: '14 Mar 2025, 10:24 AM',
    currentValue: '600',
    priorValue: '480',
    comparisonData: [
      { programme: 'B.Tech – Computer Science and Engineering', currentValue: 240, priorValue: 240, difference: 0 },
      { programme: 'B.Tech – Electronics and Communication Engineering', currentValue: 180, priorValue: 120, difference: 60 },
      { programme: 'B.Tech – Mechanical Engineering', currentValue: 180, priorValue: 120, difference: 60 },
    ],
    verificationAttempts: [
      {
        id: 'VA-001',
        source: 'Previous approval record',
        description: 'Check earlier EOA/LOA records for the institution and program details.',
        provider: 'DemoAuthorityProvider (simulated)',
        method: 'API lookup (sandbox)',
        checkedOn: '21 Apr 2025, 11:24 AM',
        referenceNumber: 'F. No. AICTE/EOA/2023-24/12345',
        status: 'Verified',
      },
      {
        id: 'VA-002',
        source: 'Issuer reference',
        description: 'Validate the document reference with issuing authority.',
        provider: 'DemoAuthorityProvider (simulated)',
        method: 'Reference search (sandbox)',
        checkedOn: '21 Apr 2025, 11:24 AM',
        referenceNumber: 'Not available',
        status: 'Source unavailable',
      },
      {
        id: 'VA-003',
        source: 'QR / official record check',
        description: 'Verify QR code or unique ID with official portal (if supported).',
        provider: 'DemoAuthorityProvider (simulated)',
        method: 'QR verification (sandbox)',
        checkedOn: '21 Apr 2025, 11:24 AM',
        referenceNumber: 'Not available',
        status: 'Not supported',
      },
    ],
  },
  {
    id: 'F-002',
    applicationId: 'EOA-DEMO-014',
    title: 'Institution certificate not provided',
    description: 'Mandatory certificate from the sponsoring trust/society is missing.',
    severity: 'High',
    status: 'Missing evidence',
    source: 'Automated check',
    ruleId: 'EOA-DOC-COMPLETENESS v0.3',
    ruleSource: 'UGC (Establishment) Regulations 2023 Reg. 4(1)(b)',
    owner: 'Applicant',
    updatedAt: '13 Mar 2025, 04:17 PM',
    verificationAttempts: [],
  },
  {
    id: 'F-003',
    applicationId: 'EOA-DEMO-014',
    title: 'Issue date could not be confirmed',
    description: 'The issue date on the land ownership document could not be verified.',
    severity: 'Medium',
    status: 'Manual review',
    source: 'Automated check',
    ruleId: 'EOA-DATE-VALIDATION v0.1',
    ruleSource: 'UGC (Establishment) Regulations 2023 Reg. 3(1)(a)',
    evidence: 'land-document.pdf',
    evidenceSize: '1.2 MB',
    owner: 'Regulator',
    updatedAt: '12 Mar 2025, 02:06 PM',
    verificationAttempts: [],
  },
  {
    id: 'F-004',
    applicationId: 'EOA-DEMO-014',
    title: 'Exact duplicate file found',
    description: 'This document appears to be an exact duplicate of another file already submitted.',
    severity: 'Low',
    status: 'Context check',
    source: 'System check',
    ruleId: 'EOA-DUPLICATE-CHECK v0.1',
    ruleSource: 'System check (Duplicate detection)',
    evidence: 'infrastructure-plan.pdf',
    evidenceSize: '980 KB',
    owner: 'System',
    updatedAt: '12 Mar 2025, 11:48 AM',
    verificationAttempts: [],
  },
];

export const DEMO_APPLICATIONS: Application[] = [
  {
    id: 'EOA-DEMO-014',
    institutionId: 'INST-002',
    institution: 'Rivermount College of Engineering (Demo)',
    type: 'Extension of Approval',
    academicYear: '2025–26',
    status: 'NEEDS_CORRECTION',
    lastUpdated: '12 Aug 2025, 10:24 AM',
    programType: 'Engineering & Technology',
    institutionRef: 'INST-DEMO-001',
    documents: [
      { id: 'D-001', name: 'EOA_Application_Form.pdf', type: 'pdf', category: 'Application Form', uploadedOn: '10 Apr 2025, 11:24 AM', status: 'Processed', size: '1.2 MB', pages: 12, required: true },
      { id: 'D-002', name: 'Prior_Approval_Order.pdf', type: 'pdf', category: 'Prior Approval', uploadedOn: '10 Apr 2025, 11:26 AM', status: 'Processed', size: '843 KB', pages: 6, required: true },
      { id: 'D-003', name: 'Land_Documents.pdf', type: 'pdf', category: 'Affidavit / Certificate', uploadedOn: '10 Apr 2025, 11:28 AM', status: 'Processed', size: '2.1 MB', pages: 8, required: true },
      { id: 'D-004', name: 'Faculty_Details.pdf', type: 'pdf', category: 'Faculty Details', uploadedOn: '10 Apr 2025, 11:30 AM', status: 'Processed', size: '1.4 MB', pages: 15, required: true },
    ],
    findings: DEMO_FINDINGS,
    validationRuns: [
      {
        id: 'RUN-20250424-1032',
        applicationId: 'EOA-DEMO-014',
        rulePackVersion: 'v1.2.0 (AY 2025–26)',
        startedAt: '24 Apr 2025, 10:32 AM',
        completedAt: '24 Apr 2025, 10:33 AM',
        status: 'Completed',
        documentsAnalysed: 4,
        stages: [
          { name: 'Files checked', description: '4 documents accepted', status: 'completed', timestamp: '00:03', details: 'All files passed format and size checks.' },
          { name: 'Text extracted', description: '18 fields extracted', status: 'completed', timestamp: '00:07' },
          { name: 'Fields normalized', description: '2 fields confirmed by user', status: 'completed', timestamp: '00:12' },
          { name: 'Applying validation rules', description: '12 configured rules selected', status: 'completed', timestamp: '00:18' },
          { name: 'Checking source responses', description: 'Verifying with official sources (where available)', status: 'completed', timestamp: '00:22' },
          { name: 'Preparing report', description: 'Compiling results and evidence summary', status: 'completed', timestamp: '00:25' },
        ],
      },
    ],
    activityTimeline: [
      { id: 'AE-001', timestamp: '10 Apr 2025, 11:22 AM', title: 'Application created', description: 'Application draft for EOA-DEMO-014 created.', type: 'create' },
      { id: 'AE-002', timestamp: '10 Apr 2025, 11:28 AM', title: 'Documents uploaded', description: '4 documents uploaded successfully.', type: 'upload' },
      { id: 'AE-003', timestamp: '10 Apr 2025, 11:31 AM', title: 'Validation run completed', description: 'Pre-submission validation completed. 4 findings identified.', type: 'validation' },
    ],
    extractedFields: [
      { id: 'EF-001', documentId: 'D-002', field: 'Institution reference', value: 'INST-DEMO-001', source: 'Prior Approval', sourcePage: 1, confidence: 'High', confirmed: true, edited: false },
      { id: 'EF-002', documentId: 'D-002', field: 'Programme', value: 'CSE-A', source: 'Prior Approval', sourcePage: 1, confidence: 'High', confirmed: true, edited: false },
      { id: 'EF-003', documentId: 'D-002', field: 'Approved intake', value: '60', source: 'Prior Approval', sourcePage: 1, confidence: 'Medium', confirmed: false, edited: false },
      { id: 'EF-004', documentId: 'D-002', field: 'Issue date', value: '12 May 2025', source: 'Prior Approval', sourcePage: 1, confidence: 'High', confirmed: false, edited: false },
    ],
  },
  {
    id: 'EOA-DEMO-013',
    institutionId: 'INST-001',
    institution: 'Northstar Institute (Demo)',
    type: 'Extension of Approval',
    academicYear: '2025–26',
    status: 'PREFLIGHT_READY',
    lastUpdated: '11 Aug 2025, 04:17 PM',
    documents: [],
    findings: [],
    validationRuns: [],
    activityTimeline: [],
    extractedFields: [],
  },
  {
    id: 'EOA-DEMO-012',
    institutionId: 'INST-003',
    institution: 'Sample Technical Institute',
    type: 'Extension of Approval',
    academicYear: '2025–26',
    status: 'PROCESSING',
    lastUpdated: '10 Aug 2025, 09:03 AM',
    documents: [],
    findings: [],
    validationRuns: [],
    activityTimeline: [],
    extractedFields: [],
  },
  {
    id: 'EOA-DEMO-011',
    institutionId: 'INST-004',
    institution: 'Greenfield Institute of Technology (Demo)',
    type: 'Extension of Approval',
    academicYear: '2024–25',
    status: 'DRAFT',
    lastUpdated: '08 Aug 2025, 01:12 PM',
    documents: [],
    findings: [],
    validationRuns: [],
    activityTimeline: [],
    extractedFields: [],
  },
  {
    id: 'EOA-DEMO-010',
    institutionId: 'INST-005',
    institution: 'Maple Leaf College (Demo)',
    type: 'Extension of Approval',
    academicYear: '2024–25',
    status: 'PREFLIGHT_READY',
    lastUpdated: '06 Aug 2025, 11:46 AM',
    documents: [],
    findings: [],
    validationRuns: [],
    activityTimeline: [],
    extractedFields: [],
  },
  {
    id: 'EOA-DEMO-009',
    institutionId: 'INST-006',
    institution: 'Sunrise Institute of Management (Demo)',
    type: 'Extension of Approval',
    academicYear: '2024–25',
    status: 'DRAFT',
    lastUpdated: '04 Aug 2025, 03:28 PM',
    documents: [],
    findings: [],
    validationRuns: [],
    activityTimeline: [],
    extractedFields: [],
  },
];

export const DEMO_RULES: Rule[] = [
  {
    id: 'EOA-DOC-COMPLETENESS',
    check: 'Mandatory documents present',
    applicationType: 'Extension of Approval (EOA)',
    academicYear: '2024–25',
    version: 'v0.3',
    status: 'Draft',
    source: 'To be verified',
    condition: 'For each mandatory document in the requirement list, application must have a valid file uploaded. If any document is missing or file is unreadable, flag as non-compliant.',
    requiredInputs: [
      'List of mandatory documents (per application type)',
      'Uploaded file metadata (file type, size, scan status)',
      'Application type (EOA / LoA / Increase in Intake etc.)',
      'Academic year',
    ],
    sourceClause: 'No official source linked yet. This rule must be verified against the relevant AICTE document (e.g. Approval Process Handbook 2024-25, Clause X.X) before it can be activated.',
    testCases: [
      { id: 'TC-01', scenario: 'All mandatory docs present', expectedResult: 'Pass', status: 'Passed' },
      { id: 'TC-02', scenario: 'Missing Self-Disclosure form', expectedResult: 'Fail', status: 'Passed' },
      { id: 'TC-03', scenario: 'Unsupported file type (exe)', expectedResult: 'Fail', status: 'Passed' },
      { id: 'TC-04', scenario: 'Corrupted PDF file', expectedResult: 'Fail', status: 'In review' },
      { id: 'TC-05', scenario: 'Large file (> 50 MB)', expectedResult: 'Fail', status: 'Not run' },
    ],
    versionHistory: [
      { version: 'v0.3', date: '12 Jan 2025', changes: 'Updated document list', by: 'Admin User' },
      { version: 'v0.2', date: '08 Jan 2025', changes: 'Initial test cases added', by: 'Admin User' },
      { version: 'v0.1', date: '05 Jan 2025', changes: 'Rule created', by: 'Admin User' },
    ],
  },
  {
    id: 'EOA-INTAKE-CONSISTENCY',
    check: 'Intake consistency across forms',
    applicationType: 'Extension of Approval (EOA)',
    academicYear: '2024–25',
    version: 'v0.2',
    status: 'In review',
    source: 'AICTE APH 2024-25 (Clause 3.2.1)',
    condition: 'Compare requested intake in current application with approved intake in prior approval letter. Flag any difference exceeding configured threshold.',
    requiredInputs: ['Current application intake values', 'Prior approval intake values', 'Programme mapping'],
    sourceClause: 'AICTE Approval Process Handbook 2024-25, Clause 3.2.1',
    testCases: [
      { id: 'TC-06', scenario: 'Matching intakes', expectedResult: 'Pass', status: 'Passed' },
      { id: 'TC-07', scenario: 'Intake increased by 60', expectedResult: 'Fail', status: 'Passed' },
    ],
    versionHistory: [
      { version: 'v0.2', date: '10 Jan 2025', changes: 'Added threshold config', by: 'Admin User' },
      { version: 'v0.1', date: '05 Jan 2025', changes: 'Rule created', by: 'Admin User' },
    ],
  },
  {
    id: 'EOA-DATE-VALIDATION',
    check: 'Academic calendar date validation',
    applicationType: 'Extension of Approval (EOA)',
    academicYear: '2024–25',
    version: 'v0.1',
    status: 'Active in demo',
    source: 'AICTE APH 2024-25 (Clause 1.4)',
    condition: 'Verify document dates are within the applicable academic year and not expired.',
    requiredInputs: ['Document issue dates', 'Academic year boundaries', 'Validity periods'],
    sourceClause: 'AICTE Approval Process Handbook 2024-25, Clause 1.4',
    testCases: [
      { id: 'TC-08', scenario: 'Valid date range', expectedResult: 'Pass', status: 'Passed' },
      { id: 'TC-09', scenario: 'Expired certificate', expectedResult: 'Fail', status: 'Passed' },
    ],
    versionHistory: [
      { version: 'v0.1', date: '05 Jan 2025', changes: 'Rule created', by: 'Admin User' },
    ],
  },
  {
    id: 'EOA-DUPLICATE-CHECK',
    check: 'Duplicate application check',
    applicationType: 'Extension of Approval (EOA)',
    academicYear: '2024–25',
    version: 'v0.1',
    status: 'Needs source confirmation',
    source: 'To be verified',
    condition: 'Check for exact or near-duplicate file submissions within the same application or across recent applications for the same institution.',
    requiredInputs: ['File hashes', 'Document metadata', 'Institution application history'],
    sourceClause: 'Internal system check — no specific regulatory clause.',
    testCases: [],
    versionHistory: [
      { version: 'v0.1', date: '05 Jan 2025', changes: 'Rule created', by: 'Admin User' },
    ],
  },
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'N-001',
    applicationId: 'EOA-DEMO-014',
    findingId: 'F-001',
    title: 'Finding needs review',
    description: 'Intake discrepancy in EOA-DEMO-014 requires your attention.',
    action: 'Review finding',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'N-002',
    applicationId: 'EOA-DEMO-014',
    findingId: 'F-002',
    title: 'Missing document',
    description: 'Institution certificate not yet uploaded for EOA-DEMO-014.',
    action: 'Upload document',
    timestamp: '5 hours ago',
    read: false,
  },
  {
    id: 'N-003',
    applicationId: 'EOA-DEMO-012',
    title: 'Validation in progress',
    description: 'EOA-DEMO-012 validation run started.',
    action: 'View progress',
    timestamp: '1 day ago',
    read: true,
  },
];

export function getStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    DRAFT: 'Draft',
    UPLOAD_COMPLETE: 'Upload complete',
    PROCESSING: 'Processing',
    EXTRACTION_REVIEW: 'Extraction review',
    VALIDATING: 'Validating',
    VALIDATION_COMPLETE: 'Validation complete',
    NEEDS_CORRECTION: 'Needs review',
    MANUAL_REVIEW: 'Manual review',
    PREFLIGHT_READY: 'Preflight ready',
  };
  return labels[status] || status;
}

export function getStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    UPLOAD_COMPLETE: 'bg-blue-50 text-blue-700',
    PROCESSING: 'bg-blue-50 text-blue-700',
    EXTRACTION_REVIEW: 'bg-amber-50 text-amber-700',
    VALIDATING: 'bg-blue-50 text-blue-700',
    VALIDATION_COMPLETE: 'bg-green-50 text-green-700',
    NEEDS_CORRECTION: 'bg-amber-50 text-amber-700',
    MANUAL_REVIEW: 'bg-amber-50 text-amber-700',
    PREFLIGHT_READY: 'bg-green-50 text-green-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getStatusDot(status: ApplicationStatus): string {
  const dots: Record<ApplicationStatus, string> = {
    DRAFT: 'bg-gray-400',
    UPLOAD_COMPLETE: 'bg-blue-500',
    PROCESSING: 'bg-blue-500',
    EXTRACTION_REVIEW: 'bg-amber-500',
    VALIDATING: 'bg-blue-500',
    VALIDATION_COMPLETE: 'bg-green-500',
    NEEDS_CORRECTION: 'bg-amber-500',
    MANUAL_REVIEW: 'bg-amber-500',
    PREFLIGHT_READY: 'bg-green-500',
  };
  return dots[status] || 'bg-gray-400';
}

export function getFindingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Needs review': 'bg-amber-100 text-amber-800',
    'Missing evidence': 'bg-red-100 text-red-800',
    'Manual review': 'bg-blue-100 text-blue-800',
    'Context check': 'bg-gray-100 text-gray-700',
    'Resolved': 'bg-green-100 text-green-800',
    'Under review': 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    High: 'text-red-600',
    Medium: 'text-amber-600',
    Low: 'text-blue-600',
  };
  return colors[severity] || 'text-gray-600';
}
