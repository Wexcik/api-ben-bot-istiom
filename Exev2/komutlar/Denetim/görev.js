const {
    MessageEmbed
} = require("discord.js");
require("moment-timezone")

const { MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');
let Stat = require("../../models/stats");
let sunucuayar = require("../../models/sunucuayar");
let xpData = require("../../models/stafxp");
let uyarıData = require("../../models/uyarı");
const ayarlar = require("../../../settings")
let puansystem = require("../../models/puansystem");
let taglıData = require("../../models/taglıUye");
const yetkiliDB = require("../../models/yetkili");
let profil = require("../../models/profil");
let ozelKomut = require("../../models/özelkomut");
let missionSystem = require("../../models/randomMission");
const randomMission = require("../../models/randomMission");

module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    let sunucuData = await sunucuayar.findOne({
        guildID: message.guild.id
    });
        if(!ayarlar.commandChannel.some(kanal => message.channel.id.includes(kanal))) return message.react(`${client.emojis.cache.find(x => x.name === "wex_iptal")}`) 
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;


        let statemoji = client.emojis.cache.find(x => x.name === "wex_stat_2");

    missionSystem.find({userID: target.id}, async (err, res) => {
        let History2 = res.map((x, index) => `\n${res ? `${client.emojis.cache.find(x => x.name == "wex_newstat")} **Görev Türü:** \`${x.Mission.MISSION.toUpperCase()}\`\n${x.Mission.MISSION == "ses" ? `- Yaptıgın Miktar \`${(x.Check/(1000*60)).toFixed(0)} Dakika.\` - Gereken Miktar: \`${(x.Mission.AMOUNT/(1000*60)).toFixed(0)} Dakika.\`` : `- Yaptıgın Miktar: \`${(x.Check).toFixed(0)}\` - Gereken Miktar: \`${(x.Mission.AMOUNT).toFixed(0)}\``}\n${progressBar(x.Mission.MISSION == "ses" ? x.Check/(1000*60) : x.Check, x.Mission.MISSION == "ses" ? x.Mission.AMOUNT/(1000*60) : x.Mission.AMOUNT, 6)} \`${x.Mission.MISSION == "ses" ? `${(x.Check/(1000*60)).toFixed(0)} / ${(x.Mission.AMOUNT/(1000*60)).toFixed(0)}` : `${(x.Check).toFixed(0)} / ${(x.Mission.AMOUNT).toFixed(0)}`}\`
        **${x.Mission.MISSION.toUpperCase()}** görevinin **%${yuzdelik(x.Mission.MISSION == "ses" ? x.Check/(1000*60) : x.Check, x.Mission.MISSION == "ses" ? x.Mission.AMOUNT/(1000*60) : x.Mission.AMOUNT, 6)}** kısmını tamamlamışsın, görevi tamamlarsan **${x.Mission.coin}** coin kazanacaksın!` : "**Yapması gereken bir günlük görev olmadığı için görevleri listeleyemedim.**"}`).join("\n")
        let arr2 = [];
        const button = new MessageButton()
        .setCustomId('davetPuan')
        .setLabel('Davet Görevi')
        .setStyle('PRIMARY').setDisabled(true)
        const button2 = new MessageButton()
        .setCustomId('mesajPuan')
        .setLabel('Mesaj Görevi')
        .setStyle('PRIMARY').setDisabled(true)
        const button3 = new MessageButton()
        .setCustomId('sesPuan')
        .setLabel('Ses Görevi')
        .setStyle('PRIMARY').setDisabled(true)
        const button4 = new MessageButton()
        .setCustomId('teyitPuan')
        .setLabel('Teyit Görevi')
        .setStyle('PRIMARY').setDisabled(true)
        const button5 = new MessageButton()
        .setCustomId('taglıPuan')
        .setLabel('Taglı Görevi')
        .setStyle('PRIMARY').setDisabled(true)

        const rowButton = new MessageActionRow().addComponents(button, button2, button3, button4, button5)
            let kontrol = await missionSystem.find({userID: target.id});
        kontrol.forEach(async memberData => {
            let mission = memberData.Mission;
            
            if (memberData.Check >= mission.AMOUNT) {
                if (mission.MISSION == "davet") {
                    button.setDisabled(false)
                }
                if (mission.MISSION == "mesaj") {
                    button2.setDisabled(false)        
                }
                if (mission.MISSION == "ses") {
                    button3.setDisabled(false)        
                }
                if (mission.MISSION == "taglı") {
                    button5.setDisabled(false)        
                }
                if (mission.MISSION == "teyit") {
                    button4.setDisabled(false)        
                }

            }})                
            let davetCoin = await missionSystem.findOne({userID: target.id, "Mission.MISSION": "davet"});
            let mesajCoin = await missionSystem.findOne({userID: target.id, "Mission.MISSION": "mesaj"});
            let sesCoin = await missionSystem.findOne({userID: target.id, "Mission.MISSION": "ses"});
            let taglıCoin = await missionSystem.findOne({userID: target.id, "Mission.MISSION": "taglı"});
            let teyitCoin = await missionSystem.findOne({userID: target.id, "Mission.MISSION": "teyit"});

            let embed4 = new MessageEmbed().setColor("PURPLE").setFooter(client.ayarlar.footer)
    embed4.setDescription(`
      ${target} **Kullanıcısının Verileri Aşağıdaki Menüde Sıralanmıştır. Aşağıdaki Menüden İstediğiniz Verinin İstatistiğine Bakabilirsiniz**\n${History2 || "\n**Aktif Bulunan Bir Görev Bulunamadı.**"}`)
      let msgcik = await message.channel.send({ components: [rowButton], embeds: [embed4] })
      var filter = (button) => button.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 })

      collector.on('collect', async (button) => {
        if (button.customId === "teyitPuan") {       
            let coin = teyitCoin.Mission.coin
           await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
           button.message.delete()
           message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Teyit Görevini tamamladıgın için **${teyitCoin.Mission.coin}** bonus puan olarak eklendi.`)
            message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
      setTimeout(() => {
        teyitCoin.delete().catch(e => console.log(e))
        }, 1000);  
  
  }
          if (button.customId === "davetPuan") {       
              let coin = davetCoin.Mission.coin
             await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
             button.message.delete()
             message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Davet Görevini tamamladıgın için **${davetCoin.Mission.coin}** bonus puan olarak eklendi.`)
              message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
        setTimeout(() => {
            davetCoin.delete().catch(e => console.log(e))
          }, 1000);  
    
    }
    if (button.customId === "mesajPuan") {       
        let coin = mesajCoin.Mission.coin
       await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
       button.message.delete()
       message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Mesaj Görevini tamamladıgın için **${mesajCoin.Mission.coin}** bonus puan olarak eklendi.`)
        message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
  setTimeout(() => {
    mesajCoin.delete().catch(e => console.log(e))
    }, 1000);  }
    if (button.customId === "taglıPuan") {       
        let coin = taglıCoin.Mission.coin
       await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
       button.message.delete()
       message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Taglı Görevini tamamladıgın için **${taglıCoin.Mission.coin}** bonus puan olarak eklendi.`)
        message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
  setTimeout(() => {
    taglıCoin.delete().catch(e => console.log(e))
    }, 1000);  

}
if (button.customId === "sesPuan") {       
    let coin = sesCoin.Mission.coin
   await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
   button.message.delete()
   message.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Ses Görevini tamamladıgın için **${sesCoin.Mission.coin}** bonus puan olarak eklendi.`)
    message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
setTimeout(() => {
    sesCoin.delete().catch(e => console.log(e))
}, 1000);  

}


    })
    })}





function yetkiliStat(data, parentArray, yasaklıArray) {
    let obje = 0;
    if (data) {
        parentArray.forEach(parentID => {
            let ekle = 0;
            message.guild.channels.cache.filter(channel => channel.parentID == parentID).forEach(channel => {
                if (!yasaklıArray.includes(channel.id)) ekle += (data ? (data[channel.id] || 0) : {});
            })
            obje = ekle
        })
        return obje
    } else return obje
}


exports.conf = {
    aliases: ["tasks"]
}
exports.help = {
    name: 'task'
}

function progressBar(value, maxValue, size) {
    const percentage = value < 0 ? 0 : value >= maxValue ? 100 / 100 : value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
    const progressText = `${client.emojis.cache.find(x => x.name == "wex_ortabar")}`.repeat(progress);
    const emptyProgressText = `${client.emojis.cache.find(x => x.name == "wex_griortabar")}`.repeat(emptyProgress);
    const bar = `${value ? client.emojis.cache.find(x => x.name == "wex_solbar") : client.emojis.cache.find(x => x.name == "wex_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "wex_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "wex_gribitisbar")}`}`;
    return bar;
};

function yuzdelik(amount, value) {
    let miktar = amount;
    let istenen = value;
    return parseInt((miktar / istenen) * 100);
}