import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Untuk logout, kita hanya perlu menghapus token dari client side
  // Backend tidak menyimpan state login, jadi cukup return success
  return res.status(200).json({ 
    success: true, 
    message: "Logout successful" 
  });
}
