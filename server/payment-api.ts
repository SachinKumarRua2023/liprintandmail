/**
 * Payment Processing API - Handles payments and creates orders in Odoo
 * All payments are recorded in Odoo Sales Orders
 */

import axios from 'axios';

const ODOO_CONFIG = {
  url: process.env.ODOO_URL || 'https://country-cove-inc.odoo.com',
  database: process.env.ODOO_DATABASE || 'country-cove-inc',
  username: process.env.ODOO_USERNAME || 'admin',
  password: process.env.ODOO_PASSWORD || 'admin',
  apiKey: process.env.ODOO_API_KEY || '',
};

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface OrderData {
  customer: CustomerInfo;
  items: OrderItem[];
  total: number;
  payment_method: 'stripe' | 'paypal' | 'bank_transfer';
}

/**
 * Create Stripe payment intent and save order in Odoo
 */
export async function createStripePayment(orderData: OrderData) {
  try {
    // Step 1: Create customer in Odoo (if new)
    const customerId = await createOdooCustomer(orderData.customer);

    // Step 2: Create sales order in Odoo
    const saleOrder = await createOdooSalesOrder(customerId, orderData);

    // Step 3: Create Stripe payment intent
    const StripeModule = require('stripe');
    const stripe = new StripeModule(STRIPE_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderData.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: saleOrder.id,
        customerEmail: orderData.customer.email,
      },
      description: `Order #${saleOrder.id} - ${orderData.customer.name}`,
    });

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      orderId: saleOrder.id,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Error creating Stripe payment:', error);
    return {
      success: false,
      error: 'Failed to create payment',
    };
  }
}

/**
 * Process Stripe payment webhook
 */
export async function handleStripeWebhook(event: any) {
  try {
    const stripe = require('stripe')(STRIPE_KEY);
    const paymentIntent = event.data.object;

    if (event.type === 'payment_intent.succeeded') {
      // Payment successful - update Odoo order status
      const orderId = paymentIntent.metadata.orderId;
      await updateOdooOrderPaymentStatus(orderId, 'paid');

      return { success: true };
    }

    if (event.type === 'payment_intent.payment_failed') {
      // Payment failed - update Odoo order status
      const orderId = paymentIntent.metadata.orderId;
      await updateOdooOrderPaymentStatus(orderId, 'failed');

      return { success: false, error: 'Payment failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    return { success: false, error: 'Webhook processing failed' };
  }
}

/**
 * Create PayPal order
 */
export async function createPayPalOrder(orderData: OrderData) {
  try {
    // Create customer in Odoo
    const customerId = await createOdooCustomer(orderData.customer);

    // Create sales order in Odoo
    const saleOrder = await createOdooSalesOrder(customerId, orderData);

    // Create PayPal order
    const paypalOrder = await createPayPalOrderRequest(orderData, saleOrder.id);

    return {
      success: true,
      orderId: saleOrder.id,
      paypalOrderId: paypalOrder.id,
      approvalLink: paypalOrder.links.find((l: any) => l.rel === 'approve')?.href,
    };
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return {
      success: false,
      error: 'Failed to create PayPal order',
    };
  }
}

/**
 * Capture PayPal order payment
 */
export async function capturePayPalOrder(paypalOrderId: string, odooOrderId: string | number) {
  try {
    // Call PayPal API to capture order
    const response = await axios.post(
      `https://api.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${await getPayPalAccessToken()}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data.status === 'COMPLETED') {
      // Update Odoo order to paid
      await updateOdooOrderPaymentStatus(Number(odooOrderId), 'paid');

      return {
        success: true,
        orderId: odooOrderId,
        transactionId: response.data.id,
      };
    }

    return {
      success: false,
      error: 'Payment not completed',
    };
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return {
      success: false,
      error: 'Failed to capture PayPal payment',
    };
  }
}

/**
 * Create customer in Odoo
 */
async function createOdooCustomer(customerInfo: CustomerInfo) {
  try {
    const response = await axios.post(
      `${ODOO_CONFIG.url}/api/res.partner`,
      {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        street: customerInfo.address,
        city: customerInfo.city,
        state_id: customerInfo.state,
        zip: customerInfo.zip,
        is_company: false,
      },
      {
        headers: {
          Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.data.id;
  } catch (error) {
    console.error('Error creating Odoo customer:', error);
    throw error;
  }
}

/**
 * Create sales order in Odoo
 */
async function createOdooSalesOrder(customerId: number, orderData: OrderData) {
  try {
    // Format order lines
    const orderLines = orderData.items.map(item => ({
      product_id: item.product_id,
      product_qty: item.quantity,
      price_unit: item.price,
    }));

    const response = await axios.post(
      `${ODOO_CONFIG.url}/api/sale.order`,
      {
        partner_id: customerId,
        order_line: orderLines,
        amount_total: orderData.total,
        payment_method: orderData.payment_method,
        state: 'draft',
      },
      {
        headers: {
          Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error creating Odoo sales order:', error);
    throw error;
  }
}

/**
 * Update order payment status in Odoo
 */
async function updateOdooOrderPaymentStatus(orderId: number, status: 'paid' | 'failed' | 'pending') {
  try {
    const stateMap = {
      paid: 'sale',
      failed: 'cancel',
      pending: 'draft',
    };

    await axios.patch(
      `${ODOO_CONFIG.url}/api/sale.order/${orderId}`,
      {
        state: stateMap[status],
        payment_status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating Odoo order status:', error);
    throw error;
  }
}

/**
 * Helper: Create PayPal order request
 */
async function createPayPalOrderRequest(orderData: OrderData, odooOrderId: number) {
  const response = await axios.post(
    'https://api.paypal.com/v2/checkout/orders',
    {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `ODOO_${odooOrderId}`,
          amount: {
            currency_code: 'USD',
            value: orderData.total.toString(),
          },
        }
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${await getPayPalAccessToken()}`,
        'Content-Type': 'application/json',
      }
    }
  );

  return response.data;
}

/**
 * Helper: Get PayPal access token
 */
async function getPayPalAccessToken() {
  const response = await axios.post(
    'https://api.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET || '',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  );

  return response.data.access_token;
}

export default {
  createStripePayment,
  handleStripeWebhook,
  createPayPalOrder,
  capturePayPalOrder,
};
