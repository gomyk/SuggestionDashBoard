var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var pkg_file = require("../models/pkg_file");

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
  limits : { filedSize: '50MB' }
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
      if(savePkgFileToDB(req.body) != null){
        res.send(200,'Upload_PKG');
      } else {
        res.send(500,'somthing wrong');
      }
    }
  });
});

async function savePkgFileToDB(data) {
  if(data == undefined || data == null){
    return null;
  }
  var response = {};
  await pkg_file.create(data, function (err, res) {
    if(err) {
      response = {"error" : true, "message" : "Error adding data"};
      console.log("error : "+ res);
    } else {
      response = {"error" : false, "message" : "Data added"};
      console.log("success");
    }
  });
  return response;
}

module.exports = router;
