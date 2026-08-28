import React from "react";
import { useTenant } from "../../context/TenantContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Receipt,
  Award,
  Clock,
  Briefcase,
  Globe,
  GitBranch,
  ShieldAlert,
  Settings,
  Sparkles,
  ChevronRight,
  School,
  FileSpreadsheet,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentTenant, enabledModules, isTenantAdmin, isParentOrStudent, currentUser } = useTenant();

  const isPrimaryOrJunior =
    currentTenant?.type === "school_primary" ||
    currentTenant?.type === "school_junior";

  const navigationItems = [
    {
      id: "dashboard",
      name: "Dashboard Overview",
      icon: LayoutDashboard,
      module: "dashboard",
      badge: null,
    },
    {
      id: "students",
      name: isPrimaryOrJunior ? "Pupils & Learners" : "Students & Admissions",
      icon: Users,
      module: "admissions",
      badge: isPrimaryOrJunior ? "Playgroup - Gr 9" : "TVET / Tertiary",
    },
    {
      id: "academics",
      name: isPrimaryOrJunior ? "Classes & Learning Areas" : "Courses, Units & Classes",
      icon: BookOpen,
      module: "education",
      badge: isPrimaryOrJunior ? "CBC Aligned" : null,
    },
    {
      id: "assessments",
      name: isPrimaryOrJunior ? "CBC Rubrics & Exams" : "Examinations & Grades",
      icon: FileSpreadsheet,
      module: "exams",
      badge: "Report Cards",
    },
    {
      id: "attendance",
      name: "Attendance Register",
      icon: CalendarCheck,
      module: "attendance",
      badge: "Daily",
    },
    {
      id: "finance",
      name: "Fees & Accounting",
      icon: Receipt,
      module: "fees",
      badge: currentTenant?.currency || "KES",
    },
    {
      id: "timetable",
      name: "Class Timetables",
      icon: Clock,
      module: "timetable",
      badge: null,
    },
    {
      id: "staff",
      name: "Educators & HR",
      icon: Briefcase,
      module: "hr",
      badge: null,
    },
    {
      id: "graduation",
      name: "Certificates & Awards",
      icon: Award,
      module: "certificates",
      badge: "QR Verified",
    },
    {
      id: "website_cms",
      name: "Public Website CMS",
      icon: Globe,
      module: "website",
      badge: "Live Sync",
    },
    {
      id: "branches",
      name: "Campuses & Branches",
      icon: GitBranch,
      module: "branches",
      badge: null,
    },
    {
      id: "audit_logs",
      name: "Security & Audit Logs",
      icon: ShieldAlert,
      module: "reports",
      badge: "Immutable",
    },
    {
      id: "settings",
      name: "Organization Settings",
      icon: Settings,
      module: "settings",
      badge: null,
    },
  ];

  return (
    <aside id="davetech_sidebar" className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      {/* Tenant Branding Card */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <img
            src={currentTenant?.logo || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120"}
            alt={currentTenant?.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-xs font-bold text-white leading-tight truncate">
              {currentTenant?.name || "DAVETECH Organization"}
            </h2>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {currentTenant?.motto || "Excellence in Execution"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Main ERP Modules
        </div>

        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar_nav_${item.id}`}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                    isActive ? "bg-indigo-700 text-indigo-100" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / User Session Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Active Tenant ID</span>
          <span className="text-[10px] font-mono text-indigo-400 font-semibold">{currentTenant?.code}</span>
        </div>
        <div className="text-[11px] text-slate-300 font-medium truncate">
          {currentUser.name}
        </div>
        <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Firestore Real-Time Sync</span>
        </div>
      </div>
    </aside>
  );
};
