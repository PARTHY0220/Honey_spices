import React, { useState } from 'react';
import { 
  User, 
  Store, 
  Lock, 
  Bell, 
  ShieldAlert, 
  Save, 
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

const SettingsView = ({ settings, saveSettings, addToast }) => {
  const [activeTab, setActiveTab] = useState('profile'); // profile, store, security, alerts
  
  // Local state form fields
  const [profileForm, setProfileForm] = useState({ ...settings.profile });
  const [storeForm, setStoreForm] = useState({ ...settings.store });
  const [alertsForm, setAlertsForm] = useState({ ...settings.notifications });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState(false);

  // Tab configurations
  const tabs = [
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'store', label: 'Store Front', icon: Store },
    { id: 'alerts', label: 'Alert Center', icon: Bell },
    { id: 'security', label: 'Security Credentials', icon: Lock }
  ];

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    saveSettings({ ...settings, profile: profileForm });
    addToast('Admin profile logs updated.', 'success');
  };

  const handleStoreSubmit = (e) => {
    e.preventDefault();
    saveSettings({ ...settings, store: storeForm });
    addToast('Storefront identity settings saved.', 'success');
  };

  const handleAlertsSave = (alertsState) => {
    saveSettings({ ...settings, notifications: alertsState });
    addToast('Alert notifications preferences saved.', 'success');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      addToast('Please fill in all security fields.', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    addToast('Credential passwords updated successfully.', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wide text-stone-900 dark:text-white">Command Center Config</h1>
          <p className="text-xs tracking-wider uppercase text-stone-500 dark:text-amber-500/70 font-mono mt-1">
            Maintain administrator accounts and shop configurations
          </p>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 border-stone-200 dark:border-white/5 pb-2 lg:pb-0 gap-1 min-w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs tracking-wider uppercase font-mono transition-all rounded-lg border cursor-pointer focus:outline-none w-full text-left whitespace-nowrap ${
                  active 
                    ? 'bg-amber-500 border-amber-500 text-black font-semibold shadow-[0_4px_12px_rgba(245,158,11,0.15)]'
                    : 'bg-transparent border-transparent text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-neutral-900/60 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Configuration Views Panel */}
        <div className="lg:col-span-3 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-6 rounded-xl shadow-sm">
          
          {/* PROFILE FORM */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6 text-xs text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-4 border-b border-stone-200/50 dark:border-white/5 pb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-amber-500/25 bg-neutral-900 flex-shrink-0">
                  <img src={profileForm.avatar} alt="Admin" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-serif text-stone-950 dark:text-white font-bold">{profileForm.name}</h3>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-600 dark:text-amber-500/70">{profileForm.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Administrator Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Authentication Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Curator Role Designation</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Avatar URL</label>
                  <input
                    type="text"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, avatar: e.target.value }))}
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-200/50 dark:border-white/5 font-mono">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Admin Profile
                </button>
              </div>
            </form>
          )}

          {/* STORE CONFIG */}
          {activeTab === 'store' && (
            <form onSubmit={handleStoreSubmit} className="space-y-5 text-xs text-stone-700 dark:text-stone-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Store Identity Name</label>
                  <input
                    type="text"
                    value={storeForm.name}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Public Store Email</label>
                  <input
                    type="email"
                    value={storeForm.email}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Customer Support Phone</label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Default Currency Symbol</label>
                  <select
                    value={storeForm.currency}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-750 dark:text-stone-300 rounded focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 dark:text-zinc-400 font-medium">Central Sourcing Headquarters Address</label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-200/50 dark:border-white/5">
                <h4 className="text-[10px] tracking-wider uppercase text-amber-600 dark:text-amber-500 font-bold font-mono">Metadata SEO Tags</h4>
                <div className="space-y-3 mt-2">
                  <div className="space-y-1">
                    <label className="text-stone-400 dark:text-zinc-500">SEO Default Title</label>
                    <input
                      type="text"
                      value={storeForm.seoTitle}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                      className="w-full p-2 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-400 dark:text-zinc-500">SEO Meta Description</label>
                    <textarea
                      value={storeForm.seoDescription}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                      rows="2"
                      className="w-full p-2 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-200/50 dark:border-white/5 font-mono">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Store Details
                </button>
              </div>
            </form>
          )}

          {/* ALERTS PREFERENCES */}
          {activeTab === 'alerts' && (
            <div className="space-y-6 text-xs text-stone-700 dark:text-stone-300">
              <div>
                <h3 className="text-sm font-serif font-bold text-stone-950 dark:text-white mb-1">Administrative Alert Center</h3>
                <p className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Define how system anomalies and checkouts notify the curators</p>
              </div>

              <div className="space-y-4 border-t border-stone-200/50 dark:border-white/5 pt-4">
                {/* Email Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50/50 dark:bg-neutral-950/20 border border-stone-200/50 dark:border-white/5 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-stone-950 dark:text-white">Email Transaction Reports</h4>
                    <p className="text-[10px] text-stone-400 dark:text-zinc-500 font-light mt-0.5">Receive immediate invoice drafts upon customer credit clearance</p>
                  </div>
                  <button
                    onClick={() => {
                      const next = { ...alertsForm, emailAlerts: !alertsForm.emailAlerts };
                      setAlertsForm(next);
                      handleAlertsSave(next);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                      alertsForm.emailAlerts ? 'bg-amber-500' : 'bg-stone-350 dark:bg-zinc-800'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      alertsForm.emailAlerts ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50/50 dark:bg-neutral-950/20 border border-stone-200/50 dark:border-white/5 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-stone-950 dark:text-white">Live Push Desktop Alerts</h4>
                    <p className="text-[10px] text-stone-400 dark:text-zinc-500 font-light mt-0.5">Show notifications when a new concierge message is received</p>
                  </div>
                  <button
                    onClick={() => {
                      const next = { ...alertsForm, pushAlerts: !alertsForm.pushAlerts };
                      setAlertsForm(next);
                      handleAlertsSave(next);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                      alertsForm.pushAlerts ? 'bg-amber-500' : 'bg-stone-350 dark:bg-zinc-800'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      alertsForm.pushAlerts ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                {/* Low Stock Alerts */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50/50 dark:bg-neutral-950/20 border border-stone-200/50 dark:border-white/5 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-stone-950 dark:text-white flex items-center gap-1.5">
                      Low Stock Flags
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    </h4>
                    <p className="text-[10px] text-stone-400 dark:text-zinc-500 font-light mt-0.5">Warn on dashboard when spice stock falls below 10 quills/jars</p>
                  </div>
                  <button
                    onClick={() => {
                      const next = { ...alertsForm, lowStockAlerts: !alertsForm.lowStockAlerts };
                      setAlertsForm(next);
                      handleAlertsSave(next);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                      alertsForm.lowStockAlerts ? 'bg-amber-500' : 'bg-stone-350 dark:bg-zinc-800'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      alertsForm.lowStockAlerts ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                {/* Daily Digest Summary */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50/50 dark:bg-neutral-950/20 border border-stone-200/50 dark:border-white/5 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-stone-950 dark:text-white">Daily Summary Digests</h4>
                    <p className="text-[10px] text-stone-400 dark:text-zinc-500 font-light mt-0.5">Compile gross metrics, revenue, and pending shipment lists at 20:00 CET</p>
                  </div>
                  <button
                    onClick={() => {
                      const next = { ...alertsForm, dailySummary: !alertsForm.dailySummary };
                      setAlertsForm(next);
                      handleAlertsSave(next);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                      alertsForm.dailySummary ? 'bg-amber-500' : 'bg-stone-350 dark:bg-zinc-800'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      alertsForm.dailySummary ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CHANGE SECURITY PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5 text-xs text-stone-700 dark:text-stone-300">
              <div>
                <h3 className="text-sm font-serif font-bold text-stone-950 dark:text-white mb-1">Update Security Key</h3>
                <p className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Alter administrator authentication password</p>
              </div>

              <div className="space-y-4 border-t border-stone-200/50 dark:border-white/5 pt-4 max-w-sm">
                
                {/* Current password */}
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Current Secret Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                      placeholder="••••••••"
                      className="w-full p-2.5 pr-10 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">New Secret Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    placeholder="Minimum 8 characters"
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Confirm new password */}
                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Confirm New Secret Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    placeholder="Confirm password"
                    className="w-full p-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-200/50 dark:border-white/5 font-mono">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Update Security Credentials
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsView;
