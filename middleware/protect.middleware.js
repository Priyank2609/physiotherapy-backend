const jwt = require("jsonwebtoken");

module.exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.Physio_Token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};
