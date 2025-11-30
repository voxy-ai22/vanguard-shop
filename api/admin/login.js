import jwt from "jsonwebtoken";

/**
 * API: Admin Login
 * POST /api/auth/login
 * 
 * Body:
 * {
 *   "username": "admin",
 *   "password": "secretpass"
 * }
 */
export default function handler(req, res) {
  // Validasi method
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
  }

  const { username, password } = req.body || {};

  // Validasi required fields
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Username dan password wajib diisi" 
    });
  }

  // Validasi format
  if (username.length < 3) {
    return res.status(400).json({ 
      success: false, 
      message: "Username minimal 3 karakter" 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: "Password minimal 6 karakter" 
    });
  }

  // Validasi credentials
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS || "vanguard2024";

  if (username !== adminUser || password !== adminPass) {
    // Log failed attempt (untuk security)
    console.warn(`[LOGIN FAILED] Username: ${username} at ${new Date().toISOString()}`);
    
    return res.status(401).json({ 
      success: false, 
      message: "Username atau password salah" 
    });
  }

  try {
    // Generate JWT token
    const token = jwt.sign(
      { 
        admin: true, 
        username,
        iat: Date.now()
      },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "1d" }
    );

    // Log successful login
    console.log(`[LOGIN SUCCESS] Username: ${username} at ${new Date().toISOString()}`);

    return res.status(200).json({ 
      success: true, 
      token,
      expiresIn: "1d",
      message: "Login berhasil" 
    });

  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan server" 
    });
  }
}
