const CategoryModel = require('../models/categoryModel');
const createHttpError = require('http-errors');
const slugify = require('../utils/slugify');
const { logger } = require('../config/logger');

exports.createNewCategory = async function (req, res, next) {
  try {
    const { category } = req.body;
   const categoryDoc = await CategoryModel.create({ category : slugify(category)})
   logger.info('New category added', {category :categoryDoc.category})
    res.json({ category: categoryDoc.category})
  } catch (err) {
    if (err.code === 11000) next(createHttpError.Conflict('The category already exists'))
    else next(err)
  }
}

exports.getCategories = async (req, res, next) => {
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
          category: { $regex: new RegExp(`^${slugify(query)}`, 'i') }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: null,
          categories: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          categories: { $slice: ['$categories', (page-1) * (limit || 10), parseInt(limit || 10)]},
          count: 1
        }
      }
    ];


    const results = await CategoryModel.aggregate(aggregationPipeline)
    res.json(results[0] ? results[0] : { count: 0 , categories: []});
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};


exports.deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const response = await CategoryModel.findByIdAndDelete(categoryId);
    if (response) res.status(204).end();
    else throw new createHttpError.NotFound('Couldn\'t find the category  with id ' + categoryId);
  } catch (error) {
    logger.error(error.message, error);
    next(error);
  }
};
