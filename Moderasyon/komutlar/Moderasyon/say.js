const {
    MessageEmbed,
    Discord
    } = require("discord.js");
    const conf = client.ayarlar;
    let mongoose = require("mongoose");
    let sunucuayar = require("../../models/sunucuayar");
    module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    if (message.member.permissions.has(8n) || durum) {
    let data = await sunucuayar.findOne({});
    let sunucuTAG = data.TAG;
    let tag = await message.guild.members.cache.filter(member => member.user.username.includes(sunucuTAG)).size;
    let sesli = message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.filter(member => !member.user.bot).size)
    let bot = message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.filter(member => member.user.bot).size)
    let embed = new MessageEmbed()
    .setColor("BLACK")
    .setDescription(`Sunucumuz da **__${message.guild.memberCount}__** üye bulunmakta.
    Sunucumuz da **__${message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size}__** aktif üye bulunmakta.
    Sunucumuz da **__${message.guild.members.cache.filter(u => u.user.username.includes("ᵃᶻᵗ")).size}__** taglı üye bulunmakta.
    Sunucumuzu boostlayan **__${message.guild.roles.cache.get("900275748596744223").members.size}}__** **__${message.guild.premiumTier != "NONE" ? `(\`${message.guild.premiumTier.replace("TIER_1","1").replace("TIER_2","2").replace("TIER_3", "3")}. Lvl\`)` : ``}__** üye bulunmakta.
    Ses kanallarında **__${message.guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").map(channel => channel.members.size).reduce((a, b) => a + b)}}__** **__(\`+${message.guild.members.cache.filter(x => x.user.bot && x.voice.channel).size} Bot\`)__** üye bulunmakta.`);
    message.channel.send({embeds: [embed]})
    }
    }
    exports.conf = {
    aliases: ["sunucusay", "serversay", "Say"]
    };
    exports.help = {
    name: 'say'
    };
    