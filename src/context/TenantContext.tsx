import React, { createContext, useContext, useState, useEffect } from "react";
import type { Tenant, Branch, UserRole, PlatformConfig } from "../types";
import {
  subscribeToTenants,
  subscribeToBranches,
  checkAndSeedInitialTenants,
  getTenantById,
  saveTenant,
  deleteTenant,
  toggleTenantStatus,
  subscribeToPlatformConfig,
  savePlatformConfig,
  getDefaultPlatformConfig,
} from "../services/firestoreService";
import {
  signInWithGoogle as firebaseGoogleSignIn,
  logoutUser as firebaseLogout,
  subscribeToAuth,
  AuthUserProfile,
} from "../services/authService";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type AppViewMode = "davetech_home" | "login" | "erp" | "website" | "platform";

interface TenantContextType {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  selectTenantById: (tenantId: string) => Promise<void>;
  selectTenantBySubdomain: (subdomain: string, targetMode?: "erp" | "website") => void;
  editTenantAction: (tenant: Tenant) => Promise<void>;
  deleteTenantAction: (tenantId: string) => Promise<void>;
  suspendTenantAction: (tenantId: string) => Promise<void>;
  activateTenantAction: (tenantId: string) => Promise<void>;
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
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  platformConfig: PlatformConfig;
  updatePlatformConfig: (config: Partial<PlatformConfig>) => Promise<void>;
  getTenantSubdomainUrl: (tenant?: Tenant | null, mode?: "erp" | "website") => string;
  getTenantShareUrl: (tenant?: Tenant | null, mode?: "erp" | "website") => string;
  // Authentication properties
  isAuthenticated: boolean;
  authUser: AuthUserProfile | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setDirectUserSession: (user: CurrentUser) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenantState] = useState<Tenant | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModule, setActiveModule] = useState<string>("dashboard");
  const [viewMode, setViewModeState] = useState<AppViewMode>("davetech_home");
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(getDefaultPlatformConfig());

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("davetech_auth_active");
      return saved === "true";
    } catch {
      return false;
    }
  });

  const [authUser, setAuthUser] = useState<AuthUserProfile | null>(null);

  // Current session user (Platform admin default)
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    try {
      const savedUser = localStorage.getItem("davetech_auth_user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {}
    return {
      id: "usr_davetech_admin",
      name: "David Muchiri",
      email: "davmuchiri48@gmail.com",
      role: "platform_super_admin",
    };
  });

  // Handle Firebase Auth subscription
  useEffect(() => {
    const unsub = subscribeToAuth((profile) => {
      if (profile) {
        setAuthUser(profile);
        setIsAuthenticated(true);
        const newUser: CurrentUser = {
          id: profile.uid,
          name: profile.displayName || "David Muchiri",
          email: profile.email || "davmuchiri48@gmail.com",
          role: profile.role,
          avatarUrl: profile.photoURL,
        };
        setCurrentUser(newUser);
        try {
          localStorage.setItem("davetech_auth_active", "true");
          localStorage.setItem("davetech_auth_user", JSON.stringify(newUser));
        } catch {}
      }
    });

    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    const profile = await firebaseGoogleSignIn();
    setAuthUser(profile);
    setIsAuthenticated(true);
    const newUser: CurrentUser = {
      id: profile.uid,
      name: profile.displayName || "David Muchiri",
      email: profile.email || "davmuchiri48@gmail.com",
      role: profile.role,
      avatarUrl: profile.photoURL,
    };
    setCurrentUser(newUser);
    try {
      localStorage.setItem("davetech_auth_active", "true");
      localStorage.setItem("davetech_auth_user", JSON.stringify(newUser));
    } catch {}
  };

  const logout = async () => {
    try {
      await firebaseLogout();
    } catch (err) {
      console.warn("Sign out err:", err);
    }
    setAuthUser(null);
    setIsAuthenticated(false);
    setViewModeState("davetech_home");
    try {
      localStorage.removeItem("davetech_auth_active");
      localStorage.removeItem("davetech_auth_user");
    } catch {}
  };

  const setDirectUserSession = (user: CurrentUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("davetech_auth_active", "true");
      localStorage.setItem("davetech_auth_user", JSON.stringify(user));
    } catch {}
  };

  // Comprehensive URL-driven tenant & subdomain routing support
  const getTenantRoutingInfo = (): { identifier: string | null; explicitMode: AppViewMode | null } => {
    let identifier: string | null = null;
    let explicitMode: AppViewMode | null = null;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Mode query parameter
      const m = urlParams.get("mode") as AppViewMode | null;
      if (m && ["davetech_home", "login", "erp", "website", "platform"].includes(m)) {
        explicitMode = m;
      }

      // Priority 1: Query parameters (?subdomain=bitc, ?tenant=bitc, ?school=bitc, ?portal=bitc)
      const querySubdomain = urlParams.get("subdomain") || urlParams.get("tenant") || urlParams.get("sub") || urlParams.get("school") || urlParams.get("portal") || urlParams.get("domain");
      if (querySubdomain) {
        identifier = querySubdomain.toLowerCase().trim();
      }

      // Priority 2: Hostname subdomain or custom domain detection
      if (!identifier) {
        const hostname = window.location.hostname.toLowerCase();
        
        // Check localhost subdomain (e.g. bitc.localhost:3000 -> ["bitc", "localhost"])
        if (hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
          const parts = hostname.split(".");
          if (parts.length >= 2 && parts[0] && !["www", "app", "api", "localhost"].includes(parts[0])) {
            identifier = parts[0];
          }
        } 
        // Check standard multi-tenant domain (e.g. bitc.davetecherp.com, bitc.davetech.co.ke)
        else if (hostname.includes(".davetecherp.") || hostname.includes(".davetech.")) {
          const parts = hostname.split(".");
          if (parts.length >= 3 && parts[0] && !["www", "app", "api"].includes(parts[0])) {
            identifier = parts[0];
          }
        }
        // Custom vanity domain (e.g. portal.breakthroughcollege.ac.ke)
        else if (!hostname.includes("run.app") && !hostname.includes("web.app") && !hostname.includes("firebaseapp.com") && hostname !== "localhost" && hostname !== "127.0.0.1") {
          identifier = hostname;
        }
      }

      // Priority 3: Path-based routing (/site/:tenantId, /app/:tenantId, /portal/:tenantId, /website/:tenantId, /erp/:tenantId)
      if (!identifier) {
        const path = window.location.pathname;
        const prefixMatch = path.match(/^\/(site|app|portal|website|erp)\/([a-zA-Z0-9_-]+)/);
        if (prefixMatch && prefixMatch[2]) {
          identifier = prefixMatch[2].toLowerCase();
          if (!explicitMode) {
            if (prefixMatch[1] === "website" || prefixMatch[1] === "site") explicitMode = "website";
            else if (prefixMatch[1] === "erp" || prefixMatch[1] === "portal" || prefixMatch[1] === "app") explicitMode = "erp";
          }
        }
      }
    } catch (e) {
      console.warn("Routing parse error:", e);
    }

    return { identifier, explicitMode };
  };

  // Match tenant by subdomain, customDomain, code, or ID
  const findMatchingTenant = (list: Tenant[], identifier: string | null): Tenant | null => {
    if (!identifier || !list || list.length === 0) return null;
    const clean = identifier.toLowerCase().trim();
    const cleanAlpha = clean.replace(/[^a-z0-9]/g, "");

    // 1. Match subdomain exact
    const subMatch = list.find((t) => t.subdomain && t.subdomain.toLowerCase().trim() === clean);
    if (subMatch) return subMatch;

    // 2. Match custom domain exact
    const customMatch = list.find((t) => t.customDomain && t.customDomain.toLowerCase().trim() === clean);
    if (customMatch) return customMatch;

    // 3. Match code exact
    const codeMatch = list.find((t) => t.code && t.code.toLowerCase().trim() === clean);
    if (codeMatch) return codeMatch;

    // 4. Match ID exact
    const idMatch = list.find((t) => t.id && t.id.toLowerCase().trim() === clean);
    if (idMatch) return idMatch;

    // 5. Match alphanumeric sanitized
    if (cleanAlpha) {
      const alphaMatch = list.find((t) => {
        const s = (t.subdomain || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const c = (t.code || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const i = (t.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        return (s && s === cleanAlpha) || (c && c === cleanAlpha) || (i && i === cleanAlpha);
      });
      if (alphaMatch) return alphaMatch;
    }

    // 6. Partial prefix match
    const prefixMatch = list.find((t) => {
      const s = (t.subdomain || "").toLowerCase();
      const c = (t.code || "").toLowerCase();
      const i = (t.id || "").toLowerCase();
      return (s && (s.startsWith(clean) || clean.startsWith(s))) ||
             (c && (c.startsWith(clean) || clean.startsWith(c))) ||
             (i && (i.startsWith(clean) || clean.startsWith(i)));
    });
    if (prefixMatch) return prefixMatch;

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

  // Atomic tenant and viewMode navigation helper
  const selectTenant = (tenant: Tenant | null, targetMode?: AppViewMode) => {
    setCurrentTenantState(tenant);
    const resolvedMode = targetMode || (tenant ? "erp" : "davetech_home");
    setViewModeState(resolvedMode);

    try {
      const url = new URL(window.location.href);
      if (tenant) {
        url.searchParams.set("tenant", tenant.id);
        const sub = (tenant.subdomain || tenant.code || "app").toLowerCase().replace(/[^a-z0-9-]/g, "");
        url.searchParams.set("subdomain", sub);
        url.searchParams.set("mode", resolvedMode);
      } else {
        url.searchParams.delete("tenant");
        url.searchParams.delete("subdomain");
        url.searchParams.set("mode", resolvedMode);
      }
      window.history.replaceState({}, "", url.toString());
    } catch {}
  };

  // Sync viewMode to URL query or path
  const setViewMode = (mode: AppViewMode) => {
    setViewModeState(mode);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      if (mode === "davetech_home") {
        url.searchParams.delete("subdomain");
        url.searchParams.delete("tenant");
      } else if (currentTenant) {
        url.searchParams.set("tenant", currentTenant.id);
        const sub = (currentTenant.subdomain || currentTenant.code || "app").toLowerCase().replace(/[^a-z0-9-]/g, "");
        url.searchParams.set("subdomain", sub);
      }
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  };

  const updatePlatformConfig = async (config: Partial<PlatformConfig>) => {
    await savePlatformConfig(config, {
      name: currentUser.name,
      email: currentUser.email,
    });
  };

  // Tenant CRUD actions
  const editTenantAction = async (tenant: Tenant) => {
    await saveTenant(tenant, { name: currentUser.name, email: currentUser.email });
    if (currentTenant?.id === tenant.id) {
      setCurrentTenantState(tenant);
    }
  };

  const deleteTenantAction = async (tenantId: string) => {
    // 1. Optimistically update local tenants array immediately
    setTenants((prev) => prev.filter((t) => t.id !== tenantId));

    // 2. If the deleted tenant was active, switch to another tenant
    if (currentTenant?.id === tenantId) {
      const remaining = tenants.filter((t) => t.id !== tenantId);
      const nextTenant = remaining.length > 0 ? remaining[0] : null;
      selectTenant(nextTenant, "platform");
    }

    // 3. Delete in Firestore
    await deleteTenant(tenantId, { name: currentUser.name, email: currentUser.email });
  };

  const suspendTenantAction = async (tenantId: string) => {
    await toggleTenantStatus(tenantId, "suspended", {
      name: currentUser.name,
      email: currentUser.email,
    });
  };

  const activateTenantAction = async (tenantId: string) => {
    await toggleTenantStatus(tenantId, "active", {
      name: currentUser.name,
      email: currentUser.email,
    });
  };

  // Initialize and seed if empty in Firestore
  useEffect(() => {
    let unsubscribeTenants: (() => void) | null = null;
    let unsubscribePlatform: (() => void) | null = null;

    const applyRouting = (list: Tenant[]) => {
      const { identifier, explicitMode } = getTenantRoutingInfo();

      if (identifier) {
        const matched = findMatchingTenant(list, identifier);
        if (matched) {
          setCurrentTenantState(matched);
          // If subdomain is present in URL and no explicit mode is specified, default to 'erp'
          const targetMode: AppViewMode = explicitMode || "erp";
          setViewModeState(targetMode);
          return;
        }
      }

      if (explicitMode) {
        setViewModeState(explicitMode);
      }

      // Default tenant selection fallback
      setCurrentTenantState((prev) => {
        if (prev && list.find((t) => t.id === prev.id)) {
          return list.find((t) => t.id === prev.id) || prev;
        }
        return list.length > 0 ? list[0] : null;
      });
    };

    const init = async () => {
      try {
        await checkAndSeedInitialTenants();
      } catch (err) {
        console.error("Seed error:", err);
      }

      unsubscribePlatform = subscribeToPlatformConfig((cfg) => {
        if (cfg) {
          setPlatformConfig(cfg);
        }
      });

      unsubscribeTenants = subscribeToTenants((list) => {
        setTenants(list);
        setLoading(false);
        applyRouting(list);
      });
    };

    init();

    // Listen to popstate changes (browser Back/Forward navigation)
    const handlePopState = () => {
      setTenants((latest) => {
        applyRouting(latest);
        return latest;
      });
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      if (unsubscribeTenants) unsubscribeTenants();
      if (unsubscribePlatform) unsubscribePlatform();
      window.removeEventListener("popstate", handlePopState);
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
    selectTenant(tenant, viewMode);
  };

  const selectTenantById = async (tenantId: string) => {
    const t = await getTenantById(tenantId);
    if (t) {
      selectTenant(t, "erp");
    }
  };

  const selectTenantBySubdomain = (subdomain: string, targetMode: "erp" | "website" = "erp") => {
    const clean = subdomain.toLowerCase().trim();
    const matched = findMatchingTenant(tenants, clean);
    if (matched) {
      selectTenant(matched, targetMode);
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
        editTenantAction,
        deleteTenantAction,
        suspendTenantAction,
        activateTenantAction,
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
        platformConfig,
        updatePlatformConfig,
        getTenantSubdomainUrl,
        getTenantShareUrl,
        isAuthenticated,
        authUser,
        loginWithGoogle,
        logout,
        setDirectUserSession,
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
