var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  //Render Json tree
  res.render('index',{title:"title",json_path:req.body.path});
});

router.post('/', function(req, res, next) {
  var data = req.body.logging_data_table;

  var parsed_json = JSON.parse(data);

  if(parsed_json == null){
    res.send(500,'json parse error');
  } else{
    res.send(200,'OK');
  }
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
});

module.exports = router;
