const { MessageEmbed, Discord } = require("discord.js");
const { link } = require("fs");
const conf = client.ayarlar
let mongoose = require("mongoose");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    if (message.member.permissions.has(8n) || durum) {

        if (args[0] == "aç") {
            message.channel.permissionOverwrites.edit(message.guild.id, {
                SEND_MESSAGES: null
            }).then(async() => {
                message.react("🔓")
                await message.reply("🔓 Kanal Kilidi Açıldı.")
            })
        }

        if (args[0] == "kapat") {
            message.channel.permissionOverwrites.edit(message.guild.id, {
                SEND_MESSAGES: false
            }).then(async() => {
                message.react("🔒")
                await message.reply("🔓 Kanal Kilitlendi.")
            })
        }

    } else {
        return 
      }
}
exports.conf = {aliases: ["kilit"]}
exports.help = {name: 'Kilit'}
