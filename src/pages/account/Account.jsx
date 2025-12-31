import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUser, 
  FiShoppingBag, 
  FiMapPin, 
  FiSettings, 
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiX,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';

const Account = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set active tab based on URL
  useEffect(() => {
    const tab = location.hash.replace('#', '') || 'profile';
    setActiveTab(tab);
    
    // Load data based on tab
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, you would fetch this data from your API
        if (tab === 'addresses') {
          setAddresses([
            {
              id: '1',
              type: 'home',
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              isDefault: true
            },
            {
              id: '2',
              type: 'work',
              street: '456 Business Ave',
              city: 'New York',
              state: 'NY',
              zipCode: '10022',
              isDefault: false
            }
          ]);
        } else if (tab === 'orders') {
          setOrders([
            {
              id: 'ORD-12345',
              date: '2023-11-15',
              status: 'Delivered',
              total: 149.99,
              items: [
                { name: 'Wireless Headphones', quantity: 1, price: 99.99 },
                { name: 'Phone Case', quantity: 2, price: 25.00 }
              ]
            },
            {
              id: 'ORD-12344',
              date: '2023-10-28',
              status: 'Shipped',
              total: 75.50,
              items: [
                { name: 'Smart Watch', quantity: 1, price: 75.50 }
              ]
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [location.hash]);

  // Set form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiEdit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiX className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FiCheck className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiX className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden bg-gray-100">
              {user?.avatar ? (
                <img
                  className="h-full w-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                  <FiUser className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {user?.name || 'User'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <dd className="mt-1 text-sm text-gray-900">{user?.name || 'Not provided'}</dd>
              )}
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.phone || 'Not provided'}
                </dd>
              )}
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Password</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ********
                <button
                  onClick={() => navigate('/account/change-password')}
                  className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Change
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        <p className="mt-1 text-sm text-gray-500">
          View and track your recent orders
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      Order #{order.id}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {order.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="ml-4 font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                    <ul className="mt-1 text-sm text-gray-500">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity} × {item.name} (${item.price.toFixed(2)} each)
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Order
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiShoppingBag className="-ml-1 mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddressesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your saved delivery addresses
          </p>
        </div>
        <button
          onClick={() => navigate('/account/addresses/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Add New Address
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 ${
                address.isDefault ? 'border-2 border-indigo-500' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {address.type}
                </h3>
                {address.isDefault && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Default
                  </span>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Set as default
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No saved addresses
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't saved any addresses yet.
          </p>
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences and notifications
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Notification Preferences
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage how you receive notifications
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="email-notifications"
                  name="email-notifications"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="email-notifications"
                  className="font-medium text-gray-700"
                >
                  Email notifications
                </label>
                <p className="text-gray-500">
                  Get notified about order updates and promotions
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="sms-notifications"
                  name="sms-notifications"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="sms-notifications"
                  className="font-medium text-gray-700"
                >
                  SMS notifications
                </label>
                <p className="text-gray-500">
                  Get order updates via text message
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketing-emails"
                  name="marketing-emails"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="marketing-emails"
                  className="font-medium text-gray-700"
                >
                  Marketing emails
                </label>
                <p className="text-gray-500">
                  Receive our newsletter and promotional offers
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Account Actions
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your account security and data
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-4">
            <div>
              <button
                onClick={() => navigate('/account/change-password')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Change Password
              </button>
              <p className="mt-1 text-sm text-gray-500">
                Update your account password
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate('/account/delete')}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Delete Account
              </button>
              <p className="mt-1 text-sm text-gray-500">
                Permanently delete your account and all associated data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { name: 'Profile', id: 'profile', icon: FiUser },
    { name: 'Orders', id: 'orders', icon: FiShoppingBag },
    { name: 'Addresses', id: 'addresses', icon: FiMapPin },
    { name: 'Settings', id: 'settings', icon: FiSettings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3 mb-8 lg:mb-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                My Account
              </h3>
            </div>
            <nav className="divide-y divide-gray-200">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={`#${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 border-l-4 border-indigo-600 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-9">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'addresses' && renderAddressesTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </main>
      </div>
    </div>
  );
};

export default Account;
