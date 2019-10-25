var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/testDB');
var mongoSchema = mongoose.Schema;
var userSchema  = {
    locale : String
};
module.exports = mongoose.model('android_metadata',userSchema);
