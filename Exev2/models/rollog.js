let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let roleLog = Schema({
    user: String, 
    roller: Array
});

module.exports = mongoose.model("rol-log", roleLog);