# FairHire — Frontend Master Platform

> **Fair Process. Right Talent.**

FairHire tackles **Volume Fatigue** in corporate recruitment by contextually evaluating candidates using semantic, AI-assisted matching rather than rigid keyword filters.

---

## Architecture Diagram

```text
Antigravity React Frontend
        ↓
API Service Layer (api.js + Domain Services)
        ↓
SNS Workbench Webhooks (https://api.snsworkbench.ai/v1/recruitment)
        ↓
Backend Workflows (n8n / Webhooks)
        ↓
Supabase DB + Gemini AI Services
```

---

## Role Portals & Workflows

1. **Candidate Portal**: Account registration with merit value prop, step-by-step profile wizard, live status tracking, and interview slot booking.
2. **Recruiter / HR Dashboard**: Active job postings, candidate pipeline Kanban board (Applied -> Screened -> Shortlisted -> Interview Scheduled -> Interviewed -> Offered -> Hired / Rejected), job creation with template auto-population (`GET /job-template`), and visual distinction between AI Assessment and Human Decision.
3. **Interviewer Dashboard**: Agenda calendar, candidate profile review, structured AI-generated interview prompts (`GET /interviews/llm-prompts`), and evaluation feedback form (`POST /interviews/feedback`).
4. **Admin Console**: System metrics, Fairness & Parity Analytics (`GET /compliance/fairness` - Adverse Impact Ratio, 80% rule compliance, demographic parity), and searchable Audit Logs (`GET /admin/audit-log`).

---

## Technology Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3 + Custom CSS variables
- **Icons**: Lucide React
- **HTTP/API**: Reusable Fetch API abstraction (`api.js`)
- **State Management**: React Context (`AuthContext`) + Custom Hooks (`useCandidates`, `useJobs`, `useInterviews`, `useAuth`)

---

## Folder Structure

```text
fairhire-frontend/
│
├── public/
│   ├── favicon.svg
│   └── assets/
│       └── logo.jpg
│
├── src/
│   ├── assets/
│   │   └── logo.jpg
│   │
│   ├── components/
│   │   ├── common/         # Button, Input, Select, Checkbox, Modal, Badge, Loader, Skeleton, EmptyState, ErrorState, ConfirmDialog, Toast
│   │   ├── layout/         # Sidebar, Topbar, DashboardLayout, PageHeader
│   │   ├── candidates/     # CandidateCard, CandidateTable, CandidateProfile, CandidateScore, SkillMatch, PipelineBoard, CandidateTimeline
│   │   ├── jobs/           # JobCard, JobTable, JobPostingForm, JobDetails
│   │   ├── interviews/     # InterviewCard, InterviewCalendar, SlotSelector, FeedbackForm, InterviewQuestions
│   │   └── compliance/     # FairnessScore, BiasMetrics, AuditLogTable
│   │
│   ├── pages/
│   │   ├── auth/           # Login, Unauthorized
│   │   ├── candidate/      # CandidateRegistration, CandidateProfileWizard, CandidateDashboard, ApplicationStatus, InterviewBooking
│   │   ├── recruiter/      # HRDashboard, Jobs, JobCreate, Candidates, CandidateDetails
│   │   ├── interviewer/    # InterviewerDashboard, InterviewDetails, CandidateEvaluation
│   │   └── admin/          # AdminConsole, FairnessAnalytics, AuditLogs
│   │
│   ├── services/           # api.js, authApi.js, candidateApi.js, jobApi.js, interviewApi.js, complianceApi.js
│   ├── mock/               # candidateMock.js, jobMock.js, interviewMock.js, complianceMock.js (Isolated Mock Sandbox)
│   ├── hooks/              # useAuth.js, useCandidates.js, useJobs.js, useInterviews.js
│   ├── context/            # AuthContext.jsx (Includes interactive role switcher)
│   ├── routes/             # AppRoutes.jsx (Role guards & routing)
│   ├── utils/              # constants.js, validators.js, formatters.js
│   ├── styles/             # globals.css, variables.css, responsive.css
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation & Setup

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```env
   VITE_API_BASE_URL=https://api.snsworkbench.ai/v1/recruitment
   VITE_API_MODE=mock
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## API Modes: Mock vs. Live

- **Mock Sandbox Mode** (`VITE_API_MODE=mock`): Uses isolated mock data services in `src/mock/` for instant local offline testing and interactive role toggling via the topbar dropdown.
- **Live Backend Mode** (`VITE_API_MODE=live`): Dispatches HTTP requests to `VITE_API_BASE_URL` (SNS Workbench Webhooks). No code changes in React components are required to switch modes!

---

## Central API Endpoints Matrix

| Service | Action | Endpoint Path | Method |
| :--- | :--- | :--- | :--- |
| Candidate | Apply Candidate | `/candidates/apply` | `POST` |
| Candidate | Status Check | `/candidates/status-check` | `GET` |
| Candidate | Confirm Slot | `/candidates/confirm-slot` | `POST` |
| Candidate | Update Status | `/candidates/status` | `POST` |
| Jobs | Create Job | `/jobs/post` | `POST` |
| Jobs | Role List | `/job-roles` | `GET` |
| Jobs | Role Template | `/job-template` | `GET` |
| Interviews | Schedule | `/interviews/schedule` | `POST` |
| Interviews | Submit Feedback | `/interviews/feedback` | `POST` |
| Interviews | AI Prompts | `/interviews/llm-prompts` | `GET` |
| Compliance | Fairness Metrics | `/compliance/fairness` | `GET` |
| Compliance | Audit Logs | `/admin/audit-log` | `GET` |
