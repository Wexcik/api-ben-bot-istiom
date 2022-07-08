const {
  MessageEmbed,
  Discord
} = require("discord.js");
let sunucuayar = require("../../models/sunucuayar");
let table = require("string-table");
module.exports.run = async (client, message, args, durum, kanal) => {
  
  if (!message.guild) return;
    
  let data = await sunucuayar.find({})
  if (message.member.permissions.has(8n) && message.member.roles.cache.some(rol => data[0].UstYetkiliRol.some(rol2 => rol.id == rol2)) || durum) {
    let enAltYetkiliRol = data[0].EnAltYetkiliRol
    const sec = args[0]
    if (!sec) {
      let members = message.guild.members.cache.filter(member => member.roles.cache.has(enAltYetkiliRol));    
      let sesteOlmayanlar = members.filter(member =>  !member.voice.channel && !member.user.bot && member.presence && member.presence.status !== "offline");

      let toplamyetkili = message.guild.roles.cache.get(enAltYetkiliRol).members.size
      let sesteOlanYetkili = message.guild.members.cache.filter(member => member.roles.cache.has(enAltYetkiliRol) && member.voice.channel && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id)).size;
      let aktifYetkili = message.guild.members.cache.filter(member => member.roles.cache.has(enAltYetkiliRol) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && (member.presence.status !== "offline")).size;
      let offlineYetkili = message.guild.members.cache.filter(member => member.roles.cache.has(enAltYetkiliRol) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && member.presence.status == "offline").size;

      let tablo = [{
        "TOPLAM": toplamyetkili + " kişi",
        "AKTİF": aktifYetkili + " kişi",
        "KAPALI": offlineYetkili + " kişi",
        "SESTE": sesteOlanYetkili + " kişi",
        "SESTE OLMAYAN": sesteOlmayanlar.size + " kişi"
      }]

      message.channel.send(`\`\`\`fix\n${table.create(tablo)}\`\`\``, {
        code: "md",
        split: true
      })
      message.channel.send(`Sunucumuzda aktif olan fakat seste olmayan yetkililer\n\`\`\`fix\n${sesteOlmayanlar.map(member => ` ${member} `).join(",")}\`\`\`
Sunucumuzda ${sesteOlmayanlar.size} yetkili aktif fakat ses kanalına bağlı değil.\`.ysay dm\``, {split: true})
    }

    if(args[0] === "dm") {
      message.guild.members.cache.filter(
          yetkili => yetkili.roles.cache.has(enAltYetkiliRol)).filter(yetkilises => !yetkilises.voice.channel && yetkilises.presence && yetkilises.presence.status != "offline" )
          .forEach(user => {
              user.send(`Merhabalar. **${message.guild.name}** sunucusunda ses aktifliğinizi artırmak ve yetkinizi yükseltmek için seslere giriniz. Müsait değil isen **Sleep Room** kanalına afk bırakabilirsin.`).catch(err => {
                  message.channel.send(`${user} isimli yetkiliye özel mesajları kapalı olduğu için mesaj atamıyorum. Lütfen seslere geçebilir misin ? Müsait değilsen **Sleep Room** kanalına geçebilirsin.`)
              })
            })
          }
  } else return;
}
exports.conf = {
  aliases: ["ysay", "seslikontrol", "Yetkilisay", "yetkili-say"]
}
exports.help = {
  name: 'yetkilisay'
}