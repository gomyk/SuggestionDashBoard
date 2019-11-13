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
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');
const commandLineArgs = require('command-line-args')

var app = express();
const PORT = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use('/uploads', serveIndex('uploads',{'icon':true}));
app.use('/uploads', serveStatic('uploads'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use('/', indexRouter);
app.use('/upload', uploadRouter);

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

//ssl key define
function createHttpOptions(url) {
  return {
    cert : fs.readFileSync('/etc/letsencrypt/live/' + url + '/fullchain.pem'),
    key : fs.readFileSync('/etc/letsencrypt/live/' + url + '/privkey.pem')
  };
}

const optionDefinitions = [
  { name: 'url', alias: 'v', type: String },
  { name: 'src', type: String, multiple: true, defaultOption: true}
]

const options = commandLineArgs(optionDefinitions)
console.log("url : " + options.url);

https.createServer(createHttpOptions(options.url), app).listen(PORT, '0.0.0.0', function(){
  console.log('HTTPS Server Start PORT:' + PORT);
});

module.exports = app;
