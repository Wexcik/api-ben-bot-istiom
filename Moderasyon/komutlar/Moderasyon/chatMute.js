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
let muteInterval = require("../../models/muteInterval");
let jailInterval = require("../../models/jailInterval");
let vmuteInterval = require("../../models/vmuteInterval");
var limit = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let sec = args[0];
    let data = await sunucuayar.findOne({})
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
                    return data.MUTEAuthorized = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "wex_tik")))
                }
                if (args[1] == "kanal") {
                    let select = message.mentions.channels.first();
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "wex_iptal"));
                    return data.MUTEChannel = select.id, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "wex_tik")))
                }
                if (args[1] == "limit") {
                    let select = Number(args[2])
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "wex_iptal"));
                    return data.MUTELimit = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "wex_tik")))
                }
            })
        } else return message.reply("Bu komutu kullanabilmek için YÖNETİCİ - Sunucu Sahibi olmanız gerekiyor")
    } else {
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);

        let reason = args.splice(2).join(" ") || "Sebep Yok";
        let time = args[1];
        if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
    if (!time) return message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Zaman Belirtilmedi\` Geçerli bir **Zaman Belirt** ve tekrar dene.`)
    if (conf.sahip.includes(target.id)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hey Dur!\` Bot Sahibide Ceza-i İşlem **uygulamayazsın.**`).then(e => setTimeout(() => e.delete().catch(() => { }), 10000)), message.react(`${client.emojis.cache.find(x => x.name === "wex_carpi")}`)
    if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hatalı Kullanım\` Belirttiğin kullanıcı ile aynı veya kullanıcı senden daha üst bir yetkide.`);
    if (target.id === message.author.id) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Kendine Ceza-i İşlem Uygulayamazsın\` Kendine **Chat-Mute** cezası uygulayamazsın.`);
    
        let cezalar = await ceza.find({
            userID: target.id
        });
        if (cezalar.length == 0) {
            cezalar = [{
                Puan: 0
            }, {
                Puan: 0
            }];
        };

                if (await client.permAyar(message.author.id, message.guild.id, "mute") || durum) {
                    let muteSorumlusu = data.MUTEAuthorized;
                    let muteLogKanal = data.MUTEChannel;
                    let muteLimit = data.MUTELimit;
                    let muteROL = data.MUTED;
                    if (muteSorumlusu.length >= 1 && client.channels.cache.get(muteLogKanal) && muteLimit >= 1) {
                        if (target.roles.cache.get(muteROL)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Zaten Muteli\` Belirttiğin kullanıcı zaten **mutelenmiş.**`);
                        if (limit.get(message.author.id) >= muteLimit) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Limit Aşımı\` Saatlik **Mute Limitini** doldurduğun için işlem iptal edildi.`);
                        if (client.ayarlar.CEZA_PUAN_SYSTEM == true) {

                            if (cezalar.map(x => x.Puan).reduce((a, b) => a + b) >= 200) {
                                await jailInterval.findOne({
                                    userID: target.id
                                }, (err, data) => {
                                    if (!data) {
                                        newData = new jailInterval({
                                            userID: target.id,
                                            jailed: true,
                                        })
                                        newData.save()
                                    } else {
                                        data.jailed = true, data.save();
                                    }
                                })
                                await target.roles.set(target.roles.cache.get(data.BOOST) ? [data.JAIL, data.BOOST] : [data.JAIL]);
                                return message.channel.send(`${target.id} adlı üye **200 Ceza Puan'ı** yaptığı için cezalı üyelerin arasına gönderildi!`)
                            }
                        }
                        message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`);

                        let messageEmbed = `${client.emojis.cache.find(x => x.name === "wex_muted")} ${target} Adlı üye ${message.author} tarafından **${reason}** gerekçesiyle **${args[1].replace("h", " saat").replace("m", " dakika").replace("s", " saniye")}** süresi boyunca metin kanallarında **susturuldu.** (Ceza Numarası: \`#${cezaID+1}\`)`
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
                        await muteInterval.findOne({
                            userID: target.id,
                        }, async (err, data) => {
                            if (!data) {
                                let newData = new muteInterval({
                                    userID: target.id,
                                    muted: true,
                                    endDate: Date.now() + ms(time)
                                })
                                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                                setTimeout(() => {
                                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                                }, 1000 * 60 * 3)
                                await newData.save()
                                await banSistemi(message, messageEmbed, client, muteLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, muteROL, cezalar);

                            } else {
                                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                                setTimeout(() => {
                                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                                }, 1000 * 60 * 3)
                                data.muted = true, data.endDate = Date.now() + ms(time), data.save();
                                await banSistemi(message, messageEmbed, client, muteLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, muteROL, cezalar);
                            }
                        })
                    } else return client.Embed(message.channel.id, "Lütfen mute komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "vmute setup` yazarak kurunuz!")
                } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici - Mute Sorumlusu olmalısın!`)
                    
    }
}
exports.conf = {
    aliases: ["cmute", "muted","chatmute"]
}
exports.help = {
    name: 'mute'
}
async function banSistemi(message, messageEmbed, client, muteLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, muteROL, cezalar) {
    await target.roles.add(muteROL).then(async x => {
        await message.channel.send(messageEmbed);
        await client.channels.cache.get(muteLogKanal).send({embeds: [messageLogEmbed]});
        let newData = ceza({
            ID: cezaID + 1,
            userID: x.id,
            Yetkili: message.author.id,
            Ceza: "MUTE",
            Sebep: reason,
            Puan: 8,
            Atilma: Date.now(),
            Bitis: Date.now() + ms(args[1]),
        })
        profil.updateOne({
            userID: message.author.id,
            guildID: message.guild.id
        }, {
            $inc: {
                MuteAmount: 1
            }
        }, {
            upsert: true
        }).exec();
        await client.savePunishment();
        await newData.save();
        await client.toplama(cezalar, client.ayarlar.CEZA_PUAN_KANAL, x.id, cezaID, 10);
    })
}
