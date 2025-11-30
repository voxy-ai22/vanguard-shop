import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (!SECRET || !ADMIN_USER || !ADMIN_PASS) {
    return res.status(500).json({ success: false, message: "Server config invalid" });
  }

  const { username, password } = req.body || {};

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign(
      { admin: true, username },
      SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
}
