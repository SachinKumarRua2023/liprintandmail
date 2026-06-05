import { Link } from "react-router-dom";
import { Search, ShoppingCart, Phone, User, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface CategoryDropdown {
  name: string;
  subcategories: string[];
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const categories: CategoryDropdown[] = [
    {
      name: "Banners",
      subcategories: [
        "Vinyl Banners",
        "Fabric Banners",
        "Mesh Banners",
        "Pole Banners",
        "Step & Repeat",
        "Canvas Banners",
        "Indoor Banners",
        "Outdoor Banners",
      ],
    },
    {
      name: "Stands & Displays",
      subcategories: [
        "Banner Stands",
        "A-Frame Stands",
        "Pop-up Displays",
        "Roll-up Banners",
        "Easels",
        "Display Boards",
        "Tripod Stands",
        "Retractable Banners",
      ],
    },
    {
      name: "Table Covers",
      subcategories: [
        "Stretch Table Covers",
        "Fitted Covers",
        "Non-Fitted Covers",
        "Table Runners",
        "Custom Printed Covers",
        "Trade Show Covers",
      ],
    },
    {
      name: "Custom Flags",
      subcategories: [
        "Rectangle Flags",
        "Feather Flags",
        "Teardrop Flags",
        "Car Flags",
        "Beach Flags",
        "Custom Flags",
      ],
    },
    {
      name: "LED Signs",
      subcategories: [
        "LED Neon Signs",
        "Custom LED Signs",
        "Digital Display Boards",
        "LED Light Boxes",
        "Programmable Signs",
      ],
    },
    {
      name: "Custom Signs",
      subcategories: [
        "Vinyl Decals",
        "Window Signs",
        "Door Signs",
        "Corrugated Signs",
        "A-Frame Signs",
        "Wall Signs",
      ],
    },
    {
      name: "Trade Show",
      subcategories: [
        "Trade Show Displays",
        "Booth Kits",
        "Canopy Tents",
        "Promotional Counters",
        "Display Backdrops",
        "Shelf Talkers",
      ],
    },
    {
      name: "Marketing",
      subcategories: [
        "Flyers",
        "Postcards",
        "Business Cards",
        "Promotional Items",
        "Stickers",
        "Labels",
      ],
    },
    {
      name: "Accessories",
      subcategories: [
        "Hardware",
        "Installation Tools",
        "Display Stands",
        "Clips & Grommets",
        "Carries Cases",
      ],
    },
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
            <div className="hidden md:flex">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(category.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-brand-orange transition whitespace-nowrap flex items-center gap-1 group-hover:border-b-2 group-hover:border-brand-orange">
                    {category.name}
                    <ChevronDown size={16} className="opacity-50" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-200 shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        {category.name}
                      </h3>
                      <ul className="space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <li key={subcategory}>
                            <Link
                              to={`/category/${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                              className="block text-sm text-gray-700 hover:text-brand-orange hover:font-semibold transition py-1"
                            >
                              {subcategory}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
                      <Link
                        to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm font-semibold text-brand-orange hover:opacity-70 transition inline-flex items-center gap-1"
                      >
                        View All {category.name} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden py-4 space-y-4">
                {categories.map((category) => (
                  <div key={category.name}>
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === category.name ? null : category.name
                        )
                      }
                      className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-orange rounded transition flex items-center justify-between"
                    >
                      {category.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          activeDropdown === category.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile Dropdown */}
                    {activeDropdown === category.name && (
                      <div className="pl-4 space-y-2 mt-2">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory}
                            to={`/category/${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                            className="block text-sm text-gray-600 hover:text-brand-orange py-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subcategory}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
