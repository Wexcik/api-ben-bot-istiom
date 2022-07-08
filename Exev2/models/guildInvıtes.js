const mongoose = require("mongoose");

const schemaInvıte  = mongoose.Schema({
    guildID: String,
    invites: { type: Map, default: new Map() }
});

module.exports = mongoose.model("guildInviteschma", schemaInvıte);
