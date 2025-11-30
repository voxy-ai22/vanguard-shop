import jwt from "jsonwebtoken";
import { getPromos } from "../../utils/db.js";

export default function handler(req, res) {
  // Izinkan kedua method GET dan POST
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Untuk GET, token bisa dari query atau header
  // Untuk POST, token dari body
  let token;
  if (req.method === "GET") {
    token = req.query.token || req.headers.authorization?.replace("Bearer ", "");
  } else {
    token = req.body.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  // Verifikasi token admin
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  try {
    const promos = getPromos();
    
    // Tambahkan info days remaining untuk setiap promo
    const promosWithRemaining = promos.map(promo => {
      const now = new Date();
      const expiry = new Date(promo.expiresAt);
      const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      
      return {
        ...promo,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        isExpired: daysRemaining <= 0
      };
    });

    return res.status(200).json({
      success: true,
      promos: promosWithRemaining
    });
  } catch (error) {
    console.error("Error fetching promos:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
