import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  HelpCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* Newsletter Section */}
      <div className="bg-brand-purple">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold mb-2">
            Subscribe & Get 20% OFF Your First Order
          </h3>
          <p className="text-gray-300 mb-6">
            Plus free super saver shipping on orders over $99
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <button className="px-6 py-3 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orange-dark transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Top Section - Contact & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-6">Get In Touch</h4>
            <div className="space-y-4">
              <a
                href="tel:800-580-4489"
                className="flex items-start gap-3 group"
              >
                <Phone size={20} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">800-580-4489</p>
                  <p className="text-sm text-gray-400">24/7 Support</p>
                </div>
              </a>
              <a href="mailto:support@bannerbuzz.com" className="flex items-start gap-3">
                <Mail size={20} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">support@bannerbuzz.com</p>
                  <p className="text-sm text-gray-400">Email us anytime</p>
                </div>
              </a>
              <Link to="/" className="flex items-start gap-3">
                <HelpCircle size={20} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Help & FAQs</p>
                  <p className="text-sm text-gray-400">Find answers</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-white mb-6">Products</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Custom Banners
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Banner Stands
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Custom Flags
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Trade Show Displays
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  LED Signs
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Table Covers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Refer & Earn
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Sample Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-orange transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            {/* Social Links */}
            <div className="flex gap-6 mb-6 md:mb-0">
              <a
                href="#"
                className="text-gray-400 hover:text-brand-orange transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-orange transition"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-orange transition"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-orange transition"
              >
                <Linkedin size={20} />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-orange">
                  4.5/5
                </div>
                <p className="text-xs text-gray-400">104K+ Reviews</p>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div className="text-center">
                <div className="text-sm font-semibold">✓ Best Price</div>
                <p className="text-xs text-gray-400">Guaranteed</p>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div className="text-center">
                <div className="text-sm font-semibold">🚚 Same Day</div>
                <p className="text-xs text-gray-400">Shipping</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500">
            <p className="flex items-center justify-center gap-1">
              © 2009-2026 BannerBuzz.com All rights reserved | Made with{" "}
              <Heart size={14} className="text-brand-orange" /> for your brand
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
