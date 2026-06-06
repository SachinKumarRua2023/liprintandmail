/**
 * Authentication API - Handles user login/signup
 * Users are stored locally, synced to Odoo as contacts
 */

import axios from 'axios';
import crypto from 'crypto';

const ODOO_CONFIG = {
  url: process.env.ODOO_URL || 'https://country-cove-inc.odoo.com',
  database: process.env.ODOO_DATABASE || 'country-cove-inc',
  username: process.env.ODOO_USERNAME || 'admin',
  password: process.env.ODOO_PASSWORD || 'admin',
  apiKey: process.env.ODOO_API_KEY || '',
};

// In-memory user storage (replace with database in production)
const users = new Map<string, any>();
const sessions = new Map<string, any>();

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface LoginData {
  email: string;
  password: string;
}

/**
 * Hash password using SHA-256
 */
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Generate session token
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create Odoo contact for the user
 */
async function createOdooContact(userData: SignupData) {
  try {
    const response = await axios.post(
      `${ODOO_CONFIG.url}/api/res.partner`,
      {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone || '',
        street: userData.address || '',
        city: userData.city || '',
        state_id: userData.state || '',
        zip: userData.zip || '',
        is_company: false,
        customer_rank: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data?.data?.id || null;
  } catch (error) {
    console.error('Error creating Odoo contact:', error);
    return null;
  }
}

/**
 * User Signup
 */
export async function signup(userData: SignupData) {
  try {
    // Validate input
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return {
        success: false,
        error: 'Missing required fields'
      };
    }

    // Check if user already exists
    if (users.has(userData.email)) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }

    // Create Odoo contact first
    const odooContactId = await createOdooContact(userData);

    // Hash password
    const hashedPassword = hashPassword(userData.password);

    // Store user locally
    const userId = crypto.randomUUID();
    users.set(userData.email, {
      id: userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      state: userData.state || '',
      zip: userData.zip || '',
      odooContactId,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Account created successfully',
      user: {
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      }
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: 'Failed to create account'
    };
  }
}

/**
 * User Login
 */
export async function login(credentials: LoginData) {
  try {
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        error: 'Email and password required'
      };
    }

    // Find user
    const user = users.get(credentials.email);
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Check password
    const hashedPassword = hashPassword(credentials.password);
    if (user.password !== hashedPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Generate session token
    const token = generateToken();
    const sessionId = crypto.randomUUID();

    sessions.set(token, {
      sessionId,
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    });

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zip: user.zip,
        odooContactId: user.odooContactId,
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed'
    };
  }
}

/**
 * Verify session token
 */
export async function verifyToken(token: string) {
  try {
    const session = sessions.get(token);

    if (!session) {
      return {
        success: false,
        error: 'Invalid or expired token'
      };
    }

    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      sessions.delete(token);
      return {
        success: false,
        error: 'Token expired'
      };
    }

    // Find user
    const user = Array.from(users.values()).find(u => u.id === session.userId);

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zip: user.zip,
        odooContactId: user.odooContactId,
      }
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      success: false,
      error: 'Token verification failed'
    };
  }
}

/**
 * Logout
 */
export async function logout(token: string) {
  try {
    sessions.delete(token);
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Logout failed'
    };
  }
}

export default {
  signup,
  login,
  verifyToken,
  logout,
};
