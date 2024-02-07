const mongoose = require('mongoose');


const preferenceSchema = new mongoose.Schema({
  categoriesInterested:[{type: String, ref: 'categories'}],
  remoteJob: {
    type: Boolean,
    default: true,
  },
  OnSiteJob: {
    type: Boolean,
    default: true,
  },
  HybridJob: {
    type: Boolean,
    default: true,
  },
  govtJob: {
    type: Boolean,
    default: true,
  },
  nonGovtJob: {
    type: Boolean,
    default: true,
  }
}, {_id: false});


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
  }, 
  highestEducation: {
    enum: ['Graduation', 'High School', 'SSLC', 'Higher Secondary', 'Post Graduation']
  },
  course: {
    type: String,
    ref: 'educations'
  },
  skills : [{ type: String, ref: 'skills'}],
   jobPreferences: preferenceSchema,  
})

module.exports = mongoose.model('users', userSchema);