var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var data_from_service = require('../models/data_from_service.js')
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  //Render Json tree
  if(req.query.path == undefined){
    res.send(500, 'Do not request without query');
  } else {
      if(fs.existsSync('.'+req.query.path)) {
        res.render('index.html',{
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
      parsed_json.output = JSON.parse(parsed_json.output);
      saveJsonToFile(parsed_json);
      updateFeedback(parsed_json.filename,'suggestion','fileexist');
      updateFeedback(parsed_json.filename,'feedback','fileexist');
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
    }
    else if(parsed_json.feedback == undefined) {
      res.send(200,'Parse data : OK...try send log');
      parsed_json.negativefeedback = false;
      parsed_json.fileexist = false;
      if(parsed_json.hint_data_list != undefined){
        parsed_json.hint_data_count = parsed_json.hint_data_list.length;
      } else {
        parsed_json.hint_data_count = 0;
      }
      sendToLogServer(parsed_json, 'suggestion');
    }
    else {
      res.send(200,'Parse data : OK...try send log');
      parsed_json.negativefeedback = true;
      if(fs.existsSync('./uploads/output/'+parsed_json.session_id+'.json')) {
        parsed_json.fileexist = true;
      } else {
        parsed_json.fileexist = false;
      }
      sendToLogServer(parsed_json, 'feedback');
    }
  }

  //save to mongodb
  var serviceLog = mongoose.model('data_from_service',data_from_service);
  serviceLog.create({
    interestList: parsed_json.data_from_service.data[0].interestList,
    sessionId: parsed_json.data_from_service.data[0].sessionId,
    RawdataConverterPassedDataList:parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.RawdataConverterPassedDataList,
    RunestoneProfileConverterPassedDataList:parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.RunestoneProfileConverterPassedDataList,
    getPersonalizedInterestsList:parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.getPersonalizedInterestsList,
    resultList:parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.resultList
  });

  serviceLog.find({sesstionId: parsed_json.data_from_service.data[0].sessionId},(err,res) => {
    console.log(res);
    if(err){
      console.log(err);
    }
  });
});

function saveJsonToFile(jsonObject){
  try {
    fs.writeFileSync('./uploads/output/'+jsonObject.filename+'.json',
    JSON.stringify(jsonObject));
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
        if(index == 'feedback'){
          updateFeedback(jsonObject.session_id,'suggestion','negativefeedback');
        }
      }
    });
}
function updateFeedback(session_id,index,field){
  var jsonObject = JSON.parse('{"query": { "match": {"session_id.keyword": "'+session_id+'"}},"script": {"source":"ctx._source.'+field+' = true"}}');
  request({
    url: 'http://localhost:9200/'+index+'/_update_by_query',
    method : 'POST',
    json : jsonObject
  },function (err,res,body) {
      if(err){
        console.log(session_id +' : '+field+ ' : '+ index + " : Error");
        console.log(err);
      } else{
        console.log(session_id +' : '+field+ ' : '+ index + " : OK");
      }
    });
}
module.exports = router;
