const jwt = require('jsonwebtoken');

module.exports.generateToken = async (user, res) => {

  try {

    const token = await jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' })
    res.cookie("Physio_Token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    })

  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }


}