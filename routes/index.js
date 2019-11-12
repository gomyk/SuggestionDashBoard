var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("test_log");
  //Todo : req.body.logging_data_table is null
  res.send(200,'Server status good');
});

router.post('/', function(req, res, next) {
  //Todo : req.body.logging_data_table is null
  //var response = process(JSON.parse(req.body.logging_data_table));
  var data = req.body.logging_data_table;
  //console.log(req.body.logging_data_table);
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
        console.log(500);
      } else{
        console.log(200);
      }
  });

  //res.render('index', { title: response });
});

module.exports = router;
