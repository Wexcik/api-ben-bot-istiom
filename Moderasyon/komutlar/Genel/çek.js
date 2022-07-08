const { MessageEmbed, Discord } = require("discord.js");
const {MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js")

module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
  if (!message.member.voice.channel) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Ses Kanalına Bağlı Değil.\` Komutu kullanmadan önce **Ses Kanalına** bağlı olman gerek.`);  
  let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Üye Belirtilmedi.\` Geçerli bir **Üye belirt** ve tekrar dene.`);
  if (!target.voice.channel) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Kanala Bağlı Değil.\` Belirttiğin kullanıcı herhangi bir ses kanalına **Bağlı Değil**.`)
  if (message.member.voice.channel.id === target.voice.channel.id) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Aynı Kanaldasın.\` Çekmek istediğin kullanıcı ile zaten **Aynı Ses Kanalındasın**.`);
    let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setFooter(conf.footer)
        const row = new MessageActionRow().addComponents(
          new MessageButton().setCustomId('onayla').setLabel(`Onayla`).setStyle('SUCCESS'),
          new MessageButton().setCustomId('reddet').setLabel(`Reddet`).setStyle('DANGER'),)
          let msg2 = await message.channel.send(`${target}`)
          let msg = await message.channel.send({ components: [row], embeds: [embed.setDescription(`Hey ${target}, ${message.author} seni yanına çekmek istiyor! aşağıda bulunan butonlara tıklayarak odaya gelip gelmemesini belirtebilirsin.`)] }); message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`)
          var filter = (button) => button.user.id === target.id;
          const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
          collector.on('collect', async (button, user) => {      
          if(button.customId === "onayla") { msg.delete()
          target.voice.setChannel(message.member.voice.channel.id)
          button.channel.send({embeds: [embed.setDescription(`${client.emojis.cache.find(x => x.name === "wex_tik") || "Emoji Bulunamadı"} ${target} adlı kullanıcı odaya bağlanma isteğini onayladı.`)] })}
          if(button.customId === "reddet") { 
          button.channel.send({embeds: [embed.setDescription(`${client.emojis.cache.find(x => x.name === "wex_carpi") || "Emoji Bulunamadı"} ${target} adlı kullanıcı odaya bağlanma istediğini reddetti.`)] })
          }
        })
        collector.on("end", async (button) => {
          row.components[0].setDisabled(true) 
          row.components[1].setDisabled(true) 
  
          msg.edit({ components: [row], embeds: [embed.setDescription(`Hey ${message.author}, herhangi bir işlem yapılmadıgı için çekme işlemi iptal edildi.`)] }); 
      })
      
}
exports.conf = {aliases: ["cek", "Çek", "Cek"]}
exports.help = {name: 'çek'}
