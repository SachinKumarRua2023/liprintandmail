import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            We couldn't find the page you're looking for. It might have moved or
            doesn't exist yet.
          </p>

          <div className="space-y-4">
            <p className="text-gray-600">
              Keep an eye on this space! We're constantly adding new products and
              features to BannerBuzz.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-8 py-3 bg-brand-orange text-white rounded-lg font-bold hover:bg-brand-orange-dark transition"
              >
                Back to Home
              </Link>
              <a
                href="tel:800-580-4489"
                className="px-8 py-3 border-2 border-brand-orange text-brand-orange rounded-lg font-bold hover:bg-brand-orange hover:text-white transition"
              >
                Call Us: 800-580-4489
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
