/* eslint-disable no-undef */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import { fetchProducts } from "../services/api";
import { formatNumber } from "../utils/formatters";
import { useCartStore } from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import Footer from "../components/Footer";

// Product Card Component
const ProductCard = React.memo(
  ({ product, onWishlistToggle, onAddToCart, isInWishlist, isInCart }) => {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group relative block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistToggle(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
          aria-label={
            isInWishlist ? "Remove from wishlist" : "Add to wishlist"
          }>
          <FiHeart
            className={`h-5 w-5 ${
              isInWishlist ? "text-red-500 fill-current" : "text-gray-400"
            }`}
          />
        </button>

        {/* Quick View Button */}
        <button
          className="absolute top-12 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Quick view">
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
                stroke="currentColor">
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
                  viewBox="0 0 20 20">
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
            }`}>
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </Link>
    );
  }
);

// Category icons mapping - will be populated dynamically from actual product categories
const categoryIcons = {
  beauty: "💄 Beauty",
  fragrances: "🌸 Fragrances",
  furniture: "🛋️ Furniture",
  groceries: "🛒 Groceries",
  "home-decoration": "🏠 Home Decoration",
  "kitchen-accessories": "🍳 Kitchen",
  laptops: "💻 Laptops",
  "mens-shirts": "👔 Men's Shirts",
  "mens-shoes": "👞 Men's Shoes",
  "mens-watches": "⌚ Men's Watches",
  "mobile-accessories": "📱 Mobile Accessories",
  motorcycle: "🏍️ Motorcycle",
  "skin-care": "🧴 Skin Care",
  smartphones: "📱 Smartphones",
  "sports-accessories": "⚽ Sports",
  sunglasses: "🕶️ Sunglasses",
  tablets: "📱 Tablets",
  tops: "👕 Tops",
  vehicle: "🚗 Vehicle",
  "womens-bags": "👜 Women's Bags",
  "womens-dresses": "👗 Women's Dresses",
  "womens-jewellery": "💍 Women's Jewellery",
  "womens-shoes": "👠 Women's Shoes",
  "womens-watches": "⌚ Women's Watches",
};

// Helper function to format category names
const formatCategory = (category) => {
  if (!category) return "";
  return String(category)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const location = useLocation();

  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const brandFromUrl = searchParams.get("brand") || "";
  const categoryFromUrl = searchParams.get("category") || "";

  // Select state and actions from the stores.
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const wishlistItems = useWishlistStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );

  // Memoize product checks with stable references
  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.id === productId),
    [cartItems]
  );

  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  // Memoize handlers with stable references
  const handleWishlistToggle = useCallback(
    (product) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  const handleAddToCart = useCallback(
    (product) => {
      if (!isInCart(product.id)) {
        addToCart({ ...product, quantity: 1 });
      }
    },
    [isInCart, addToCart]
  );

  // Memoize the filtered products with proper dependency array
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    const lowerQuery = query.toLowerCase();
    const lowerBrand = selectedBrand.toLowerCase();
    const lowerCategory = selectedCategory.toLowerCase();
    const hasBrandFilter = selectedBrand !== "";
    const hasCategoryFilter = selectedCategory !== "";
    const hasSearchQuery = query !== "";

    // Early return if no filters are applied
    if (!hasBrandFilter && !hasCategoryFilter && !hasSearchQuery) {
      return products;
    }

    return products.filter((product) => {
      if (hasBrandFilter) {
        const productBrand = (product.brand || "Unbranded").toLowerCase();
        if (productBrand !== lowerBrand) return false;
      }

      if (hasCategoryFilter) {
        const productCategory = (
          product.category || "Uncategorized"
        ).toLowerCase();
        if (productCategory !== lowerCategory) return false;
      }

      if (hasSearchQuery) {
        const searchIn = [
          product.title,
          product.description || "",
          product.brand || "",
          product.category || "",
        ]
          .join(" ")
          .toLowerCase();

        if (!searchIn.includes(lowerQuery)) return false;
      }

      return true;
    });
  }, [products, query, selectedBrand, selectedCategory]);

  // Extract unique brands and categories
  useEffect(() => {
    if (products.length === 0) return;

    const brandSet = new Set();
    const categorySet = new Set();

    products.forEach((product) => {
      brandSet.add(product.brand || "Unbranded");
      categorySet.add(product.category || "Uncategorized");
    });

    const newBrands = Array.from(brandSet).sort();
    const newCategories = Array.from(categorySet).sort();

    setBrands((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newBrands) ? newBrands : prev
    );
    setCategories((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newCategories)
        ? newCategories
        : prev
    );
  }, [products]);

  // Handle URL parameters on initial load
  useEffect(() => {
    if (brandFromUrl && brandFromUrl !== selectedBrand) {
      setSelectedBrand(brandFromUrl);
    }
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandFromUrl, categoryFromUrl]);

  // Fetch products only once on component mount
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      if (products.length > 0) return;

      setLoading(true);
      try {
        const response = await fetchProducts();
        if (!isMounted) return;

        const productsList = Array.isArray(response?.products)
          ? response.products
          : [];

        if (productsList.length > 0) {
          setProducts(productsList);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (isMounted) setError("Unable to load products. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Get top brands (brands with most products)
  const topBrands = useMemo(() => {
    const brandCounts = {};
    products.forEach((product) => {
      const brand = product.brand || "Unbranded";
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    return Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([brand]) => brand);
  }, [products]);

  // Get featured categories (categories with most products) - only show categories that have products
  const featuredCategories = useMemo(() => {
    const categoryCounts = {};
    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    return Object.entries(categoryCounts)
      .filter(([_, count]) => count > 0) // Only include categories with products
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);
  }, [products]);

  return (
    <div className="bg-white min-h-screen pt-16">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            {selectedBrand || selectedCategory ? (
              <>{selectedBrand || formatCategory(selectedCategory)}</>
            ) : (
              "Discover Amazing Products"
            )}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            {selectedBrand || selectedCategory
              ? `Browse our collection of ${
                  selectedBrand ||
                  formatCategory(selectedCategory).toLowerCase()
                } products.`
              : "Shop from our wide selection of quality products across all categories."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Category Navigation */}
        <div className="mb-12">
          <nav className="overflow-x-auto py-4 border-b border-gray-200">
            <ul className="flex space-x-8 min-w-max">
              <li>
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`pb-3 px-1 text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}>
                  All Products
                </button>
              </li>

              {featuredCategories.map((category) => {
                const label =
                  categoryIcons[category] || `${formatCategory(category)}`;
                return (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`pb-3 px-1 text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category
                          ? "text-indigo-600 border-b-2 border-indigo-600"
                          : "text-gray-500 hover:text-gray-900"
                      }`}>
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Brand Filter Chips */}
        {!selectedBrand && !query && !selectedCategory && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-gray-500">
              Popular Brands
            </h3>
            <div className="flex flex-wrap gap-2">
              {topBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mt-6 flex flex-col gap-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-1 flex-wrap gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring focus:ring-gray-200 sm:max-w-xs"
            />
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring focus:ring-gray-200 sm:max-w-xs">
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-600">
            Showing {formatNumber(filteredProducts.length)} of{" "}
            {formatNumber(products.length)} products
          </span>

          {/* Apple-style Product Grid */}
          <div className="space-y-16">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse bg-gray-50 rounded-xl h-[400px]"
                    />
                  ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg">
                  We're having trouble loading products. Please try again later.
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onWishlistToggle={handleWishlistToggle}
                    onAddToCart={handleAddToCart}
                    isInWishlist={isInWishlist(product.id)}
                    isInCart={isInCart(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">
                  No products found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
