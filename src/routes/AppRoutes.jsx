import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

// Master Index Landing Page
import Index from '../pages/Index';

// Auth Pages
import Login from '../pages/auth/Login';
import Unauthorized from '../pages/auth/Unauthorized';

// Candidate Pages
import CandidateRegistration from '../pages/candidate/CandidateRegistration';
import CandidateProfileWizard from '../pages/candidate/CandidateProfileWizard';
import CandidateDashboard from '../pages/candidate/CandidateDashboard';
import ApplicationStatus from '../pages/candidate/ApplicationStatus';
import InterviewBooking from '../pages/candidate/InterviewBooking';

// Recruiter Pages
import HRDashboard from '../pages/recruiter/HRDashboard';
import Jobs from '../pages/recruiter/Jobs';
import JobCreate from '../pages/recruiter/JobCreate';
import Candidates from '../pages/recruiter/Candidates';
import CandidateDetails from '../pages/recruiter/CandidateDetails';
import Requirements from '../pages/recruiter/Requirements';

// Interviewer Pages
import InterviewerDashboard from '../pages/interviewer/InterviewerDashboard';
import InterviewDetails from '../pages/interviewer/InterviewDetails';
import CandidateEvaluation from '../pages/interviewer/CandidateEvaluation';

// Admin Pages
import AdminConsole from '../pages/admin/AdminConsole';
import FairnessAnalytics from '../pages/admin/FairnessAnalytics';
import AuditLogs from '../pages/admin/AuditLogs';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Master Index & Auth Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<CandidateRegistration />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Candidate Routes */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/profile"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <CandidateProfileWizard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/status"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <ApplicationStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/interview"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <InterviewBooking />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Routes */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
            <HRDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/jobs/create"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
            <JobCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/candidates"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
            <Candidates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/candidates/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
            <CandidateDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/requirements"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
            <Requirements />
          </ProtectedRoute>
        }
      />

      {/* Interviewer Routes */}
      <Route
        path="/interviewer"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INTERVIEWER]}>
            <InterviewerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewer/interviews/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INTERVIEWER]}>
            <InterviewDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviewer/candidates/:id/evaluate"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INTERVIEWER]}>
            <CandidateEvaluation />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminConsole />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/fairness"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <FairnessAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-All Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
