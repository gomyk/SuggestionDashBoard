var express = require('express');
var mongoose = require('mongoose');
var Parking = require('../models/parking.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.query.q == undefined || req.query.q == null) {
    console.log('query not found error');
    res.send(500, 'query not found');
    return;
  }
  var parsed_query = JSON.parse(req.query.q);
  var selection = null;
  var option = null;
  if(req.query.s != undefined) {
    selection = req.query.s;
  }
  if(req.query.o != undefined) {
    option = JSON.parse(req.query.o);
  }
  if(parsed_query == null) {
    console.log('parsed query is null');
    res.send(500, 'query parse error');
    return;
  }
  if(parsed_query == null) {
    console.log('parsed query is null');
    res.send(500, 'query parse error');
    return;
  }
  Parking.find(parsed_query, selection, option, function(err , docs) {
    if(err){
      console.log(err);
      res.send(500, err);
      return;
    }
    console.log('OK');
    res.json(docs);
  });
});

router.post('/', function(req, res, next) {
  var parsed_json = null;
  var data = req.body.logging_data_table;
  if(data == undefined || data == null){
    console.log("Request error : There is no logging_data_table field in body");
  }
  try {
    parsed_json = JSON.parse(data);
  } catch (err){
    console.log(err);
  }
  var parking_json = {
    parking_id: parsed_json.parking_id,
    type: parsed_json.type,
    feedback: parsed_json.feedback,
    feedback_comment: parsed_json.feedback_comment,
    timestamp: Date.now(),
    device_id: parsed_json.device_id,
    log_version: parsed_json.log_version,
    bixby_client_version: parsed_json.bixby_client_version,
    bixby_service_version: parsed_json.bixby_service_version
  };
  var parking = new Parking(parking_json);
  Parking.find({parking_id : parsed_json.parking_id}, function(err , docs) {
    if(err){
      console.log(err);
      res.send(500, err);
      return;
    }
    if(docs.length > 0) {
      parking.update({parking_id : parsed_json.parking_id}, parking_json ,function(err, object){
          console.log("Already have same parking Id");
          if(err) {
            return console.log(err);
          }
          console.log('parking Id : ' + object.parking_id + ' success');
          res.send(200);
      });
    } else {
      parking.save(function(err, object){
          if(err) {
            return console.log(err);
          }
          console.log('parking Id : ' + object.parking_id + ' success');
          res.send(200);
      });
    }
  });
});
router.get('/update', function(req, res, next) {
  if(req.query.q == undefined || req.query.q == null) {
    console.log('query not found error');
    res.send(500, 'query not found');
    return;
  }
  var parsed_query = JSON.parse(req.query.q);
  var selection = null;
  var option = null;
  if(req.query.s != undefined) {
    selection = req.query.s;
  }
  if(req.query.o != undefined) {
    option = JSON.parse(req.query.o);
  }
  if(parsed_query == null) {
    console.log('parsed query is null');
    res.send(500, 'query parse error');
    return;
  }
  Parking.find(parsed_query, selection, option, function(err , docs) {
    if(err){
      console.log(err);
      res.send(500, err);
      return;
    }
    console.log('OK');
    docs.forEach(doc => {
      var time = doc.session_id.split('_')[0].split(' ');
      var YMD = time[0].split('-');
      var HMS = time[1].split(':');
      var milli = HMS[2].split('.');

      var date = new Date(YMD[0], YMD[1] - 1, YMD[2], HMS[0], HMS[1], milli[0]);

      Feedback.update({_id:doc._id},{timestamp:date.getTime()+milli[1]},function(err,result) {
        if(err){
          console.log("err");
        } else {
          console.log("OK_updated");
        }
      });
    });
  });
});

module.exports = router;
