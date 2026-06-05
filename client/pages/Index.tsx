import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RealCardShowcase from "@/components/RealCardShowcase";
import RealBasketShowcase from "@/components/RealBasketShowcase";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ChevronRight, Star, TrendingUp, Zap, Award } from "lucide-react";
import "@/styles/real-card-showcase.css";
import "@/styles/real-basket-showcase.css";

interface Product {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  startingPrice: string;
  image: string;
  badge?: string;
}

const heroProducts: Product[] = [
  {
    id: "1",
    name: "Vinyl Decals",
    rating: 4.2,
    reviews: 693,
    startingPrice: "$6.00",
    image: "/assets/images/a101_bbclc01_1_us.jpg",
    badge: "Popular",
  },
  {
    id: "2",
    name: "Indoor Banners",
    rating: 4.6,
    reviews: 330,
    startingPrice: "$6.99",
    image: "/assets/images/a101_bbcm01_1_us.jpg",
  },
  {
    id: "3",
    name: "Custom LED Neon Signs",
    rating: 4.8,
    reviews: 302,
    startingPrice: "$249.00",
    image: "/assets/images/a101_bbdh01_1_us.jpg",
    badge: "Trending",
  },
  {
    id: "4",
    name: "Banner Stands",
    rating: 4.4,
    reviews: 470,
    startingPrice: "$29.99",
    image: "/assets/images/a101_bbevt01_1_us.jpg",
  },
  {
    id: "5",
    name: "Table Covers",
    rating: 4.5,
    reviews: 285,
    startingPrice: "$19.99",
    image: "/assets/images/a101_bbly01_1_us.jpg",
  },
];

const featuredProducts: Product[] = [
  {
    id: "6",
    name: "Custom Vinyl Banners",
    rating: 4.4,
    reviews: 4797,
    startingPrice: "$6.99",
    image: "/assets/images/a101_bbnp01_1_us.jpg",
  },
  {
    id: "7",
    name: "Outdoor Banners",
    rating: 4.5,
    reviews: 1688,
    startingPrice: "$6.99",
    image: "/assets/images/a101_bbosc01_1_us.jpg",
  },
  {
    id: "8",
    name: "Pole Banners",
    rating: 4.2,
    reviews: 165,
    startingPrice: "$6.99",
    image: "/assets/images/a101_bbpklb01_1_us.jpg",
  },
  {
    id: "9",
    name: "Step and Repeat Banners",
    rating: 4.4,
    reviews: 862,
    startingPrice: "$6.99",
    image: "/assets/images/a101_bbpst01_1_us.jpg",
  },
  {
    id: "10",
    name: "Canvas Banners",
    rating: 4.3,
    reviews: 456,
    startingPrice: "$15.99",
    image: "/assets/images/a101_bbrc01_1_us.jpg",
  },
];

const bestSellerCategories = [
  { name: "Custom Flags", image: "/assets/images/a101_bbly01_1_us.jpg" },
  { name: "Vinyl Banners", image: "/assets/images/a101_bbclc01_1_us.jpg" },
  { name: "Step & Repeat Displays", image: "/assets/images/a101_bbpklb01_1_us.jpg" },
  { name: "Canopy Tents", image: "/assets/images/a101_bbosc01_1_us.jpg" },
  { name: "Window Signs", image: "/assets/images/a101_bbdh01_1_us.jpg" },
  { name: "Table Covers", image: "/assets/images/a101_bbtc01_1_us.jpg" },
];

const blogPosts = [
  {
    id: "1",
    date: "June 1, 2026",
    title: "5 Essential Tips for Outdoor Event Signage",
    excerpt:
      "Learn how to choose the perfect signage for your outdoor events to maximize visibility and impact.",
    image: "/assets/images/a101_bbsbc01_1_us.jpg",
  },
  {
    id: "2",
    date: "May 28, 2026",
    title: "Trade Show Display Ideas for Maximum Engagement",
    excerpt:
      "Discover innovative ways to make your booth stand out and attract more visitors.",
    image: "/assets/images/a101_bbsks01_1_us.jpg",
  },
  {
    id: "3",
    date: "May 21, 2026",
    title: "Custom Banners: The Perfect Marketing Tool",
    excerpt:
      "Understand why custom banners are essential for your brand awareness strategy.",
    image: "/assets/images/a101_bbspc01_1_us.jpg",
  },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState("Banners");
  const siteConfig = useSiteConfig();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-xs text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Carousel Section */}
        <section className="bg-gradient-to-br from-gray-900 to-brand-purple text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Custom Banners & Signs
              <br />
              for Your Brand
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Create stunning promotional displays with our premium custom
              signage. Fast shipping, competitive prices, and expert design
              support included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-brand-orange text-white rounded-lg font-bold text-lg hover:bg-brand-orange-dark transition transform hover:scale-105">
                Start Designing
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition">
                View Catalog
              </button>
            </div>
          </div>
        </section>

        {/* Trust & Benefits Section */}
        <section className="bg-gray-50 py-12 px-4 border-b border-gray-200">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="flex justify-center mb-2">
                <Award size={32} className="text-brand-orange" />
              </div>
              <p className="font-semibold text-gray-900">Premium Quality</p>
              <p className="text-sm text-gray-600">100% satisfaction</p>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-2">
                <Zap size={32} className="text-brand-orange" />
              </div>
              <p className="font-semibold text-gray-900">Same Day Shipping</p>
              <p className="text-sm text-gray-600">Available on all orders</p>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-2">
                <TrendingUp size={32} className="text-brand-orange" />
              </div>
              <p className="font-semibold text-gray-900">Best Price Guarantee</p>
              <p className="text-sm text-gray-600">Price match promise</p>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-2">
                <Star size={32} className="text-brand-orange" />
              </div>
              <p className="font-semibold text-gray-900">4.5★ Rating</p>
              <p className="text-sm text-gray-600">104K+ Reviews</p>
            </div>
          </div>
        </section>

        {/* Most Loved Brand Builders */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Most Loved Brand Builders
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {heroProducts.map((product) => (
                <div
                  key={product.id}
                  className="group hover:shadow-lg transition rounded-xl overflow-hidden bg-white border border-gray-200"
                >
                  {product.badge && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => {e.currentTarget.src = '/assets/images/a101_bbclc01_1_us.jpg'}} />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2">
                      {product.name}
                    </h3>

                    <div className="mb-3">{renderStars(product.rating)}</div>

                    <p className="text-lg font-bold text-brand-orange mb-4">
                      {product.startingPrice}
                    </p>

                    <button className="w-full bg-brand-orange text-white py-2 rounded-lg font-semibold hover:bg-brand-orange-dark transition text-sm">
                      Customize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Selector Section */}
        <section className="bg-gradient-to-r from-brand-orange to-brand-orange-dark py-16 px-4 text-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              Customize Your Signs & Displays
              <br />
              to Unlock Unlimited Opportunities
            </h2>

            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-3 rounded-lg text-gray-900 font-semibold"
              >
                <option>Banners</option>
                <option>Stands & Displays</option>
                <option>Custom Flags</option>
                <option>LED Signs</option>
                <option>Table Covers</option>
              </select>
              <select className="px-6 py-3 rounded-lg text-gray-900 font-semibold">
                <option>All Subcategories</option>
                <option>Vinyl Banners</option>
                <option>Fabric Banners</option>
                <option>Mesh Banners</option>
              </select>
            </div>

            <div className="flex justify-center">
              <button className="px-8 py-3 bg-white text-brand-orange font-bold rounded-lg hover:bg-gray-100 transition inline-flex items-center gap-2">
                View All Products
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Featured Products
              </h2>
              <Link
                to="/"
                className="text-brand-orange font-semibold hover:opacity-70 flex items-center gap-2"
              >
                View All <ChevronRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group hover:shadow-lg transition rounded-xl overflow-hidden bg-white border border-gray-200"
                >
                  <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden group-hover:scale-110 transition">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => {e.currentTarget.src = '/assets/images/a101_bbnp01_1_us.jpg'}} />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2">
                      {product.name}
                    </h3>

                    <div className="mb-3">{renderStars(product.rating)}</div>

                    <p className="text-lg font-bold text-brand-orange mb-4">
                      {product.startingPrice}
                    </p>

                    <button className="w-full bg-brand-orange text-white py-2 rounded-lg font-semibold hover:bg-brand-orange-dark transition text-sm">
                      Customize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Showcase - Real Product Images */}
        {siteConfig.showCardShowcase && <RealCardShowcase />}
        {siteConfig.showBasketShowcase && <RealBasketShowcase />}

        {/* Promotional Banner */}
        <section className="bg-brand-purple text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Refer & Save 30%</h2>
            <p className="text-lg mb-6">
              Share the love with friends and earn rewards
            </p>
            <button className="px-8 py-3 bg-brand-orange text-white font-bold rounded-lg hover:bg-brand-orange-dark transition">
              Start Referring
            </button>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Latest Insights & Tips
              </h2>
              <Link
                to="/"
                className="text-brand-orange font-semibold hover:opacity-70 flex items-center gap-2"
              >
                View Blog <ChevronRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden group-hover:scale-110 transition">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" onError={(e) => {e.currentTarget.src = '/assets/images/a101_bbsbc01_1_us.jpg'}} />
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-brand-orange font-semibold mb-2">
                      {post.date}
                    </p>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-brand-orange transition">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>

                    <a
                      href="#"
                      className="text-brand-orange font-semibold hover:opacity-70 inline-flex items-center gap-2"
                    >
                      Read More <ChevronRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Premium Custom Signage Solutions for Every Brand
            </h2>

            <div className="space-y-4 text-gray-700 text-left">
              <p>
                LiPrintandMail is your one-stop shop for premium custom banners,
                signs, and displays. Whether you need vinyl banners for outdoor
                events, custom flags for your business, LED signs for
                storefronts, or trade show displays to impress clients, we have
                the perfect solution.
              </p>

              <p>
                With over 104,000 5-star reviews, our customers trust us to
                deliver quality products on time. Our expert design team is
                available 24/7 to help you create the perfect marketing
                materials for your brand.
              </p>

              <p>
                From custom banners starting at just $6.99 to premium LED
                digital displays, we offer competitive pricing without
                compromising on quality. Get free design templates, upload your
                own artwork, or let our designers create something custom for
                you.
              </p>

              <div className="mt-8 pt-8 border-t border-gray-300">
                <h3 className="text-xl font-bold mb-4">Why Choose LiPrintandMail?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Premium quality materials and printing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Same-day shipping on orders placed before 2 PM</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Best price guarantee - we match any competitor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Free design templates and professional design help</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>24/7 customer support via phone, email, and chat</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
