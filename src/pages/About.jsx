import React from "react";
import { Link } from "react-router-dom";
import { FiAward, FiShield, FiTruck, FiHeart } from "react-icons/fi";

const About = () => {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the journey of ShopEase and our commitment to bringing you
            the best products with exceptional service.
          </p>
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Who We Are
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            At ShopEase, we believe in making online shopping simple, enjoyable,
            and secure. Our mission is to provide high-quality products with
            exceptional customer service.
          </p>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-100 text-pink-600 mx-auto">
                <FiAward className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Quality Products
              </h3>
              <p className="mt-2 text-base text-gray-500">
                We source only the highest quality products from trusted
                suppliers.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mx-auto">
                <FiShield className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Secure Shopping
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Your security is our priority with encrypted transactions and
                data protection.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mx-auto">
                <FiTruck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Fast Delivery
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Quick and reliable shipping to get your orders to you as fast as
                possible.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600 mx-auto">
                <FiHeart className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Customer Care
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Our dedicated support team is here to help with any questions.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-24">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              The passionate people behind ShopEase who work hard to bring you
              the best shopping experience.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & CEO",
                bio: "With over 10 years in e-commerce, Alex founded ShopEase to revolutionize online shopping.",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Sarah Williams",
                role: "Head of Operations",
                bio: "Ensuring our operations run smoothly and efficiently every day.",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Michael Chen",
                role: "Customer Experience",
                bio: "Dedicated to making sure every customer has an exceptional experience.",
                image: "https://randomuser.me/api/portraits/men/29.jpg",
              },
            ].map((member, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="flex items-center justify-center">
                      <img
                        className="h-24 w-24 rounded-full bg-gray-100"
                        src={member.image}
                        alt={member.name}
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                      {member.name}
                    </h3>
                    <p className="text-sm text-pink-600 text-center">
                      {member.role}
                    </p>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ready to shop with us?
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their
            shopping needs.
          </p>
          <div className="mt-8">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
