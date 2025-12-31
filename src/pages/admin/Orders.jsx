import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshIcon,
  DownloadIcon,
} from "@heroicons/react/outline";
import { getAllOrders, getOrderStats } from "../../services/orderService";

const statuses = {
  pending: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: ClockIcon,
    badge: "bg-yellow-100 text-yellow-800",
  },
  processing: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: ClockIcon,
    badge: "bg-blue-100 text-blue-800",
  },
  shipped: {
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: TruckIcon,
    badge: "bg-indigo-100 text-indigo-800",
  },
  delivered: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircleIcon,
    badge: "bg-green-100 text-green-800",
  },
  cancelled: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircleIcon,
    badge: "bg-red-100 text-red-800",
  },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [stats, setStats] = useState(null);

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        // Build filters
        const filters = {
          status: selectedStatus,
        };

        // Apply date filter
        if (dateRange !== "all") {
          const now = new Date();
          let startDate = new Date();

          switch (dateRange) {
            case "today":
              startDate.setDate(now.getDate() - 1);
              break;
            case "week":
              startDate.setDate(now.getDate() - 7);
              break;
            case "month":
              startDate.setMonth(now.getMonth() - 1);
              break;
            case "year":
              startDate.setFullYear(now.getFullYear() - 1);
              break;
            default:
              break;
          }

          filters.startDate = startDate;
        }

        // Fetch orders
        const { orders: fetchedOrders } = await getAllOrders(
          100,
          null,
          filters
        );

        // Format dates for display
        const ordersData = fetchedOrders.map((order) => ({
          ...order,
          date: order.createdAt?.toLocaleDateString(),
          customerName: order.userName || "Guest",
        }));

        setOrders(ordersData);

        // Fetch stats
        const orderStats = await getOrderStats(filters);
        setStats(orderStats);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedStatus, dateRange]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getTotalSales = () => {
    if (stats) return stats.totalRevenue.toFixed(2);
    return orders
      .reduce((sum, order) => sum + (order.total || 0), 0)
      .toFixed(2);
  };

  const getOrderCountByStatus = (status) => {
    if (stats && stats.statusCounts) {
      return stats.statusCounts[status] || 0;
    }
    return orders.filter((order) => order.status === status).length;
  };

  const SortIcon = ({ direction }) => (
    <span className="ml-1">
      {direction === "asc" ? (
        <ArrowUpIcon className="h-4 w-4 inline" />
      ) : (
        <ArrowDownIcon className="h-4 w-4 inline" />
      )}
    </span>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all orders from your customers
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
            <RefreshIcon
              className={`-ml-1 mr-2 h-5 w-5 text-gray-500 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
            <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 overflow-hidden shadow-lg rounded-xl transform hover:scale-105 transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-lg p-3">
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-indigo-100 truncate">
                    Total Orders
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-white">
                      {loading ? "..." : orders.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 overflow-hidden shadow-lg rounded-xl transform hover:scale-105 transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-lg p-3">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-green-100 truncate">
                    Completed
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-white">
                      {loading ? "..." : getOrderCountByStatus("delivered")}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 overflow-hidden shadow-lg rounded-xl transform hover:scale-105 transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-lg p-3">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-yellow-100 truncate">
                    Pending
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-white">
                      {loading
                        ? "..."
                        : getOrderCountByStatus("pending") +
                          getOrderCountByStatus("processing")}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 overflow-hidden shadow-lg rounded-xl transform hover:scale-105 transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-lg p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-purple-100 truncate">
                    Total Revenue
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-white">
                      ${loading ? "..." : getTotalSales()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative rounded-md shadow-sm w-full sm:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              {Object.keys(statuses).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 sm:flex-none">
            <label
              htmlFor="date-range"
              className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="date-range"
              name="date-range"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">This year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-sm text-gray-500">
                    Loading orders...
                  </p>
                </div>
              ) : filteredOrders.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                        onClick={() => handleSort("id")}>
                        <div className="flex items-center">
                          Order ID
                          {sortConfig.key === "id" && (
                            <SortIcon direction={sortConfig.direction} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => handleSort("date")}>
                        <div className="flex items-center">
                          Date
                          {sortConfig.key === "date" && (
                            <SortIcon direction={sortConfig.direction} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => handleSort("customerName")}>
                        <div className="flex items-center">
                          Customer
                          {sortConfig.key === "customerName" && (
                            <SortIcon direction={sortConfig.direction} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => handleSort("total")}>
                        <div className="flex items-center">
                          Total
                          {sortConfig.key === "total" && (
                            <SortIcon direction={sortConfig.direction} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => handleSort("status")}>
                        <div className="flex items-center">
                          Status
                          {sortConfig.key === "status" && (
                            <SortIcon direction={sortConfig.direction} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredOrders.map((order) => {
                      const StatusIcon =
                        statuses[order.status]?.icon || ClockIcon;
                      const statusStyle =
                        statuses[order.status]?.color ||
                        "bg-gray-100 text-gray-800";

                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-indigo-600 hover:text-indigo-900">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            <div className="font-medium">
                              {order.customerName || "Guest"}
                            </div>
                            <div className="text-gray-500">{order.email}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            ${order.total?.toFixed(2) || "0.00"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {order.status || "pending"}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-indigo-600 hover:text-indigo-900">
                              View<span className="sr-only">, {order.id}</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No orders
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No orders found matching your current filters.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredOrders.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-b-lg">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">10</span> of{" "}
                      <span className="font-medium">
                        {filteredOrders.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
