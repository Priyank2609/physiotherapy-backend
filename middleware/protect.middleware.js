const jwt = require('jsonwebtoken');

module.exports.protect = async (req, res, next) => {
  try {
    let token
    token = req.cookies.Physio_Token
    if (!token) {
      return res.status(403).json({ message: "No Token provided or Invalid Token" })
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()


  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message })
  }
}