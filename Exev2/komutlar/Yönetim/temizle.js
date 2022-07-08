const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    if (message.member.permissions.has(8n) || durum) {
        if (!args[0] || (args[0] && isNaN(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.react(client.emojis.cache.find(res => res.name === "wex_carpi")).catch(() => { })

        message.channel.bulkDelete(Number(args[0])).then(msg => message.channel.send(`${message.channel} Kanalından **${msg.size}** adet mesaj temizlendi!`)).catch(() => { }).then(e => setTimeout(() => e.delete().catch(() => { }), 10000))

    }
};
exports.conf = {aliases: ["sil", "clear", "clean", "oglumsohbettemizlendi", "hahaha", "pepe"]}
exports.help = {name: 'temizle'}
