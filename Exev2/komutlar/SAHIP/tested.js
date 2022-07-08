const Discord = require('discord.js');
exports.run = async function(client, message, params) {
  if (!message.guild) return
  if(!client.ayarlar.sahip.some(x => x == message.author.id)) return
  let missionSystem = require("../../models/randomMission");

  missionSystem.find({userID: message.author.id}, async (err, res) => {
    let History2 = res.map((x, index) => `\n \`${index + 1}.\` ${res ? ` ${client.emojis.cache.find(x => x.name == "wex_newstat")} \`${x.Mission.MISSION.toLowerCase()}\` ${x.Mission.MISSION == "ses" ? `- Miktar: \`${(x.Check/(1000*60)).toFixed(0)}\` Gereken Miktar: \`${(x.Mission.AMOUNT/(1000*60)).toFixed(0)}\`` : `- Miktar: \`${(x.Check).toFixed(0)}\` - Gerken Miktar: \`${(x.Mission.AMOUNT).toFixed(0)}\``} ${progressBar(x.Mission.MISSION == "ses" ? x.Check/(1000*60) : x.Check, x.Mission.MISSION == "ses" ? x.Mission.AMOUNT/(1000*60) : x.Mission.AMOUNT, 6)} \`${x.Mission.MISSION == "ses" ? `${(x.Check/(1000*60)).toFixed(0)} / ${(x.Mission.AMOUNT/(1000*60)).toFixed(0)}` : `${(x.Check).toFixed(0)} / ${(x.Mission.AMOUNT).toFixed(0)}`}\`
    ` : "**Yapması gereken bir günlük görev olmadığı için görevleri listeleyemedim.**"}
`).join("\n")
   message.reply(`${History2}`)
  })
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['wexciktest'],
  permLevel: 4
};

exports.help = {
  name: 'testedbot',
  description: "Botu yeniden başlatmaya yarar",
  usage: 'yenile',
  kategori: "Bot Yapımcısı"
};
function progressBar(value, maxValue, size) {
  const percentage = value < 0 ? 0 : value >= maxValue ? 100 / 100 : value / maxValue;
  const progress = Math.round((size * percentage));
  const emptyProgress = size - progress;
  const progressText = `${client.emojis.cache.find(x => x.name == "wex_ortabar")}`.repeat(progress);
  const emptyProgressText = `${client.emojis.cache.find(x => x.name == "wex_griortabar")}`.repeat(emptyProgress);
  const bar = `${value ? client.emojis.cache.find(x => x.name == "wex_solbar") : client.emojis.cache.find(x => x.name == "wex_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "wex_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "wex_gribitisbar")}`}`;
  return bar;
};
