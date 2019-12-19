var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/testDB');
var mongoSchema = mongoose.Schema;
var userSchema  = {
  interestList : "Mixed",
  sessionId : "String",
  RawdataConverterPassedDataList : "Mixed",
  RunestoneProfileConverterPassedDataList : "Mixed",
  getPersonalizedInterestsList : "Mixed",
  resultList : "Mixed"
};
module.exports = mongoose.model('log_table',userSchema);
