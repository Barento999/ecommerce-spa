import { Link } from "react-router-dom";
import { FiArrowLeft, FiHeart } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import useWishlistStore from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";
import { formatPrice } from "../utils/formatters";

const Wishlist = () => {
  const {
    items: wishlistItems,
    removeFromWishlist,
    addToWishlist,
    clearWishlist,
  } = useWishlistStore();
  const { addToCart, items: cartItems } = useCartStore();

  const isInCart = (productId) =>
    cartItems.some((item) => item.id === productId);

  const handleAddToCart = (product) => {
    if (!isInCart(product.id)) {
      addToCart({ ...product, quantity: 1 });
    }
  };

  const handleWishlistToggle = (product) => {
    if (wishlistItems.some((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 pt-28">
        <div className="max-w-md w-full mx-auto text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-6 bg-pink-50 rounded-full flex items-center justify-center">
            <FiHeart className="w-10 h-10 text-pink-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Your wishlist is empty
          </h1>
          <p className="text-gray-500 mb-8">
            Find something you love and add it to your wishlist.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors shadow-sm hover:shadow-md">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <div className="flex items-center">
                      <Link
                        to="/"
                        className="text-gray-500 hover:text-gray-700">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="sr-only">Home</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <Link
                        to="/products"
                        className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Products
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-sm font-medium text-gray-500">
                        Wishlist
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <div className="mt-12">
                <h1 className="text-3xl font-bold text-gray-900">
                  Your Wishlist
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  {wishlistItems.length}{" "}
                  {wishlistItems.length === 1 ? "item" : "items"} in your
                  collection
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <FiArrowLeft className="-ml-1 mr-2 h-4 w-4" />
                Back to Products
              </Link>
              {wishlistItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              isInCart={isInCart(product.id)}
              isInWishlist={wishlistItems.some(
                (item) => item.id === product.id
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
