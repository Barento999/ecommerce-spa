import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'New Arrivals', path: '/products?new=true' },
    { name: 'Best Sellers', path: '/products?sort=popular' },
    { name: 'Sale', path: '/sale' },
    { name: 'Gift Cards', path: '/gift-cards' },
  ];

  const customerService = [
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Shipping & Returns', path: '/shipping' },
    { name: 'Track Order', path: '/track-order' },
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: <FiFacebook />, 
      url: '#'
    },
    { 
      name: 'Twitter', 
      icon: <FiTwitter />, 
      url: '#'
    },
    { 
      name: 'Instagram', 
      icon: <FiInstagram />, 
      url: '#'
    },
    { 
      name: 'LinkedIn', 
      icon: <FiLinkedin />, 
      url: '#'
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">ShopEase</h2>
            <p className="text-sm text-gray-400">
              Your premier destination for quality products and exceptional service.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-medium mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe for updates and special offers.
            </p>
            <form>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 text-white border border-gray-700 rounded-l focus:outline-none focus:ring-1 focus:ring-pink-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-r text-sm"
                >
                  <FiArrowRight />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500">
              &copy; {currentYear} ShopEase. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link 
                to="/privacy" 
                className="text-xs text-gray-500 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-xs text-gray-500 hover:text-white"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
