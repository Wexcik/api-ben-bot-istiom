const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let teyit = require("../../models/teyit");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

   if (durum || message.member.permissions.has(8n)) {
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    let teyitData = await teyit.findOne({
        userID: target.id
    }) || {
        userName: []
    };
    let Embed = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setColor("RANDOM");

    teyit.findOne({guildID: message.guild.id, victimID: target.id}, (err, res) => {
        if(!res) {
return message.reply("Kullanıcının isim geçmişi olmadığı için veri görüntüleyemedim.")
        } else {
            const History = res.nicknames.reverse().map((e, i) => ` \`${i + 1}.\` \`${e.isimler}\` (**${e.rol}**) - <@${e.execID}> - <t:${Math.floor(Math.floor(e.date) / 1000)}:R>`).slice(0, 30)
        message.reply({ embeds: [Embed.setDescription(`${target} adlı üyenin geçmiş isimleri sırasıyla aşağıda listelenmiştir.

        ${History.join("\n")}
        
        ${client.emojis.cache.find(x => x.name === "wex_carpi") || "Emoji Bulunamadı"} üyenin \`${History.length}\` adet geçmiş ismi görüntülendi.`)]}), message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`) 
        
        }
        
        })
    }


}
exports.conf = {
    aliases: ["İsimler", "names"]
}
exports.help = {
    name: 'isimler'
}