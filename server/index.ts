import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as productsApi from "./products-api";
import * as paymentApi from "./payment-api";
import * as authApi from "./auth-api";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ========================
  // AUTH API (User Login/Signup)
  // ========================

  // User Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const result = await authApi.signup(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Signup failed" });
    }
  });

  // User Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = await authApi.login(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Login failed" });
    }
  });

  // Verify Token
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ success: false, error: "No token provided" });
      }
      const result = await authApi.verifyToken(token);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Verification failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ success: false, error: "No token provided" });
      }
      const result = await authApi.logout(token);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Logout failed" });
    }
  });

  // ========================
  // PRODUCTS API (from Odoo)
  // ========================

  // Get all products from Odoo
  app.get("/api/products", async (_req, res) => {
    try {
      const limit = parseInt(_req.query.limit as string) || 100;
      const offset = parseInt(_req.query.offset as string) || 0;
      const result = await productsApi.getAllProducts(limit, offset);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const result = await productsApi.getProductById(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ success: false, error: "Product not found" });
    }
  });

  // Get products by category
  app.get("/api/categories/:categoryId/products", async (req, res) => {
    try {
      const result = await productsApi.getProductsByCategory(req.params.categoryId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const result = await productsApi.getCategories();
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch categories" });
    }
  });

  // ========================
  // PAYMENT API (to Odoo)
  // ========================

  // Create Stripe payment
  app.post("/api/payments/stripe", async (req, res) => {
    try {
      const result = await paymentApi.createStripePayment(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to create payment" });
    }
  });

  // Stripe webhook
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const result = await paymentApi.handleStripeWebhook(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Webhook processing failed" });
    }
  });

  // Create PayPal order
  app.post("/api/payments/paypal", async (req, res) => {
    try {
      const result = await paymentApi.createPayPalOrder(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to create PayPal order" });
    }
  });

  // Capture PayPal payment
  app.post("/api/payments/paypal/:orderId/capture", async (req, res) => {
    try {
      const result = await paymentApi.capturePayPalOrder(
        req.body.paypalOrderId,
        req.params.orderId
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to capture payment" });
    }
  });

  // Create order (for bank transfer and other payment methods)
  app.post("/api/orders/create", async (req, res) => {
    try {
      const result = await paymentApi.createOrder(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to create order" });
    }
  });

  // ========================
  // EXAMPLE ROUTES
  // ========================

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
