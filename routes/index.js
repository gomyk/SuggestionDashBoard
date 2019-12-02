var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  //Render Json tree
  res.render('index',{
    title:"title",
    path:req.query.path,
    link:req.query.link});
});

router.post('/', function(req, res, next) {
  var data = req.body.logging_data_table;

  var parsed_json = JSON.parse(data);

  if(parsed_json == null){
    res.send(500,'Parse data : Json parse error');
  } else{
    if(parsed_json.bixby_client_version == undefined
      || parsed_json.bixby_client_version == null) {
      //json output
      res.send(200,'Save data : Save analyzed keyword output');
      saveJsonToFile(parsed_json);
    }
    else if(parsed_json.bixby_client_version <= '2.2.46.85') {
      res.send(500,'Parse data : Low version');
    } else {
      res.send(200,'Parse data : OK...try send log');
      request({
        url: 'http://localhost:3003/suggestion',
        method : 'POST',
        json : parsed_json
      },function (err,res,body) {
          if(err){
            console.log("Send log : Cannot send to logstash");
          } else{
            console.log("Send log : OK");
          }
      });
    }
  }
});

function saveJsonToFile(jsonObject){
  try {
    fs.writeFileSync('/uploads/output/'+jsonObject.filename+'.json',
    JSON.stringify(jsonObject.output));
  } catch (err) {
    console.error(err);
  }
}
module.exports = router;
