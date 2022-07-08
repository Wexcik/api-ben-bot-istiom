const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let moment = require("moment")
moment.locale("tr");
let ms = require("ms");
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
let profil = require("../../models/profil");
let jailInterval = require("../../models/jailInterval");
var limit = new Map(); 

module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let sec = args[0];
    let data = await sunucuayar.findOne({})
    let jailSorumlusu = data.JAILAuthorized;
    let jailLogKanal = data.JAILChannel;
    let jailLimit = data.JAILLimit;
    let cezaID = data.WARNID;
    let jailROL = data.JAIL;
    let booster = data.BOOST

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
                    return data.JAILAuthorized = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "wex_tik")))
                }
                if (args[1] == "kanal") {
                    let select = message.mentions.channels.first();
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "wex_iptal"));
                    return data.JAILChannel = select.id, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "wex_tik")))
                }
                if (args[1] == "limit") {
                    let select = Number(args[2])
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "wex_iptal"));
                    return data.JAILLimit = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "wex_tik")))
                }
            })
        } else return message.reply("Bu komutu kullanabilmek için YÖNETİCİ - Sunucu Sahibi olmanız gerekiyor")
    }

    if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) {
        if (jailSorumlusu.length >= 1 && client.channels.cache.get(jailLogKanal) && jailLimit >= 1) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
            if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hatalı Kullanım\` Belirttiğin kullanıcı ile aynı veya kullanıcı senden daha üst bir yetkide.`);
            if (target.id === message.author.id) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Kendine Ceza-i İşlem Uygulayamazsın\` Kendine **Jail** cezası uygulayamazsın.`);
            if (conf.sahip.includes(target.id)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hey Dur!\` Bot Sahibide Ceza-i İşlem **uygulamayazsın.**`).then(e => setTimeout(() => e.delete().catch(() => { }), 10000)), message.react(`${client.emojis.cache.find(x => x.name === "wex_carpi")}`)
            if (target.roles.cache.get(jailROL)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Zaten Cezalıda\` Belirttiğin kullanıcı zaten **cezalıda.**`);
            let reason = args.slice(1).join(" ");
            if (!reason) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Sebeb Belirtilmedi\` Geçerli bir **Sebeb Belirt** ve tekrar dene.`)
            if (limit.get(message.author.id) >= jailLimit) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Limit Aşımı\` Saatlik **Jail Limitini** doldurduğun için işlem iptal edildi.`);
            if (target.roles.cache.get(data.EnAltYetkiliRol) && !message.member.permissions.has(8n)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hatalı İşlem\` Yetkili kullanıcılar yetkililere ceza-i işlem **uygulayamazlar.**`);
            limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
            setTimeout(() => {
                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
            },1000*60*3)
            await banSistemi(message, client, jailLogKanal, target, cezaID, jailROL, booster,reason);
            let cezalar = await ceza.find({userID: target.id});
            if (cezalar.length == 0) {
                cezalar = [{Puan: 0}, {Puan: 0}];
            };
            await client.toplama(cezalar,client.ayarlar.CEZA_PUAN_KANAL, target.id, cezaID, 15);
        } else return client.Embed(message.channel.id, "Lütfen jail komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "jail setup` yazarak kurunuz!")
    } else return;
}
exports.conf = {
    aliases: ["cezalı", "Jail", "Cezalı", "JAIL", "JAİL", "CEZALI"]
}
exports.help = {
    name: 'jail'
}
async function banSistemi(message, client, jailLogKanal, target, cezaID, jailROL, booster,reason) {

        let messageEmbed = `${client.emojis.cache.find(x => x.name === "wex_jailed")}${target} Adlı üye ${message.author} tarafından **${reason}** gerekçesiyle sunucu üzerinde **cezalı** kategorisine gönderildi. (Ceza Numarası: \`#${cezaID+1}\`)`;
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
        await target.roles.set(target.roles.cache.get(booster) ? [jailROL, booster] : [jailROL]).then(async () => {
			if (target.voice.channel) {
				target.voice.setChannel(null);
			}
            await message.channel.send(messageEmbed);
            await client.channels.cache.get(jailLogKanal).send({embeds: [messageLogEmbed]});
                let newData = ceza({
                    ID: cezaID + 1,
                    userID: target.id,
                    Yetkili: message.author.id,
                    Ceza: "JAIL",
                    Sebep: reason,
                    Puan: 15,
                    Atilma: Date.now(),
                    Bitis: "KALICI",
                });
                await profil.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {JailAmount: 1}}, {upsert: true}).exec();
                await client.savePunishment();
                await newData.save();

                await jailInterval.findOne({userID: target.id}, (err,data) => {
                    if (!data) {
                        newData = new jailInterval({
                            userID: target.id,
                            jailed: true,
                        })
                        newData.save()
                    } else {
                        data.jailed = true,data.save();
                    }
                })
        });
};