const mongoose = require('mongoose');

const  CategoryModel = mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true})

module.exports = mongoose.model('categories', CategoryModel);
