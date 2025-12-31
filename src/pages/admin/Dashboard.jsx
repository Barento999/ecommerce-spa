/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  collection,
  query,
  where,
  getCountFromServer,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

// Sample data for the chart (you can replace with real data)
const generateChartData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Seeded random number generator for consistent values
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const currentMonth = new Date().getMonth();
  return months.map((month, index) => {
    const seed = index * 100 + new Date().getFullYear();
    return {
      name: month,
      sales: Math.floor(seededRandom(seed) * 1000) + 500,
      orders: Math.floor(seededRandom(seed + 1) * 200) + 50,
      current: index === currentMonth,
    };
  });
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch these from your backend
        // This is a simplified example with mock data
        const salesQuery = query(collection(db, "orders"));
        const productsQuery = query(collection(db, "products"));
        const usersQuery = query(collection(db, "users"));

        // Get counts
        const [salesSnapshot, productsSnapshot, usersSnapshot] =
          await Promise.all([
            getCountFromServer(salesQuery),
            getCountFromServer(productsQuery),
            getCountFromServer(usersQuery),
          ]);

        // Get recent orders
        const recentOrdersQuery = query(
          collection(db, "orders"),
          where(
            "createdAt",
            ">=",
            Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          ) // Last 30 days
        );
        const ordersSnapshot = await getDocs(recentOrdersQuery);
        const recentOrders = ordersSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate().toLocaleDateString(),
          }))
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 5);

        // Calculate total sales (in a real app, you'd sum up order totals)
        const totalSales = recentOrders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        );

        setStats({
          totalSales,
          totalOrders: salesSnapshot.data().count,
          totalProducts: productsSnapshot.data().count,
          totalCustomers: usersSnapshot.data().count,
          recentOrders,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = generateChartData();

  const StatCard = ({ title, value, icon: Icon, change, loading = false }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-md bg-indigo-50">
              <Icon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {loading ? "..." : value}
                </div>
                {change && (
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                    <span className="sr-only">Increased by</span>
                    {change}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link
            to="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
            <span className="sr-only"> {title} stats</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your store's performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          icon={DollarSign}
          change="12% from last month"
          loading={stats.loading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          change="8% from last month"
          loading={stats.loading}
        />
        <StatCard
          title="Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          change="5% from last month"
          loading={stats.loading}
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          change="15% from last month"
          loading={stats.loading}
        />
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Sales Overview
            </h3>
            <p className="text-sm text-gray-500">Last 12 months</p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              12 Months
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              6 Months
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Simple bar chart (you can replace with a proper charting library) */}
        <div className="mt-6">
          <div className="flex items-end h-64">
            {chartData.map((month, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-8 bg-indigo-200 rounded-t-sm hover:bg-indigo-400 transition-colors",
                    month.current ? "bg-indigo-600" : "bg-indigo-200"
                  )}
                  style={{ height: `${Math.min(100, month.sales / 15)}%` }}
                  title={`${month.sales} sales`}
                />
                <span className="mt-2 text-xs text-gray-500">{month.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
            >
              View all <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="bg-white overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.shippingAddress?.name || "Guest"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {order.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Top Products */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Top Products
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Product {i}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Math.floor(((i + 1) * 19) % 100) + 1} sold
                      </p>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${((i + 1) * 7) % 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  {
                    id: 1,
                    type: "order",
                    action: "New order placed",
                    user: "John Doe",
                    time: "2 minutes ago",
                    icon: ShoppingBag,
                    iconColor: "text-blue-500",
                  },
                  {
                    id: 2,
                    type: "user",
                    action: "New customer registered",
                    user: "Jane Smith",
                    time: "1 hour ago",
                    icon: Users,
                    iconColor: "text-green-500",
                  },
                  {
                    id: 3,
                    type: "product",
                    action: "Product updated",
                    user: "Alex Johnson",
                    time: "3 hours ago",
                    icon: Package,
                    iconColor: "text-yellow-500",
                  },
                  {
                    id: 4,
                    type: "order",
                    action: "Order shipped",
                    user: "Sarah Williams",
                    time: "5 hours ago",
                    icon: CheckCircle,
                    iconColor: "text-green-500",
                  },
                  {
                    id: 5,
                    type: "system",
                    action: "System update completed",
                    user: "System",
                    time: "1 day ago",
                    icon: AlertCircle,
                    iconColor: "text-indigo-500",
                  },
                ].map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== 4 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                              activity.iconColor
                            )}
                          >
                            <activity.icon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.action}{" "}
                              <span className="font-medium text-gray-900">
                                {activity.user}
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime="2020-09-20">{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/products/new"
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Product
              </Link>
              <Link
                to="/admin/orders/new"
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Order
              </Link>
              <Link
                to="/admin/customers/new"
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Add Customer
              </Link>
              <Link
                to="/admin/reports"
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Generate Report
              </Link>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Quick Stats
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Avg. Order Value</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${((new Date().getDate() * 7) % 100 + 50).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {((new Date().getDate() * 3) % 5 + 1).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Returning Customers</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {((new Date().getDate() * 11) % 50) + 20}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Inventory Status</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {((new Date().getDate() * 13) % 20) + 5} Low Stock
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for conditional class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;
