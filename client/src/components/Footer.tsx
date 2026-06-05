import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-container">
          {/* Brand Section */}
          <div className="footer-section">
            <h3 className="footer-title">LiPrintandMail</h3>
            <p className="footer-subtitle">Premium Printing & Signage Solutions</p>
            <p className="footer-description">
              Your trusted partner for high-quality custom banners, signs, decals, flags, and more.
              Serving Long Island and beyond since 1998.
            </p>
          </div>

          {/* Products Section */}
          <div className="footer-section">
            <h4>Products</h4>
            <ul className="footer-links">
              <li><a href="#banners">Custom Banners</a></li>
              <li><a href="#signs">LED & Neon Signs</a></li>
              <li><a href="#decals">Vinyl Decals</a></li>
              <li><a href="#flags">Custom Flags</a></li>
              <li><a href="#displays">Trade Show Displays</a></li>
              <li><a href="#table-covers">Table Covers</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#press">Press Kit</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#returns">Return Policy</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Use</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h4>Get In Touch</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={18} />
                <div>
                  <p className="label">Phone</p>
                  <a href="tel:9173387086">917-338-7086</a>
                  <p className="hours">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <div>
                  <p className="label">Email</p>
                  <a href="mailto:sales@longislandconvenience.com">sales@longislandconvenience.com</a>
                </div>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <div>
                  <p className="label">Address</p>
                  <p>605 Old Country Road<br />Plainview, NY 11803</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <p>&copy; {currentYear} LiPrintandMail. All rights reserved | Made with ❤️ for your brand</p>
          </div>
          <div className="social-links">
            <a href="#facebook" title="Facebook" className="social-btn">
              <Facebook size={20} />
            </a>
            <a href="#twitter" title="Twitter" className="social-btn">
              <Twitter size={20} />
            </a>
            <a href="#instagram" title="Instagram" className="social-btn">
              <Instagram size={20} />
            </a>
            <a href="#linkedin" title="LinkedIn" className="social-btn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
