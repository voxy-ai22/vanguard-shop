import { validatePromo } from "../utils/db.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { token, code, username } = req.body || {};

  // Verifikasi token (opsional untuk validate promo, bisa dihapus jika ingin publik)
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }

  // Validasi kode promo
  if (!code) {
    return res.status(400).json({ success: false, message: "Missing promo code" });
  }

  try {
    const result = validatePromo(code, username);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      discount: result.discount,
      type: result.type,
      value: result.value,
      message: result.message
    });
  } catch (error) {
    console.error("Error validating promo:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}
