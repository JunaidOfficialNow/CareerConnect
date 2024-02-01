const SkillsModel = require('../models/skillModel');
const createHttpError = require('http-errors');
const slugify = require('../utils/slugify');
const { logger } = require('../config/logger');

exports.createNewSkill = async function (req, res, next) {
  try {
    const { skill } = req.body;
   const skillDoc = await SkillsModel.create({ skill : slugify(skill)})
   logger.info('New skill added', {skill :skillDoc.skill})
    res.json({ skill: skillDoc.skill})
  } catch (err) {
    if (err.code === 11000) next(createHttpError.Conflict('The skill already exists'))
    else next(createHttpError.InternalServerError())
  }
}

exports.getSkills = async (req, res, next) => {
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
          skill: { $regex: new RegExp(`^${slugify(query)}`, 'i') }
        }
      },
      {
        $group: {
          _id: null,
          skills: { $push: '$$ROOT' },
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
          skills: { $slice: ['$skills', (page-1) * (limit || 10), parseInt(limit || 10)]},
          count: 1
        }
      }
    ];


    const results = await SkillsModel.aggregate(aggregationPipeline)
    res.json(results[0] ? results[0] : { count: 0 , skills: []});
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};


exports.deleteSkills = async (req, res, next) => {
  const { skillId } = req.params;
  try {
    const response = await SkillsModel.findByIdAndDelete(skillId);
    if (response) res.status(204).end();
    else throw new createHttpError.NotFound('Couldn\'t find the skill  with id ' + skillId);
  } catch (error) {
    logger.error(error.message, error);
    next(error);
  }
};

exports.getPaginatedSkills