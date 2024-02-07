const { Router } = require('express');
const skillModel = require('../models/skillModel');
const educationsModel = require('../models/educationsModel');
const categoryModel = require('../models/categoryModel');
const slugify = require('../utils/slugify');
const { logger } = require('../config/logger');

const router = Router();



router.get('/', async  (req, res, next) => {

 Promise.all([
  skillModel.find().sort({createdAt: -1}).limit(10),
  educationsModel.find().sort({createdAt: -1}).limit(10),
  categoryModel.find().sort({createdAt: -1}).limit(10),
 ]).then(([skills, educations, categories]) => {
  res.json({ skills, educations, categories})
 }).catch(next)
})

router.get('/category/:query', async (req, res, next) => {
try {
  const results = await categoryModel.find({
    category: {
      $regex: new RegExp(`^${slugify(req.params.query)}`, 'i')
    }
  }, {category: 1})
  res.json(results)
} catch (error) {
  logger.error(error.message, error);
  next(error)
}
})

router.get('/skills/:query', async (req, res, next) => {
  try {
    const results = await skillModel.find({
      skill: {
        $regex: new RegExp(`^${slugify(req.params.query)}`, 'i')
      }
    }, {skill: 1})
    res.json(results)
  } catch (error) {
    logger.error(error.message, error);
    next(error)
  }
  })

  router.get('/educations/:query', async (req, res, next) => {
    try {
      const results = await educationsModel.find({
        education: {
          $regex: new RegExp(`^${slugify(req.params.query)}`, 'i')
        }
      }, {education: 1})
      res.json(results)
    } catch (error) {
      logger.error(error.message, error);
      next(error)
    }
    })

module.exports = router;