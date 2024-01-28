const mongoose = require('mongoose');

const  SkillSchema = mongoose.Schema({
  _id: String
}, { timestamps: true})

module.exports = mongoose.model('skills', SkillSchema);
