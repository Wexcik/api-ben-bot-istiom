const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');

exports.run = async (client, message, args, durum, kanal) => {
  if (!message.guild) return;
  let guild = message.guild;
  if (!client.ayarlar.sahip.some(x => x === message.author.id)) return
	if(args[0] === "kur" || args[0] === "kurulum") {
    
    let onay = "https://cdn.discordapp.com/emojis/802098678369091594.gif?v=1";
    let iptal = "https://cdn.discordapp.com/emojis/673576480487506011.gif?v=1"; 
    let bosta = "https://cdn.discordapp.com/emojis/673576453140512788.png?v=1";
    let rahatsizetmeyin = "https://cdn.discordapp.com/emojis/673576231433797664.png?v=1";
    let gorunmez = "https://cdn.discordapp.com/emojis/673576417224556611.png?v=1";
    let cevrimici = "https://cdn.discordapp.com/emojis/673576292205068314.png?v=1";
    let wex_stat = "https://cdn.discordapp.com/emojis/813380585338699806.png?v=1";
    let wex_bitisbar = "https://cdn.discordapp.com/emojis/812591747393650728.gif?v=1";
    let wex_solbar =  "https://cdn.discordapp.com/emojis/812591747401646100.gif?v=1";
    let wex_ortabar = "https://cdn.discordapp.com/emojis/813380548768563250.gif?v=1";
    let wex_baslangicbar = "https://cdn.discordapp.com/emojis/813380552924594216.png?v=1";
    let wex_gribitisbar = "https://cdn.discordapp.com/emojis/813825131674730528.png?v=1";
    let wex_griortabar = "https://cdn.discordapp.com/emojis/813441171489292348.png?v=1";
    let wex_deynek = "https://cdn.discordapp.com/emojis/794553871405285386.gif?v=1"
    let bannedEmoji =    "https://cdn.discordapp.com/emojis/925746073052516404.gif?v=1";
    let chatmuteEmoji =  "https://cdn.discordapp.com/emojis/959385737986445312.png?v=1";
    let voiceMuteEmoji = "https://cdn.discordapp.com/emojis/911197650416721920.png?v=1";
    let jailedEmoji =    "https://cdn.discordapp.com/emojis/946782601862086698.png?v=1";


    guild.emojis.create(bannedEmoji, "wex_banned").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(chatmuteEmoji, "wex_muted").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(voiceMuteEmoji, "wex_vmuted").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(jailedEmoji, "wex_jailed").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(wex_deynek, "wex_deynek").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(wex_stat, "wex_stat").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(onay, "wex_tik").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(iptal, "wex_iptal").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(bosta, "wex_away").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(rahatsizetmeyin, "wex_dnd").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(gorunmez, "wex_offline").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(cevrimici, "wex_online").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(wex_baslangicbar, "wex_baslangicbar").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(wex_bitisbar, "wex_bitisbar").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(wex_solbar, "wex_solbar").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(wex_ortabar, "wex_ortabar").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(wex_gribitisbar, "wex_gribitisbar").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(wex_griortabar, "wex_griortabar").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    
    return;
  };
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['emojis'],
    permLevel: 4
  };
  
  exports.help = {
    name: 'emoji',
    description: "Sunucuda komut denemeye yarar",
    usage: 'eval <kod>',
    kategori: "Bot Yapımcısı"
  };
  