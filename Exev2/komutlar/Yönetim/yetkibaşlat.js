const {
  MessageEmbed,
  Discord
} = require("discord.js");
const Stats = require("../../models/stats")
const ayarlar = require("../../../settings")
const yetkiliData = require("../../models/yetkili")
const { MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');

let sunucuayar = require("../../models/sunucuayar");
let table = require("string-table");
module.exports.run = async (client, message, args, durum, kanal) => {
  
  if (!message.guild) return;
    
  let data = await sunucuayar.find({})
  if (message.member.permissions.has(8n) && message.member.roles.cache.some(rol => data[0].UstYetkiliRol.some(rol2 => rol.id == rol2)) || durum) {
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
    let datas = await yetkiliData.findOne({ userID: target.id})
    if (datas) return message.react(client.emojis.cache.find(x => x.name === "wex_iptal")), message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Hatalı İşlem\` Belirttiğin kullanıcı zaten yetkili olarak databasede kayıtlı.`);

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setPlaceholder(`${target.user.tag || target.username} kullanıcısına verebileceğin yetkiler.`)
        .setCustomId('yetkibaslat')
        .addOptions([      
        {
              label: `${ayarlar.Yetki1Name} Yetkilerini ver!`,
              description: `Kullanıcıya ${ayarlar.Yetki1Name} yetkisini ver!`,
              value: "yetki1",
        },
        { 
          label: `${ayarlar.Yetki2Name} Yetkilerini ver!`,
          description: `Kullanıcıya ${ayarlar.Yetki2Name} yetkisini ver!`,
          value: "yetki2",

        },
        { 
          label: `${ayarlar.Yetki3Name} Yetkilerini ver!`,
          description: `Kullanıcıya ${ayarlar.Yetki3Name} yetkisini ver!`,
          value: "yetki3",

        },
      ])
      );
      let mesggased = message.channel.send({ components: [row], content: `sasas` }).then(async m => {
        let collector = m.createMessageComponentCollector({ filter: row => row.member.user.id === message.author.id, max: 1, time: 20000, errors: ['time'] })
        collector.on('collect', async (interaction) => {
            
    if(interaction.values == "yetki1") {
        const Embed = new MessageEmbed().setColor("PURPLE").setFooter("Yetkili puanın tanımlandı!").setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
        .setDescription(`${client.emojis.cache.find(x => x.name === "wex_tik")} Başarılı bir şekilde ${target} üyesine **${ayarlar.Yetki1Name}** yetkilerini tanımladım.`)
        target.roles.add(ayarlar.Yetki1Roles)
        message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
        await yetkiliData.updateOne({
          userID: target.id,
          Durum: "puan"
      }, {
          authorID: message.author.id
      }, {
          upsert: true
      }).exec();
      Stats.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {["coin"]: 30}}, {upsert: true}).exec();    
        interaction.message.delete()
    interaction.channel.send({embeds: [Embed] })}	
    if(interaction.values == "yetki2") {
      const Embed = new MessageEmbed().setColor("PURPLE").setFooter("Yetkili puanın tanımlandı!").setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
      .setDescription(`${client.emojis.cache.find(x => x.name === "wex_tik")} Başarılı bir şekilde ${target} üyesine **${ayarlar.Yetki2Name}** yetkilerini tanımladım.`)
    target.roles.add(ayarlar.Yetki2Roles)
    message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
    await yetkiliData.updateOne({
      userID: target.id,
      Durum: "puan"
  }, {
      authorID: message.author.id
  }, {
      upsert: true
  }).exec();
  Stats.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {["coin"]: 30}}, {upsert: true}).exec();
      interaction.message.delete()
  interaction.channel.send({embeds: [Embed] })}		 
  if(interaction.values == "yetki3") {
    const Embed = new MessageEmbed().setColor("PURPLE").setFooter("Yetkili puanın tanımlandı!").setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setDescription(`${client.emojis.cache.find(x => x.name === "wex_tik")} Başarılı bir şekilde ${target} üyesine **${ayarlar.Yetki3Name}** yetkilerini tanımladım.`)
    target.roles.add(ayarlar.Yetki3Roles)
    message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
    await yetkiliData.updateOne({
      userID: target.id,
      Durum: "puan"
  }, {
      authorID: message.author.id
  }, {
      upsert: true
  }).exec();
  Stats.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {["coin"]: 30}}, {upsert: true}).exec();

    interaction.message.delete()
interaction.channel.send({embeds: [Embed] })}		 

    })
  })    
  }

  
}
exports.conf = {
  aliases: ["yetkibaslat"]
}
exports.help = {
  name: 'ybaslat'
}