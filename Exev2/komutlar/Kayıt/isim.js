const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let teyit = require("../../models/teyit");
let isim_limit = new Map();

module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    if ((isim_limit.get(message.author.id) || 0) >= 5) return message.reply("5 dakikada en fazla 5 isim değişikliği yapabilirsin.")
    isim_limit.set(message.author.id, (isim_limit.get(message.author.id) || 0)+1)

    setTimeout(() => {
        isim_limit.set(message.author.id, (isim_limit.get(message.author.id) || 0)-1)
    }, 1000*60*5)

    let data = await sunucuayar.findOne({guildID: message.guild.id});
    if(message.member.roles.cache.some(rol => data.REGISTERAuthorized.some(rol2 => rol.id == rol2)) || message.member.permissions.has(8n)) {
        let tag = data.TAG
        let tag2 = data.TAG2;
    
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply(client.Reply.üyeBelirt);
    if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(client.Reply.aynıüstYT);
    if (!args[1]) return message.reply(client.Reply.isimBelirt);
    
    let isim = args[1][0].toUpperCase() + args[1].substring(1);
        let isimler = await teyit.findOne({
            userID: target.id
        });
        let İsimYascik = `${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} ${isim}`
        await target.setNickname(`${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} ${target.user.username} (${isim})`);
        teyit.findOne({guildID: message.guild.id, victimID: target.id}, (err, res) => {
            if(!res) {
            new teyit({guildID: message.guild.id, victimID: target.id, nicknames: [{isimler: `${İsimYascik}`, rol: `İsim Değiştirme`, execID: message.author.id, date: Date.now()}]}).save()
            } else {
            res.nicknames.push({isimler: `${İsimYascik}`,rol: `İsim Değiştirme`, execID: message.author.id, date: Date.now()})
            res.save()}})
            let Embed = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
            message.reply({ embeds: [Embed.setDescription(`${target} adlı kullanıcının ismi \`${İsimYascik}\` olarak değiştirldi.`)] }).then(e => setTimeout(() => e.delete().catch(() => { }), 10000)), message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`)
            
    } else return;
};

exports.conf = {
    aliases: ["isim", "İsim", "İSİM", "ISIM"]
};
exports.help = {
    name: 'name'
};