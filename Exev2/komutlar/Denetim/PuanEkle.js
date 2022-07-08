let xpData = require("../../models/stafxp");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    if (durum) {
        let sec = args[0];
        let data = await sunucuayar.findOne({guildID: message.guild.id});
        if (sec == "user") {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            if(!target) return message.reply(client.Reply.üyeBelirt).then(e => setTimeout(() => e.delete(), 7000))
            if (!args[2]) return message.reply(client.Reply.puanBelirt).then(e => setTimeout(() => e.delete(), 7000))
            if (args[2] > 250 && !data.GKV.includes(message.author.id)) return message.reply("250 üzeri puan ekleyemezsin.").then(e => setTimeout(() => e.delete(), 7000))
            xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(args[2])}}, {upsert: true}).exec();
            message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Başarılı bir şekilde ${target} adlı üyeye ${args[2]} puan eklediniz.`).then(e => setTimeout(() => e.delete(), 7000))
        }
        if (sec == "rol") {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if(!rol) return message.reply(client.Reply.rolBelirt).then(e => setTimeout(() => e.delete(), 7000))
            if (!args[2]) return message.reply(client.Reply.puanBelirt).then(e => setTimeout(() => e.delete(), 7000))
            if (args[2] > 250 && !data.GKV.includes(message.author.id)) return message.reply("250 üzeri puan ekleyemezsin.").then(e => setTimeout(() => e.delete(), 7000))
            rol.members.map(target => {
                xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(args[2])}}, {upsert: true}).exec();
                message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Başarılı bir şekilde ${target} adlı üyeye ${args[2]} puan eklediniz.`).then(e => setTimeout(() => e.delete(), 7000))
            })
        }
       


    } else return;
}
exports.conf = {
    aliases: ["bonus"]
}
exports.help = {
    name: 'puanekle'
}