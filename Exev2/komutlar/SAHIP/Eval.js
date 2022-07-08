const Discord = require("discord.js");
const util = require("util")
const Permissions = require("discord.js")
exports.run = async (client, message, args, durum, kanal) => {
  if (!message.guild) return
  let sahip = ["588383174506184714", "728161454288535604"]
  if (!sahip.some(x => x == message.author.id)) return;
  function clean(text) {
    if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
}
if (!args[0]) return message.reply(`Kod belirtilmedi`);
try {
    //eval("(async () => { " + code + "})();")
    const code = message.content.split(' ').slice(1).join(' ');
    let evaled = clean(await eval(code));
    if (typeof evaled !== "string") evaled = util.inspect(evaled).replace(client.token, "Yasaklı komut")
    const arr = Discord.Util.splitMessage(evaled, { maxLength: 1950, char: "\n" });
    arr.forEach(element => {
        message.channel.send(Discord.Formatters.codeBlock("js", element));
    });
} catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
}
}


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['eval'],
  permLevel: 4
};

exports.help = {
  name: 'eval',
  description: "Sunucuda komut denemeye yarar",
  usage: 'eval <kod>',
  kategori: "Bot Yapımcısı"
};

