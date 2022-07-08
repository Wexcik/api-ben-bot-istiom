const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar

let mongoose = require("mongoose");
let stringTabe = require("string-table");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
let moment = require("moment");
moment.locale("tr")
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) {
        let target = Number(args[0])
        if (!target) return client.Embed(message.channel.id, `Lütfen cezalarına bakmak istediğiniz ID'yi giriniz!`)
        let data = await ceza.find({}).then(x => x)
        let embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`${data.filter(x => Number(x.ID) == target).map(veri => `
**${target}** ceza numarasına ait ceza-i işlem verileri;\`\`\`js
=> Kullanıcı: ${message.guild.members.cache.get(veri.userID) ? message.guild.members.cache.get(veri.userID).user.tag : veri.userID} 
=> Yetkili: ${message.guild.members.cache.get(veri.Yetkili) ? message.guild.members.cache.get(veri.Yetkili).user.tag : veri.Yetkili}
=> Tür: ${veri.Ceza}
=> Sebep: ${veri.Sebep}
=> Başlangıç Tarihi: ${moment(Number(veri.Atilma)).format('LLL')}
=> Bitiş Tarihi:  ${moment(Number(veri.Bitis)).format('LLL')}   
=> Ceza Durumu: ${veri.Sebep == "AFFEDILDI" ? "🔴 (Bitti)" : veri.Bitis == "null" ? "🟢 (Devam Ediyor)" : veri.Bitis == "KALICI" ? "🟢 (Devam Ediyor)" : Date.now()>=veri.Bitis ? "🔴 (Bitti)" : "🟢 (Devam Ediyor)"}\`\`\`
Haksız bir ceza-i işlem oldugunu düşünüyorsanız Üst yetkililerimize yazmaktan çekinmemelisin.

        `)}`)
        await message.channel.send({embeds: [embed]});

    } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Kayıt Sorumlusu veya Yönetici olmalısınız!`)
}
exports.conf = {aliases: ["cezaID"]}
exports.help = {name: 'ceza'}
