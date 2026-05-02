import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Bell, Lock, Eye, EyeOff, Save, Moon, Sun, Shield, Mail, Phone } from 'lucide-react';
import { usersService } from '../../services/users';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';

const UserSettings = () => {
  const { user, updateUser } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState('account');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [accountSettings, setAccountSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    order_updates: true,
    promotional_emails: false,
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profile_visible: true,
    show_email: false,
    show_phone: false,
  });

  const handleAccountUpdate = async () => {
    setLoading(true);
    try {
      await usersService.updateSettings(accountSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await authService.changePassword(passwordData.current_password, passwordData.new_password);
      toast.success('Password changed successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    try {
      await usersService.updatePrivacy(privacySettings);
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-2">
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about your account</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={accountSettings.email_notifications}
                        onChange={(e) => setAccountSettings({ ...accountSettings, email_notifications: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications on your device</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={accountSettings.push_notifications}
                        onChange={(e) => setAccountSettings({ ...accountSettings, push_notifications: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Order Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get updates about your orders</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={accountSettings.order_updates}
                        onChange={(e) => setAccountSettings({ ...accountSettings, order_updates: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Promotional Emails</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive offers and promotions</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={accountSettings.promotional_emails}
                        onChange={(e) => setAccountSettings({ ...accountSettings, promotional_emails: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                  </div>
                  
                  <button
                    onClick={handleAccountUpdate}
                    disabled={loading}
                    className="btn-primary mt-6 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                          className="input-field pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                          className="input-field pr-10"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        className="input-field"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePasswordChange}
                    disabled={loading}
                    className="btn-primary mt-6 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Privacy Settings</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Profile Visibility</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Make your profile visible to others</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.profile_visible}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, profile_visible: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Show Email
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Display email on your public profile</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.show_email}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, show_email: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          Show Phone Number
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Display phone number on your public profile</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.show_phone}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, show_phone: e.target.checked })}
                        className="toggle-checkbox"
                      />
                    </label>
                  </div>
                  
                  <button
                    onClick={handlePrivacyUpdate}
                    disabled={loading}
                    className="btn-primary mt-6 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Privacy Settings</span>
                  </button>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          darkMode ? 'bg-brand-orange' : 'bg-gray-300'
                        } relative`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            darkMode ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </label>
                    
                    <div className="pt-4">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">Preview</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} border border-gray-200 dark:border-gray-700`}>
                          <Sun className="h-8 w-8 mb-2" />
                          <p className="text-sm">Light Mode</p>
                        </div>
                        <div className={`p-4 rounded-xl ${!darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} border border-gray-200 dark:border-gray-700`}>
                          <Moon className="h-8 w-8 mb-2" />
                          <p className="text-sm">Dark Mode</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;