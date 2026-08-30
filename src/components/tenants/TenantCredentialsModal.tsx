import React, { useState, useEffect } from "react";
import type { Tenant, TenantUser, UserRole } from "../../types";
import {
  subscribeToTenantUsers,
  saveTenantUser,
  deleteTenantUser,
  resetTenantUserPassword,
} from "../../services/firestoreService";
import { useTenant } from "../../context/TenantContext";
import {
  KeyRound,
  X,
  UserPlus,
  Shield,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Send,
  Building2,
  Mail,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface TenantCredentialsModalProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
}

export const TenantCredentialsModal: React.FC<TenantCredentialsModalProps> = ({
  isOpen,
  tenant,
  onClose,
}) => {
  const { currentUser, getTenantSubdomainUrl } = useTenant();
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<TenantUser | null>(null);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState<{
    displayName: string;
    email: string;
    role: UserRole;
    phone: string;
    password: string;
    notes: string;
  }>({
    displayName: "",
    email: "",
    role: "tenant_owner",
    phone: "+254 ",
    password: "",
    notes: "",
  });

  // Password Reset / Modification Form State
  const [customNewPassword, setCustomNewPassword] = useState<string>("");

  useEffect(() => {
    if (!tenant) return;
    setLoading(true);
    const unsub = subscribeToTenantUsers(tenant.id, (userList) => {
      setUsers(userList);
      setLoading(false);
    });

    return () => unsub();
  }, [tenant?.id]);

  if (!isOpen || !tenant) return null;

  const generateStrongPassword = (prefix: string = "DaveTech") => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let randomPart = "";
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const cleanCode = (tenant.code || "SEC").toUpperCase().replace(/[^A-Z0-9]/g, "");
    return `${prefix}@${cleanCode}${randomPart}26`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    try {
      const generatedId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`;
      const pwd = newUserForm.password.trim() || generateStrongPassword();

      const userToSave: TenantUser = {
        id: generatedId,
        tenantId: tenant.id,
        displayName: newUserForm.displayName.trim(),
        email: newUserForm.email.toLowerCase().trim(),
        role: newUserForm.role,
        phone: newUserForm.phone.trim(),
        password: pwd,
        tempPassword: pwd,
        status: "active",
        notes: newUserForm.notes.trim() || `Provisioned by ${currentUser.name}`,
        createdAt: new Date().toISOString(),
        lastPasswordReset: new Date().toISOString(),
      };

      await saveTenantUser(tenant.id, userToSave, {
        name: currentUser.name,
        email: currentUser.email,
      });

      setStatusMessage({
        type: "success",
        text: `Account created for ${userToSave.displayName} with password set.`,
      });
      setIsAddingUser(false);
      setNewUserForm({
        displayName: "",
        email: "",
        role: "tenant_owner",
        phone: "+254 ",
        password: "",
        notes: "",
      });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to create user account." });
    }
  };

  const handleResetPassword = async (user: TenantUser, customPass?: string) => {
    if (!tenant) return;
    const newPass = (customPass || customNewPassword).trim() || generateStrongPassword();
    try {
      await resetTenantUserPassword(tenant.id, user.id, newPass, {
        name: currentUser.name,
        email: currentUser.email,
      });
      setStatusMessage({
        type: "success",
        text: `Password successfully updated for ${user.displayName}: ${newPass}`,
      });
      setIsResettingPassword(false);
      setSelectedUser(null);
      setCustomNewPassword("");
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to reset password." });
    }
  };

  const handleDeleteUser = async (userId: string, displayName: string) => {
    try {
      await deleteTenantUser(tenant.id, userId, {
        name: currentUser.name,
        email: currentUser.email,
      });
      setStatusMessage({ type: "success", text: `Removed credentials for ${displayName}.` });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to delete user." });
    }
  };

  const getDispatchTemplate = (user: TenantUser) => {
    const portalUrl = `https://${tenant.subdomain || tenant.code.toLowerCase()}.davetecherp.com`;
    return `*DAVETECH CLOUD ERP PORTAL ACCESS*\n\n` +
      `🏢 *Institution:* ${tenant.name}\n` +
      `🌐 *Portal URL:* ${portalUrl}\n` +
      `👤 *Assigned To:* ${user.displayName}\n` +
      `📧 *Login Email/Username:* ${user.email}\n` +
      `🔑 *Temporary Password:* ${user.password || user.tempPassword || "DaveTech@2026"}\n` +
      `🛡️ *Role:* ${user.role.toUpperCase().replace(/_/g, " ")}\n\n` +
      `*DAVETECH SOLUTIONS Support:* 0707760239 / 0719176549`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Tenant Access & Password Manager
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {tenant.name} • <span className="font-mono text-purple-700">{tenant.subdomain}.davetecherp.com</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              {statusMessage.text}
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-700 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Actions Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Configured User Accounts ({users.length})</h4>
              <p className="text-xs text-slate-500">
                Authorized staff, principals, bursars and administrators with portal access credentials.
              </p>
            </div>

            <button
              onClick={() => {
                setIsAddingUser(!isAddingUser);
                if (!newUserForm.password) {
                  setNewUserForm((prev) => ({ ...prev, password: generateStrongPassword() }));
                }
              }}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              {isAddingUser ? "Cancel New User" : "Add Tenant User"}
            </button>
          </div>

          {/* Add User Form Drawer */}
          {isAddingUser && (
            <form onSubmit={handleCreateUser} className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-600" />
                Create New Tenant Staff / Admin Account
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Faith Mutua"
                    value={newUserForm.displayName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, displayName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email / Login ID *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. principal@school.edu"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="tenant_owner">Tenant Owner / Director (Full Control)</option>
                    <option value="tenant_admin">Tenant Administrator / Principal</option>
                    <option value="accountant">Bursar / Finance Officer</option>
                    <option value="teacher">Teacher / Educator</option>
                    <option value="lecturer">Lecturer / Instructor</option>
                    <option value="parent">Parent Portal Account</option>
                    <option value="student">Student Portal Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setNewUserForm({ ...newUserForm, password: generateStrongPassword() })}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs flex items-center gap-1"
                      title="Generate Secure Password"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (For WhatsApp / SMS)</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save & Provision Account
                </button>
              </div>
            </form>
          )}

          {/* Reset / Modify Password Drawer */}
          {isResettingPassword && selectedUser && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Modify Password for {selectedUser.displayName} ({selectedUser.email})
                </h4>
                <button
                  onClick={() => {
                    setIsResettingPassword(false);
                    setSelectedUser(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter New Password or PIN:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter custom new password..."
                    value={customNewPassword}
                    onChange={(e) => setCustomNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomNewPassword(generateStrongPassword())}
                    className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                    Auto-Generate Password
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResetPassword(selectedUser, customNewPassword)}
                    className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Confirm & Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Accounts List */}
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading tenant accounts...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Shield className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No User Accounts Found for this Tenant</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Click "Add Tenant User" above to create an initial administrator account with login credentials.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => {
                const isPasswordShown = showPasswordMap[user.id] || false;
                const passwordVal = user.password || user.tempPassword || "••••••••";
                const dispatchText = getDispatchTemplate(user);

                return (
                  <div
                    key={user.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{user.displayName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                              {user.role.replace(/_/g, " ")}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {user.email}
                            {user.phone && (
                              <>
                                <span>•</span>
                                <Phone className="w-3 h-3 text-slate-400" />
                                {user.phone}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setCustomNewPassword(generateStrongPassword());
                            setIsResettingPassword(true);
                          }}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Reset or change password"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          Reset Password
                        </button>

                        <button
                          onClick={() => handleCopy(dispatchText, `dispatch_${user.id}`)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Copy WhatsApp Dispatch Card"
                        >
                          {copiedId === `dispatch_${user.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Copied Card!
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5 text-emerald-600" />
                              Copy SMS/WhatsApp
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user.id, user.displayName)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Password Display & Copy Box */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-medium">Active Password:</span>
                        <code className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {isPasswordShown ? user.password || user.tempPassword || "DaveTech@2026" : "••••••••••••"}
                        </code>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          {isPasswordShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      </div>

                      <button
                        onClick={() => handleCopy(user.password || user.tempPassword || "DaveTech@2026", `pwd_${user.id}`)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        {copiedId === `pwd_${user.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Copied Password
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* WhatsApp / SMS Quick Dispatch Guidance */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-purple-600" />
              Direct Client Onboarding & WhatsApp Credentials Dispatch
            </h5>
            <p className="text-slate-500 leading-relaxed">
              When onboarding a new school or business client in Kenya, click <strong>"Copy SMS/WhatsApp"</strong> above to send ready-formatted login credentials directly to the Director, Principal, or Bursar with the isolated subdomain link.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex justify-end bg-slate-50/70">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
