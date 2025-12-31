import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye } from "react-icons/fi";
import { formatNumber } from "../utils/formatters";

const ProductCard = React.memo(
  ({
    product,
    onWishlistToggle,
    onAddToCart,
    isInWishlist,
    isInCart,
  }) => {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group relative block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
      >
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistToggle(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart
            className={`h-5 w-5 ${
              isInWishlist ? "text-red-500 fill-current" : "text-gray-400"
            }`}
          />
        </button>

        {/* Quick View Button */}
        <button
          className="absolute top-12 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Quick view"
        >
          <FiEye className="h-5 w-5 text-gray-700" />
        </button>

        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {product.thumbnail || product.image ? (
            <img
              src={product.thumbnail || product.image}
              alt={product.title}
              className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `
              <div class="h-full w-full flex flex-col items-center justify-center p-4 text-center bg-gray-50">
                <span class="text-gray-400 text-sm">Image not available</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="mt-2 text-sm text-gray-500">No image available</span>
              </div>
              `;
              }}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="mt-2 text-sm text-gray-500">
                No image available
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              ${product.price}
              {product.discountPercentage > 0 && (
                <span className="ml-1 text-xs text-red-500">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
            </p>
            {product.rating && (
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-xs text-gray-600">
                  {product.rating.rate} ({formatNumber(product.rating.count)})
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isInCart}
            className={`mt-3 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isInCart
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </Link>
    );
  }
);

export default ProductCard;

