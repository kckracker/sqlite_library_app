var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const sequelize = require('./models').sequelize;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Page not found!'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(500);
  if(err.status === 404){
    res.render('page_not_found', {message: err.message, error: err, title: 'Page Not Found'});
  } else{
    if(!err.status){
      err.status = 500;
    }
    if(!err.message){
      err.message = 'Sorry, we encountered an error with your request.'
    }
    console.log(err.status, err.message);
    res.render('error', {error: err, message: err.message});
  }
  
});

(async () => {
  try {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log("Connection was successful!")
} catch(error){
  console.error("Connection error: ", error)
} })();

module.exports = app;
