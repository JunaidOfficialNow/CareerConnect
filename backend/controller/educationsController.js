const EducationsModel = require('../models/skillModel');
const createHttpError = require('http-errors');
const slugify = require('../utils/slugify');
const { logger } = require('../config/logger');

exports.createNewEducation = async function (req, res, next) {
  try {
    const { education } = req.body;
   const educationDoc = await EducationsModel.create({ education : slugify(education)})
   logger.info('New Education Added', {education :educationDoc.education})
    res.json({ education: educationDoc.education})
  } catch (err) {
    if (err.code === 11000) next(createHttpError.Conflict('The skill already exists'))
    else next(err)
  }
}

exports.getEducations = async (req, res, next) => {
  let {page, limit, query} = req.query;
  if ((isNaN(page) && page !== undefined) || page < 1) {
    return next(
      createHttpError.BadRequest(
        'page must be a number and must be greater than zero.'
      )
    );
  }

  if ((isNaN(limit) && limit !== undefined) || limit < 10) {
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
          education: { $regex: new RegExp(`^${slugify(query)}`, 'i') }
        }
      },
      {
        $group: {
          _id: null,
          educations: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $project: {
          _id: 0,
          educations: { $slice: ['$educations', (page-1) * (limit || 10), parseInt(limit || 10)]},
          count: 1
        }
      }
    ];


    const results = await EducationsModel.aggregate(aggregationPipeline)
    res.json(results[0] ? results[0] : { count: 0 , educations: []});
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};


exports.deleteEducation = async (req, res, next) => {
  const { educationId } = req.params;
  try {
    const response = await EducationsModel.findByIdAndDelete(educationId);
    if (response) res.status(204).end();
    else throw new createHttpError.NotFound('Couldn\'t find the education  with id ' + educationId);
  } catch (error) {
    logger.error(error.message, error);
    next(error);
  }
};
