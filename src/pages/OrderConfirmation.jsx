import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 pt-28 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Thank you for your order!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your order has been placed and is being processed. We'll send you a
        confirmation email with your order details.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
