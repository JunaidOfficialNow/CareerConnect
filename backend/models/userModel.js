const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber : {
    type: String,
    required: true,
    maxLength: 10,
    minLength: 10,
  },
  age: {
    type: Number,
    required: true,
  }
})

module.exports = mongoose.model('users', userSchema);