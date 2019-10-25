var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/testDB');
var mongoSchema = mongoose.Schema;
var userSchema  = {
    id : Number,
    identity_hash : String
};
module.exports = mongoose.model('room_master_table',userSchema);
