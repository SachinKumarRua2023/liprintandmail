import React from 'react';
import { Phone, Mail, MapPin, Search, ShoppingCart, User, Menu } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  onAccountClick?: () => void;
}

export function Header({ cartCount = 0, onCartClick, onAccountClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="header-top">
        <div className="header-top-content">
          <div className="top-left">
            <div className="contact-item">
              <Phone size={16} />
              <a href="tel:9173387086" className="contact-link">📞 917-338-7086</a>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <a href="mailto:sales@longislandconvenience.com" className="contact-link">✉️ sales@longislandconvenience.com</a>
            </div>
          </div>
          <div className="top-right">
            <span>🚚 Free Shipping over $99</span>
            <span>✅ Premium Quality Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="header-container">
          {/* Logo & Brand */}
          <div className="header-left">
            <h1 className="site-name">LiPrintandMail</h1>
            <p className="site-tagline">Premium Printing & Signage</p>
          </div>

          {/* Search Bar */}
          <div className="header-center">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for banners, signs, flags..."
                className="search-input"
              />
              <button className="search-btn">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="header-right">
            <button className="header-btn account-btn" onClick={onAccountClick}>
              <User size={20} />
              <span>Account</span>
            </button>
            <button className="header-btn cart-btn" onClick={onCartClick}>
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cartCount && cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`navigation ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#banners" className="nav-link">Banners</a>
          <a href="#signs" className="nav-link">Signs</a>
          <a href="#decals" className="nav-link">Decals</a>
          <a href="#flags" className="nav-link">Flags</a>
          <a href="#displays" className="nav-link">Displays</a>
          <a href="#table-covers" className="nav-link">Table Covers</a>
          <a href="#stands" className="nav-link">Stands</a>
        </nav>
      </header>
    </>
  );
}

export default Header;
