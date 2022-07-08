const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let ceza = require("../../models/ceza");
let moment = require("moment");
require("moment-timezone");
moment.locale("tr")
const { table } = require('table');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');


module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    
    if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) {
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")}\`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
                await ceza.find({ userID: target.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
        res.reverse()
            let datax = [
                ["🔵", "ID", "Tarih", "Ceza", "Sebep", "Yetkili"]
            ];

            let dataxe = [
                ["🔵", "ID", "Ceza", "Tarih", "Bitiş", "Yetkili", "Sebep"]
            ];

            let config = {
                border: {
                    topBody: ``,
                    topJoin: ``,
                    topLeft: ``,
                    topRight: ``,

                    bottomBody: ``,
                    bottomJoin: ``,
                    bottomLeft: ``,
                    bottomRight: ``,

                    bodyLeft: `│`,
                    bodyRight: `│`,
                    bodyJoin: `│`,

                    joinBody: ``,
                    joinLeft: ``,
                    joinRight: ``,
                    joinJoin: ``
                }
            };
            res.map(x => {
                datax.push([x.Sebep == "AFFEDILDI" ? "🔴" : x.Bitis == "null" ? "🟢" : x.Bitis == "KALICI" ? "🟢" : Date.now()>=x.Bitis ? "🔴" : "🟢", x.ID, moment(Number(x.Atilma)).format('LLL'), x.Ceza, x.Sebep, client.users.cache.get(x.Yetkili).tag])
            })
            let cezaSayi = datax.length - 1//, moment(Number(x.Atilma)).format('LLL') ,x.Ceza,  x.Sebep, x.Sebep == "AFFEDILDI" ? "🔴" : x.Bitis == "null" ? "🟢 (Devam Ediyor)" : x.Bitis == "KALICI" ? "🟢 (Devam Ediyor)" : Date.now()>=x.Bitis ? "🔴" : "🟢 (Devam Ediyor)"
            //
            //
            if(cezaSayi == 0) return message.channel.send(`${target} kullanıcısının ceza bilgisi bulunmuyor.`, message.author, message.channel)

            res.map(x => {////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                [ "Durum"]
                dataxe.push([x.Sebep == "AFFEDILDI" ? "🔴" : x.Bitis == "null" ? "🟢" : x.Bitis == "KALICI" ? "🟢" : Date.now()>=x.Bitis ? "🔴" : "🟢",x.ID, x.Ceza , moment(Number(x.Atilma)).format('LLL') , x.Bitis == "null" ? "KALICI" : x.Bitis == "KALICI" ? "KALICI" : moment(Number(x.Bitis)).locale("tr").format("LLL"), client.users.cache.get(x.Yetkili).tag, x.Sebep])
            })
            let out = table(dataxe, config)
            let outi = table(datax.slice(0, 10), config)

            
                const row = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId('CezaDosya')
                    .setLabel("Ceza Bilgi Dosyası")
                    .setEmoji("🚫")
                    .setStyle('PRIMARY'),
                  new MessageButton()
                    .setCustomId('CezaSayı')
                    .setLabel("Ceza Sayıları")
                    .setEmoji("❔")
                    .setStyle('PRIMARY'),
                  new MessageButton()
                    .setCustomId('CANCEL')
                    .setLabel("İptal")
                    .setStyle('DANGER'),
                );
                let msg = await message.channel.send({ components: [row], content: "<@" + target.id + "> kullanıcısının toplam " + cezaSayi + " cezası bulunmakta son 10 ceza aşağıda belirtilmiştir. Tüm ceza bilgi dosyasını indirmek için 🚫 emojisine, ceza sayılarına bakmak için ❔ emojisine basabilirsin.Tekli bir cezaya bakmak için `.ceza ID` komutunu uygulayınız. ```php\n" + outi + "\n``` " })

                var filter = (button) => button.user.id === message.author.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

                collector.on('collect', async (button) => {
                    if (button.customId === "CezaDosya") {
                    row.components[0].setDisabled(true) 
                    msg.edit({ components: [row] }); 
                    button.reply({content: `${target} kullanıcısının toplam ${datax.length - 1} cezası aşağıdaki belgede yazmaktadır.`, ephemeral: true,  files: [{ attachment: Buffer.from(out), name: `${target.user.username}_cezalar.txt` }] })
                   
                } else if (button.customId === "CezaSayı") {
                    row.components[1].setDisabled(true) 
                    msg.edit({ components: [row] }); 
                    let filterArr = res.map(x => (x.Ceza))
                    let chatMute = filterArr.filter(x => x == "MUTE").length || 0
                    let voiceMute = filterArr.filter(x => x == "SES MUTE").length || 0
                    let jail = filterArr.filter(x => x == "JAIL").length || 0
                    let ban = filterArr.filter(x => x == "BAN").length || 0
                    let reklam = filterArr.filter(x => x == "REKLAM").length || 0
                    let point = (chatMute * 8) + (voiceMute * 10) + (jail * 15) + (ban * 30) + (reklam * 20)
                   button.reply({ content: "\`\`\`" + target.user.tag + " kullanıcısının ceza bilgileri aşağıda belirtilmiştir:\n\nChat Mute: " + chatMute + " kez.\nSes Mute: " + voiceMute + " kez.\nCezalı Bilgisi: "+ jail + " kez.\nReklam Bilgisi: "+ reklam +"\nBan Bilgisi: " + ban + " kez.\n\nKullanıcı toplamda " + cezaSayi + " kez kural ihlali yapmış, kullanıcının ceza puanı "+point+".\`\`\`", ephemeral: true })
                    
                } else if (button.customId === "CANCEL") {
                    row.components[0].setDisabled(true) 
                    row.components[1].setDisabled(true) 
                    row.components[2].setDisabled(true) 
                    msg.edit({ components: [row] }); 
                    
                    button.reply({ content: "Herhangi bir işlem yapılmadığı için buton tepkimeleri iptal edildi!", ephemeral: true })


                }
                })  
                collector.on('end', async (button, reason) => {
                    row.components[0].setDisabled(true) 
                    row.components[1].setDisabled(true) 
                    row.components[2].setDisabled(true) 
                    msg.edit({ components: [row] }); 
                    
                })
            })
        }

            }
exports.conf = {aliases: ["sicil", "Cezalar", "Sicil"]}
exports.help = {name: 'cezalar'}

Date.prototype.toTurkishFormatDate = function () {
    return moment.tz(this, "Europe/Istanbul").format('LLL');
  };