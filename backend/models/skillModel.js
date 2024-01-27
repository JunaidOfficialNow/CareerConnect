const mongoose = require('mongoose');

const  SkillSchema = mongoose.Schema({
  _id: String
})

module.exports = mongoose.model('skills', SkillSchema);
