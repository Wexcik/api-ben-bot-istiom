let sunucuayar = require("../../models/sunucuayar");
let vmuteInterval = require("../../models/vmuteInterval");
let muteInterval = require("../../models/muteInterval");
const ceza = require("../../models/ceza");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    let data = await sunucuayar.findOne({});
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
    let cezalar = await ceza.find({userID: target.id});
    if (cezalar.length == 0) {cezalar = [{Puan: 0}, {Puan: 0}];};
        message.reactions.removeAll();
     
            let muteRol = data.MUTED;
            if (await client.permAyar(message.author.id, message.guild.id, "mute") || durum) {
                if (!target.roles.cache.get(muteRol)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Muteli Değil?\` Belirttiğin kullanıcı zaten **muteli değil**.`);
                await muteInterval.deleteOne({userID: target.id}).exec();
                await target.roles.remove(muteRol).then(async (user) => {
                    message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} <@${target.id}> adlı üyenin bulunan **Chat-Mute** cezasını kaldırdın.`)});
                    await ceza.updateMany({ "userID": target.id, "Ceza": "MUTE" }, { Sebep: "AFFEDILDI", Bitis: Date.now() });

                message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`);
            } else return;

    
}
exports.conf = {aliases: ["uncmute","unchatmute"]}
exports.help = {name: 'unmute'}
