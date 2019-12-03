var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  //Render Json tree
  if(req.query.path == undefined){
    res.send(500, 'Do not request without query');
  } else {
      if(fs.existsSync('.'+req.query.path)) {
        res.render('index',{
          title:"title",
          path:req.query.path,
          link:req.query.link});
      } else {
        res.render('error',{
          message:'File not found',
          detail:'It may take some time for a file to be created'});
      }
  }
});

router.post('/', function(req, res, next) {
  var data = req.body.logging_data_table;
  if(data == undefined || data == null){
    console.log("Request error : There is no logging_data_table field in body");
  }
  var parsed_json = null;
  try {
    parsed_json = JSON.parse(data);
  } catch (err){
    console.log(err);
  }

  if(parsed_json == null){
    console.log('Parse data : Json parse error');
    res.send(500,'Parse data : Json parse error');
  } else{
    if(parsed_json.bixby_client_version == undefined
      || parsed_json.bixby_client_version == null) {
      //json output
      console.log('Save data : Save analyzed keyword output');
      saveJsonToFile(parsed_json);
      res.send(200,'Save json complete');
      if(parsed_json.output.length == 0) {
        console.log('Save data : parsed_json is empty');
      } else {
        sendToLogServer(parsed_json, 'keyword');
      }
    }
    else if(parsed_json.bixby_client_version <= '2.2.46.85') {
      console.log('Parse data : Low version');
      res.send(500,'Parse data : Low version');
    } else {
      res.send(200,'Parse data : OK...try send log');
      sendToLogServer(parsed_json, 'suggestion');
    }
  }
});

function saveJsonToFile(jsonObject){
  try {
    fs.writeFileSync('./uploads/output/'+jsonObject.filename+'.json',
    JSON.stringify(jsonObject.output));
  } catch (err) {
    console.log(err);
  }
}

function sendToLogServer(jsonObject, index){
  request({
    url: 'http://localhost:3003/'+index,
    method : 'POST',
    json : jsonObject
  },function (err,res,body) {
      if(err){
        console.log("Send log : Cannot send to logstash");
        console.log(err);
      } else{
        console.log("Send log : OK");
      }
    });
}
module.exports = router;
