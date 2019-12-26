var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');
var suggestionRouter = require('./routes/suggestion');
var feedbackRouter = require('./routes/feedback');
var uploadRouter = require('./routes/upload');
var indexRouter = require('./routes/index');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');
var mongoose = require('mongoose');
var cors = require('cors');

if (process.argv.length < 3) {
  console.log("Usage: npm start [url]\n");
  process.exit();
}

var app = express();

var db = mongoose.connection;

db.on('error',console.error);
db.once('open',function(){
  console.log("Connected to mongo server");
});

mongoose.connect('mongodb://localhost:27017/logging');

const PORT = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use('/', indexRouter);
app.use('/feedback', feedbackRouter);
app.use('/suggestion', suggestionRouter);
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
  res.render('error.html');
});

//ssl key define
function createHttpOptions() {
  const url = process.argv[2];
  return {
    cert : fs.readFileSync('/etc/letsencrypt/live/' + url + '/fullchain.pem'),
    key : fs.readFileSync('/etc/letsencrypt/live/' + url + '/privkey.pem')
  };
}

https.createServer(createHttpOptions(), app).listen(PORT, '0.0.0.0', function(){
  console.log('HTTPS Server Start PORT:' + PORT);
});

module.exports = app;
