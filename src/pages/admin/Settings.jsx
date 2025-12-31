import React, { useState } from 'react';
import { 
  Save, 
  Mail, 
  Lock, 
  Globe, 
  CreditCard, 
  Bell, 
  User, 
  Shield, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    // General Settings
    siteName: 'My E-commerce Store',
    siteDescription: 'The best e-commerce platform',
    adminEmail: 'admin@example.com',
    timezone: 'UTC+03:00',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Email Settings
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'user@example.com',
    smtpPassword: '',
    smtpEncryption: 'tls',
    
    // Payment Settings
    currency: 'USD',
    paymentMethods: ['credit_card', 'paypal', 'bank_transfer'],
    testMode: true,
    
    // Notification Settings
    emailNotifications: true,
    orderConfirmation: true,
    orderStatus: true,
    lowStock: true,
    
    // Security Settings
    twoFactorAuth: false,
    failedLoginAttempts: 5,
    sessionLifetime: 24,
    
    // Advanced Settings
    maintenanceMode: false,
    enableCache: true,
    debugMode: false,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus({
        type: 'success',
        message: 'Settings saved successfully!'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <User className="h-4 w-4 mr-2" /> },
    { id: 'email', name: 'Email', icon: <Mail className="h-4 w-4 mr-2" /> },
    { id: 'payments', name: 'Payments', icon: <CreditCard className="h-4 w-4 mr-2" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-4 w-4 mr-2" /> },
    { id: 'security', name: 'Security', icon: <Shield className="h-4 w-4 mr-2" /> },
    { id: 'advanced', name: 'Advanced', icon: <Globe className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your store's settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Save Status */}
      {saveStatus.message && (
        <div className={`mb-6 p-4 rounded-md ${
          saveStatus.type === 'success' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {saveStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {saveStatus.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">General Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Basic information about your store</p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    id="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                    Store Description
                  </label>
                  <textarea
                    name="siteDescription"
                    id="siteDescription"
                    rows={3}
                    value={formData.siteDescription}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                    Admin Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="email"
                      name="adminEmail"
                      id="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="UTC-12:00">(UTC-12:00) International Date Line West</option>
                    <option value="UTC-11:00">(UTC-11:00) Coordinated Universal Time-11</option>
                    <option value="UTC-10:00">(UTC-10:00) Hawaii</option>
                    <option value="UTC-09:00">(UTC-09:00) Alaska</option>
                    <option value="UTC-08:00">(UTC-08:00) Pacific Time (US & Canada)</option>
                    <option value="UTC-07:00">(UTC-07:00) Mountain Time (US & Canada)</option>
                    <option value="UTC-06:00">(UTC-06:00) Central Time (US & Canada)</option>
                    <option value="UTC-05:00">(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option value="UTC-04:00">(UTC-04:00) Atlantic Time (Canada)</option>
                    <option value="UTC-03:00">(UTC-03:00) Buenos Aires, Georgetown</option>
                    <option value="UTC-02:00">(UTC-02:00) Mid-Atlantic</option>
                    <option value="UTC-01:00">(UTC-01:00) Cape Verde Is.</option>
                    <option value="UTC">(UTC) Dublin, Edinburgh, Lisbon, London</option>
                    <option value="UTC+01:00">(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                    <option value="UTC+02:00">(UTC+02:00) Athens, Bucharest, Istanbul</option>
                    <option value="UTC+03:00" selected>(UTC+03:00) Moscow, St. Petersburg, Volgograd</option>
                    <option value="UTC+04:00">(UTC+04:00) Abu Dhabi, Muscat</option>
                    <option value="UTC+05:00">(UTC+05:00) Islamabad, Karachi, Tashkent</option>
                    <option value="UTC+05:30">(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                    <option value="UTC+06:00">(UTC+06:00) Astana, Dhaka</option>
                    <option value="UTC+07:00">(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                    <option value="UTC+08:00">(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                    <option value="UTC+09:00">(UTC+09:00) Osaka, Sapporo, Tokyo</option>
                    <option value="UTC+10:00">(UTC+10:00) Canberra, Melbourne, Sydney</option>
                    <option value="UTC+11:00">(UTC+11:00) Magadan, Solomon Is., New Caledonia</option>
                    <option value="UTC+12:00">(UTC+12:00) Auckland, Wellington</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700">
                    Time Format
                  </label>
                  <select
                    id="timeFormat"
                    name="timeFormat"
                    value={formData.timeFormat}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="12h">12-hour (3:45 PM)</option>
                    <option value="24h">24-hour (15:45)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Email Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Configure your email server settings</p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    id="smtpHost"
                    value={formData.smtpHost}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="smtp.example.com"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    name="smtpPort"
                    id="smtpPort"
                    value={formData.smtpPort}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="587"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    name="smtpUsername"
                    id="smtpUsername"
                    value={formData.smtpUsername}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="username"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                    SMTP Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="password"
                      name="smtpPassword"
                      id="smtpPassword"
                      value={formData.smtpPassword}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="smtpEncryption" className="block text-sm font-medium text-gray-700">
                    Encryption
                  </label>
                  <select
                    id="smtpEncryption"
                    name="smtpEncryption"
                    value={formData.smtpEncryption}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Test your email settings before saving to ensure they work correctly.
                    </p>
                    <div className="mt-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        Test Email Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payments' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Configure your payment methods and settings</p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Methods
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="credit_card"
                          name="paymentMethods"
                          type="checkbox"
                          checked={formData.paymentMethods.includes('credit_card')}
                          onChange={(e) => {
                            const newMethods = [...formData.paymentMethods];
                            if (e.target.checked) {
                              newMethods.push('credit_card');
                            } else {
                              const index = newMethods.indexOf('credit_card');
                              if (index > -1) newMethods.splice(index, 1);
                            }
                            setFormData({ ...formData, paymentMethods: newMethods });
                          }}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="credit_card" className="font-medium text-gray-700">
                          Credit/Debit Card
                        </label>
                        <p className="text-gray-500">Accept credit and debit card payments</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="paypal"
                          name="paymentMethods"
                          type="checkbox"
                          checked={formData.paymentMethods.includes('paypal')}
                          onChange={(e) => {
                            const newMethods = [...formData.paymentMethods];
                            if (e.target.checked) {
                              newMethods.push('paypal');
                            } else {
                              const index = newMethods.indexOf('paypal');
                              if (index > -1) newMethods.splice(index, 1);
                            }
                            setFormData({ ...formData, paymentMethods: newMethods });
                          }}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="paypal" className="font-medium text-gray-700">
                          PayPal
                        </label>
                        <p className="text-gray-500">Accept payments via PayPal</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="bank_transfer"
                          name="paymentMethods"
                          type="checkbox"
                          checked={formData.paymentMethods.includes('bank_transfer')}
                          onChange={(e) => {
                            const newMethods = [...formData.paymentMethods];
                            if (e.target.checked) {
                              newMethods.push('bank_transfer');
                            } else {
                              const index = newMethods.indexOf('bank_transfer');
                              if (index > -1) newMethods.splice(index, 1);
                            }
                            setFormData({ ...formData, paymentMethods: newMethods });
                          }}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="bank_transfer" className="font-medium text-gray-700">
                          Bank Transfer
                        </label>
                        <p className="text-gray-500">Accept payments via bank transfer</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="testMode"
                        name="testMode"
                        type="checkbox"
                        checked={formData.testMode}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="testMode" className="font-medium text-gray-700">
                        Test Mode
                      </label>
                      <p className="text-gray-500">
                        Enable test mode to process payments in a sandbox environment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your email notification preferences</p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                      Enable Email Notifications
                    </label>
                    <p className="text-gray-500">
                      Receive email notifications for important account activities
                    </p>
                  </div>
                </div>

                <div className="ml-7 pl-4 border-l-2 border-gray-100 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="orderConfirmation"
                        name="orderConfirmation"
                        type="checkbox"
                        checked={formData.orderConfirmation}
                        onChange={handleChange}
                        disabled={!formData.emailNotifications}
                        className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ${
                          !formData.emailNotifications ? 'opacity-50' : ''
                        }`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label 
                        htmlFor="orderConfirmation" 
                        className={`font-medium ${
                          !formData.emailNotifications ? 'text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        Order Confirmation
                      </label>
                      <p className="text-gray-500">
                        Send an email when a new order is placed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="orderStatus"
                        name="orderStatus"
                        type="checkbox"
                        checked={formData.orderStatus}
                        onChange={handleChange}
                        disabled={!formData.emailNotifications}
                        className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ${
                          !formData.emailNotifications ? 'opacity-50' : ''
                        }`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label 
                        htmlFor="orderStatus" 
                        className={`font-medium ${
                          !formData.emailNotifications ? 'text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        Order Status Updates
                      </label>
                      <p className="text-gray-500">
                        Send an email when an order status changes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="lowStock"
                        name="lowStock"
                        type="checkbox"
                        checked={formData.lowStock}
                        onChange={handleChange}
                        disabled={!formData.emailNotifications}
                        className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ${
                          !formData.emailNotifications ? 'opacity-50' : ''
                        }`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label 
                        htmlFor="lowStock" 
                        className={`font-medium ${
                          !formData.emailNotifications ? 'text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        Low Stock Alerts
                      </label>
                      <p className="text-gray-500">
                        Get notified when product stock is running low
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Security Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your account security settings</p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="twoFactorAuth"
                      name="twoFactorAuth"
                      type="checkbox"
                      checked={formData.twoFactorAuth}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">
                      Two-Factor Authentication
                    </label>
                    <p className="text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>

                <div className="ml-7 pl-4 border-l-2 border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="failedLoginAttempts" className="block text-sm font-medium text-gray-700">
                        Failed Login Attempts
                      </label>
                      <select
                        id="failedLoginAttempts"
                        name="failedLoginAttempts"
                        value={formData.failedLoginAttempts}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="3">3 attempts</option>
                        <option value="5">5 attempts</option>
                        <option value="10">10 attempts</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Number of failed login attempts before account is locked
                      </p>
                    </div>

                    <div>
                      <label htmlFor="sessionLifetime" className="block text-sm font-medium text-gray-700">
                        Session Lifetime
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          name="sessionLifetime"
                          id="sessionLifetime"
                          value={formData.sessionLifetime}
                          onChange={handleChange}
                          min="1"
                          max="720"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <span className="text-gray-500 sm:text-sm mr-3">hours</span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        How long to keep users logged in (1-720 hours)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Password Requirements</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>At least 8 characters long</li>
                  <li>Contains at least one uppercase letter</li>
                  <li>Contains at least one number</li>
                  <li>Contains at least one special character</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        {activeTab === 'advanced' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Advanced Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Advanced configuration options for your store
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="maintenanceMode"
                      name="maintenanceMode"
                      type="checkbox"
                      checked={formData.maintenanceMode}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                      Maintenance Mode
                    </label>
                    <p className="text-gray-500">
                      Enable to take your store offline for maintenance
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableCache"
                      name="enableCache"
                      type="checkbox"
                      checked={formData.enableCache}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableCache" className="font-medium text-gray-700">
                      Enable Caching
                    </label>
                    <p className="text-gray-500">
                      Improve performance by enabling caching
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="debugMode"
                      name="debugMode"
                      type="checkbox"
                      checked={formData.debugMode}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="debugMode" className="font-medium text-gray-700">
                      Debug Mode
                    </label>
                    <p className="text-gray-500">
                      Enable debug mode for troubleshooting (not recommended for production)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">Clear Cache</h4>
                    <p className="text-sm text-gray-500">
                      Clear all cached data to free up space
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">Export Data</h4>
                    <p className="text-sm text-gray-500">
                      Export your store data for backup or migration
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSaving ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
