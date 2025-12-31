import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { makeAdmin } from "../../services/adminService";
import { getOrderStats } from "../../services/orderService";
import { getCustomers } from "../../services/customerService";
import {
  PlusIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
} from "@heroicons/react/outline";

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [orderStats, customersData] = await Promise.all([
          getOrderStats(),
          getCustomers(100),
        ]);

        setStats({
          ...orderStats,
          totalCustomers: customersData.customers.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Please enter an email address", type: "error" });
      return;
    }

    try {
      const result = await makeAdmin(email);
      if (result.success) {
        setMessage({ text: result.message, type: "success" });
        setEmail("");
      } else {
        setMessage({ text: result.error, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred", type: "error" });
      console.error("Error making admin:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {currentUser?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 overflow-hidden shadow-lg rounded-xl transform hover:scale-105 transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-lg p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-purple-100 truncate">
                    Total Revenue
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-white">
                      {loading
                        ? "..."
                        : `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 overflow-hidden shadow-lg rounded-xl transform hover:scale-105 transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-lg p-3">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-indigo-100 truncate">
                    Total Orders
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-white">
                      {loading ? "..." : stats?.totalOrders || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 overflow-hidden shadow-lg rounded-xl transform hover:scale-105 transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-lg p-3">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-green-100 truncate">
                    Total Customers
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-white">
                      {loading ? "..." : stats?.totalCustomers || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 overflow-hidden shadow-lg rounded-xl transform hover:scale-105 transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-lg p-3">
                <TrendingUpIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-yellow-100 truncate">
                    Avg Order Value
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-white">
                      {loading
                        ? "..."
                        : `$${stats?.averageOrderValue?.toFixed(2) || "0.00"}`}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Stats */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Order Status Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <ClockIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : stats?.statusCounts?.pending || 0}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : stats?.statusCounts?.processing || 0}
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <TruckIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : stats?.statusCounts?.shipped || 0}
            </div>
            <div className="text-sm text-gray-600">Shipped</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : stats?.statusCounts?.delivered || 0}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Admin Actions */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/orders"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200">
              <div className="flex items-center">
                <ShoppingBagIcon className="h-6 w-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Manage Orders
                  </h3>
                  <p className="text-xs text-gray-500">
                    View and process orders
                  </p>
                </div>
              </div>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              to="/admin/customers"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200">
              <div className="flex items-center">
                <UsersIcon className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    View Customers
                  </h3>
                  <p className="text-xs text-gray-500">
                    Manage customer accounts
                  </p>
                </div>
              </div>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              to="/admin/products"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-purple-600 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Manage Products
                  </h3>
                  <p className="text-xs text-gray-500">
                    Add, edit, or remove products
                  </p>
                </div>
              </div>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Add Admin */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add Admin User
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-lg sm:text-sm border-gray-300"
                placeholder="user@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Grant Admin Access
            </button>
          </form>

          {message.text && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.type === "success" ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
