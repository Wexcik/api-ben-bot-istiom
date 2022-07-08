const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let moment = require("moment")
moment.locale("tr");
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
let profil = require("../../models/profil");
var limit = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    let sec = args[0];
    let data = await sunucuayar.findOne({})
    let banSorumlusu = data.BANAuthorized
    let banLogKanal = data.BANChannel
    let banLimit = data.BANLimit
    let cezaID = data.WARNID;

    if (sec == "setup") {
        if (!args[1]) return message.reply("Lütfen `yetki-kanal-limit` belirleyiniz")
        if (message.guild.members.cache.some(member => conf.sahip.some(sahip => member === sahip)) || message.member.permissions.has(8n) || message.author.id === message.guild.owner.id) {
            await sunucuayar.findOne({
                guildID: message.guild.id
            }, async (err, data) => {
                if (args[1] == "yetki") {
                    let select;
                    if (message.mentions.roles.size >= 1) {
                        select = message.mentions.roles.map(r => r.id);
                    } else {
                        if (!select) return message.react(client.emojis.cache.find(res => res.name === "wex_iptal"));
                        select = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
                    }
                    return data.BANAuthorized = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "wex_tik")))
                }
                if (args[1] == "kanal") {
                    let select = message.mentions.channels.first();
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "wex_iptal"));
                    return data.BANChannel = select.id, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "wex_tik")))
                }
                if (args[1] == "limit") {
                    let select = Number(args[2])
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "wex_iptal"));
                    return data.BANLimit = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "wex_tik")))
                }
            })
        } else return message.reply("Bu komutu kullanabilmek için YÖNETİCİ - Sunucu Sahibi olmanız gerekiyor")
    }
    if (await client.permAyar(message.author.id, message.guild.id, "ban") || durum) {
        if (banSorumlusu.length >= 1 && client.channels.cache.get(banLogKanal) && banLimit >= 1) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
            if (conf.sahip.includes(target.id)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hey Dur!\` Bot Sahibide Ceza-i İşlem **uygulamayazsın.**`).then(e => setTimeout(() => e.delete().catch(() => { }), 10000)), message.react(`${client.emojis.cache.find(x => x.name === "wex_carpi")}`)
            let reason = args.slice(1).join(" ");
            if (!reason) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Sebeb Belirtilmedi\` Geçerli bir **Sebeb Belirt** ve tekrar dene.`)
            if (limit.get(message.author.id) >= banLimit) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Limit Aşımı\` Saatlik **Ban Limitini** doldurduğun için işlem iptal edildi.`);
            if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hatalı Kullanım\` Belirttiğin kullanıcı ile aynı veya kullanıcı senden daha üst bir yetkide.`);
            if (target.id === message.author.id) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Kendine Ceza-i İşlem Uygulayamazsın\` Kendini Banlanmayazansın.`);



limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
setTimeout(() => {
    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
},1000*60*3)
        await banSistemi(message, client, banLogKanal, target, cezaID,reason);
        } else return message.reply("Lütfen ban komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "ban setup` yazarak kurunuz!")
    } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici - Ban Sorumlusu olmalısın!`)
}
exports.conf = {
    aliases: ["Ban"]
}
exports.help = {
    name: 'ban'
}
async function banSistemi(message, client, banLogKanal, target, cezaID,reason) {

let messageLogEmbed = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.author.tag, message.author.avatarURL({
        dynamic: true
    }))
    .setFooter(`Ceza Numarası: #${cezaID+1}`)
    .setDescription(`
    \`•\` Yetkili: ${message.author} (\`${message.author.id}\` - \`${message.author.tag}\`)
    \`•\` Kullanıcı: ${target} (\`${target.id}\` - \`${target.tag || target.user.tag}\`)
    \`•\` Tarih: \`${moment(Date.now()).format('LLL')}\`
    \`•\` Sebeb: [\`${reason}\`]
`)
    await message.guild.members.ban(target.id, { reason: `${reason} | Yetkili: ${message.author.tag}` , days:1})
    await message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_banned")} ${target} **${target.tag || target.user.tag}** adlı üye ${message.author} tarafından **${reason}** gerekçesiyle sunucudan **yasaklandı.** (Ceza Numarası: \`#${cezaID+1}\`)`);
    await client.channels.cache.get(banLogKanal).send({embeds: [messageLogEmbed]});
    await target.user.send(`${message.guild.name} adlı sunucumuzdan ${reason} sebebi ile uzaklaştırıldın`).catch(err => {
        console.log(`${message.author.tag} adlı yetkilini banlamış oldugu ${target.tag || target.user.tag} adlı üyeye dm üzerinden ban bilgi mesajını gönderemedim.`)})
    let newData = ceza({
        ID: cezaID + 1,
        userID: target.id,
        Yetkili: message.author.id,
        Ceza: "BAN",
        Sebep: reason,
        Puan: 30,
        Atilma: Date.now(),
        Bitis: null,
    });
    await profil.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {["BanAmount"]: 1}}, {upsert: true}).exec();
    await client.savePunishment();
    await newData.save();

}