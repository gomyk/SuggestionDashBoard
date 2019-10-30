var express = require('express');
var router = express.Router();
var android_metadata = require("../models/android_metadata");
//var hint_commands_table = require("../models/hint_commands_table");
var log_table = require("../models/log_table");
var logging_data_table = require("../models/logging_data_table");
var remote_data_table = require("../models/remote_data_table");
var room_master_table = require("../models/room_master_table");
var sqlite_sequence = require("../models/sqlite_sequence");
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

async function process(body){
  var response;
  if(body != undefined || body != null || body.length != 0){
    response = save_logging_data_table(body);
  } else {
    console.log("error : body is empty");
  }
  return response;
}

async function save_logging_data_table(dataArray) {
  if(dataArray == undefined || dataArray == null || dataArray.length == 0){
    return null;
  }
  var response = {};
  console.log(dataArray);
  await logging_data_table.insertMany(dataArray, function (err, data) {
    if(err) {
      response = {"error" : true, "message" : "Error adding data"};
      console.log("error : "+ data);
    } else {
      response = {"error" : false, "message" : "Data added"};
      console.log("success");
    }
  });
  return response;
}

module.exports = router;
