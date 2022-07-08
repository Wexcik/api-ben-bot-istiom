const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let otokayit = require("../../models/otokayit");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
	let data = await sunucuayar.findOne({})
    let tag = data.TAG;
    let tag2 = data.TAG2;
    let unRegisterRol = data.UNREGISTER;
    if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) { 
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
    if (target.id === message.author.id) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Kendine İşlem Uygulayamazsın\` Kendine **Kayıtsız** işlemi uygulayamazsın.`);
    if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hatalı Kullanım\` Belirttiğin kullanıcı ile aynı veya kullanıcı senden daha üst bir yetkide.`);
    if (target.roles.cache.get(data.EnAltYetkiliRol) && !message.member.permissions.has(8n)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hatalı İşlem\` Yetkili kullanıcılar yetkililere ceza-i işlem **uygulayamazlar.**`);
    otokayit.deleteOne({userID: target.id}).exec();
        target.setNickname(`${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} İsim | Yaş`)
    target.roles.set(unRegisterRol).then(x => message.react(client.emojis.cache.find(x => x.name === "wex_tik"))).catch(y => message.react(client.emojis.cache.find(x => x.name === "wex_iptal")));
	} else return;
}
exports.conf = {aliases: ["unregister", "kayitsiz"]}
exports.help = {name: 'kayıtsız'}
