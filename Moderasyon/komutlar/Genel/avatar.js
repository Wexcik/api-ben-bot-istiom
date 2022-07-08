

const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js")
const { MessageEmbed, Discord } = require("discord.js");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    let user = args.length > 0 ? message.mentions.users.first()  || message.guild.members.cache.get(args[0]) ||message.author : message.author
    let avatar = user.displayAvatarURL({ dynamic: true, size: 4096 })
    let Embed = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor("RANDOM");
    const row = new MessageActionRow().addComponents(
        new MessageButton().setLabel(`LINK`).setStyle(5).setURL(avatar),)    
        let msg = await message.channel.send({ components: [row], embeds: [Embed.setImage(avatar).setDescription(`**${user.tag || user.user.tag}** Kullanıcısının Avatar'ı`)]})
        var filter = (button) => button.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

    }
exports.conf = {aliases: ["Avatar", "pp"]}
exports.help = {name: 'avatar'}
