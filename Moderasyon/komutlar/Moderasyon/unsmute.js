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
     
            let muteRol = data.VMUTED;
            if (await client.permAyar(message.author.id, message.guild.id, "vmute") || durum) {
                if (!target.roles.cache.get(muteRol)) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Muteli Değil?\` Belirttiğin kullanıcı zaten **muteli değil**.`);

                message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} <@${target.id}> adlı üyenin bulunan **Voice-Mute** cezasını kaldırdın.`);
                await target.roles.remove(muteRol).catch(() => {});
                await vmuteInterval.deleteOne({userID: target.id}).exec();
                await ceza.updateMany({ "userID": target.id, "Ceza": "SES MUTE" }, { Sebep: "AFFEDILDI", Bitis: Date.now() });

                await target.voice.setMute(false).catch(() => {});
            } else return;
  

    
}
exports.conf = {aliases: ["unsmute","vunmute"]}
exports.help = {name: 'unvmute'}
