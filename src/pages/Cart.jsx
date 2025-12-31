import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../store/cartStore";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiShoppingCart,
  FiCheck,
  FiTruck,
  FiShield,
  FiTag,
} from "react-icons/fi";
import { formatPrice, formatNumber } from "../utils/formatters";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

const Cart = () => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, removeFromCart, updateQuantity } = useCartStore();

  // Check authentication status when component mounts
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page with the current path as the return URL
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated (will be redirected by the useEffect)
  if (!isAuthenticated) {
    return null;
  }
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice =
      item.discountPercentage > 0
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const discount = appliedDiscount
    ? subtotal * (appliedDiscount.percentOff / 100)
    : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyDiscount = () => {
    // In a real app, validate with backend
    const validCodes = {
      SAVE10: {
        percentOff: 10,
        code: "SAVE10",
        description: "10% off your order",
      },
      WELCOME15: {
        percentOff: 15,
        code: "WELCOME15",
        description: "15% off for new customers",
      },
      FREESHIP: {
        percentOff: 0,
        code: "FREESHIP",
        description: "Free shipping on your order",
      },
    };

    const code = validCodes[discountCode.toUpperCase()];
    if (code) {
      setAppliedDiscount(code);
      setError(null);

      // If it's a free shipping code
      if (code.code === "FREESHIP") {
        // In a real app, you would update the shipping cost
        console.log("Free shipping applied!");
      }
    } else {
      setError("Invalid discount code");
    }
  };

  const handleCheckout = async () => {
    try {
      // Ensure user is authenticated
      if (!isAuthenticated) {
        // Redirect to login with the current path as the return URL
        navigate("/login", { state: { from: "/checkout" } });
        return;
      }

      // Ensure cart is not empty
      if (cartItems.length === 0) {
        setError("Your cart is empty");
        return;
      }

      // Navigate to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Error during checkout:", error);
      setError(
        "An error occurred while processing your checkout. Please try again."
      );
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error Loading Cart
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
        <div className="max-w-md w-full mx-auto text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
            <FiShoppingCart className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-5 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
              Return Home
            </Link>
            <Link
              to="/products"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow-md">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 transition-colors">
            <FiArrowLeft className="w-4 h-4 mr-1.5" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Shopping Cart
          </h1>
          <p className="text-gray-500">
            {formatNumber(cartItems.length)}{" "}
            {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="lg:flex lg:space-x-6">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {cartItems.map((item, index) => {
                const itemPrice =
                  item.discountPercentage > 0
                    ? item.price * (1 - item.discountPercentage / 100)
                    : item.price;

                return (
                  <div
                    key={`${item.id}-${item.size || ""}`}
                    className={`border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}>
                    <div className="p-4 sm:p-5 flex">
                      <Link
                        to={`/product/${item.id}`}
                        className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden border border-gray-100 p-1.5 hover:shadow-sm transition-shadow">
                        <img
                          src={item.thumbnail || item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/200?text=No+Image";
                          }}
                        />
                      </Link>

                      <div className="ml-4 sm:ml-5 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between h-full">
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-base font-semibold text-gray-900">
                                <Link
                                  to={`/product/${item.id}`}
                                  className="hover:text-blue-600 transition-colors">
                                  {item.title}
                                </Link>
                              </h3>
                              <div className="text-right ml-4">
                                <p className="text-base font-semibold text-gray-900">
                                  {formatPrice(itemPrice * item.quantity)}
                                </p>
                                {item.discountPercentage > 0 && (
                                  <p className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-gray-500 mt-0.5">
                              {item.brand || "Generic Brand"}
                            </p>

                            <div className="mt-1.5 space-y-1">
                              <p className="text-sm text-gray-600">
                                {formatPrice(itemPrice)} each
                              </p>

                              {item.size && (
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-500">
                                    Size:{" "}
                                  </span>
                                  <span className="ml-1 text-sm font-medium text-gray-700">
                                    {item.size}
                                  </span>
                                </div>
                              )}

                              {item.color && (
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-500">
                                    Color:{" "}
                                  </span>
                                  <div className="ml-1.5 flex items-center">
                                    <span
                                      className="w-4 h-4 rounded-full border border-gray-200 inline-block"
                                      style={{ backgroundColor: item.color }}
                                      title={item.color}
                                    />
                                    <span className="ml-1 text-sm font-medium text-gray-700">
                                      {item.color}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 flex items-center justify-between sm:justify-end space-x-4">
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className={`px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors ${
                                    item.quantity <= 1
                                      ? "text-red-500 hover:bg-red-50"
                                      : "hover:text-blue-600"
                                  }`}
                                  aria-label="Decrease quantity">
                                  <FiMinus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-1.5 bg-white text-center w-12 text-gray-700 font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                  aria-label="Increase quantity">
                                  <FiPlus className="w-4 h-4" />
                                </button>
                              </div>

                              <button
                                onClick={() =>
                                  removeFromCart(item.id, item.size)
                                }
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                                aria-label="Remove item">
                                <FiTrash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0 lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"})
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span
                    className={
                      shipping > 0
                        ? "font-medium text-gray-900"
                        : "text-green-600 font-medium"
                    }>
                    {shipping > 0 ? formatPrice(shipping) : "Free"}
                  </span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <span className="text-green-600 font-medium">
                        Discount
                      </span>
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {appliedDiscount.code} (-{appliedDiscount.percentOff}%)
                      </span>
                    </div>
                    <span className="text-green-600 font-medium">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center mb-3">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                      Apply
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Secure Checkout
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-3 mt-0.5">
                    <FiCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Free Shipping
                    </p>
                    <p className="text-xs text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-3 mt-0.5">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Secure Payment
                    </p>
                    <p className="text-xs text-gray-500">100% secure payment</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-3 mt-0.5">
                    <FiTruck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Fast Delivery
                    </p>
                    <p className="text-xs text-gray-500">2-3 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
