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
	     req.body.filename =  req.body.deviceId+'.zip';
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

  res.render('upload.html');
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
      //send after 10 sec
//       setTimeout(function() {
//         var session_id = req.body.filename.split('.zip')[0];
//         console.log("send pkg exist filename : "+session_id);
//         updateFeedback(session_id);
//       }, 10000);
    }

//       request({
//         url: 'http://localhost:3003/suggestion',
//         method : 'POST',
//         json : data
//       },function (err,res,body) {
//           if(err){
//             console.log(500);
//           } else{
//             console.log(200);
//           }
//       });
       res.send(200);
  });
});

function updateFeedback(session_id){
  var jsonObject = JSON.parse('{"query": { "match": {"session_id.keyword": "'+session_id+'"}},"script": {"source":"ctx._source.fileexist = true"}}');
  request({
    url: 'http://localhost:9200/suggestion/_update_by_query',
    method : 'POST',
    json : jsonObject
  },function (err,res,body) {
      if(err){
        console.log("Update file exist : Error");
        console.log(err);
      } else{
        console.log("Update file exist : OK");
      }
    });
}


module.exports = router;
