const mongoose = require('mongoose');

const  EducationsSchema = mongoose.Schema({
  education: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true})

module.exports = mongoose.model('educations', EducationsSchema);
