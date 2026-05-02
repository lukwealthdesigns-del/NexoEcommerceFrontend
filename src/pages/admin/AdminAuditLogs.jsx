import { useState, useEffect } from 'react';
import { Search, Filter, Download, User, Package, ShoppingBag, Shield, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/admin';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, [filter]);

  const loadLogs = async () => {
    try {
      const data = await adminService.getAuditLogs({ action_type: filter });
      setLogs(data);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('user')) return <User className="h-4 w-4" />;
    if (action.includes('product')) return <Package className="h-4 w-4" />;
    if (action.includes('order')) return <ShoppingBag className="h-4 w-4" />;
    if (action.includes('admin')) return <Shield className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getActionColor = (action) => {
    if (action.includes('create')) return 'text-green-500';
    if (action.includes('delete') || action.includes('ban') || action.includes('suspend')) return 'text-red-500';
    if (action.includes('update') || action.includes('edit')) return 'text-blue-500';
    return 'text-yellow-500';
  };

  const handleExport = async () => {
    try {
      const blob = await adminService.exportAuditLogs();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${formatDate(new Date())}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Audit logs exported successfully');
    } catch (error) {
      toast.error('Failed to export logs');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Track all admin actions and system events</p>
          </div>
          <button onClick={handleExport} className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs by admin, action or target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-full md:w-48"
            >
              <option value="all">All Actions</option>
              <option value="user">User Actions</option>
              <option value="product">Product Actions</option>
              <option value="order">Order Actions</option>
              <option value="admin">Admin Actions</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Timestamp</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Admin</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Action</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Target</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Details</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(log.created_at)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white text-xs">
                          {log.admin_name?.[0]}
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{log.admin_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        {getActionIcon(log.action)}
                        <span className={`text-sm capitalize ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white capitalize">{log.target_type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {log.target_id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{log.metadata || '-'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{log.ip_address}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {logs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No audit logs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;