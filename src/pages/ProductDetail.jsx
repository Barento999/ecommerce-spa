import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProduct } from "../services/api";
import { useCartStore } from "../store/cartStore";
import {
  FiPlus,
  FiMinus,
  FiStar,
  FiChevronRight,
  FiShoppingCart,
  FiCheck,
} from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [, setAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load product. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] pt-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16">
        <ErrorAlert message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16">
        <ErrorAlert
          message="Product not found"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Get all available images - same approach as Products.jsx
  const mainImage = product.thumbnail || product.image;
  const additionalImages = Array.isArray(product.images) ? product.images : [];

  const allImages = [
    mainImage,
    ...additionalImages.filter((img) => img && img !== mainImage),
  ].filter(Boolean);

  if (allImages.length === 0) {
    allImages.push("https://via.placeholder.com/500x500?text=No+Image");
  }

  // Check if product is already in cart and get its quantity
  const cartItem = cartItems.find((item) => item.id === product?.id);
  const isInCart = !!cartItem;

  // Use cart quantity if item is in cart, otherwise use local quantity state
  const currentQuantity = isInCart ? cartItem.quantity : quantity;

  const handleAddToCart = async (navigateToCart = false) => {
    try {
      setIsAddingToCart(true);

      // Only add to cart if not already in cart
      if (!isInCart) {
        addToCart({ ...product, quantity });
        // Show success feedback
        setAddedToCart(true);
        // Wait a moment before navigating or resetting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (navigateToCart) {
        navigate("/cart");
      } else if (!isInCart) {
        // Reset the success state after 2 seconds (only if we just added)
        setTimeout(() => setAddedToCart(false), 2000);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <FiChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                <Link
                  to="/products"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Products
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <FiChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                <span className="text-sm font-medium text-gray-500 line-clamp-1">
                  {product.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2 p-6">
              {/* Main Image */}
              <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                <img
                  src={allImages[selectedImage]}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain p-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/500x500?text=Image+Not+Available";
                  }}
                />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${
                        selectedImage === index
                          ? "border-gray-900"
                          : "border-gray-200 hover:border-gray-400"
                      }`}>
                      <img
                        src={img}
                        alt={`${product.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/100x100?text=No+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`h-5 w-5 ${
                        star <=
                        Math.round(product.rating || product.rating?.rate || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {product.rating || product.rating?.rate || 0} (
                  {product.reviews?.length || product.rating?.count || 0}{" "}
                  reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price?.toFixed(2)}
                </span>
                {product.discountPercentage && (
                  <span className="ml-2 text-sm text-red-500">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Add to Cart */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => {
                        if (isInCart) {
                          // Update cart quantity directly
                          updateQuantity(
                            product.id,
                            Math.max(1, currentQuantity - 1)
                          );
                        } else {
                          // Update local state
                          setQuantity(Math.max(1, quantity - 1));
                        }
                      }}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors">
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={() => {
                        if (isInCart) {
                          // Update cart quantity directly
                          updateQuantity(product.id, currentQuantity + 1);
                        } else {
                          // Update local state
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors">
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={isInCart}
                  className={`w-full py-3 px-6 rounded-md font-medium transition-colors mb-3 ${
                    isInCart
                      ? "bg-green-100 text-green-700 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-700"
                  }`}>
                  {isInCart ? "Added to Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={isAddingToCart}
                  className={`w-full bg-white border border-gray-900 text-gray-900 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center ${
                    isAddingToCart ? "opacity-50 cursor-not-allowed" : ""
                  }`}>
                  Buy Now
                </button>

                {/* Additional Info */}
                <div className="mt-6 text-sm text-gray-500 space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Specifications</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-500">Brand</span>
                  <span className="text-gray-900">
                    {product.brand || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="text-gray-900 capitalize">
                    {product.category || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Stock</span>
                  <span className="text-gray-900">
                    {product.stock || 0} available
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Additional Information
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-500">Weight</span>
                  <span className="text-gray-900">
                    {product.weight || 0.5} kg
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Warranty</span>
                  <span className="text-gray-900">
                    {product.warrantyInformation || "1 year"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">SKU</span>
                  <span className="text-gray-900">
                    {product.sku ||
                      `PRD-${product.id?.toString().padStart(4, "0")}`}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
