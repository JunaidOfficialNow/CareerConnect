var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const cors = require('cors');

const connetToMongoDB = require('./config/mongodb');

var categoryRotuer = require('./routes/category');
var usersRouter = require('./routes/users');
const skillsRouter = require('./routes/skills');
const EducationRouter = require('./routes/educations');
const filtersRouter = require('./routes/filters');
const notificationsRouter = require('./routes/notifications');

var app = express();


connetToMongoDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/categories', categoryRotuer);
app.use('/users', usersRouter);
app.use('/skills', skillsRouter);
app.use('/educations', EducationRouter);
app.use('/filters', filtersRouter);
app.use('/notifications', notificationsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      error: err.message || 'Internal Server Error',
    }
  })
});

module.exports = app;
