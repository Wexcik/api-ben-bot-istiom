const {
  MessageEmbed,
  Discord
} = require("discord.js");
let sunucuayar = require("../../models/sunucuayar");
let table = require("string-table");
module.exports.run = async (client, message, args, durum, kanal) => {
  
  if (!message.guild) return;
    
  let data = await sunucuayar.findOne({});

let unRegisterRol = data.UNREGISTER;
if (message.member.permissions.has(8n) || durum) {
    let Embed = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor("RANDOM");
    let bg = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
    if (args[0] == "add") {
        bg.forEach(r => {
            r.roles.add(unRegisterRol)
        });
        message.reply({ embeds: [Embed.setDescription(`${client.emojis.cache.find(x => x.name === "wex_beyazboncuk")} Sunucuda Rolü Olmayan Kullanıcılara <@&${unRegisterRol}> rolü tanılandı. (\`${bg.size}\`)`)] }).catch((err) => console.log(err), message.react(`${client.emojis.cache.find(x => x.name === "wex_onay")}`)).then(e => setTimeout(() => e.delete().catch(() => { }), 20000))
    } else if (!args[0]) {
        message.reply({ embeds: [Embed.setDescription(`${client.emojis.cache.find(x => x.name === "wex_beyazboncuk")} Sunucuda Rolsüzlere Verilmek için Tanımlanan Rol;
${client.emojis.cache.find(x => x.name === "wex_beyazboncuk")} Unregister Rol: <@&${unRegisterRol}>
${client.emojis.cache.find(x => x.name === "wex_beyazboncuk")} Sunucuda Rolü Bulunmayan Kullanıcı Sayısı \`${bg.size}\`
        
        Kullanıcılara Rolü Vermek için \`.roles add\` komutunu uygula.`)] }).catch((err) => console.log(err), message.react(`${client.emojis.cache.find(x => x.name === "wex_carpi")}`)).then(e => setTimeout(() => e.delete().catch(() => { }), 25000))
    }

} else return;
}
exports.conf = {
  aliases: ["roles"]
}
exports.help = {
  name: 'rolsüz'
}