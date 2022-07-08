const moment = require('moment');
let {MessageEmbed} = require('discord.js');
require("moment-duration-format");
let sunucuayar = require("../models/sunucuayar");
const client = global.client;
let conf = client.ayarlar

const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = async client => {
  try {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Aktif, Komutlar yüklendi!`);
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: ${client.user.username} ismi ile giriş yapıldı!`);
  
   let kanal = client.channels.cache.get(conf.botSesID);
    setInterval(() => {
        const oynuyor = client.ayarlar.readyFooter;
        const index = Math.floor(Math.random() * (oynuyor.length));
        client.user.setActivity("Wex 💙 Aztecas",{type: "STREAMING", url: "https://twitch.tv/wexcik"})
        const connection = joinVoiceChannel({
          channelId: kanal.id,
          guildId: kanal.guild.id,
          adapterCreator: kanal.guild.voiceAdapterCreator,
 });
      }, 10000);

      
  
  } catch (err) { }
  




setInterval(async() => {
  let alarmModel = require("../models/alarm.js");
  let alarmlar = await alarmModel.find({ bitis: { $lte: Date.now() } });
  for (let alarm of alarmlar) {
    let uye = client.guilds.cache.get(client.ayarlar.sunucuId).members.cache.get(alarm.uye);
    if (!uye) continue;
    let embed = new MessageEmbed().setColor("RANDOM").setDescription(alarm.aciklama).setTimestamp();
    uye.send(`**${uye} sana hatırlatmamı istediğin şeyin vakti geldi!**`, { embed: embed }).catch(err => {return undefined});
    let kanal = client.channels.cache.get(alarm.kanal);
    if (kanal) kanal.send(`**${uye} sana hatırlatmamı istediğin şeyin vakti geldi!**`, { embed: embed });
    await alarm.remove();
  };
}, 10000);

};

