import { RequestHandler } from "express";
import crypto from "crypto";

// Simple token generation (for development - use JWT in production)
function generateToken(userId: string, role: string): string {
  const payload = JSON.stringify({ userId, role, exp: Date.now() + 900000 }); // 15 min
  return Buffer.from(payload).toString('base64url');
}

function generateRefreshToken(userId: string, role: string): string {
  const payload = JSON.stringify({ userId, role, exp: Date.now() + 604800000 }); // 7 days
  return Buffer.from(payload).toString('base64url');
}

// Mock user database (in production, use a real database)
const users = new Map<string, {
  id: string;
  email: string;
  username: string;
  password: string; // In production, this should be hashed
  first_name: string;
  last_name: string;
  role: string;
}>();

// Add a default admin user for testing
users.set("admin@example.com", {
  id: "admin-1",
  email: "admin@example.com",
  username: "admin",
  password: "password", // In production, hash this!
  first_name: "Admin",
  last_name: "User",
  role: "admin"
});

// Login handler
export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    let user = users.get(email);

    // Auto-create user if not exists (for demo purposes)
    if (!user) {
      const username = email.split("@")[0];
      user = {
        id: `user-${Date.now()}`,
        email,
        username,
        password, // In production, hash this!
        first_name: req.body.first_name || username,
        last_name: req.body.last_name || "",
        role: role || "buyer"
      };
      users.set(email, user);
      console.log(`✓ Created new user: ${email} with role: ${user.role}`);
    }

    // Verify password (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const access = generateToken(user.id, user.role);
    const refresh = generateRefreshToken(user.id, user.role);

    console.log(`✓ User logged in: ${email} (${user.role})`);

    return res.json({
      access,
      refresh,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Register handler
export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const username = email.split("@")[0];
    const user = {
      id: `user-${Date.now()}`,
      email,
      username,
      password, // In production, hash this!
      first_name: first_name || username,
      last_name: last_name || "",
      role: role || "buyer"
    };

    users.set(email, user);
    console.log(`✓ Registered new user: ${email} with role: ${user.role}`);

    // Generate tokens
    const access = generateToken(user.id, user.role);
    const refresh = generateRefreshToken(user.id, user.role);

    return res.json({
      access,
      refresh,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Token refresh handler
export const handleRefreshToken: RequestHandler = (req, res) => {
  try {
    const { refresh } = req.body;

    if (!refresh) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    // Decode refresh token
    const payload = JSON.parse(Buffer.from(refresh, 'base64url').toString());

    // Check expiration
    if (payload.exp < Date.now()) {
      return res.status(401).json({ error: "Refresh token expired" });
    }

    // Generate new access token
    const access = generateToken(payload.userId, payload.role);

    return res.json({ access });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};
