const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let Database = require("../../models/invite");
let muteInterval = require("../../models/muteInterval");
let vmuteInterval = require("../../models/vmuteInterval");
const moment = require("moment")
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

    let muted = await muteInterval.find({"muted": true, userID: message.member.id});
    let vmuted = await vmuteInterval.find({"muted": true});


    let embed = new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({
        dynamic: true
    })).setColor("RANDOM").setFooter(conf.footer)
    .setDescription(`${client.emojis.cache.find(x => x.name === "wex_deynek") || "Emoji Bulunamadı"} **Voice-Mute Bilgisi**\nKullanıcının aktif olan voice mute bilgileri aşağıda belirtilmiştir.\n\n${vmuted.length > 0 ? vmuted.map(x => `<@${x.userID}> - Bitiş Süresi \`${moment(x.endDate -  Date.now()).format("m [dakika,] s [saniye.]")}\``).join("\n") : "Aktif Voice-Mute Cezası Görüntülenemiyor"}
    **────────────────────**
    ${client.emojis.cache.find(x => x.name === "wex_deynek") || "Emoji Bulunamadı"} **Chat-Mute Bilgisi**
    Kullanıcının aktif olan chat mute bilgileri aşağıda belirtilmiştir.\n\n${muted.length > 0 ? muted.map(x => `<@${x.userID}> - Bitiş Süresi \`${moment(x.endDate -  Date.now()).format("m [dakika,] s [saniye.]")}\``).join("\n") : "Aktif Mute Cezası Görüntülenemiyor"}
    
    `)
    message.channel.send({embeds: [embed]})

}
exports.conf = {aliases: ["davet", "rank"]}
exports.help = {name: 'mbilgi'}