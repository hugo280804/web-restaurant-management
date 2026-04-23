const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json("Không có token");

  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) return res.status(401).json("Token không hợp lệ");

    req.user = user;
    next();
  });
};

exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json("Không có quyền");
    }
    next();
  };
};