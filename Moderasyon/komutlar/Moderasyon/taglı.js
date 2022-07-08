const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let taglıData = require("../../models/taglıUye");
const { MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');
let Stat = require("../../models/stats");
let ayars = require("../../../settings")
let StaffXP = require("../../models/stafxp");
const hanedan = require("../../models/hanedanlik");
let limit = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    
    let data = await sunucuayar.findOne({})
    if (durum) {
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
       let datas = await taglıData.findOne({ userID: target.id})
            if (datas) return message.react(client.emojis.cache.find(x => x.name === "wex_iptal")), message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Hatalı İşlem\` Belirttiğin kullanıcıyı farklı bir yetkili taglı olarak kayıt etmiş.`);
        if (target.id === message.author.id) return message.react(client.emojis.cache.find(x => x.name === "wex_iptal")), message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Hatalı İşlem\` Kendini Taglı olarak kaydedemezsin..`);
		if (!target.user.username.includes(data.TAG)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Tagsız Kullanıcı\` Belirttiğin kullanıcının isminde **Tagımız bulunmamakta.**`);
        let embed= new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(message.author.tag, message.author.avatarURL({
            dynamic: true
        }))
        .setFooter(conf.footer)

        const row = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('onaylatagli').setLabel(`Onayla`).setStyle('SUCCESS'),
            new MessageButton().setCustomId('reddettagli').setLabel(`Reddet`).setStyle('DANGER'),)
            let msg = await message.channel.send({ components: [row], content: `${target}`, embeds: [embed.setDescription(`Hey ${target}, ${message.author} adlı yetkili seni taglı olarak kaydetmek istiyor onaylamak veya reddetmek için butonları kullanman yeterli.`)] })
            var filter = (button) => button.user.id === target.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
            collector.on('collect', async (button, user) => {      
            if(button.customId === "onaylatagli") {
                await taglıData.updateOne({
                    userID: target.id,
                    Durum: "puan"
                }, {
                    authorID: message.author.id
                }, {
                    upsert: true
                }).exec();
                Stat.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {["coin"]: 30}}, {upsert: true}).exec();
                await client.easyMission(message.author.id, "taglı", 1);
                await client.dailyMission(message.author.id, "taglı", 1)
                baddAudit(message.author.id, 1)
                msg.delete()
                button.channel.send({embeds: [embed.setDescription(`${client.emojis.cache.find(x => x.name === "wex_tik") || "Emoji Bulunamadı"} ${target} adlı üye onu taglı olarak kaydetmeni onayladı.`)] }), message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`)}
            if(button.customId === "reddettagli") { 
            msg.delete()
            button.channel.send({embeds: [embed.setDescription(`${client.emojis.cache.find(x => x.name === "wex_carpi") || "Emoji Bulunamadı"} ${target} adlı üye onu taglı olarak kaydetmeni reddetti.`)] }), message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`)}})
            }
    
  
}
exports.conf = {
    aliases: ["Taglı"]
}
exports.help = {
    name: 'taglı'
}

function baddAudit(id, value) {
    Stat.updateMany({
        userID: id,
        guildID: client.ayarlar.sunucuId
    }, {
        $inc: {
            "yedi.TagMember": value
        }
    }).exec((err, res) => {
        if (err) console.error(err);
    });
};