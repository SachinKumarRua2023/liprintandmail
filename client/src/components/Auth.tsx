import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import './Auth.css';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (email: string, password: string) => void;
}

export function Auth({ isOpen, onClose, onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login via Odoo API
        const response = await fetch('/api/odoo/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        const data = await response.json();
        onLogin?.(formData.email, formData.password);
        setFormData({ ...formData, email: '', password: '' });
        onClose();
      } else {
        // Signup via Odoo API
        const response = await fetch('/api/odoo/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            street: formData.address,
            city: formData.city,
            state_id: formData.state,
            zip: formData.zip
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create account');
        }

        setIsLogin(true);
        setFormData({ ...formData, password: '' });
        setError('Account created! Please login.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Form Container */}
        <div className="auth-container">
          {/* Header */}
          <div className="auth-header">
            <h2>{isLogin ? 'Login to LiPrintandMail' : 'Create Your Account'}</h2>
            <p>{isLogin ? 'Welcome back! Login to your account.' : 'Join us and start ordering today.'}</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`auth-message ${error.includes('created') ? 'success' : 'error'}`}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {isLogin ? (
              <>
                {/* Login Form */}
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-footer">
                  <label className="remember-me">
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <a href="#forgot" className="forgot-password">Forgot Password?</a>
                </div>
              </>
            ) : (
              <>
                {/* Signup Form */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <div className="input-wrapper">
                      <User size={18} />
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="input-wrapper">
                      <User size={18} />
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      id="signup-email"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input
                      id="signup-password"
                      type="password"
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <div className="input-wrapper">
                    <Phone size={18} />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="(917) 338-7086"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <div className="input-wrapper">
                    <MapPin size={18} />
                    <input
                      id="address"
                      type="text"
                      name="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zip">ZIP</label>
                    <input
                      id="zip"
                      type="text"
                      name="zip"
                      placeholder="11803"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <label className="agree">
                  <input type="checkbox" required />
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </>
            )}

            {/* Submit Button */}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Social Login */}
          <div className="auth-social">
            <button className="social-login google">
              <img src="/google-icon.svg" alt="Google" />
              Google
            </button>
            <button className="social-login facebook">
              <img src="/facebook-icon.svg" alt="Facebook" />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
