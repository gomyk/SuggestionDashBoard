var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');
var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');

var app = express();
const PORT = 3000;
//ssl key define
const optionsForHTTPS = {
  cert : fs.readFileSync('/etc/letsencrypt/live/suggestionlogging.koreacentral.cloudapp.azure.com/fullchain.pem'),
  key : fs.readFileSync('/etc/letsencrypt/live/suggestionlogging.koreacentral.cloudapp.azure.com/privkey.pem')
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/static', express.static('uploads'));

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
  res.status(err.status || 500);
  res.render('error');
});

https.createServer(optionsForHTTPS, app).listen(PORT, function(){
  console.log('HTTPS Server Start PORT:' + PORT);
});

module.exports = app;
