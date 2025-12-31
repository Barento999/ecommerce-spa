import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

export default function Checkout() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items: cart, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 9.99 : 0; // Example shipping cost
  const tax = subtotal * 0.1; // Example tax 10%
  const total = subtotal + shipping + tax;

  useEffect(() => {
    // Redirect if cart is empty and no order was placed
    if (cart.length === 0 && !orderId) {
      navigate("/cart");
    }
  }, [cart, orderId, navigate]);

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!cart || cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!currentUser) {
      setError("You must be logged in to place an order");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    // Prevent double submission
    if (isSubmitting) return;

    try {
      console.log("Starting order placement...");
      setIsSubmitting(true);
      setError(null);

      // Create order object with all necessary fields
      const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
        userName: currentUser.displayName || "Guest",
        items: cart.map((item) => ({
          id: item.id,
          name: item.name || item.title || "Product",
          price: Number(item.price), // Ensure it's a number
          quantity: Number(item.quantity), // Ensure it's a number
          image: item.image || "",
          productId: item.id, // Add productId for reference
        })),
        subtotal: Number(subtotal.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
        status: "processing",
        paymentMethod: "Credit Card",
        paymentStatus: "pending",
        shippingAddress: {
          name: currentUser.displayName || "Customer",
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zip: "12345",
          country: "USA",
          phone: currentUser.phoneNumber || "",
        },
        trackingNumber: null,
        estimatedDelivery: null,
        notes: "",
      };

      console.log("Order data prepared:", JSON.stringify(orderData, null, 2));

      // Create order in Firestore
      console.log("Creating order in Firestore...");
      const newOrderId = await createOrder(orderData);
      console.log("Order created with ID:", newOrderId);

      // Set order ID in state
      setOrderId(newOrderId);

      // Clear cart after successful order
      console.log("Clearing cart...");
      clearCart();

      // Redirect to order confirmation after a short delay
      console.log("Redirecting to order confirmation...");
      setTimeout(() => {
        navigate(`/account/orders/${newOrderId}`, {
          state: { orderPlaced: true },
          replace: true, // Prevent going back to checkout
        });
      }, 1000);
    } catch (err) {
      console.error("Error in handlePlaceOrder:", {
        error: err,
        message: err.message,
        stack: err.stack,
      });

      let errorMessage = "Failed to place order. ";
      if (err.message.includes("permission-denied")) {
        errorMessage +=
          "Permission denied. Please make sure you are logged in.";
      } else if (err.message.includes("network-request-failed")) {
        errorMessage +=
          "Network error. Please check your connection and try again.";
      } else {
        errorMessage += "Please try again later.";
      }

      setError(errorMessage);

      // If there was an error, ensure we're not stuck in a loading state
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  // Show success message if order was placed
  if (orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <FiCheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Order Placed Successfully!
          </h2>
          <p className="mt-2 text-gray-600">
            Your order has been received and is being processed.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Order ID: {orderId.substring(0, 8).toUpperCase()}
          </p>
          <div className="mt-6">
            <Link
              to="/account/orders"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-10 px-4 pt-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">Checkout</h2>
          <p className="text-gray-600">
            Review your cart and confirm your purchase.
          </p>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {cart.length === 0 ? (
            <div className="space-y-3 text-center">
              <p className="text-lg font-medium text-gray-700">
                Your cart is currently empty.
              </p>
              <Link
                to="/products"
                className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start space-x-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name || item.title}
                          className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.name || item.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl bg-gray-50 px-6 py-4 text-sm text-gray-600">
                <p>
                  ✅ Free shipping on orders over{" "}
                  <span className="font-semibold text-gray-900">$50</span>.
                </p>
                <p className="mt-1">
                  🔒 Payments are secured using industry-leading encryption.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Order total</p>
            <p className="text-3xl font-semibold text-gray-900">
              ${total.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-md border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white">
              Edit cart
            </Link>
          </div>

          <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-gray-900">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-gray-900">${shipping.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Tax (10%)</p>
                <p className="text-gray-900">${tax.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                <p className="font-medium text-gray-900">Total</p>
                <p className="text-lg font-bold text-gray-900">
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiXCircle
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className={`mt-2 w-full rounded-lg px-6 py-3 text-center text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-indigo-600"
              }`}>
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <FiLoader className="animate-spin mr-2 h-5 w-5" />
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </button>

            <p className="mt-2 text-center text-xs text-gray-500">
              By placing your order, you agree to our{" "}
              <a
                href="/terms"
                className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
