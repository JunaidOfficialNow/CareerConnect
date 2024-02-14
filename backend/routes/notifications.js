const {Router} = require('express');
const {logger} = require('../config/logger');
const JobNotificationModel = require('../models/notificationModel');
const slugify = require('../utils/slugify');
const createHttpError = require('http-errors');

const router = Router();

router.post('/', async (req, res, next) => {
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
    minQualification,
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
      minQualification,
    });
    logger.info('New job notification created ' + jobNotiDoc.jobTitle);
    res.json(jobNotiDoc);
  } catch (error) {
    logger.error(error.message, error);
    next(error);
  }
});

router.get('/all', async (req, res, next) => {
  try {
    const results = await JobNotificationModel.find();
    res.json(results);
  } catch (error) {
    logger.error(error.message, error);
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  let {page, limit, query, order} = req.query;
  let sortOrder = -1;
  if (order === 'asc') sortOrder = 1;
  if (!page) page = 1;
  if  (!limit) limit = 10;
  if (isNaN(page) || page < 1) {
    return next(
      createHttpError.BadRequest(
        'page must be a number and must be greater than zero.'
      )
    );
  }

  if (isNaN(limit) || limit < 10) {
    return next(
      createHttpError.BadRequest(
        'limit must be a number and atleast should be 10'
      )
    );
  }

  if (!query) query = '';

  try {
    const aggregationPipeline = [
      {
        $match: {
          $or: [
            {
              jobTitle: {$regex: new RegExp(`^${slugify(query)}`, 'i')}
            },
            {
              CompanyOrDept: { $regex: new RegExp(`^${slugify(query)}`, 'i')}
            },
            {
              location: { $regex: new RegExp(`^${slugify(query)}`, 'i')}
            },
            {
              category : { $regex: new RegExp(`^${slugify(query)}`, 'i')}
            },
          ],
        },
      },
      {
        $sort: {
          createdAt: sortOrder,
        },
      },
      {
        $group: {
          _id: null,
          jobNotifications: {$push: '$$ROOT'},
          count: {$sum: 1},
        },
      },
      {
        $project: {
          _id: 0,
          jobNotifications: {
            $slice: [
              '$jobNotifications',
              (page - 1) * (limit || 10),
              parseInt(limit || 10),
            ],
          },
          count: 1,
        },
      },
    ];

    const results = await JobNotificationModel.aggregate(aggregationPipeline);
    res.json(results[0] ? results[0] : {count: 0, jobNotifications: []});
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
});

router.delete('/:jobNotificationId', async (req, res, next) => {
  const {jobNotificationId} = req.params;
  try {
    const result = await JobNotificationModel.findByIdAndDelete(jobNotificationId);
    if (result) return res.status(204).end();
    throw new createHttpError.NotFound('entity not found');
  } catch (error) {
    logger.error(error.message, error);
    next(error);
  }
})

module.exports = router;