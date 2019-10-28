var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/testDB');
var mongoSchema = mongoose.Schema;
var userSchema  = {
    deviceId : String,
    timestamp : String
};
module.exports = mongoose.model('pkg_file',userSchema);
