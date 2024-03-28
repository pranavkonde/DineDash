const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = data.userId;
    req.email = data.email;
    req.fname = data.fname;
    req.lname = data.lname;
    req.userType = data.userType;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

module.exports = authorization;
