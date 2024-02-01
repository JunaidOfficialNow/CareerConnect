const mongoose = require('mongoose');

const  SkillSchema = mongoose.Schema({
  skill: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true})

module.exports = mongoose.model('skills', SkillSchema);
