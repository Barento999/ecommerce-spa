/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiEye,
  FiArrowRight,
  FiStar,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiGift,
  FiClock,
  FiTag,
  FiSmartphone,
  FiHeadphones,
  FiWatch,
  FiCamera,
  FiMonitor,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { useCartStore } from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import { formatPrice } from "../utils/formatters";
import ProductCard from "../components/ProductCard";
import { fetchProducts, fetchCategories } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

// Mock product data
const featuredProducts = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 399.99,
    originalPrice: 449.99,
    rating: 4.9,
    reviewCount: 5247,
    image:
      "https://images.unsplash.com/photo-1655720827867-10cc30f3d0d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: true,
    isOnSale: true,
    category: "audio",
    features: [
      "30-hour battery life",
      "8 microphones",
      "Touch controls",
      "Built-in Alexa",
    ],
  },
  {
    id: 2,
    name: "Apple Watch Series 9",
    price: 399.0,
    rating: 4.8,
    reviewCount: 8923,
    image:
      "https://images.unsplash.com/photo-1697720080583-3e7d2c2b8f8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: true,
    category: "wearables",
    features: ["Always-On Retina display", "ECG app", "Water resistant 50m"],
  },
  {
    id: 3,
    name: "Sony Alpha 7 IV Camera",
    price: 2498.0,
    originalPrice: 2799.0,
    rating: 4.9,
    reviewCount: 1247,
    image:
      "https://images.unsplash.com/photo-1633883192103-8e7da1d7a0b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isOnSale: true,
    category: "cameras",
    features: ["33MP full-frame sensor", "4K 60p video", "10fps shooting"],
  },
  {
    id: 4,
    name: "MacBook Pro 16 M3 Pro",
    price: 2399.0,
    rating: 4.9,
    reviewCount: 3542,
    image:
      "https://images.unsplash.com/photo-1697898706710-0daab8550c6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "computers",
    features: ["M3 Pro chip", "16GB RAM", "512GB SSD"],
  },
];

const features = [
  {
    name: "Free Shipping",
    description: "On all orders over $50",
    icon: FiTruck,
  },
  {
    name: "Secure Checkout",
    description: "100% secure payment",
    icon: FiShield,
  },
  {
    name: "30-Day Returns",
    description: "Money back guarantee",
    icon: FiClock,
  },
  {
    name: "24/7 Support",
    description: "Dedicated support",
    icon: FiShoppingBag,
  },
];

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: <FiSmartphone className="w-6 h-6" />,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Audio",
    slug: "audio",
    icon: <FiHeadphones className="w-6 h-6" />,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Wearables",
    slug: "wearables",
    icon: <FiWatch className="w-6 h-6" />,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Cameras",
    slug: "cameras",
    icon: <FiCamera className="w-6 h-6" />,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Computers",
    slug: "computers",
    icon: <FiMonitor className="w-6 h-6" />,
    image:
      "https://images.unsplash.com/photo-1496181133205-80b9f0706fc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Accessories",
    slug: "accessories",
    icon: <FiTag className="w-6 h-6" />,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
];

const deals = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 50% off",
    description: "On selected items",
    image:
      "https://images.unsplash.com/photo-1526170375885-4edd8f8b6d7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "/deals/summer-sale",
    buttonText: "Shop Now",
    bgColor: "bg-gradient-to-r from-pink-500 to-rose-500",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Latest Tech",
    description: "Discover new products",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "/new-arrivals",
    buttonText: "Explore",
    bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
];

const highlightStats = [
  { label: "Products", value: "1,000+" },
  { label: "Happy Customers", value: "10,000+" },
  { label: "5-Star Reviews", value: "4.8/5" },
];

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Fashion Editor",
    quote:
      "The quality and selection of products here is unmatched. I always find something unique!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Miller",
    role: "Interior Designer",
    quote:
      "My go-to place for home decor. The curation is always on point and the quality is exceptional.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    role: "Tech Enthusiast",
    quote:
      "Finally a place that combines great tech with great design. The customer service is top-notch too!",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  const {
    addToWishlist,
    removeFromWishlist,
    items: wishlistItems,
  } = useWishlistStore();

  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.id === productId),
    [cartItems]
  );

  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  const handleAddToCart = useCallback(
    (product) => {
      if (!isInCart(product.id)) {
        addToCart({ ...product, quantity: 1 });
      }
    },
    [addToCart, isInCart]
  );

  const handleWishlistToggle = useCallback(
    (product) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [addToWishlist, isInWishlist, removeFromWishlist]
  );

  // Calculate derived state using useMemo to prevent unnecessary recalculations
  const { heroProduct, featuredProducts, categoryShowcase } = useMemo(() => {
    const hero =
      products.length > 0
        ? products[Math.floor(Math.random() * products.length)]
        : null;

    const featured =
      products.length > 4
        ? [...products].sort(() => 0.5 - Math.random()).slice(0, 8)
        : [...products];

    // Calculate category showcase
    const showcase = !products.length
      ? []
      : (() => {
          const aggregates = products.reduce((acc, product) => {
            const key = product.category ?? "Other";
            const entry = acc.get(key) ?? { category: key, count: 0, total: 0 };
            acc.set(key, {
              category: key,
              count: entry.count + 1,
              total: entry.total + (product.price ?? 0),
            });
            return acc;
          }, new Map());

          return Array.from(aggregates.values()).map((item) => ({
            ...item,
            average: item.total / item.count,
          }));
        })();

    return {
      heroProduct: hero,
      featuredProducts: featured,
      categoryShowcase: showcase,
    };
  }, [products]);

  // Fetch products when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching products...");
        setLoading(true);
        const response = await fetchProducts();
        console.log("Products data received:", response);

        if (response && Array.isArray(response.products)) {
          console.log("Setting products:", response.products);
          setProducts(response.products);
        } else {
          console.error("Unexpected products data format:", response);
          setError("Received unexpected data format from server");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(`Unable to load products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error loading products
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-1/4 h-[600px] w-[600px] rounded-full bg-teal-500/10 blur-3xl animate-float" />
          <div className="absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl animate-float animation-delay-2000" />
          <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl animate-float animation-delay-4000" />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/5 backdrop-blur-md px-6 py-2.5 text-sm font-medium text-white/90 border border-white/10 shadow-lg hover:shadow-teal-500/10 transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-500"></span>
              </span>
              <span className="tracking-wide">
                New Collection Just Launched
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Elevate Your
              </span>
              <span className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mt-2">
                Shopping Experience
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover handpicked collections that blend quality, style, and
              sustainability. Each piece is carefully selected to bring
              sophistication to your everyday life.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110">
                <span className="relative z-10 flex items-center gap-2">
                  Start Shopping
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transition-transform group-hover:translate-x-1 duration-200"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>

              <Link
                to="/about"
                className="group relative w-full sm:w-auto overflow-hidden rounded-xl border-2 border-white/20 bg-transparent px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5">
                <span className="relative z-10 flex items-center gap-2">
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-pink-300 transition-transform group-hover:translate-x-1 duration-200"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400 lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-indigo-900 bg-gradient-to-br from-pink-400 to-purple-500"></div>
                  ))}
                </div>
                <span>Trusted by 10,000+ customers</span>
              </div>
              <div className="hidden md:block h-6 w-px bg-white/20"></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Free shipping on orders over $50</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Browse our wide selection of products
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <div key={category.id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-48 w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              View all
              <FiArrowRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                isInCart={isInCart(product.id)}
                isInWishlist={isInWishlist(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Deals Carousel */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Special Offers
          </h2>

          <div className="relative overflow-hidden rounded-xl">
            <div className="relative h-80 md:h-96">
              {deals.map((deal, index) => (
                <div
                  key={deal.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}>
                  <div
                    className={`h-full w-full ${deal.bgColor} rounded-xl overflow-hidden`}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative h-full flex items-center">
                      <div className="max-w-2xl mx-auto px-8 text-center sm:px-16">
                        <h3 className="text-3xl font-bold text-white sm:text-4xl">
                          {deal.title}
                        </h3>
                        <p className="mt-4 text-xl text-white">
                          {deal.subtitle}
                        </p>
                        <p className="mt-2 text-lg text-white">
                          {deal.description}
                        </p>
                        <div className="mt-8">
                          <Link
                            to={deal.link}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100">
                            {deal.buttonText}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === 0 ? deals.length - 1 : prev - 1
                  )
                }
                className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white">
                <FiChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === deals.length - 1 ? 0 : prev + 1
                  )
                }
                className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white">
                <FiChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              {deals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 w-2 rounded-full ${
                    index === currentSlide ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
              We provide the best shopping experience with our premium services
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <dt>
                    <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Sign up for our newsletter
            </h2>
            <p className="mt-4 max-w-2xl text-base text-gray-200">
              Subscribe for curated edits, early access to limited releases, and
              insider interviews with the designers behind your favorite pieces.
            </p>
            <form className="mt-6 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/60 shadow-inner outline-none transition focus:border-white/60"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-amber-400 sm:w-auto">
                Join the list
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">
              No spam. Only thoughtful drops and curated stories.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6">
          <header className="space-y-2 text-center">
            <p className="text-sm font-semibold text-amber-500">
              Voices from the community
            </p>
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              What tastemakers are saying
            </h2>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="flex h-full flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <p className="flex-1 text-base text-gray-600">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
