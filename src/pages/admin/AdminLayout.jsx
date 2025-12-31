import { useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Bell,
} from "lucide-react";
import { cn } from "../../lib/utils";

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if user is admin
  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check if user has admin privileges
  if (!currentUser.isAdmin) {
    return <Navigate to="/" state={{ error: "access_denied" }} replace />;
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current:
        location.pathname === "/admin" ||
        location.pathname === "/admin/dashboard",
      badge: null,
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      current: location.pathname.startsWith("/admin/products"),
      badge: null,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      current: location.pathname.startsWith("/admin/orders"),
      badge: "12",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
      current: location.pathname.startsWith("/admin/customers"),
      badge: null,
      gradient: "from-orange-500 to-red-600",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart2,
      current: location.pathname.startsWith("/admin/analytics"),
      badge: null,
      gradient: "from-pink-500 to-rose-600",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: location.pathname.startsWith("/admin/settings"),
      badge: null,
      gradient: "from-gray-500 to-slate-600",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      {/* Mobile sidebar */}
      <div className="md:hidden fixed inset-0 z-40">
        <div
          className={cn(
            "fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300",
            isMobileSidebarOpen
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  item.current
                    ? "bg-gradient-to-r " +
                        item.gradient +
                        " text-white shadow-lg shadow-indigo-500/50"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setIsMobileSidebarOpen(false)}>
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white/20 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile User Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <img
                className="h-10 w-10 rounded-full ring-2 ring-indigo-500"
                src={
                  currentUser.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentUser.displayName || "Admin"
                  )}&background=6366f1&color=fff`
                }
                alt={currentUser.displayName || "Admin"}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser.displayName || "Admin"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {currentUser.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - Fixed below Navbar */}
      <div className="hidden md:flex md:flex-shrink-0 md:fixed md:top-16 md:bottom-0 md:left-0 md:z-30">
        <div
          className={cn(
            "flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300 ease-in-out",
            isSidebarOpen ? "w-72" : "w-20"
          )}>
          {/* Header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
            <div
              className={cn(
                "flex items-center space-x-3",
                !isSidebarOpen && "justify-center w-full"
              )}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                  <p className="text-xs text-gray-400">Management System</p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Collapsed Toggle Button */}
          {!isSidebarOpen && (
            <div className="px-4 py-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-full p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <ChevronRight className="h-5 w-5 mx-auto" />
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden",
                  item.current
                    ? "bg-gradient-to-r " +
                        item.gradient +
                        " text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white",
                  !isSidebarOpen && "justify-center"
                )}>
                {/* Glow effect for active item */}
                {item.current && (
                  <div className="absolute inset-0 bg-white/10 blur-xl"></div>
                )}

                <div className="flex items-center relative z-10">
                  <item.icon
                    className={cn("h-5 w-5", isSidebarOpen && "mr-3")}
                  />
                  {isSidebarOpen && <span>{item.name}</span>}
                </div>

                {isSidebarOpen && item.badge && (
                  <span className="relative z-10 px-2 py-0.5 text-xs font-semibold rounded-full bg-white/20 text-white">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-6 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Quick Actions */}
          {isSidebarOpen && (
            <div className="px-4 py-4 border-t border-white/10">
              <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </button>
            </div>
          )}

          {/* User Section */}
          <div className="flex-shrink-0 border-t border-white/10 p-4 bg-slate-900/50 backdrop-blur-sm">
            <div
              className={cn(
                "flex items-center",
                !isSidebarOpen && "justify-center"
              )}>
              <img
                className="h-10 w-10 rounded-full ring-2 ring-indigo-500"
                src={
                  currentUser.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentUser.displayName || "Admin"
                  )}&background=6366f1&color=fff`
                }
                alt={currentUser.displayName || "Admin"}
              />
              {isSidebarOpen && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser.displayName || "Admin"}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-gray-400 hover:text-white flex items-center transition-colors">
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Scrollable */}
      <div
        className={cn(
          "flex flex-col flex-1 overflow-y-auto",
          isSidebarOpen ? "md:ml-72" : "md:ml-20"
        )}>
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 md:hidden bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              type="button"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Admin</span>
            </div>
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
