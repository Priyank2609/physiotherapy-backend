const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Patient', 'Doctor']
  }
}, {
  timestamps: true
})


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next()

  this.password = await bcrypt.hash(this.password, 10)

})


userSchema.methods.passwordCheck = async function (password) {
  return await bcrypt.compare(password, this.password)

}

const UserModel = mongoose.model("UserModel", userSchema)

module.exports = UserModel