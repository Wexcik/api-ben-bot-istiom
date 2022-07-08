const {
	MessageEmbed,
	Discord
} = require("discord.js");
const conf = client.ayarlar
let jailInterval = require("../../models/jailInterval");
let sunucuayar = require("../../models/sunucuayar");
const ceza = require("../../models/ceza");
const otologin = require("../../models/otokayit");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    if (kanal) return;
	let data = await sunucuayar.findOne({guildID: message.guild.id});
	let jailRol = data.REKLAM;
	let booster = data.BOOST
	let kayitsizUyeRol = data.UNREGISTER
	let tag = data.TAG;
	let tag2 = data.TAG2
	if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) {
		let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
		if (!target.roles.cache.get(jailRol)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Reklamcıda Değil?\` Belirttiğin kullanıcı zaten **reklamcıda değil**.`);
		await target.roles.set(kayitsizUyeRol)
		await target.setNickname("• İsim | Yaş")
		message.channel.send(`Başarılı bir şekilde <@${target.id}> adlı kullanıcının jailini kaldırdınız.`)
		await ceza.updateMany({ "userID": target.id, "Ceza": "REKLAM" }, { Sebep: "AFFEDILDI", Bitis: Date.now() });
		await jailInterval.deleteOne({userID: target.id})
	} else return
}
exports.conf = {
	aliases: ["Unreklam", "reklamkaldır", "reklamcezalı", "UNREKLAM", "UNJREK"]
}
exports.help = {
	name: 'unreklam'
}