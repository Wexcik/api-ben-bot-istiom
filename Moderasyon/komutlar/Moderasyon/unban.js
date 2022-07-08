const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    let data = await sunucuayar.findOne({});
    
    let banSorumlusu = data.BANAuthorized
    let banLogKanal = data.BANChannel
    if (await client.permAyar(message.author.id, message.guild.id, "unban") || durum || client.ayarlar.sahip.includes(message.author.id)) {

        let target = await client.users.fetch(args[0]);
        if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
        if (target === message.author.id) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Kendi Banını mı Açmaya Çalışıyorsun?\` Kendı banını açamazsın çünkü banlı değilsin.`);
        let cezaDATA = await ceza.findOne({userID: target, Ceza: "YARGI", Bitis: "null"})
        if(cezaDATA && !data.GKV.includes(message.author.id) && !client.ayarlar.sahip.includes(message.author.id)) return message.reply("Etiketlediğiniz kullanıcının banını sadece sunucu sahipleri açabilir.");
        
        await ceza.findOne({userID: target.id, Ceza: "YARGI", Bitis: "null"}, async (err, doc) => {
        const fetchBans =  message.guild.bans.fetch()
        fetchBans.then(async (bans) => {
          let ban = await bans.find(a => a.user.id === target.id)
          if (!ban) {
             message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Yasaklı Değil\` Belirttiğin **${target.tag}** adlı üye sunucuda **yasaklı değil**.`)
             message.react(client.emojis.cache.find(x => x.name === "wex_iptal"))
            }
            else if(doc) {
                message.reply('**'+member.tag+'** üyesinin yasağı <@'+doc.Yetkili+'> yetkilisi tarafından açılmaz olarak işaretlendi.', message.author , message.channel)
                message.react(client.emojis.cache.find(x => x.name === "wex_iptal"))
              } else {
          
         message.guild.members.unban(target.id)
         message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} \`Ban Kaldırıldı\` Belirttiğin **${target.tag}** adlı üyenin **yasağı kaldırıldı**.`)
         message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
        }
        })
    })
     } else return;
}
exports.conf = {aliases: ["bankaldır", "Unban", "UNBAN"]}
exports.help = {name: 'unban'}
