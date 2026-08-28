import React, { useState } from "react";
import { TenantProvider, useTenant } from "./context/TenantContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { TenantDashboard } from "./components/dashboard/TenantDashboard";
import { StudentsManager } from "./components/education/StudentsManager";
import { AcademicsManager } from "./components/education/AcademicsManager";
import { AssessmentManager } from "./components/education/AssessmentManager";
import { AttendanceManager } from "./components/attendance/AttendanceManager";
import { FinanceManager } from "./components/finance/FinanceManager";
import { TimetableManager } from "./components/timetable/TimetableManager";
import { StaffManager } from "./components/staff/StaffManager";
import { GraduationManager } from "./components/certificates/GraduationManager";
import { WebsiteManager } from "./components/website/WebsiteManager";
import { PublicWebsiteView } from "./components/website/PublicWebsiteView";
import { BranchManager } from "./components/branches/BranchManager";
import { AuditLogsManager } from "./components/audit/AuditLogsManager";
import { SettingsManager } from "./components/settings/SettingsManager";
import { PlatformAdminView } from "./components/platform/PlatformAdminView";
import { NewTenantModal } from "./components/tenants/NewTenantModal";

const AppContent: React.FC = () => {
  const { currentTenant, viewMode, setViewMode, isLoading } = useTenant();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [newTenantModalOpen, setNewTenantModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm font-semibold tracking-wide text-slate-300">
          Connecting to DAVETECH Firestore Multi-Tenant Cloud...
        </div>
      </div>
    );
  }

  // 1. PUBLIC WEBSITE PREVIEW MODE
  if (viewMode === "website") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header onOpenNewTenantModal={() => setNewTenantModalOpen(true)} />
        <main className="flex-1">
          <PublicWebsiteView onBackToERP={() => setViewMode("erp")} />
        </main>
        <NewTenantModal
          isOpen={newTenantModalOpen}
          onClose={() => setNewTenantModalOpen(false)}
        />
      </div>
    );
  }

  // 2. PLATFORM SUPER ADMIN PORTAL MODE
  if (viewMode === "platform") {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <Header onOpenNewTenantModal={() => setNewTenantModalOpen(true)} />
        <main className="flex-1">
          <PlatformAdminView onOpenNewTenantModal={() => setNewTenantModalOpen(true)} />
        </main>
        <NewTenantModal
          isOpen={newTenantModalOpen}
          onClose={() => setNewTenantModalOpen(false)}
        />
      </div>
    );
  }

  // 3. MAIN TENANT ERP WORKSPACE
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header onOpenNewTenantModal={() => setNewTenantModalOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Side Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Main Stage Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/90">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && (
              <TenantDashboard onNavigate={(tab) => setActiveTab(tab)} />
            )}

            {activeTab === "students" && <StudentsManager />}

            {activeTab === "academics" && <AcademicsManager />}

            {activeTab === "assessments" && <AssessmentManager />}

            {activeTab === "attendance" && <AttendanceManager />}

            {activeTab === "finance" && <FinanceManager />}

            {activeTab === "timetable" && <TimetableManager />}

            {activeTab === "staff" && <StaffManager />}

            {activeTab === "graduation" && <GraduationManager />}

            {activeTab === "website_cms" && (
              <WebsiteManager onPreviewWebsite={() => setViewMode("website")} />
            )}

            {activeTab === "branches" && <BranchManager />}

            {activeTab === "audit_logs" && <AuditLogsManager />}

            {activeTab === "settings" && <SettingsManager />}
          </div>
        </main>
      </div>

      <NewTenantModal
        isOpen={newTenantModalOpen}
        onClose={() => setNewTenantModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TenantProvider>
      <AppContent />
    </TenantProvider>
  );
}
