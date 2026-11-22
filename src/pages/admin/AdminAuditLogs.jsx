

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  User,
  Package,
  ShoppingBag,
  Shield,
  AlertCircle,
  RefreshCw,
  Activity,
  Clock,
  Calendar,
  ChevronDown,
  FileText,
  CheckCircle,
  XCircle,
  Edit3,
  Eye,
  X,
  ListFilter,
  ArrowUpRight,
  Server,
  Globe,
  ClipboardList,
  UserCog,
} from 'lucide-react';

import { adminService } from '../../services/admin';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

  // ============================================================
  // LOAD AUDIT LOGS
  // ============================================================

  const loadLogs = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await adminService.getAuditLogs({
        action_type: filter,
      });

      const auditLogs = Array.isArray(data)
        ? data
        : Array.isArray(data?.logs)
          ? data.logs
          : Array.isArray(data?.items)
            ? data.items
            : [];

      setLogs(auditLogs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      toast.error('Failed to load audit logs');
      setLogs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // ============================================================
  // ADMIN INFORMATION
  // ============================================================

  const getAdminName = (log) => {
    return (
      log?.admin_name ||
      log?.admin?.username ||
      log?.admin?.full_name ||
      log?.admin?.name ||
      log?.admin?.email ||
      log?.admin_email ||
      log?.username ||
      'Administrator'
    );
  };

  const getAdminInitial = (log) => {
    const name = String(getAdminName(log)).trim();
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  // ============================================================
  // ACTION INFORMATION
  // ============================================================

  const getActionIcon = (action) => {
    const normalized = String(action || '').toLowerCase();

    if (normalized.includes('user')) return User;
    if (normalized.includes('product')) return Package;
    if (normalized.includes('order')) return ShoppingBag;
    if (normalized.includes('admin')) return Shield;
    if (normalized.includes('login')) return UserCog;
    if (normalized.includes('system')) return Server;
    if (normalized.includes('create')) return CheckCircle;
    if (normalized.includes('delete')) return XCircle;
    if (normalized.includes('update')) return Edit3;

    return Activity;
  };

  const getActionStyle = (action) => {
    const normalized = String(action || '').toLowerCase();

    if (
      normalized.includes('delete') ||
      normalized.includes('ban') ||
      normalized.includes('suspend') ||
      normalized.includes('reject') ||
      normalized.includes('cancel')
    ) {
      return {
        color: 'text-red-600 dark:text-red-400',
        background: 'bg-red-50 dark:bg-red-500/10',
        border: 'border-red-100 dark:border-red-500/20',
      };
    }

    if (
      normalized.includes('create') ||
      normalized.includes('approve') ||
      normalized.includes('verify') ||
      normalized.includes('success')
    ) {
      return {
        color: 'text-green-600 dark:text-green-400',
        background: 'bg-green-50 dark:bg-green-500/10',
        border: 'border-green-100 dark:border-green-500/20',
      };
    }

    if (
      normalized.includes('update') ||
      normalized.includes('edit') ||
      normalized.includes('change')
    ) {
      return {
        color: 'text-blue-600 dark:text-blue-400',
        background: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-100 dark:border-blue-500/20',
      };
    }

    return {
      color: 'text-orange-600 dark:text-orange-400',
      background: 'bg-orange-50 dark:bg-orange-500/10',
      border: 'border-orange-100 dark:border-orange-500/20',
    };
  };

  const formatAction = (action) => {
    return String(action || 'Unknown action')
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // ============================================================
  // METADATA FORMATTING
  // ============================================================

  const getMetadata = (metadata) => {
    if (!metadata) return {};

    if (typeof metadata === 'object' && !Array.isArray(metadata)) {
      return metadata;
    }

    if (typeof metadata === 'string') {
      try {
        const parsed = JSON.parse(metadata);

        if (parsed && typeof parsed === 'object') {
          return parsed;
        }

        return { details: parsed };
      } catch {
        return { details: metadata };
      }
    }

    return { details: String(metadata) };
  };

  const formatMetadataKey = (key) => {
    return String(key)
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatMetadataValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === 'object' && item !== null
          ? JSON.stringify(item)
          : String(item)
      ).join(', ');
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  const MetadataDetails = ({ metadata, compact = false }) => {
    const entries = Object.entries(getMetadata(metadata));

    if (entries.length === 0) {
      return (
        <span className="text-gray-400 dark:text-gray-500">
          No additional details
        </span>
      );
    }

    if (compact) {
      return (
        <div className="flex flex-wrap gap-2">
          {entries.slice(0, 3).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/70 text-xs text-gray-600 dark:text-gray-300 max-w-full"
            >
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                {formatMetadataKey(key)}:
              </span>
              <span className="truncate max-w-[150px]">
                {formatMetadataValue(value)}
              </span>
            </span>
          ))}

          {entries.length > 3 && (
            <span className="text-xs text-brand-orange font-medium">
              +{entries.length - 3} more
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {formatMetadataKey(key)}
            </p>

            <div className="sm:col-span-2 text-sm text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap">
              {formatMetadataValue(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ============================================================
  // SEARCH AND FILTER
  // ============================================================

  const filteredLogs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return logs;

    return logs.filter((log) => {
      const searchableValues = [
        getAdminName(log),
        log?.admin_email,
        log?.action,
        log?.target_type,
        log?.target_id,
        log?.ip_address,
        JSON.stringify(getMetadata(log?.metadata)),
      ];

      return searchableValues.some((value) =>
        String(value || '').toLowerCase().includes(search)
      );
    });
  }, [logs, searchTerm]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const stats = useMemo(() => {
    const total = logs.length;

    const userActions = logs.filter((log) =>
      String(log?.action || '').toLowerCase().includes('user')
    ).length;

    const productActions = logs.filter((log) =>
      String(log?.action || '').toLowerCase().includes('product')
    ).length;

    const orderActions = logs.filter((log) =>
      String(log?.action || '').toLowerCase().includes('order')
    ).length;

    return {
      total,
      userActions,
      productActions,
      orderActions,
    };
  }, [logs]);

  // ============================================================
  // CSV EXPORT
  // ============================================================

  const escapeCSV = (value) => {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      if (filteredLogs.length === 0) {
        toast.error('There are no audit logs to export');
        return;
      }

      const headers = [
        'Timestamp',
        'Administrator',
        'Admin Email',
        'Action',
        'Target Type',
        'Target ID',
        'Details',
        'IP Address',
      ];

      const rows = filteredLogs.map((log) => [
        log?.created_at || '',
        getAdminName(log),
        log?.admin_email || '',
        log?.action || '',
        log?.target_type || '',
        log?.target_id || '',
        JSON.stringify(getMetadata(log?.metadata)),
        log?.ip_address || '',
      ]);

      const csvContent = [
        headers.map(escapeCSV).join(','),
        ...rows.map((row) => row.map(escapeCSV).join(',')),
      ].join('\r\n');

      const blob = new Blob(
        ['\uFEFF', csvContent],
        { type: 'text/csv;charset=utf-8;' }
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `nexoleolite-audit-logs-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success('Audit logs exported successfully');
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      toast.error('Failed to export logs');
    } finally {
      setExporting(false);
    }
  };

  // ============================================================
  // DATE DISPLAY
  // ============================================================

  const getDateTime = (date) => {
    if (!date) return { date: '-', time: '-' };

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return { date: String(date), time: '-' };
    }

    return {
      date: formatDate(date),
      time: parsed.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Loading audit activity...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-500/10">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                System Monitoring
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Audit Logs
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Monitor administrator activities and important system events.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => loadLogs(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>

            <button
              onClick={handleExport}
              disabled={exporting || filteredLogs.length === 0}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-sm shadow-orange-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}

              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Activities
                </p>

                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total.toLocaleString()}
                </h3>

                <p className="text-xs text-gray-400 mt-2">
                  Loaded audit records
                </p>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10">
                <Activity className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  User Activities
                </p>

                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.userActions.toLocaleString()}
                </h3>

                <p className="text-xs text-gray-400 mt-2">
                  User-related events
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10">
                <User className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Product Activities
                </p>

                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.productActions.toLocaleString()}
                </h3>

                <p className="text-xs text-gray-400 mt-2">
                  Product-related events
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10">
                <Package className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order Activities
                </p>

                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.orderActions.toLocaleString()}
                </h3>

                <p className="text-xs text-gray-400 mt-2">
                  Order-related events
                </p>
              </div>

              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10">
                <ShoppingBag className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

        </div>

        {/* SEARCH AND FILTER */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">

            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

              <input
                type="text"
                placeholder="Search administrator, action, target, details or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="relative lg:w-56">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 cursor-pointer"
              >
                <option value="all">All Actions</option>
                <option value="user">User Actions</option>
                <option value="product">Product Actions</option>
                <option value="order">Order Actions</option>
                <option value="admin">Admin Actions</option>
              </select>

              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <ListFilter className="h-4 w-4" />
              <span>
                Showing <strong className="text-gray-900 dark:text-white">{filteredLogs.length}</strong> of{' '}
                <strong className="text-gray-900 dark:text-white">{logs.length}</strong> loaded records
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Audit monitoring
            </div>
          </div>
        </div>

        {/* AUDIT TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Activity History
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                A record of administrative operations
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/60">
              <ClipboardList className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">

              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-700">

                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Timestamp
                  </th>

                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Administrator
                  </th>

                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Action
                  </th>

                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Target
                  </th>

                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Details
                  </th>

                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    IP Address
                  </th>

                  <th className="text-center py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    View
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">

                {filteredLogs.map((log, index) => {
                  const adminName = getAdminName(log);
                  const action = log?.action || 'Unknown action';
                  const ActionIcon = getActionIcon(action);
                  const actionStyle = getActionStyle(action);
                  const dateTime = getDateTime(log?.created_at);

                  return (
                    <tr
                      key={log?.id || index}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                    >

                      {/* TIMESTAMP */}
                      <td className="py-4 px-5">
                        <div className="flex items-start gap-2.5 min-w-[145px]">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                              {dateTime.date}
                            </p>

                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {dateTime.time}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ADMINISTRATOR */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3 min-w-[180px]">

                          <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">
                            {getAdminInitial(log)}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
                              {adminName}
                            </p>

                            {log?.admin_email && (
                              <p className="text-xs text-gray-400 truncate max-w-[160px] mt-1">
                                {log.admin_email}
                              </p>
                            )}
                          </div>

                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold whitespace-nowrap ${actionStyle.color} ${actionStyle.background} ${actionStyle.border}`}
                        >
                          <ActionIcon className="h-3.5 w-3.5" />
                          {formatAction(action)}
                        </span>
                      </td>

                      {/* TARGET */}
                      <td className="py-4 px-5">
                        <div className="min-w-[120px]">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize">
                            {log?.target_type?.replace(/[_-]/g, ' ') || 'System'}
                          </p>

                          <p className="text-xs text-gray-400 mt-1 break-all max-w-[160px]">
                            {log?.target_id
                              ? `ID: ${log.target_id}`
                              : 'No target ID'}
                          </p>
                        </div>
                      </td>

                      {/* DETAILS */}
                      <td className="py-4 px-5">
                        <div className="min-w-[180px] max-w-[320px]">
                          <MetadataDetails
                            metadata={log?.metadata}
                            compact
                          />
                        </div>
                      </td>

                      {/* IP ADDRESS */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          <Globe className="h-3.5 w-3.5 text-gray-400" />
                          {log?.ip_address || '-'}
                        </div>
                      </td>

                      {/* VIEW */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => setSelectedLog(log)}
                          title="View audit details"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {filteredLogs.length === 0 && (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                {searchTerm ? (
                  <Search className="h-7 w-7 text-gray-400" />
                ) : (
                  <FileText className="h-7 w-7 text-gray-400" />
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {searchTerm ? 'No matching audit logs' : 'No audit activity found'}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                {searchTerm
                  ? 'We could not find any records matching your search. Try another search term.'
                  : 'There are currently no audit records for this category.'}
              </p>

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-5 text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* TABLE FOOTER */}
          {filteredLogs.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-xs text-gray-400">
                Displaying {filteredLogs.length} audit records
              </p>

              <p className="text-xs text-gray-400">
                Nexoleolite Administration System
              </p>
            </div>
          )}

        </div>

        {/* AUDIT DETAIL MODAL */}
        {selectedLog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedLog(null)}
          >
            <div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Audit Details
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Full information about this administrative action
                  </p>
                </div>

                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 transition"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* MODAL CONTENT */}
              <div className="p-5 space-y-6">

                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-lg">
                    {getAdminInitial(selectedLog)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {getAdminName(selectedLog)}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {selectedLog?.admin_email || 'Administrator'}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${getActionStyle(selectedLog?.action).color} ${getActionStyle(selectedLog?.action).background} ${getActionStyle(selectedLog?.action).border}`}
                  >
                    {formatAction(selectedLog?.action)}
                  </span>
                </div>

                {/* GENERAL INFORMATION */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                    General Information
                  </h3>

                  <div className="rounded-xl border border-gray-100 dark:border-gray-700 px-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Date</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {getDateTime(selectedLog?.created_at).date}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 mb-1">Time</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {getDateTime(selectedLog?.created_at).time}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Target Type</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                          {selectedLog?.target_type || 'System'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 mb-1">Target ID</p>
                        <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                          {selectedLog?.target_id || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="py-4">
                      <p className="text-xs text-gray-400 mb-1">IP Address</p>
                      <p className="text-sm font-mono text-gray-800 dark:text-gray-200">
                        {selectedLog?.ip_address || '-'}
                      </p>
                    </div>

                  </div>
                </div>

                {/* METADATA */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Action Details
                  </h3>

                  <div className="rounded-xl border border-gray-100 dark:border-gray-700 px-4">
                    <MetadataDetails metadata={selectedLog?.metadata} />
                  </div>
                </div>

                {/* RECORD ID */}
                {selectedLog?.id && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-xs text-gray-400 mb-1">
                      Audit Record ID
                    </p>

                    <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">
                      {selectedLog.id}
                    </p>
                  </div>
                )}

              </div>

              {/* MODAL FOOTER */}
              <div className="sticky bottom-0 flex justify-end p-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminAuditLogs;
