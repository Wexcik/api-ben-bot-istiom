
let sunucuayar = require("../../models/sunucuayar");
let randMiss = require("../../models/randomMission");
let moment = require("moment")
let puansystem = require("../../models/puansystem");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

    if (!client.ayarlar.sahip.includes(message.author.id)) return;
    const rowcuk = new MessageActionRow().addComponents(
      new MessageButton()
      .setCustomId('davetGörev')
      .setLabel(`Davet Görevi`)
      .setStyle('PRIMARY'),
      new MessageButton()
      .setCustomId('mesajGörevi')
      .setLabel(`Mesaj Görevi`)
      .setStyle('PRIMARY'),
      new MessageButton()
      .setCustomId('sesGörev')
      .setLabel(`Ses Görevi`)
      .setStyle('PRIMARY'),
      new MessageButton()
      .setCustomId('taglıGörev')
      .setLabel(`Taglı Görevi`)
      .setStyle('PRIMARY'),
      new MessageButton()
      .setCustomId('teyitGörev')
      .setLabel(`Teyit Görevi`)
      .setStyle('PRIMARY'),)      
      message.channel.send({ components: [rowcuk], content: `Selamlar \`${message.guild.name}\` Yetkilileri!
Aşağıda bulunan butonlar sayesinde dilediğin görev tipini seçebilirsiniz, butonlar hakkında bilgiler aşağıda belirtilmiştir.

\`•\` Davet Görevi \`••>\` Ortalama 5 ila 20 davet görevi vermektedir.
\`•\` Mesaj Görevi \`••>\` Belirtilen metin kanalına mesaj göndermelisin, ortalama 100 ila 500 vermektedir.
\`•\` Ses Görevi \`••>\` Belirtilen ses kanalında vakit geçirmelisin, Ortalama 1 ila 5 saat arası vermektedir.
\`•\` Teyit Görevi \`••>\` Ortalama 10 ila 20 teyit görevi verir.
\`•\` Taglı Görevi \`••>\` Ortalama 1 ila 3 taglı görevi verir.

\`Not:\`__Görev 24 Saatliktir yani bir görevi aldıktan sonra 24 saat içerisinde tamamlamalısın.__`}), message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`)

    
  }
exports.conf = {aliases: ["görevbuton", "butontask"]}
exports.help = {name: 'taskbuton'}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
