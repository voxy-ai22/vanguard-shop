import jwt from "jsonwebtoken";
import { getPromos } from "../../utils/db.js";

const SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  if (!SECRET) {
    return res.status(500).json({
      success: false,
      message: "Server config invalid"
    });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  // Verifikasi token admin
  try {
    jwt.verify(token, SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Ambil semua promo dari database
  const promos = getPromos();

  return res.status(200).json({
    success: true,
    promos
  });
}
