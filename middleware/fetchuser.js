const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_KEY;

const fetchuser = (req, res, next) => {
  const token = req.header('authtoken');
  if (!token) {
    return res.status(401).send({ error: "Please Authenticate Using a Valid Token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please Authenticate Using a Valid Token" });
  }
};

module.exports = fetchuser;
