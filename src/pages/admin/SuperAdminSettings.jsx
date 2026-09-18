import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  DollarSign, 
  Mail, 
  Bell, 
  Globe,
  Save,
  Plus,
  Trash2,
  Edit,
  X,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/admin';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    full_name: '',
    role: 'admin'
  });
  const [settings, setSettings] = useState({
    site_name: 'NexoLeolite',
    site_description: 'Buy and sell everything anywhere',
    contact_email: 'support@nexoelite.com',
    support_phone: '+2348012345678',
    currency: 'NGN',
    tax_rate: 7.5,
    shipping_fee: 2000,
    free_shipping_threshold: 50000,
    enable_registration: true,
    enable_guest_checkout: true,
    maintenance_mode: false,
    email_verification: true,
    max_upload_size: 5
  });

  const { user } = useAuthStore();

  useEffect(() => {
    loadAdmins();
    loadSettings();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data || []);
    } catch (error) {
      console.error('Failed to load admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await adminService.getSettings();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.email || !newAdmin.full_name) {
      toast.error('Please fill all fields');
      return;
    }

    setSaving(true);
    try {
      await adminService.createAdmin(newAdmin);
      toast.success('Admin created successfully');
      setShowCreateAdmin(false);
      setNewAdmin({ email: '', full_name: '', role: 'admin' });
      loadAdmins();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    
    setSaving(true);
    try {
      await adminService.deleteAdmin(adminId);
      toast.success('Admin deleted successfully');
      loadAdmins();
    } catch (error) {
      toast.error('Failed to delete admin');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'admins', label: 'Admin Management', icon: Shield },
    { id: 'users', label: 'User Settings', icon: Users },
    { id: 'payments', label: 'Payment Settings', icon: DollarSign },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (loading && admins.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage platform settings and administrators</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-2 sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                    activeTab === tab.id
                      ? 'bg-brand-orange text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">General Settings</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Site Description
                    </label>
                    <textarea
                      value={settings.site_description}
                      onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                      rows="3"
                      className="input-field resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.contact_email}
                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Support Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.support_phone}
                        onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="input-field"
                      >
                        <option value="NGN">Nigerian Naira (₦)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.tax_rate}
                        onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Standard Shipping Fee (₦)
                      </label>
                      <input
                        type="number"
                        value={settings.shipping_fee}
                        onChange={(e) => setSettings({ ...settings, shipping_fee: parseInt(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Free Shipping Threshold (₦)
                      </label>
                      <input
                        type="number"
                        value={settings.free_shipping_threshold}
                        onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseInt(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">Features</h3>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Enable User Registration</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow new users to sign up</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.enable_registration}
                        onChange={(e) => setSettings({ ...settings, enable_registration: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Enable Guest Checkout</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow checkout without account</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.enable_guest_checkout}
                        onChange={(e) => setSettings({ ...settings, enable_guest_checkout: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Require Email Verification</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Users must verify email before login</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.email_verification}
                        onChange={(e) => setSettings({ ...settings, email_verification: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
                        <p className="text-sm text-red-500">Site will be temporarily unavailable</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.maintenance_mode}
                        onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Management Tab */}
            {activeTab === 'admins' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Administrators</h2>
                  <button
                    onClick={() => setShowCreateAdmin(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Admin</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {admins.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No administrators found
                    </div>
                  ) : (
                    admins.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{admin.full_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                          <span className={`inline-flex px-2 py-0.5 text-xs rounded-full mt-1 ${
                            admin.role === 'super_admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {admin.role}
                          </span>
                        </div>
                        {admin.role !== 'super_admin' && admin.email !== user?.email && (
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* User Settings Tab */}
            {activeTab === 'users' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">User Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Default User Role
                    </label>
                    <select className="input-field">
                      <option value="user">User</option>
                      <option value="seller">Seller</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Products per User
                    </label>
                    <input type="number" className="input-field" defaultValue="100" />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings Tab */}
            {activeTab === 'payments' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Payment Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Paystack Secret Key
                    </label>
                    <input type="password" className="input-field" placeholder="Enter Paystack secret key" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Paystack Public Key
                    </label>
                    <input type="text" className="input-field" placeholder="Enter Paystack public key" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Flutterwave Secret Key
                    </label>
                    <input type="password" className="input-field" placeholder="Enter Flutterwave secret key" />
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings Tab */}
            {activeTab === 'email' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Email Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SMTP Host
                    </label>
                    <input type="text" className="input-field" defaultValue="smtp.gmail.com" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SMTP Port
                    </label>
                    <input type="number" className="input-field" defaultValue="587" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SMTP Username
                    </label>
                    <input type="email" className="input-field" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SMTP Password
                    </label>
                    <input type="password" className="input-field" />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Settings</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Admin Email Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive email for new registrations and orders</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox" />
                  </label>
                  
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">New Order Alert</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when a new order is placed</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox" />
                  </label>
                  
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Product Approval Request</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when a product needs approval</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox" />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {activeTab !== 'admins' && (
          <div className="fixed bottom-8 right-8">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="btn-primary flex items-center space-x-2 shadow-lg px-6 py-3"
            >
              {saving ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Admin</h2>
              <button onClick={() => setShowCreateAdmin(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newAdmin.full_name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="input-field"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="input-field"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowCreateAdmin(false)} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreateAdmin} disabled={saving} className="flex-1 btn-primary">
                {saving ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSettings;