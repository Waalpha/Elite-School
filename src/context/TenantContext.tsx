import React, { createContext, useContext, useState, useEffect } from "react";
import type { Tenant, Branch, UserRole } from "../types";
import {
  subscribeToTenants,
  subscribeToBranches,
  checkAndSeedInitialTenants,
  getTenantById,
  saveTenant,
} from "../services/firestoreService";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface TenantContextType {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  selectTenantById: (tenantId: string) => Promise<void>;
  selectTenantBySubdomain: (subdomain: string) => void;
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch | null) => void;
  currentUser: CurrentUser;
  setCurrentUserRole: (role: UserRole) => void;
  isPlatformAdmin: boolean;
  isTenantAdmin: boolean;
  isParentOrStudent: boolean;
  enabledModules: string[];
  activeModule: string;
  setActiveModule: (module: string) => void;
  refreshTenants: () => void;
  loading: boolean;
  viewMode: "erp" | "website" | "platform";
  setViewMode: (mode: "erp" | "website" | "platform") => void;
  getTenantSubdomainUrl: (tenant?: Tenant | null, mode?: "erp" | "website") => string;
  getTenantShareUrl: (tenant?: Tenant | null, mode?: "erp" | "website") => string;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenantState] = useState<Tenant | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModule, setActiveModule] = useState<string>("dashboard");
  const [viewMode, setViewModeState] = useState<"erp" | "website" | "platform">("erp");

  // Current session user (Platform admin default with toggle ability)
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: "usr_davetech_admin",
    name: "David Muchiri (DAVETECH)",
    email: "davmuchiri48@gmail.com",
    role: "tenant_admin",
  });

  // URL-driven tenant & subdomain routing support
  const getTenantIdentifierFromUrl = (): string | null => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      // Priority 1: ?subdomain=bitc or ?subdomain=staustin
      const querySubdomain = urlParams.get("subdomain");
      if (querySubdomain) return querySubdomain.toLowerCase().trim();

      // Priority 2: ?tenant=bitc-college
      const queryTenant = urlParams.get("tenant");
      if (queryTenant) return queryTenant.trim();

      // Priority 3: Hostname subdomain detection (e.g. bitc.davetecherp.com or bitc.davetech.co.ke)
      const hostname = window.location.hostname;
      if (
        hostname.includes(".davetecherp.") ||
        hostname.includes(".davetech.") ||
        hostname.includes(".localhost")
      ) {
        const parts = hostname.split(".");
        if (parts.length > 2 && parts[0] !== "www" && parts[0] !== "app" && parts[0] !== "api") {
          return parts[0].toLowerCase();
        }
      }

      // Priority 4: Path-based routing /site/:tenantId or /app/:tenantId
      const path = window.location.pathname;
      if (path.startsWith("/site/")) {
        const siteId = path.replace("/site/", "").split("/")[0];
        if (siteId) return siteId;
      }
      if (path.startsWith("/app/")) {
        const appId = path.replace("/app/", "").split("/")[0];
        if (appId) return appId;
      }
    } catch {
      // fallback
    }
    return null;
  };

  // Helper to format full DAVETECH subdomain URL
  const getTenantSubdomainUrl = (tenant?: Tenant | null, mode?: "erp" | "website"): string => {
    const target = tenant || currentTenant;
    if (!target) return "https://davetecherp.com";
    const sub = (target.subdomain || target.code || "app").toLowerCase().replace(/[^a-z0-9-]/g, "");
    const base = `https://${sub}.davetecherp.com`;
    return mode === "website" ? `${base}/website` : base;
  };

  // Helper to get shareable live app URL with query params
  const getTenantShareUrl = (tenant?: Tenant | null, mode?: "erp" | "website"): string => {
    const target = tenant || currentTenant;
    if (!target) return window.location.origin;
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      const sub = (target.subdomain || target.code || "app").toLowerCase().replace(/[^a-z0-9-]/g, "");
      url.searchParams.set("subdomain", sub);
      url.searchParams.set("tenant", target.id);
      if (mode) url.searchParams.set("mode", mode);
      return url.toString();
    } catch {
      return window.location.href;
    }
  };

  // Sync viewMode to URL query or path
  const setViewMode = (mode: "erp" | "website" | "platform") => {
    setViewModeState(mode);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      if (currentTenant) {
        url.searchParams.set("tenant", currentTenant.id);
        const sub = (currentTenant.subdomain || currentTenant.code || "app").toLowerCase().replace(/[^a-z0-9-]/g, "");
        url.searchParams.set("subdomain", sub);
      }
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  };

  // Initialize and seed if empty in Firestore
  useEffect(() => {
    let unsubscribeTenants: (() => void) | null = null;

    const init = async () => {
      try {
        await checkAndSeedInitialTenants();
      } catch (err) {
        console.error("Seed error:", err);
      }

      unsubscribeTenants = subscribeToTenants((list) => {
        setTenants(list);
        setLoading(false);

        // Check if URL specifies tenant by subdomain, code, or ID
        const urlIdentifier = getTenantIdentifierFromUrl();
        if (urlIdentifier) {
          const matched = list.find(
            (t) =>
              (t.subdomain && t.subdomain.toLowerCase() === urlIdentifier.toLowerCase()) ||
              t.code.toLowerCase() === urlIdentifier.toLowerCase() ||
              t.id.toLowerCase() === urlIdentifier.toLowerCase()
          );
          if (matched) {
            setCurrentTenantState(matched);
            return;
          }
        }

        // If no current tenant yet and list has items, set first one
        setCurrentTenantState((prev) => {
          if (prev && list.find((t) => t.id === prev.id)) {
            return list.find((t) => t.id === prev.id) || prev;
          }
          return list.length > 0 ? list[0] : null;
        });
      });
    };

    init();

    // Check initial mode from URL
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode") as "erp" | "website" | "platform";
    if (modeParam && ["erp", "website", "platform"].includes(modeParam)) {
      setViewModeState(modeParam);
    }

    return () => {
      if (unsubscribeTenants) unsubscribeTenants();
    };
  }, []);

  // Subscribe to branches for current tenant
  useEffect(() => {
    if (!currentTenant) {
      setBranches([]);
      setCurrentBranch(null);
      return;
    }

    const unsub = subscribeToBranches(currentTenant.id, (branchList) => {
      setBranches(branchList);
      if (branchList.length > 0) {
        const mainBranch = branchList.find((b) => b.isMain) || branchList[0];
        setCurrentBranch(mainBranch);
      } else {
        setCurrentBranch(null);
      }
    });

    return () => unsub();
  }, [currentTenant?.id]);

  const setCurrentTenant = (tenant: Tenant | null) => {
    setCurrentTenantState(tenant);
    try {
      const url = new URL(window.location.href);
      if (tenant) {
        url.searchParams.set("tenant", tenant.id);
        const sub = (tenant.subdomain || tenant.code || "app").toLowerCase().replace(/[^a-z0-9-]/g, "");
        url.searchParams.set("subdomain", sub);
      } else {
        url.searchParams.delete("tenant");
        url.searchParams.delete("subdomain");
      }
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  };

  const selectTenantById = async (tenantId: string) => {
    const t = await getTenantById(tenantId);
    if (t) {
      setCurrentTenant(t);
    }
  };

  const selectTenantBySubdomain = (subdomain: string) => {
    const clean = subdomain.toLowerCase().trim();
    const matched = tenants.find(
      (t) =>
        (t.subdomain && t.subdomain.toLowerCase() === clean) ||
        t.code.toLowerCase() === clean ||
        t.id.toLowerCase() === clean
    );
    if (matched) {
      setCurrentTenant(matched);
    }
  };

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name:
        role === "platform_super_admin" || role === "platform_admin"
          ? "Platform Super Admin (DAVETECH)"
          : role === "tenant_owner" || role === "tenant_admin"
          ? `Tenant Administrator (${currentTenant?.code || "Admin"})`
          : role === "teacher" || role === "lecturer"
          ? "Senior Educator / Class Teacher"
          : role === "accountant"
          ? "Bursar / Finance Officer"
          : role === "parent"
          ? "Parent / Guardian Portal"
          : "Registered Student",
    }));
  };

  const isPlatformAdmin =
    currentUser.role === "platform_super_admin" ||
    currentUser.role === "platform_admin";

  const isTenantAdmin =
    isPlatformAdmin ||
    currentUser.role === "tenant_owner" ||
    currentUser.role === "tenant_admin" ||
    currentUser.role === "manager";

  const isParentOrStudent =
    currentUser.role === "parent" || currentUser.role === "student";

  const enabledModules = currentTenant?.enabledModules || [
    "education",
    "admissions",
    "classes",
    "fees",
    "exams",
    "attendance",
    "website",
    "reports",
  ];

  return (
    <TenantContext.Provider
      value={{
        tenants,
        currentTenant,
        setCurrentTenant,
        selectTenantById,
        selectTenantBySubdomain,
        branches,
        currentBranch,
        setCurrentBranch,
        currentUser,
        setCurrentUserRole,
        isPlatformAdmin,
        isTenantAdmin,
        isParentOrStudent,
        enabledModules,
        activeModule,
        setActiveModule,
        refreshTenants: () => {},
        loading,
        viewMode,
        setViewMode,
        getTenantSubdomainUrl,
        getTenantShareUrl,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
