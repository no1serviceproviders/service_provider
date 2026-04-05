const jwt = require("jsonwebtoken")

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ msg: "Not authenticated" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ msg: "Invalid session" })
  }
}