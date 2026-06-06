import React, { useState } from 'react';
import { X, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import './Checkout.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: any;
}

type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer';
type CheckoutStep = 'shipping' | 'billing' | 'payment' | 'confirm';

export function Checkout({ isOpen, onClose, items, user }: CheckoutProps) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');

  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || '',
  });

  const [billingData, setBillingData] = useState({
    sameAsShipping: true,
    ...shippingData,
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 99 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }

      const orderData = {
        customer: shippingData,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
        payment_method: paymentMethod,
      };

      // Create payment based on selected method
      let response;
      if (paymentMethod === 'stripe') {
        response = await fetch('/api/payments/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });
      } else if (paymentMethod === 'paypal') {
        response = await fetch('/api/payments/paypal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });
      } else {
        // Bank transfer - just create the order
        response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      setSuccess(true);
      setStep('confirm');

      // Clear cart
      localStorage.removeItem('cart');

      // Redirect after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="checkout-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className={`step ${['shipping', 'billing', 'payment', 'confirm'].indexOf(step) >= 0 ? 'active' : ''}`}>
            <span>1</span>
            <p>Shipping</p>
          </div>
          <div className={`step ${['billing', 'payment', 'confirm'].indexOf(step) >= 0 ? 'active' : ''}`}>
            <span>2</span>
            <p>Billing</p>
          </div>
          <div className={`step ${['payment', 'confirm'].indexOf(step) >= 0 ? 'active' : ''}`}>
            <span>3</span>
            <p>Payment</p>
          </div>
          <div className={`step ${step === 'confirm' ? 'active' : ''}`}>
            <span>4</span>
            <p>Confirm</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <CheckCircle size={32} />
            <h3>Order Placed Successfully!</h3>
            <p>Your order has been created and payment processed.</p>
            <p className="closing-msg">Closing in 3 seconds...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {!success && (
          <>
            <div className="checkout-content">
              {/* Shipping Form */}
              {(step === 'shipping' || step === 'billing' || step === 'payment') && (
                <form className={step === 'shipping' ? '' : 'hidden'}>
                  <h3>Shipping Address</h3>
                  <div className="form-row">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={shippingData.firstName}
                      onChange={handleShippingChange}
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={shippingData.lastName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={shippingData.email}
                    onChange={handleShippingChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={shippingData.phone}
                    onChange={handleShippingChange}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    required
                  />
                  <div className="form-row">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={shippingData.state}
                      onChange={handleShippingChange}
                      required
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP"
                      value={shippingData.zip}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </form>
              )}

              {/* Billing Form */}
              {step === 'billing' && (
                <form>
                  <h3>Billing Address</h3>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={billingData.sameAsShipping}
                      onChange={(e) => {
                        setBillingData(prev => ({
                          ...prev,
                          sameAsShipping: e.target.checked,
                        }));
                      }}
                    />
                    Same as shipping address
                  </label>
                  {!billingData.sameAsShipping && (
                    <>
                      <div className="form-row">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={billingData.firstName}
                          onChange={handleBillingChange}
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={billingData.lastName}
                          onChange={handleBillingChange}
                        />
                      </div>
                      <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        value={billingData.address}
                        onChange={handleBillingChange}
                      />
                      <div className="form-row">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={billingData.city}
                          onChange={handleBillingChange}
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={billingData.state}
                          onChange={handleBillingChange}
                        />
                        <input
                          type="text"
                          name="zip"
                          placeholder="ZIP"
                          value={billingData.zip}
                          onChange={handleBillingChange}
                        />
                      </div>
                    </>
                  )}
                </form>
              )}

              {/* Payment Method */}
              {step === 'payment' && (
                <div className="payment-methods">
                  <h3>Payment Method</h3>
                  <div className="method-option">
                    <input
                      type="radio"
                      id="stripe"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    />
                    <label htmlFor="stripe">
                      <CreditCard size={20} />
                      <span>Credit Card (Stripe)</span>
                    </label>
                  </div>
                  <div className="method-option">
                    <input
                      type="radio"
                      id="paypal"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    />
                    <label htmlFor="paypal">
                      <span>PayPal</span>
                    </label>
                  </div>
                  <div className="method-option">
                    <input
                      type="radio"
                      id="bank"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    />
                    <label htmlFor="bank">
                      <span>Bank Transfer</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="checkout-summary">
                <h3>Order Summary</h3>
                {items.map(item => (
                  <div key={item.id} className="summary-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="summary-divider"></div>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="checkout-actions">
              {step !== 'shipping' && (
                <button
                  className="back-btn"
                  onClick={() => {
                    if (step === 'billing') setStep('shipping');
                    else if (step === 'payment') setStep('billing');
                  }}
                  disabled={loading}
                >
                  Back
                </button>
              )}

              <button
                className="next-btn"
                onClick={() => {
                  if (step === 'shipping') setStep('billing');
                  else if (step === 'billing') setStep('payment');
                  else if (step === 'payment') handleCheckout();
                }}
                disabled={loading}
              >
                {step === 'payment' ? (loading ? 'Processing...' : 'Place Order') : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
