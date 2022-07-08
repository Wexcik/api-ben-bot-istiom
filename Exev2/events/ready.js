const moment = require('moment');
require("moment-duration-format");
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = async client => {
  try {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Aktif, Komutlar yüklendi!`);
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: ${client.user.username} ismi ile giriş yapıldı!`);
  
   let kanal = client.channels.cache.get(client.ayarlar.botSesID);
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
  

};
