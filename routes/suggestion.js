var express = require('express');
var mongoose = require('mongoose');
var Suggestion = require('../models/suggestion.js');
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
  Suggestion.find(parsed_query, selection, option, function(err , docs) {
    if(err){
      console.log(err);
      res.send(500, err);
      return;
    }
    console.log('OK');
    res.json(docs);
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
  var update = null;
  if(req.query.u != undefined) {
    update = JSON.parse(req.query.u);
  }
  if(update == null ){
    console.log("update_time");
    Suggestion.find(parsed_query, selection, option, function(err , docs) {
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

        Suggestion.update({_id:doc._id},{timestamp:date.getTime()/1000+milli[1]},function(err,result) {
          if(err){
            console.log("err");
          } else {
            console.log("OK_updated");
          }
        });
      });
    });
  } else {
    Suggestion.update(parsed_query, update,function(err,result) {
      console.log("update_with_query : ");
      console.log(update);
      if(err){
        console.log("err");
        res.send(500,'not ok');
      } else {
        console.log("OK_updated");
        res.send(200,'ok');
      }
    });
  }
});

router.get('/increase', function(req, res, next) {
  Suggestion.findOne({session_id:req.query.session_id},function(err, result){
    if(err){
      console.log(err);
      res.send(500);
      return;
    }
    var object;
    if(result == null) {
      console.log('result == null');
      res.send(500);
      return;
    }
    result.hint_data_list.forEach(hint => {
      if(hint.interest == req.query.interest){
        hint.command_list.forEach(command => {
          if(command.command == req.query.command){
            if(command.consumption_count != undefined) {
              command.consumption_count += 1;
            } else {
              command.consumption_count = 0;
            }
          }
        });
      }
    });
    console.log(object);
    Suggestion.update({
      session_id: req.query.session_id
    }, {
        hint_data_list : result.hint_data_list
    }, function(err, result) {
      if(err){
        console.log(err);
        res.send(500);
      } else {
        console.log('ok');
        res.send(200);
      }
    });
  });
});
router.get('/delete', function(req, res, next) {
    Suggestion.remove({
      session_id: req.query.session_id
    }, function(err, result) {
      if(err){
        console.log(err);
        res.send(500);
      } else {
        console.log('ok');
        res.send(200);
      }
    });
});

module.exports = router;
