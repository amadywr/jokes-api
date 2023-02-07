const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  apikey: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
