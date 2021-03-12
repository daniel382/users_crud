const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  token: {
    type: String,
    required: true,
    select: false
  }
})

const userModel = model('user', userSchema)
module.exports = userModel
