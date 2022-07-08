const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let teyit = require("../../models/teyit");
let sunucuayar = require("../../models/sunucuayar");
let otokayit = require("../../models/otokayit");
let puansystem = require("../../models/puansystem");
let limit = new Map();
let sure = new Map();
let randMiss = require("../../models/randomMission")
const ms = require("ms");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    let data = await sunucuayar.findOne({
        guildID: message.guild.id
    });
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    let erkekRol = data.MAN;
    let kadinRol = data.WOMAN;
    let unRegisterRol = data.UNREGISTER;
    let registerChannel = data.REGISTERChannel;
    let tag = data.TAG;
    let tag2 = data.TAG2;
    let kayitSorumlusu = data.REGISTERAuthorized;
    let ekipRol = data.TEAM;
    let supheliRol = data.SUPHELI;
    let chatKANAL = data.CHAT;
    let boost = data.BOOST
    if (!message.guild.roles.cache.get(erkekRol[0]) &&
        !message.guild.roles.cache.get(kadinRol[0]) &&
        !message.guild.roles.cache.get(unRegisterRol[0]) &&
        !message.guild.roles.cache.get(kayitSorumlusu[0]) &&
        !client.channels.cache.get(registerChannel) &&
        !tag && !tag2) return message.reply(`Lütfen kurulum sistemini tamamen bitiriniz \`${conf.prefix[0]}setup help\``);
        if (message.member.permissions.has(8n) || message.member.roles.cache.some(e => kayitSorumlusu.some(x => x == e)) || message.member.permissions.has(8n)) {

        let kntrl = limit.get(message.author.id)
        let sre = sure.get(message.author.id)
        if (kntrl >= 5 && sre > Date.now() && !message.member.permissions.has(8n) && !message.member.roles.cache.some(rol => data.MUTEAuthorized.includes(rol.id))) {
message.channel.send("Kısa Süre İçerisinde **6** ve daha fazla kayıt işlemi gerçekleştirdiğin için yetkilerin alındı.")
            return message.member.roles.remove(user.roles.cache.filter(rol => message.guild.roles.cache.get(data.TEAM).position <= rol.position && !rol.managed))
        }
        if (!sre) {
            sure.set(message.author.id, Date.now()+ms("30s"))
        }
        
        limit.set(message.author.id, (limit.get(message.author.id) || 0) +1)
        setTimeout(() => {
            limit.delete(message.author.id)
            sure.delete(message.author.id)
        }, ms("30s"));
    
        if (!target) return message.reply(client.Reply.üyeBelirt);
        unreg = unRegisterRol;
        if (!args[1]) return message.reply(client.Reply.isimBelirt);

        let name = args[1][0].toUpperCase() + args[1].substring(1);
        if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(client.Reply.aynıüstYT);
        
        if (target.roles.cache.some(rol => erkekRol.includes(rol.id))) return message.reply(client.Reply.zatenKayıtlı)
        if (target.roles.cache.some(rol => kadinRol.includes(rol.id))) return message.reply(client.Reply.zatenKayıtlı)

        let autoLogin = await puansystem.findOne({
            guildID: message.guild.id
        });
        target.user.username.includes(tag) ? kadinRol.push(ekipRol) : kadinRol = kadinRol;
            await target.roles.remove(unreg).then(async x => {
                await target.roles.set(target.roles.cache.has(boost) ? [boost, ...kadinRol] : [...kadinRol])
                let = İsimYascik = `${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} ${name}`
                await target.setNickname(`${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} ${target.user.username} (${name})`);
				
                if (target.roles.cache.some(rol => erkekRol.some(rol2 => rol.id == rol2))) {
                    await erkekRol.forEach(async (res, i) => {
                        setTimeout(async () => {
                            await target.roles.remove(res)
                        }, i * 1000);
                    })
                };
                teyit.findOne({guildID: message.guild.id, victimID: target.id}, (err, wex) => {
                    if(!wex) {
                        let Embed = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
                        message.reply({ embeds: [Embed.setDescription(`${target} adlı kullanıcı **Kadın** olarak kayıt edildi.`)] }).then(e => setTimeout(() => e.delete().catch(() => { }), 20000)), message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`)
                    } else {
                    const History = wex.nicknames.reverse().map((e, i) => ` \`${i + 1}.\` \`${e.isimler}\` (**${e.rol}**) - <@${e.execID}> - ${dateToUnixEpoch(e.date)}`).slice(0, 30)
                    let Embede = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
                    message.reply({ embeds: [Embede.setDescription(`${target} adlı kullanıcı **Kadın** olarak kayıt edildi fakat kişini geçmiş isimleri görüntülendi.\n\n${History.join("\n")}\n\n${client.emojis.cache.find(x => x.name === "wex_carpi") || "Emoji Bulunamadı"} Kullanıcının toplam \`${History.length}\` adet geçmiş isim kaydı görüntülendi.`)] }).then(e => setTimeout(() => e.delete().catch(() => { }), 20000)), message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`)}})
                    teyit.findOne({guildID: message.guild.id, victimID: target.id}, (err, res) => {
                    if(!res) {
                    new teyit({guildID: message.guild.id, victimID: target.id, nicknames: [{isimler: `${İsimYascik}`, rol: `Kadın`, execID: message.author.id, date: Date.now()}]}).save()
                    } else {
                    res.nicknames.push({isimler: `${İsimYascik}`,rol: `Kadın`, execID: message.author.id, date: Date.now()})
                    res.save()}})
            
                
                client.channels.cache.get(chatKANAL).send(client.ayarlar.chatMesajı.replace("-member-", target)).then(msg => msg.delete({
                    timeout: 1000 * 15
                }))
                await randMiss.findOneAndUpdate({ userID: message.member.id, "Mission.MISSION": "teyit" }, { $inc: { Check: 1 } }, { upsert: true });
                client.easyMission(message.author.id, "teyit", 1)
                return client.addAudit(message.author.id, 1, "Kadin");
            })
 
    }

        }
        function dateToUnixEpoch(date) {
            return `<t:${Math.floor(Math.floor(date) / 1000)}:R>`
          }
        exports.conf = {
            aliases: ["k", "Kadın", "KADIN", "Woman", "woman"]
        }
        exports.help = {
            name: 'kadın'
        }  