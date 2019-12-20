var mongoose = require("mongoose");
var mongoSchema = mongoose.Schema;
var userSchema  = {
  bixby_client_version: 'String',
  bixby_service_version: 'String',
  country_code: 'String',
  startTime: 'String',
  startTimeInMillis: 'Number',
  endTime: 'String',
  endTimeInMillis: 'Number',
  result: 'String',
  device_id: 'String',
  fileexist: 'Boolean',
  filename: 'String',
  hint_data_count: 'Number',
  hint_data_list: 'Mixed',
  log_version: 'Number',
  negativefeedback: 'Boolean',
  session_id: 'String',
  time_of_request: 'Number',
  interestList: 'Mixed',
  sessionId: 'String',
  RawdataConverterPassedDataList: 'Mixed',
  RunestoneProfileConverterPassedDataList: 'Mixed',
  getPersonalizedInterestsList: 'Mixed',
  resultList: 'Mixed',
  JRDFoxExceptionList:'Mixed'
};
module.exports = mongoose.model('suggestion',userSchema);
