import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import { useAuth } from "../context/AuthContext";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiUser as FiUserIcon,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Calculate total items in cart
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Close mobile menu and user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Fashion", slug: "fashion" },
    { name: "Home & Garden", slug: "home-garden" },
    { name: "Beauty", slug: "beauty" },
    { name: "Sports", slug: "sports" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-md" : "bg-white/80"
      } backdrop-blur-md border-b border-gray-100`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-gray-900">E</span>
              <span className="text-2xl font-bold text-indigo-600">-Shop</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:block">
              <div className="flex items-center space-x-1">
                <Link
                  to="/"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-50">
                  Home
                </Link>
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-50">
                    <span>Categories</span>
                    <FiChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-10">
                    <div className="py-1">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/products?category=${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-50">
                  All Products
                </Link>
                <Link
                  to="/about"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-50">
                  About
                </Link>
                <Link
                  to="/contact"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-50">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-600">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 mr-2">
              <FiSearch className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-expanded="false">
              {isOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop user actions */}
          <div className="hidden md:ml-4 md:flex md:items-center">
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true">
                    <span className="sr-only">Open user menu</span>
                    {user?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt={user.name || "User"}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <FiUserIcon className="h-5 w-5" />
                      </div>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu">
                      <div className="py-1" role="none">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <p className="font-medium">{user?.name || "User"}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem">
                          <FiUserIcon className="mr-3 h-5 w-5 text-gray-400" />
                          Your Profile
                        </Link>
                        <Link
                          to="/account/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem">
                          <svg
                            className="mr-3 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v2h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-2H4a2 2 0 01-2-2V4z" />
                          </svg>
                          Your Orders
                        </Link>
                        <Link
                          to="/account/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem">
                          <FiSettings className="mr-3 h-5 w-5 text-gray-400" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          role="menuitem">
                          <FiLogOut className="mr-3 h-5 w-5 text-red-400" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600">
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Sign up
                  </Link>
                </>
              )}
              <Link
                to="/wishlist"
                className="p-2 text-gray-600 hover:text-pink-600 rounded-full hover:bg-gray-100 relative"
                title="Wishlist">
                <FiHeart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 relative"
                title="Cart">
                <FiShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white border-t border-gray-200`}>
        <div className="space-y-1 px-2 pb-3 pt-2">
          {isAuthenticated ? (
            <div className="flex items-center px-3 py-2 mb-2">
              {user?.avatar ? (
                <img
                  className="h-10 w-10 rounded-full mr-3"
                  src={user.avatar}
                  alt={user.name || "User"}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                  <FiUserIcon className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50">
                <FiLogIn className="mr-2 h-4 w-4" />
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                <FiUserPlus className="mr-2 h-4 w-4" />
                Sign up
              </Link>
            </div>
          )}
          <Link
            to="/"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link
            to="/about"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link
            to="/contact"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          <div className="relative">
            <button
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() =>
                document
                  .getElementById("mobile-categories")
                  .classList.toggle("hidden")
              }>
              Categories
              <FiChevronDown className="h-4 w-4" />
            </button>
            <div id="mobile-categories" className="hidden pl-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/products?category=${category.slug}`}
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <Link
            to="/products"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}>
            All Products
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/account"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}>
                My Account
              </Link>
              <Link
                to="/account/orders"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}>
                My Orders
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50">
                Sign out
              </button>
            </>
          )}
          <Link
            to="/wishlist"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}>
            Wishlist
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      {isSearchOpen && (
        <div
          ref={searchRef}
          className="border-t border-gray-200 bg-white p-4 md:hidden">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 rounded-l-md border border-r-0 border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="rounded-r-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <FiSearch className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
