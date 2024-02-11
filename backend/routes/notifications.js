const { Router } = require('express');
const { logger } = require('../config/logger');
const  JobNotificationModel = require('../models/notificationModel');

const router = Router();


router.post('/', async  (req, res, next) => {
  const {
    jobTitle,
    CompanyOrDept,
    description,
    location,
    category,
    educations,
    skills,
    deadline,
    jobType,
    govtOrNot,
    applicationLink,
    officialLink,
    websiteLink,
    minQualification
  } = req.body;

  try {

    const jobNotiDoc = await JobNotificationModel.create({
      jobTitle,
      CompanyOrDept,
      description,
      location,
      category,
      educations,
      skills,
      deadline,
      jobType,
      govtOrNot,
      applicationLink,
      officialLink,
      websiteLink,
      minQualification
    })
     logger.info('New job notification created '+ jobNotiDoc.jobTitle);
    res.json(jobNotiDoc);
  } catch (error) {
    logger.error(error.message, error);
    next(error)
    
  }
})

router.get('/', async (req, res, next) => {
  try {
    const results = await JobNotificationModel.find();
    res.json(results);
  } catch (error) {
    logger.error(error.message, error);
    next(error);
  }
})


module.exports =  router;