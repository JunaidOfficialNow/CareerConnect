var express = require('express');
var router = express.Router();
const userModel = require('../models/userModel');
const createHttpError = require('http-errors');
const { logger } = require('../config/logger');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', async (req, res, next) => {
  const { name, email, age, phoneNumber } = req.body;
  try {
    const userDoc = await userModel.create({name, email, age, phoneNumber})
    logger.info('New user created', {name: userDoc.name, email: userDoc.email});
    if (userDoc) res.json(userDoc);
    else throw new createHttpError.InternalServerError();
  } catch (error) {
    logger.error(error.message, error);
    if (error.code === 11000) {
      next (createHttpError.Conflict('User with the email already exists'));
    }
    next(error);
  }

})


module.exports = router;
