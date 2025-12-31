import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import PasswordChange from "./pages/account/PasswordChange";
import Orders from "./pages/account/Orders";
import OrderDetails from "./pages/account/OrderDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Customers from "./pages/admin/Customers";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

// Wrapper component for pages that need padding
const PageWrapper = ({ children }) => (
  <div className="pt-6 px-4 sm:px-6 lg:px-8">{children}</div>
);

// Layout component that conditionally shows footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ScrollToTop />
      {children}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppLayout>
              <Routes>
                {/* Admin Routes - With top spacing for Navbar */}
                <Route
                  path="/admin/login"
                  element={
                    <div className="pt-16">
                      <AdminLogin />
                    </div>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <div className="pt-16">
                        <AdminLayout />
                      </div>
                    </AdminRoute>
                  }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route
                    path="products/:id"
                    element={<div>Product Detail</div>}
                  />
                  <Route path="products/new" element={<div>New Product</div>} />
                  <Route
                    path="products/:id/edit"
                    element={<div>Edit Product</div>}
                  />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<div>Order Detail</div>} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Main site routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route
                  path="/product/:id"
                  element={
                    <PageWrapper>
                      <ProductDetail />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <PageWrapper>
                      <About />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PageWrapper>
                      <Contact />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PageWrapper>
                      <Login />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PageWrapper>
                      <Register />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PageWrapper>
                      <ForgotPassword />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/verify-email"
                  element={
                    <PageWrapper>
                      <VerifyEmail />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <PageWrapper>
                      <ResetPassword />
                    </PageWrapper>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <Cart />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <Checkout />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-confirmation"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <OrderConfirmation />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <Settings />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <Wishlist />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <Account />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/change-password"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <PasswordChange />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/orders"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <Orders />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <OrderDetails />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <PageWrapper>
                      <NotFound />
                    </PageWrapper>
                  }
                />
              </Routes>
            </AppLayout>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
