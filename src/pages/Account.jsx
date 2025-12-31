import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiLogOut,
  FiUsers,
  FiPackage,
  FiSettings,
  FiBarChart2,
  FiTag,
} from "react-icons/fi";

const Account = () => {
  const { currentUser, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Admin Dashboard
  if (isAdmin) {
    const adminQuickLinks = [
      {
        icon: <FiBarChart2 className="w-6 h-6" />,
        title: "Dashboard",
        to: "/admin/dashboard",
        description: "View analytics and stats",
      },
      {
        icon: <FiPackage className="w-6 h-6" />,
        title: "Products",
        to: "/admin/products",
        description: "Manage inventory and listings",
      },
      {
        icon: <FiShoppingBag className="w-6 h-6" />,
        title: "Orders",
        to: "/admin/orders",
        description: "Process and track orders",
      },
      {
        icon: <FiUsers className="w-6 h-6" />,
        title: "Customers",
        to: "/admin/customers",
        description: "Manage customer accounts",
      },
      {
        icon: <FiTag className="w-6 h-6" />,
        title: "Discounts",
        to: "/admin/discounts",
        description: "Manage promotions and coupons",
      },
      {
        icon: <FiSettings className="w-6 h-6" />,
        title: "Settings",
        to: "/admin/settings",
        description: "Configure store settings",
      },
    ];

    return (
      <div className="min-h-screen bg-gray-50 pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <FiUser className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-600">{currentUser?.email}</p>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      Admin
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 sm:mt-0 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <FiLogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Admin Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {adminQuickLinks.map((link) => (
              <Link
                key={link.title}
                to={link.to}
                className="group bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-transparent hover:border-indigo-200">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Admin Stats Overview */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-700">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">$24,780</p>
                <p className="text-xs text-green-600 mt-1">
                  +12.5% from last month
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-700">Orders</p>
                <p className="text-2xl font-bold text-gray-900">1,248</p>
                <p className="text-xs text-green-600 mt-1">
                  +8.2% from last month
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-700">Products</p>
                <p className="text-2xl font-bold text-gray-900">842</p>
                <p className="text-xs text-green-600 mt-1">
                  +24 new this month
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-700">Customers</p>
                <p className="text-2xl font-bold text-gray-900">5,312</p>
                <p className="text-xs text-green-600 mt-1">
                  +3.1% from last month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular User View
  const orderHistory = [
    { id: "ORD-12345", date: "2023-11-15", total: 149.99, status: "Delivered" },
    { id: "ORD-12344", date: "2023-10-28", total: 89.99, status: "Delivered" },
  ];

  const userQuickLinks = [
    {
      icon: <FiUser className="w-6 h-6" />,
      title: "Profile",
      to: "/account/profile",
      description: "View and edit your profile",
    },
    {
      icon: <FiShoppingBag className="w-6 h-6" />,
      title: "Orders",
      to: "/account/orders",
      description: "Track and manage orders",
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      title: "Wishlist",
      to: "/wishlist",
      description: "Your saved items",
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Addresses",
      to: "/account/addresses",
      description: "Manage shipping addresses",
    },
    {
      icon: <FiCreditCard className="w-6 h-6" />,
      title: "Payment Methods",
      to: "/account/payments",
      description: "Your saved payment methods",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* User Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <FiUser className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hello,{" "}
                  {currentUser?.name?.split(" ")[0] ||
                    currentUser?.displayName?.split(" ")[0] ||
                    "Customer"}
                </h1>
                <p className="text-gray-600">{currentUser?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
              <FiLogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userQuickLinks.map((link) => (
            <Link
              key={link.title}
              to={link.to}
              className="group bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-transparent hover:border-indigo-200">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-colors">
                  {link.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Order History */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              to="/account/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all orders →
            </Link>
          </div>

          {orderHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderHistory.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-indigo-600 hover:text-indigo-900 hover:underline">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No orders yet
              </h3>
              <p className="text-gray-500 mb-6">
                When you place an order, you'll see it here.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
