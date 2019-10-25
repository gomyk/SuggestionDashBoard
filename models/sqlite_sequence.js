var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/testDB');
var mongoSchema = mongoose.Schema;
var userSchema  = {
    name : String,
    seq : String
};
module.exports = mongoose.model('sqlite_sequence',userSchema);
