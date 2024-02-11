const mongoose = require('mongoose');


const jobNotificationsSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  CompanyOrDept: {
    type: String,
    required: true,
  },
  description: {
    type: String,
     required: true,
  },
  location: {
    type:  String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  educations: {
    type: [String],
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  jobType: {
    type: String,
    enum: ['remoteJob', 'HybridJob',  'OnSiteJob'],
  },
  govtOrNot: {
    type: String,
    enum: ['govtJob', 'nonGovtJob'],
  },
  applicationLink: {
    type: String,
    required: true,
  },
  officialLink: String,
  websiteLink: String,
  minQualification: {
    type: String,
    enum: ['Graduation', 'High School', 'SSLC', 'Higher Secondary', 'Post Graduation'],
  }
}, {timestamps: true});


module.exports = mongoose.model('jobNotifications', jobNotificationsSchema);