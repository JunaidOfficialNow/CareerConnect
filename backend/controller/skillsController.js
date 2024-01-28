const SkillsModel = require('../models/skillModel');
const createHttpError = require('http-errors');
const slugify = require('../utils/slugify');
const { logger } = require('../config/logger');

exports.createNewSkill = async function (req, res, next) {
  try {
    const { skill } = req.body;
   const skillDoc = await SkillsModel.create({ _id: slugify(skill)})
   logger.info('New skill added', {skill})
    res.json({ skill: skillDoc._id})
  } catch (err) {
    if (err.code === 11000) next(createHttpError.Conflict('The skill already exists'))
    else next(createHttpError.InternalServerError())
  }
}

exports.getPaginatedSkills