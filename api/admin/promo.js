import jwt from "jsonwebtoken";
import { getPromos } from "../../utils/db.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { token } = req.body || {};

  // Verifikasi token admin
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  return res.status(200).json({
    success: true,
    promos: getPromos()
  });
}