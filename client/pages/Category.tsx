import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, Star, Phone, Palette, Mail } from "lucide-react";

export default function Category() {
  const { category } = useParams();

  const categoryNames: { [key: string]: string } = {
    "banners": "Custom Banners",
    "stands-displays": "Stands & Displays",
    "table-covers": "Table Covers",
    "custom-flags": "Custom Flags",
    "led-signs": "LED Signs & Letters",
    "custom-signs": "Custom Signs & Decals",
    "trade-show": "Trade Show Displays",
    "marketing": "Marketing Materials",
    "accessories": "Accessories",
    "vinyl-banners": "Vinyl Banners",
    "step-repeat-displays": "Step & Repeat Displays",
    "canopy-tents": "Canopy Tents",
    "window-signs": "Window Signs",
  };

  const displayName = categoryNames[category || ""] || "Products";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-brand-purple text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-gray-300 mb-6">
              <a href="/" className="hover:text-white transition">
                Home
              </a>
              <ChevronRight size={18} />
              <span>{displayName}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayName}</h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Explore our premium selection of {displayName.toLowerCase()}.
              Browse through hundreds of customizable options perfect for your
              brand.
            </p>
          </div>
        </section>

        {/* Coming Soon Message */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-2xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-4">
                Detailed Product Listings Coming Soon
              </h2>

              <p className="text-lg text-gray-100 mb-8">
                We're building an amazing shopping experience for{" "}
                <strong>{displayName}</strong>. In the meantime, you can:
              </p>

              <ul className="text-left space-y-3 mb-8 inline-block">
                <li className="flex items-center gap-3">
                  <Star size={24} className="text-white flex-shrink-0" />
                  <span>Browse our featured products on the homepage</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={24} className="text-white flex-shrink-0" />
                  <span>
                    Call our team at <strong>917-338-7086</strong> for product
                    advice
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Palette size={24} className="text-white flex-shrink-0" />
                  <span>Start customizing with our design tool</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={24} className="text-white flex-shrink-0" />
                  <span>Email us for bulk quotes and business inquiries</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="px-8 py-3 bg-white text-brand-orange rounded-lg font-bold hover:bg-gray-100 transition inline-block"
                >
                  Back to Home
                </a>
                <a
                  href="tel:917-338-7086"
                  className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-brand-orange transition inline-block"
                >
                  Call Us Now
                </a>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-3xl mb-2">🚀</p>
                <h3 className="font-bold text-gray-900 mb-2">Quick Response</h3>
                <p className="text-sm text-gray-600">
                  Tell us what you're looking for and we'll help you find the
                  perfect product
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-3xl mb-2">💰</p>
                <h3 className="font-bold text-gray-900 mb-2">Best Prices</h3>
                <p className="text-sm text-gray-600">
                  Quality products at competitive prices with our price match
                  guarantee
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-3xl mb-2">⚡</p>
                <h3 className="font-bold text-gray-900 mb-2">Fast Shipping</h3>
                <p className="text-sm text-gray-600">
                  Same-day shipping available on most orders placed before 2 PM
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
