import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { AuditLog } from "../../types";
import { subscribeToAuditLogs } from "../../services/firestoreService";
import { ShieldCheck, ShieldAlert, Filter, Clock, Search, RefreshCw, Lock } from "lucide-react";

export const AuditLogsManager: React.FC = () => {
  const { currentTenant, isPlatformAdmin } = useTenant();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterModule, setFilterModule] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scope, setScope] = useState<"current" | "all">("current");

  useEffect(() => {
    const targetTenantId = scope === "all" && isPlatformAdmin ? "all" : (currentTenant?.id || "all");
    const unsub = subscribeToAuditLogs(targetTenantId, (list) => {
      setLogs(list);
    });
    return () => unsub();
  }, [currentTenant?.id, scope, isPlatformAdmin]);

  const filteredLogs = logs.filter((log) => {
    const matchesModule = filterModule === "all" || log.module === filterModule;
    const matchesSearch =
      (log.userName && log.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  const modules = Array.from(new Set(logs.map((l) => l.module).filter(Boolean)));

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <span>Audit Trail & Security Event Logs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically timestamped, immutable change history across tenant data mutations in Firestore.
          </p>
        </div>

        {isPlatformAdmin && (
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setScope("current")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === "current" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              Current Tenant ({currentTenant?.code})
            </button>
            <button
              type="button"
              onClick={() => setScope("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              Platform-Wide Logs
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, user, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white"
          >
            <option value="all">All Modules ({logs.length})</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User / Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Audit Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {log.userName || "System"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-semibold text-[11px] whitespace-nowrap">
                    {log.module}
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-md break-words text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No matching audit log records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
