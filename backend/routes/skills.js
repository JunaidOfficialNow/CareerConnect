const {Router} = require('express');
const {createNewSkill} = require('../controller/skillsController');
const skillModel = require('../models/skillModel');
const createHttpError = require('http-errors');
const {logger} = require('../config/logger');
const router = Router();

router.post('/', createNewSkill);
router.get('/', async (req, res, next) => {
  const {page, limit} = req.query;
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
  try {
    const results = await skillModel
      .find()
      .sort({createdAt : -1})
      .limit(limit || 10)
      .skip((page - 1) * (limit || 10));
    res.json({skills: results});
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
});

router.get('/count', async (req, res, next) => {
  try {
    const count = await skillModel.countDocuments();
    res.json({count});
  } catch (error) {
    logger.error(error.message, error);
    next(error);
  }
});

router.delete('/:skillId', async (req, res, next) => {
  const { skillId } = req.params;
  try {
    const response = await skillModel.findByIdAndDelete(skillId);
    if (response) res.status(204).end();
    else throw new createHttpError.NotFound('Couldn\'t find the skill  with id ' + skillId);
  
  } catch (error) {
    logger.error(error.message, error);
    next(error);
  }
})

module.exports = router;
