

const { DiscordBanners } = require('discord-banners');
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Message} = require("discord.js")
const discordBanners = new DiscordBanners(client);
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    let user = args.length > 0 ? message.mentions.users.first()  || message.guild.members.cache.get(args[0]) ||message.author : message.author
    let avatar = user.displayAvatarURL({ dynamic: true, size: 4096 })
    let Embed = new MessageEmbed()
    const Banner = await discordBanners.getBanner(user.id, { size: 2048, dynamic: true })
    const row = new MessageActionRow().addComponents(
        new MessageButton().setLabel(`LINK`).setStyle(5).setURL(Banner),)    
    let msg = await message.channel.send({ components: [row], embeds: [Embed.setImage(Banner).setDescription(`**${user.tag || user.user.tag}** Kullanıcısının Banner'ı`)]})
 

    }
exports.conf = {aliases: ["bnnr", "bn"]}
exports.help = {name: 'banner'}
