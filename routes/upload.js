var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var request = require('request');

var storage = multer.diskStorage({
  destination: function (req, file, cb){
    console.log(req.body);
    var dir = './uploads/'+req.body.deviceId;
    console.log("Dir : "+dir);
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb){
    if(req.body.filename == undefined || req.body.filename == null) {
	     req.body.filename =  req.body.timestamp+'_'+req.body.deviceId+'.ttl';
    }
    cb(null, req.body.deviceId+"/"+req.body.filename);
  }
})
var upload = multer({
  storage: storage,
  limits : { fileSize: '50MB' }
}).single('file');

router.get('/', function(req, res, next) {
  console.log("get routing test");

  res.render('upload');
});

router.post('/', function(req, res, next) {
  upload(req,res,function(err) {
    if(err){
      console.log(err);
      res.send(500,'somthing wrong');
    } else{
      var data = {
        "deviceId":req.body.deviceId,
        "timestamp":req.body.timestamp,
        "filename":req.body.filename,
        "filesize":req.file.size
      };

      request({
        url: 'http://localhost:3003/pkgfile',
        method : 'POST',
        json : data
      },function (err,res,body) {
          if(err){
            console.log(500);
          } else{
            console.log(200);
          }
      });
      res.send(200);
    }
  });
});


module.exports = router;
