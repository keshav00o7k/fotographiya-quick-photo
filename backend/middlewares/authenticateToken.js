import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Token not found, access denied!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token is invalid!" });

    console.log("✅ Decoded JWT:", user); // ✅ Corrected
    req.user = {
      userId: user.userId,
      role: user.role,
    };
    next();
  });
};
