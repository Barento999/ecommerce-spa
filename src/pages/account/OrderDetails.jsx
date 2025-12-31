import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { getFirestoreDb } from "../../firebase";
import {
  FiArrowLeft,
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiCreditCard,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details from Firestore
  useEffect(() => {
    const fetchOrder = async () => {
      if (!currentUser || !orderId) return;

      try {
        setIsLoading(true);
        setError(null);

        const db = getFirestoreDb();
        const orderDoc = await getDoc(doc(db, "orders", orderId));

        if (!orderDoc.exists()) {
          throw new Error("Order not found");
        }

        const orderData = orderDoc.data();

        // Verify the order belongs to the current user
        if (orderData.userId !== currentUser.uid) {
          throw new Error("Unauthorized access to order");
        }

        setOrder({
          id: orderDoc.id,
          ...orderData,
          // Convert Firestore timestamp to Date if needed
          createdAt: orderData.createdAt?.toDate
            ? orderData.createdAt.toDate().toLocaleDateString()
            : new Date(orderData.createdAt).toLocaleDateString(),
        });
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [currentUser, orderId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "shipped":
        return <FiTruck className="text-blue-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      case "processing":
      default:
        return <FiClock className="text-amber-500" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <FiAlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Error Loading Order
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-6">
            <Link
              to="/account/orders"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
            <FiPackage className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Order Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            We couldn't find the order you're looking for.
          </p>
          <div className="mt-6">
            <Link
              to="/account/orders"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
            <FiArrowLeft className="mr-1.5 h-5 w-5" />
            Back to Orders
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Order #{order.id.substring(0, 8).toUpperCase()}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Placed on {order.createdAt}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1.5">{getStatusText(order.status)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiMapPin className="mr-2 h-5 w-5 text-gray-400" />
                  Shipping Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {order.shippingAddress?.name && (
                    <div className="font-medium">
                      {order.shippingAddress.name}
                    </div>
                  )}
                  {order.shippingAddress?.street && (
                    <div>{order.shippingAddress.street}</div>
                  )}
                  {order.shippingAddress?.city &&
                    order.shippingAddress?.state &&
                    order.shippingAddress?.zip && (
                      <div>{`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`}</div>
                    )}
                  {order.shippingAddress?.country && (
                    <div>{order.shippingAddress.country}</div>
                  )}
                  {order.shippingAddress?.phone && (
                    <div className="mt-1">
                      Phone: {order.shippingAddress.phone}
                    </div>
                  )}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiCreditCard className="mr-2 h-5 w-5 text-gray-400" />
                  Payment Method
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="font-medium">
                    {order.paymentMethod || "Credit Card"}
                  </div>
                  <div className="text-gray-500">Paid on {order.createdAt}</div>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order Items
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-0">
            <div className="divide-y divide-gray-200">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="flex items-center">
                    {item.image ? (
                      <img
                        className="h-16 w-16 rounded-md object-cover mr-4"
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                        <FiPackage className="h-8 w-8" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:col-span-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order Summary
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <dl className="-my-4 text-sm divide-y divide-gray-200">
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">
                    ${order.subtotal?.toFixed(2)}
                  </dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd className="font-medium text-gray-900">
                    ${order.shipping?.toFixed(2)}
                  </dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Tax</dt>
                  <dd className="font-medium text-gray-900">
                    ${order.tax?.toFixed(2)}
                  </dd>
                </div>
                <div className="py-4 flex items-center justify-between text-base font-medium text-gray-900">
                  <dt>Total</dt>
                  <dd>${order.total?.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
