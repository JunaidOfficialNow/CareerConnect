const { connect } = require("mongoose");
const { logger } = require("./logger");

module.exports = async function () {
  try {
    await connect(process.env.MONGODB_URL ||'mongodb://127.0.0.1:27017/career-connect');
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('Error connecting to mongodb', error);
    process.exit(1)
  }
} 