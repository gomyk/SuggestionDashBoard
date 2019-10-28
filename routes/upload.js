var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var pkg_file = require("../models/pkg_file");

var storage = multer.diskStorage({
  destination: function (req, file, cb){
    var dir = './uploads/'+req.body.deviceId;
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb){
    cb(null, req.body.deviceId+"/"+req.body.timestamp+'.ttl');
  }
})
var upload = multer({ storage: storage});

router.get('/', function(req, res, next) {
  console.log("get routing test");

  res.render('upload');
});

router.post('/',upload.single("pkg_file"), function(req, res, next) {
  console.log(req.body);
  if(savePkgFileToDB(req.body) != null){
    res.send(200,'Upload_PKG');
  } else {
    res.send(500,'somthing wrong');
  }

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
