import { Link } from "react-router-dom";
import { Search, ShoppingCart, Phone, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    "Banners",
    "Stands & Displays",
    "Table Covers",
    "Custom Flags",
    "LED Signs",
    "Custom Signs",
    "Trade Show",
    "Marketing",
    "Accessories",
  ];

  return (
    <>
      {/* Top Promo Bar */}
      <div className="bg-brand-orange text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <span className="inline-block">
            📦 Free Super Saver Shipping over $99 | 🎉 Up to 25% OFF | Use Code:
            PROMO
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top Row */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-brand-orange flex-shrink-0"
            >
              BannerBuzz
            </Link>

            {/* Search Bar - Hidden on Mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <input
                type="text"
                placeholder="Search for banners, signs, flags..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <button className="bg-brand-orange text-white px-4 py-2 rounded-r-lg hover:bg-brand-orange-dark transition">
                <Search size={20} />
              </button>
            </div>

            {/* Right Actions */}
            <div className="hidden sm:flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm hover:text-brand-orange transition">
                <Phone size={18} />
                <span className="font-semibold">800-580-4489</span>
              </button>

              <button className="flex items-center gap-2 text-sm hover:text-brand-orange transition">
                <User size={18} />
                <span>Account</span>
              </button>

              <button className="relative flex items-center gap-2 text-sm hover:text-brand-orange transition">
                <ShoppingCart size={18} />
                <span>Cart</span>
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <button className="bg-brand-orange text-white px-3 py-2 rounded-lg">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden md:flex overflow-x-auto py-0">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-brand-orange hover:border-b-2 hover:border-brand-orange transition whitespace-nowrap"
                >
                  {category}
                </Link>
              ))}
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden py-4 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-orange rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
