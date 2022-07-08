let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let levelCard = Schema({

    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    background: { type: String, default: undefined },
    color: { type: String, default: undefined },
    opacity: { type: String, default: undefined }
});

module.exports = mongoose.model("lvlcard", levelCard)