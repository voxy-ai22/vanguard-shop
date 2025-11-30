import jwt from "jsonwebtoken";
import { validatePromo } from "../utils/db.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { token, code } = req.body || {};

  // Verifikasi token (sama seperti endpoint lainnya)
  if (!token) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  // Validasi kode promo
  if (!code) {
    return res.status(400).json({ success: false, message: "Missing promo code" });
  }

  const result = validatePromo(code);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json({
    success: true,
    discount: result.discount,
    message: "Promo valid and applied!"
  });
}
