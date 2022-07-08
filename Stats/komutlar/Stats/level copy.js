const {
    Client,
    MessageEmbed,
    MessageAttachment
} = require('discord.js');
const {
    Canvas
} = require('canvas-constructor');
const {
    loadImage
} = require('canvas');
const {
    join
} = require("path");
require("moment-timezone")
const ayarlar = require("../../../settings")
let Stat = require("../../models/stats");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		let data = await Stat.findOne({userID: target.id, guildID: message.guild.id});
        let loading = await message.channel.send(`Veriler yükleniyor...`)
                
        const background = await loadImage("https://media.discordapp.net/attachments/904664323769651211/967469018011283526/owslarank.png")
        const avatar = await loadImage(target.user.avatarURL({
                    format: "jpg"
                }));
				// Default: 232;
                
                let embed = new MessageEmbed().setColor("0b7888")
                .setFooter(ayarlar.footer)
                .addField(`${client.emojis.cache.find(x => x.name == "wex_mesaj")} Mesaj Level Bilgileri`, `
                **${data.messageLevel}** Levelsin! (__**${data.messageXP.toFixed(0)}/${data.messageLevel*643}**__)
                Mesaj Levelinin **%${yuzdelik(data.messageXP, data.messageLevel*643, 232)}** bölümünü tamamlamışsın!`)
                .addField(`${client.emojis.cache.find(x => x.name == "wex_ses")} Ses Level Bilgileri`, `
                **${data.voiceLevel}** Levelsin! (__**${data.voiceXP.toFixed(0)}/${data.voiceLevel*643}**__)
                Ses Levelinin **%${yuzdelik(data.voiceXP, data.voiceLevel*643, 232)}** bölümünü tamamlamışsın!`).setDescription(`\`${message.guild.name}\` Sunucusundaki mesaj ve ses level bilgilerin aşağıda belirtilmiştir.`)
                
        loading.delete();
        message.channel.send({embeds: [embed]});

        
function progressBar(maxWidth, requiredXP, currentXP) {
    const percentage = currentXP < 0 ? 0 : currentXP >= requiredXP ? 0.1 / 0.1  : currentXP / requiredXP;
    const progress = Math.round((currentXP * percentage));
    const emptyProgress = currentXP - progress;
    const progressText = `${client.emojis.cache.find(x => x.name == "wex_ortabar")}`.repeat(progress);
    const emptyProgressText = `${client.emojis.cache.find(x => x.name == "wex_griortabar")}`.repeat(emptyProgress);
    const bar = `${maxWidth ? client.emojis.cache.find(x => x.name == "wex_solbar") : client.emojis.cache.find(x => x.name == "wex_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "wex_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "wex_gribitisbar")}`}`;
    return bar;
};

}
exports.conf = {
    aliases: ["Level","lvl","Lvl","LvL"]
}
exports.help = {
    name: 'level'
}


function yuzdelik(currentXP, requiredXP, maxWidth) {
    let miktar = currentXP;
    let istenen = requiredXP;
    return parseInt((miktar / istenen) * 100);
}
function getProgressBarWidth(currentXP, requiredXP, maxWidth) {
    if ((currentXP+0.1) > requiredXP) return maxWidth;

    let width = currentXP <= 0 ? 0 : ((currentXP+0.1) * maxWidth) / requiredXP;
    if (width > maxWidth) width = maxWidth;
    return width;
}
function progressBare(currentXP, maxWidth, requiredXP) {
    const percentage = currentXP < 0 ? 0 : currentXP >= maxWidth ? 20 / 20 : currentXP / maxWidth;
    const progress = Math.round((requiredXP * percentage));
    const emptyProgress = requiredXP - progress;
    const progressText = `${client.emojis.cache.find(x => x.name == "wex_ortabar")}`.repeat(progress);
    const emptyProgressText = `${client.emojis.cache.find(x => x.name == "wex_griortabar")}`.repeat(emptyProgress);
    const bar = `${currentXP ? client.emojis.cache.find(x => x.name == "wex_solbar") : client.emojis.cache.find(x => x.name == "wex_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "wex_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "wex_gribitisbar")}`}`;
    return bar;
};
