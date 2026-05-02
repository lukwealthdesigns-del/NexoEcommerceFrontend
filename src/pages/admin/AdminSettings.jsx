import { Key } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, RefreshCw, Globe, Mail, Bell, Shield, 
  CreditCard, Truck, Users, Package, DollarSign, Eye, 
  CheckCircle, AlertCircle, XCircle, Smartphone, Lock,
  Database, Cloud, Activity, FileText, MessageCircle, Star
} from 'lucide-react';
import { adminService } from '../../services/admin';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    site_name: 'NexoElite',
    site_description: 'Buy and sell everything anywhere',
    site_logo: '',
    site_favicon: '',
    contact_email: 'support@nexoelite.com',
    support_phone: '+2348012345678',
    address: '123 Lagos Street, Ikeja, Lagos, Nigeria',
    
    // Currency & Tax
    currency: 'NGN',
    currency_symbol: '₦',
    tax_rate: 7.5,
    tax_label: 'VAT',
    
    // Shipping
    shipping_fee: 2000,
    free_shipping_threshold: 50000,
    international_shipping: false,
    
    // Features
    enable_registration: true,
    enable_guest_checkout: true,
    email_verification: true,
    maintenance_mode: false,
    
    // Upload Settings
    max_upload_size: 5,
    allowed_image_types: ['jpg', 'png', 'webp', 'gif'],
    allowed_video_types: ['mp4', 'mov', 'avi', 'webm'],
    
    // Security
    two_factor_auth: false,
    session_timeout: 60,
    max_login_attempts: 5,
    
    // Email
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    
    // Social Media
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    linkedin_url: '',
    
    // API Keys
    google_maps_key: '',
    paystack_public_key: '',
    paystack_secret_key: '',
    sendgrid_api_key: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSettings();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
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

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'currency', label: 'Currency & Tax', icon: DollarSign },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'features', label: 'Features', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'social', label: 'Social Media', icon: MessageCircle },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your platform configuration</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-2 sticky top-24">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                    activeSection === section.id
                      ? 'bg-brand-orange text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* General Settings */}
            {activeSection === 'general' && (
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Address
                    </label>
                    <textarea
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      rows="2"
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Currency & Tax */}
            {activeSection === 'currency' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Currency & Tax Settings</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Currency Code
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => {
                          const symbols = { NGN: '₦', USD: '$', EUR: '€', GBP: '£' };
                          setSettings({ 
                            ...settings, 
                            currency: e.target.value,
                            currency_symbol: symbols[e.target.value] || '₦'
                          });
                        }}
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
                        Currency Symbol
                      </label>
                      <input
                        type="text"
                        value={settings.currency_symbol}
                        onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                        className="input-field"
                      />
                    </div>
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
                    <p className="text-xs text-gray-500 mt-1">Applied to all orders</p>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Settings */}
            {activeSection === 'shipping' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Shipping Settings</h2>
                <div className="space-y-5">
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
                    <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping</p>
                  </div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Enable International Shipping</p>
                      <p className="text-sm text-gray-500">Allow shipping to other countries</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.international_shipping}
                      onChange={(e) => setSettings({ ...settings, international_shipping: e.target.checked })}
                      className="toggle-checkbox"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Features */}
            {activeSection === 'features' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Feature Settings</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Enable User Registration</p>
                      <p className="text-sm text-gray-500">Allow new users to sign up</p>
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
                      <p className="text-sm text-gray-500">Allow checkout without account</p>
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
                      <p className="text-sm text-gray-500">Users must verify email before login</p>
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
                      <p className="text-sm text-red-500">Site will be temporarily unavailable to users</p>
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
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                <div className="space-y-5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.two_factor_auth}
                      onChange={(e) => setSettings({ ...settings, two_factor_auth: e.target.checked })}
                      className="toggle-checkbox"
                    />
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.session_timeout}
                      onChange={(e) => setSettings({ ...settings, session_timeout: parseInt(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.max_login_attempts}
                      onChange={(e) => setSettings({ ...settings, max_login_attempts: parseInt(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeSection === 'email' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Email Settings</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={settings.smtp_host}
                        onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        value={settings.smtp_port}
                        onChange={(e) => setSettings({ ...settings, smtp_port: parseInt(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SMTP Username
                    </label>
                    <input
                      type="email"
                      value={settings.smtp_user}
                      onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={settings.smtp_password}
                      onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Encryption
                    </label>
                    <select
                      value={settings.smtp_encryption}
                      onChange={(e) => setSettings({ ...settings, smtp_encryption: e.target.value })}
                      className="input-field"
                    >
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media */}
            {activeSection === 'social' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Social Media Links</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.facebook_url}
                      onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                      className="input-field"
                      placeholder="https://facebook.com/nexoelite"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      value={settings.twitter_url}
                      onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                      className="input-field"
                      placeholder="https://twitter.com/nexoelite"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.instagram_url}
                      onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                      className="input-field"
                      placeholder="https://instagram.com/nexoelite"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={settings.linkedin_url}
                      onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                      className="input-field"
                      placeholder="https://linkedin.com/company/nexoelite"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* API Keys */}
            {activeSection === 'api' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">API Keys</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Google Maps API Key
                    </label>
                    <input
                      type="password"
                      value={settings.google_maps_key}
                      onChange={(e) => setSettings({ ...settings, google_maps_key: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Paystack Public Key
                    </label>
                    <input
                      type="text"
                      value={settings.paystack_public_key}
                      onChange={(e) => setSettings({ ...settings, paystack_public_key: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Paystack Secret Key
                    </label>
                    <input
                      type="password"
                      value={settings.paystack_secret_key}
                      onChange={(e) => setSettings({ ...settings, paystack_secret_key: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SendGrid API Key
                    </label>
                    <input
                      type="password"
                      value={settings.sendgrid_api_key}
                      onChange={(e) => setSettings({ ...settings, sendgrid_api_key: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleSave}
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
      </div>
    </div>
  );
};

export default AdminSettings;