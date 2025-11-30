import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body || {};

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign(
      { admin: true, username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
}
