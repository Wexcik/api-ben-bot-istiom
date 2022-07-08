const {
  MessageEmbed
} = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const roller = require("./models/rollog")
let muteInterval = require("./models/muteInterval");
let puansystem = require("./models/puansystem");
let vmuteInterval = require("./models/vmuteInterval");
let jailInterval = require("./models/jailInterval");
const Discord = require('discord.js');
const client = global.client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
  ]
});
const members = require("./models/membersInvıte")
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
moment.locale("tr");
const logs = require("discord-logs");
logs(client)
const Stat = require("./models/stats");
let StaffXP = require("./models/stafxp");
let mainSettings = require(__dirname + "/../settings.js");
let mongoose = require("mongoose");
mongoose.connect(mainSettings.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
client.db = require("./models/özelperm");
client.Reply = require("../AutoReply")


const sunucuayar = require('./models/sunucuayar');
let randMiss = require("./models/randomMission");
let easyMiss = require("./models/easyMission");
let guildInvites = require("./models/guildInvıtes");
let xpData = require("./models/stafxp");
require('./util/eventLoader')(client);
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
const hanedan = require("./models/hanedanlik");

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir(__dirname + '/komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    fs.readdir(__dirname + "/komutlar/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./komutlar/${f}/` + file);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
        });
      })
    })
  });
});

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-.]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.on("ready", async () => {
  let sunucu = client.guilds.cache.get(mainSettings.sunucuId)
  let sunucuData = await sunucuayar.findOne({
      guildID: mainSettings.sunucuId
  })
  let muteRol = sunucuData.MUTED;
  setInterval(async () => {
      let muted = await muteInterval.find({
          "muted": true,
          "endDate": {
              $lte: Date.now()
          }
      });
      muted.forEach(async memberdata => {
          if (!sunucu) return;
          if (!sunucu.members.cache.has(memberdata.userID)) {
              await muteInterval.deleteOne({
                  userID: memberdata.userID
              }).exec()
          } else {
              let member = sunucu.members.cache.get(memberdata.userID)
              if (!member) return;
              await member.roles.remove(muteRol)
              await muteInterval.deleteOne({
                  userID: memberdata.userID
              }).exec()
          }
      });
  }, 5000)
});

client.on("ready", async () => {
  let sunucuData = await sunucuayar.findOne({
      guildID: mainSettings.sunucuId
  })
  let sunucu = client.guilds.cache.get(mainSettings.sunucuId);
  setInterval(async () => {
      let jail = await jailInterval.find({
          jailed: true,
          endDate: {
              $lte: Date.now()
          }
      });
      jail.forEach(async memberdata => {

          if (!sunucu) return;
          if (!sunucu.members.cache.has(memberdata.userID)) {
              await jailInterval.deleteOne({
                  userID: memberdata.userID
              }).exec();
          } else {
              let member = sunucu.members.cache.get(memberdata.userID)
              if (!member) return;
              let unregister = sunucuData.UNREGISTER;
              let booster = sunucuData.BOOST;
              member.roles.cache.has(sunucuData.BOOST) ? unregister.push(booster) : unregister;
              await member.roles.set(unregister)
              await jailInterval.deleteOne({
                  userID: member.id
              }).exec();
          }
      });
  }, 5000);
});

client.on("ready", async () => {
  let sunucuData = await sunucuayar.findOne({
      guildID: mainSettings.sunucuId
  })
let sunucu = client.guilds.cache.get(mainSettings.sunucuId);
let vmuteRol = sunucuData.VMUTED;
  setInterval(async () => {
      let vmuted = await vmuteInterval.find({
          muted: true,
          endDate: {
              $lte: Date.now()
          }
      })
      vmuted.forEach(async memberdata => {
          if (!sunucu) return;
          if (!sunucu.members.cache.has(memberdata.userID)) {
              vmuteInterval.deleteOne({
                  userID: memberdata.userID
              }).exec();
          } else {
              let member = sunucu.members.cache.get(memberdata.userID)
              if (!member) return;

                  await member.roles.remove(vmuteRol)
                  await member.voice.setMute(false).catch(() => {});
                  vmuteInterval.deleteOne({
                      userID: memberdata.userID
                  }).exec()
          }
      })
  }, 5000);
})



client.ayarlar = {
  "prefix": mainSettings.prefix,
  "botSesID": mainSettings.botSesID,
  "sunucuId": mainSettings.sunucuId,
  "sahip": mainSettings.sahip,
  "commandChannel": mainSettings.commandChannel,

  "CHAT_KANAL": mainSettings.CHAT_KANAL,
  "PUBLIC_KATEGORI": mainSettings.PUBLIC_KATEGORI,
  "STREAMER_KATEGORI": mainSettings.STREAMER_KATEGORI,
  "REGISTER_KATEGORI": mainSettings.REGISTER_KATEGORI,
  "SLEEP_ROOM": mainSettings.SLEEP_ROOM,
  "taglıAlım": mainSettings.taglıAlım,

  "footer": mainSettings.footer,
  "onsekizatilacakoda": mainSettings.onsekizatilacakoda,
  "onsekizodalar": mainSettings.onsekizodalar,
  "readyFooter": mainSettings.readyFooter,
  "chatMesajı": mainSettings.chatMesajı,
  "YETKI_VER_LOG": mainSettings.YETKI_VER_LOG,
  "CEZA_PUAN_KANAL": mainSettings.CEZA_PUAN_KANAL,

  "leaderboard": mainSettings.leaderboard,
  "yetkilisay": mainSettings.yetkilisay,
  "GörevSystem": mainSettings.GörevSystem,

  "vkyonetici": "",
}
const conf = client.ayarlar
global.conf = conf;

client.kullanabilir = function (id) {
  if (client.guilds.cache.get(mainSettings.sunucuId).members.cache.get(id).permissions.has("ADMINISTRATOR") || client.guilds.cache.get(mainSettings.sunucuId).members.cache.get(id).permissions.has("MANAGE_CHANNELS") || client.guilds.cache.get(mainSettings.sunucuId).members.cache.get(id).permissions.has("VIEW_AUDIT_LOG")) return true;
  return false;
};


client.on("guildMemberUpdate", async (oldMember, newMember) => {

  await newMember.guild.fetchAuditLogs({
    type: "MEMBER_ROLE_UPDATE"
}).then(async (audit) => {
    let ayar = audit.entries.first()
    let hedef = ayar.target
    let yapan = ayar.executor
    if (yapan.bot) return
    newMember.roles.cache.forEach(async role => {
        if (!oldMember.roles.cache.has(role.id)) {
            const emed = new Discord.MessageEmbed()
            .setAuthor({ name: hedef.tag, iconURL: hedef.displayAvatarURL({ dynamic: true })})
                .setColor("RANDOM")
                .setDescription(`
                **Rol Eklenen kişi**\n ${hedef} - **${hedef.id}** `)
                .addField(` Rolü Ekleyen Kişi`, `${yapan} - **${yapan.id}**`, false)
                .addField(` Eklenen Rol`, `${role} - **${role.id}**`, false)
                .setFooter({ text: yapan.tag, iconURL: yapan.displayAvatarURL({ dynamic: true })})
                .setTimestamp()
            roller.findOne({
                user: hedef.id
            }, async (err, res) => {
                if (!res) {
                    let arr = []
                    arr.push({
                        rol: role.id,
                        mod: yapan.id,
                        tarih: Date.parse(new Date()),
                        state: "Ekleme"
                    })
                    let newData = new roller({
                        user: hedef.id,
                        roller: arr
                    })
                    newData.save().catch(e => console.log(e))
                } else {
                    res.roller.push({
                        rol: role.id,
                        mod: yapan.id,
                        tarih: Date.parse(new Date()),
                        state: "Ekleme"
                    })
                    res.save().catch(e => console.log(e))
                }
            })
        }
    });
    oldMember.roles.cache.forEach(async role => {
        if (!newMember.roles.cache.has(role.id)) {
            const emeed = new Discord.MessageEmbed()
            .setAuthor({ name: hedef.tag, iconURL: hedef.displayAvatarURL({ dynamic: true })})
                .setColor("RANDOM")
                .setDescription(`
                **Rolü Alınan kişi** \n${hedef} - **${hedef.id}**`)
                .addField(`Rolü Alan Kişi`, `${yapan} - **${yapan.id}**`, false)
                .addField(`Alınan Rol`, `${role} - **${role.id}**`, false)
                .setFooter({text: yapan.tag, iconURL: yapan.displayAvatarURL({ dynamic: true })})
                .setTimestamp()

            roller.findOne({
                user: hedef.id
            }, async (err, res) => {
                if (!res) {
                    let arr = []
                    arr.push({
                        rol: role.id,
                        mod: yapan.id,
                        tarih: Date.parse(new Date()),
                        state: "Kaldırma"
                    })
                    let newData = new roller({
                        user: hedef.id,
                        roller: arr
                    })
                    newData.save().catch(e => console.log(e))
                } else {
                    res.roller.push({
                        rol: role.id,
                        mod: yapan.id,
                        tarih: Date.parse(new Date()),
                        state: "Kaldırma"
                    })
                    res.save().catch(e => console.log(e))
                }
            })
        }
    });
  })

});



let Database = require("./models/invite");
const { CommandInteractionOptionResolver } = require("discord.js");

client.on('ready', async () => {
  client.guilds.cache.forEach(async (guild) => {
      const inviteData = await guildInvites.findOne({ guildID: guild.id });
      const memberData = await members.findOne({ guildID: guild.id });
      if (!inviteData) console.log("Sunucu ayarları başarıyla yüklendi! artık kurulum yapabilirsiniz!"),await new members({ guildID: mainSettings.sunucuId }).save()
      const fetchedInvites = await guild.invites.fetch();
      if (!inviteData && !memberData) {
          await guild.invites.fetch().then(invites => {
              new guildInvites({
                  guildID: guild.id,
                  invites: new Map(invites.map(invite => [invite.code, invite.uses]))
              }).save();
          });
          new members({
              guildID: guild.id,
          }).save();
      } else {
          await guildInvites.findOneAndUpdate({ guildID: guild.id }, { $set: { invites: new Map(fetchedInvites.map(invite => [invite.code, invite.uses])) } }, { upsert: true });
      }
  });
});

///-------
client.on('ready', async () => {
  client.guilds.cache.forEach(async (guild) => {
    setInterval(() => {
      client.user.setActivity("Wex 💙 Aztecas",{type: "STREAMING", url: "https://twitch.tv/wexcik"})
    }, 10000);

      const inviteData = await guildInvites.findOne({ guildID: guild.id });
      const memberData = await members.findOne({ guildID: guild.id });
      if (!inviteData) console.log("Sunucu ayarları başarıyla yüklendi! artık kurulum yapabilirsiniz!"),await new members({ guildID: guild.id }).save()

      const fetchedInvites = await guild.invites.fetch();
      if (!inviteData && !memberData) {
          await guild.invites.fetch().then(invites => {
              new guildInvites({
                  guildID: guild.id,
                  invites: new Map(invites.map(invite => [invite.code, invite.uses]))
              }).save();
          });
          new members({
              guildID: guild.id,
          }).save();
      } else {
          await guildInvites.findOneAndUpdate({ guildID: guild.id }, { $set: { invites: new Map(fetchedInvites.map(invite => [invite.code, invite.uses])) } }, { upsert: true });
      }
  });
});

client.on('inviteCreate', async (invite) => {
  const inviteData = await guildInvites.findOne({ guildID: invite.guild.id });
  if (!inviteData) {
      await invite.guild.invites.fetch().then(invites => {
          new guildInvites({
              guildID: invite.guild.id,
              invites: new Map(invites.map(inv => [inv.code, inv.uses]))
          }).save();
      });
      return;
  }
  inviteData.invites.set(invite.code, invite.uses);
  await inviteData.save();
});
client.on('inviteDelete', async (invite) => {
  const inviteData = await guildInvites.findOne({ guildID: invite.guild.id });
  if (!inviteData) {
      await invite.guild.invites.fetch().then(invites => {
          new guildInvites({
              guildID: invite.guild.id,
              invites: new Map(invites.map(inv => [inv.code, inv.uses]))
          }).save();
      });
      return;
  }
  inviteData.invites.delete(invite.code);
  await inviteData.save();
});

client.on('guildMemberAdd', async (member) => {
  const inviteData = await guildInvites.findOne({ guildID: member.guild.id });
  const memberData = await members.findOne({ guildID: member.guild.id });
  if (!inviteData) {
      await member.guild.invites.fetch().then(invites => {
          new guildInvites({
              guildID: member.guild.id,
              invites: new Map(invites.map(inv => [inv.code, inv.uses]))
          }).save();
      });
      return;
  }
  let inviteChannelID = await sunucuayar.findOne({}).then(x => x.INVITEChannel);
  let inviteChannel = client.channels.cache.get(inviteChannelID);

  const newInvites = await member.guild.invites.fetch();
  const invite = newInvites.filter(inv => inv.uses != inviteData.invites.get(inv.code)).first() || { code: member.guild.vanityURLCode, uses: 0 };
  if (invite && !invite.code) return;
  const inviter = (invite.code == member.guild.vanityURLCode) ? { user: { tag: member.guild.name, id: member.guild.vanityURLCode }, id: member.guild.vanityURLCode } : member.guild.members.cache.get(invite.inviter.id);
  const inviterData = await Database.findOne({ guildID: member.guild.id, userID: inviter.id });

  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7 * 24 * 60 * 60 * 1000;
  if (isMemberFake) {
    await Database.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id, }, { $inc: { regular: 0, regular: 0, bonus: 0, fake: 1} }, { upsert: true });
    inviteChannel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} ${member} üyesi **${inviter.user.tag === member.guild.id ? member.guild.name : inviter.user.tag}**  tarafından <t:${Math.floor(Math.floor(Date.now()) / 1000)}:R> sunucumuza davet edildi.`).catch(err => {});
  } else {
    if (invite.code == member.guild.vanityURLCode) {
      inviteChannel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} ${member} üyesi sunucumuza **Özel URL** kullanarak <t:${Math.floor(Math.floor(Date.now()) / 1000)}:R> katıldı!`).catch(err => {});
    } else {
      inviteChannel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} ${member} üyesi **${inviter.user.tag === member.guild.id ? member.guild.name : inviter.user.tag}**  tarafından <t:${Math.floor(Math.floor(Date.now()) / 1000)}:R> sunucumuza davet edildi.`).catch(err => {});
      await Database.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id, }, { $inc: { regular: 1, bonus: 0, fake: 0} }, { upsert: true });

    } }
  if (invite.code) {
      inviteData.invites.set(invite.code, invite.uses);
      await inviteData.save();
  }

  memberData.members.set(member.id, { inviter: inviter, invite: invite });
  await memberData.save();
  await randMiss.findOneAndUpdate({ userID: inviter.id, "Mission.MISSION": "davet" }, { $inc: { Check: 1 } }, { upsert: true });
  client.dailyMission(inviter.id, "davet", 1)
  client.easyMission(inviter.id, "davet", 1);
  aaddAudit(inviter.id, 1)
  Stat.updateOne({
    userID: inviter.id,
    guildID: member.guild.id
  }, {
    $inc: {
      ["coin"]: 2
    }
  }, {
    upsert: true
  }).exec();

});

client.on('guildMemberRemove', async (member) => {
  let inviteChannelID = await sunucuayar.findOne({}).then(x => x.INVITEChannel);
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7 * 24 * 60 * 60 * 1000;
  const inviteData = await guildInvites.findOne({ guildID: member.guild.id });
  const memberData = await members.findOne({ guildID: member.guild.id });
  if (!inviteData) return;
  if (!memberData) return;
  let inviteChannel = client.channels.cache.get(inviteChannelID);
  const data = memberData.members.get(member.id);
  if (!data) return inviteChannel.send(`${member.user.tag} Kullanıcısı sunucudan ayrıldı **Davet Eden: Bulunamadı.** `)
  const invite = data.invite;
  const inviter = data.inviter == member.guild.vanityURLCode ? { user: { tag: member.guild.name, id: member.guild.vanityURLCode }, id: member.guild.vanityURLCode } : member.guild.members.cache.get(data.inviter);
  if (!inviter) return inviteChannel.send(`${client.emojis.cache.find(x => x.name === "wex_carpi")} **${member.user.tag}** üyesi sunucumuzdan <t:${Math.floor(Math.floor(Date.now()) / 1000)}:R> ayrıldı!`).catch(err => {});
  if (isMemberFake) {
    await Database.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id, }, { $inc: { regular: 0,  bonus: 0, fake: -1} }, { upsert: true });
    inviteChannel.send(`${client.emojis.cache.find(x => x.name === "wex_carpi")} **${member.user.tag}** üyesi sunucumuzdan <t:${Math.floor(Math.floor(Date.now()) / 1000)}:R> ayrıldı! Sunucumuza **${inviter.user.tag === member.guild.id ? member.guild.name : inviter.user.tag}** üyesi tarafından davet edilmiş.`).catch(err => {});
  } else {
    await Database.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id, }, { $inc: { regular: -1,  bonus: 0, fake: 0} }, { upsert: true });
    inviteChannel.send(`${client.emojis.cache.find(x => x.name === "wex_carpi")} **${member.user.tag}** üyesi sunucumuzdan <t:${Math.floor(Math.floor(Date.now()) / 1000)}:R> ayrıldı! Sunucumuza **${inviter.user.tag === member.guild.id ? member.guild.name : inviter.user.tag}** üyesi tarafından davet edilmiş.`).catch(err => {});

  }
  memberData.members.delete(member.id);
   await memberData.save();
   client.dailyMission(inviter.id, "davet", -1)
   client.easyMission(inviter.id, "davet", -1);
   aaddAudit(inviter.id, -1)

     Stat.updateOne({
    userID: inviter.id,
    guildID: member.guild.id
  }, {
    $inc: {
      ["coin"]: -2
    }
  }, {
    upsert: true
  }).exec();


});
//-------
client.login(mainSettings.EXECUTIVE).catch(err => console.log("Token bozulmuş lütfen yeni bir token girmeyi dene"));

client.emoji = function (x) {
  return client.emojis.cache.find(x => x.name === client.emojiler[x]);
};
const emoji = global.emoji;

const sayiEmojiler = {
  0: "",
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
  9: ""
};

client.emojiSayi = function (sayi) {
  var yeniMetin = "";
  var arr = Array.from(sayi);
  for (var x = 0; x < arr.length; x++) {
    yeniMetin += (sayiEmojiler[arr[x]] === "" ? arr[x] : sayiEmojiler[arr[x]]);
  }
  return yeniMetin;
};

client.emojiler = {
  onay: "wex_tik",
  iptal: "wex_iptal",
  cevrimici: "wex_online",
  rahatsizetmeyin: "wex_dnd",
  bosta: "wex_away",
  gorunmez: "wex_offline",
  erkekEmoji: "wex_man",
  kizEmoji: "wex_woman",
  sagEmoji: "wex_sag",
  tikEmoji: "wex_tik",
  aktifEmoji: "wex_acik",
  deaktifEmoji: "wex_kapali",
  muteEmoji: "wex_muted",
  unmuteEmoji: "wex_unmuted",
  deafnedEmoji: "wex_deafned",
  undeafnedEmoji: "wex_undeafned"
};

global.emoji = client.emoji = function (x) {
  return client.emojis.cache.find(x => x.name === client.emojiler[x]);
};

client.sayilariCevir = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


client.renk = {
  //"renksiz": "2F3136", // 0x36393E
  "mor": "#3c0149",
  "mavi": "#10033d",
  "turkuaz": "#00ffcb",
  "kirmizi": "#750b0c",
  "yesil": "#032221" // 00cd00 - 008b00
};

client.randomColor = function () {
  return client.renk[Object.keys(client.renk).random()];
};

let kufurler = ["allahoc", "allahoç", "allahamk", "allahaq", "0r0spuc0cu", "4n4n1 sk3r1m", "p1c", "@n@nı skrm", "evladi", "orsb", "orsbcogu", "amnskm", "anaskm", "oc", "abaza", "abazan", "ag", "a\u011fz\u0131na s\u0131\u00e7ay\u0131m", "fuck", "shit", "ahmak", "seks", "sex", "allahs\u0131z", "amar\u0131m", "ambiti", "am biti", "amc\u0131\u011f\u0131", "amc\u0131\u011f\u0131n", "amc\u0131\u011f\u0131n\u0131", "amc\u0131\u011f\u0131n\u0131z\u0131", "amc\u0131k", "amc\u0131k ho\u015faf\u0131", "amc\u0131klama", "amc\u0131kland\u0131", "amcik", "amck", "amckl", "amcklama", "amcklaryla", "amckta", "amcktan", "amcuk", "am\u0131k", "am\u0131na", "amına", "am\u0131nako", "am\u0131na koy", "am\u0131na koyar\u0131m", "am\u0131na koyay\u0131m", "am\u0131nakoyim", "am\u0131na koyyim", "am\u0131na s", "am\u0131na sikem", "am\u0131na sokam", "am\u0131n feryad\u0131", "am\u0131n\u0131", "am\u0131n\u0131 s", "am\u0131n oglu", "am\u0131no\u011flu", "am\u0131n o\u011flu", "am\u0131s\u0131na", "am\u0131s\u0131n\u0131", "amina", "amina g", "amina k", "aminako", "aminakoyarim", "amina koyarim", "amina koyay\u0131m", "amina koyayim", "aminakoyim", "aminda", "amindan", "amindayken", "amini", "aminiyarraaniskiim", "aminoglu", "amin oglu", "amiyum", "amk", "amkafa", "amk \u00e7ocu\u011fu", "amlarnzn", "aml\u0131", "amm", "ammak", "ammna", "amn", "amna", "amnda", "amndaki", "amngtn", "amnn", "amona", "amq", "ams\u0131z", "amsiz", "amsz", "amteri", "amugaa", "amu\u011fa", "amuna", "ana", "anaaann", "anal", "analarn", "anam", "anamla", "anan", "anana", "anandan", "anan\u0131", "anan\u0131", "anan\u0131n", "anan\u0131n am", "anan\u0131n am\u0131", "anan\u0131n d\u00f6l\u00fc", "anan\u0131nki", "anan\u0131sikerim", "anan\u0131 sikerim", "anan\u0131sikeyim", "anan\u0131 sikeyim", "anan\u0131z\u0131n", "anan\u0131z\u0131n am", "anani", "ananin", "ananisikerim", "anani sikerim", "ananisikeyim", "anani sikeyim", "anann", "ananz", "anas", "anas\u0131n\u0131", "anas\u0131n\u0131n am", "anas\u0131 orospu", "anasi", "anasinin", "anay", "anayin", "angut", "anneni", "annenin", "annesiz", "anuna", "aq", "a.q", "a.q.", "aq.", "ass", "atkafas\u0131", "atm\u0131k", "att\u0131rd\u0131\u011f\u0131m", "attrrm", "auzlu", "avrat", "ayklarmalrmsikerim", "azd\u0131m", "azd\u0131r", "azd\u0131r\u0131c\u0131", "babaannesi ka\u015far", "baban\u0131", "baban\u0131n", "babani", "babas\u0131 pezevenk", "baca\u011f\u0131na s\u0131\u00e7ay\u0131m", "bac\u0131na", "bac\u0131n\u0131", "bac\u0131n\u0131n", "bacini", "bacn", "bacndan", "bacy", "bastard", "b\u0131z\u0131r", "bitch", "biting", "boner", "bosalmak", "bo\u015falmak", "cenabet", "cibiliyetsiz", "cibilliyetini", "cibilliyetsiz", "cif", "cikar", "cim", "\u00e7\u00fck", "dalaks\u0131z", "dallama", "daltassak", "dalyarak", "dalyarrak", "dangalak", "dassagi", "diktim", "dildo", "dingil", "dingilini", "dinsiz", "dkerim", "domal", "domalan", "domald\u0131", "domald\u0131n", "domal\u0131k", "domal\u0131yor", "domalmak", "domalm\u0131\u015f", "domals\u0131n", "domalt", "domaltarak", "domalt\u0131p", "domalt\u0131r", "domalt\u0131r\u0131m", "domaltip", "domaltmak", "d\u00f6l\u00fc", "d\u00f6nek", "d\u00fcd\u00fck", "eben", "ebeni", "ebenin", "ebeninki", "ebleh", "ecdad\u0131n\u0131", "ecdadini", "embesil", "emi", "fahise", "fahi\u015fe", "feri\u015ftah", "ferre", "fuck", "fucker", "fuckin", "fucking", "gavad", "gavat", "giberim", "giberler", "gibis", "gibi\u015f", "gibmek", "gibtiler", "goddamn", "godo\u015f", "godumun", "gotelek", "gotlalesi", "gotlu", "gotten", "gotundeki", "gotunden", "gotune", "gotunu", "gotveren", "goyiim", "goyum", "goyuyim", "goyyim", "g\u00f6t", "g\u00f6t deli\u011fi", "g\u00f6telek", "g\u00f6t herif", "g\u00f6tlalesi", "g\u00f6tlek", "g\u00f6to\u011flan\u0131", "g\u00f6t o\u011flan\u0131", "g\u00f6to\u015f", "g\u00f6tten", "g\u00f6t\u00fc", "g\u00f6t\u00fcn", "g\u00f6t\u00fcne", "g\u00f6t\u00fcnekoyim", "g\u00f6t\u00fcne koyim", "g\u00f6t\u00fcn\u00fc", "g\u00f6tveren", "g\u00f6t veren", "g\u00f6t verir", "gtelek", "gtn", "gtnde", "gtnden", "gtne", "gtten", "gtveren", "hasiktir", "hassikome", "hassiktir", "has siktir", "hassittir", "haysiyetsiz", "hayvan herif", "ho\u015faf\u0131", "h\u00f6d\u00fck", "hsktr", "huur", "\u0131bnel\u0131k", "ibina", "ibine", "ibinenin", "ibne", "ibnedir", "ibneleri", "ibnelik", "ibnelri", "ibneni", "ibnenin", "ibnerator", "ibnesi", "idiot", "idiyot", "imansz", "ipne", "iserim", "i\u015ferim", "ito\u011flu it", "kafam girsin", "kafas\u0131z", "kafasiz", "kahpe", "kahpenin", "kahpenin feryad\u0131", "kaka", "kaltak", "kanc\u0131k", "kancik", "kappe", "karhane", "ka\u015far", "kavat", "kavatn", "kaypak", "kayyum", "kerane", "kerhane", "kerhanelerde", "kevase", "keva\u015fe", "kevvase", "koca g\u00f6t", "kodu\u011fmun", "kodu\u011fmunun", "kodumun", "kodumunun", "koduumun", "koyarm", "koyay\u0131m", "koyiim", "koyiiym", "koyim", "koyum", "koyyim", "krar", "kukudaym", "laciye boyad\u0131m", "libo\u015f", "madafaka", "malafat", "malak", "mcik", "meme", "memelerini", "mezveleli", "minaamc\u0131k", "mincikliyim", "mna", "monakkoluyum", "motherfucker", "mudik", "oc", "ocuu", "ocuun", "O\u00c7", "o\u00e7", "o. \u00e7ocu\u011fu", "o\u011flan", "o\u011flanc\u0131", "o\u011flu it", "orosbucocuu", "orospu", "orospucocugu", "orospu cocugu", "orospu \u00e7oc", "orospu\u00e7ocu\u011fu", "orospu \u00e7ocu\u011fu", "orospu \u00e7ocu\u011fudur", "orospu \u00e7ocuklar\u0131", "orospudur", "orospular", "orospunun", "orospunun evlad\u0131", "orospuydu", "orospuyuz", "orostoban", "orostopol", "orrospu", "oruspu", "oruspu\u00e7ocu\u011fu", "oruspu \u00e7ocu\u011fu", "osbir", "ossurduum", "ossurmak", "ossuruk", "osur", "osurduu", "osuruk", "osururum", "otuzbir", "\u00f6k\u00fcz", "\u00f6\u015fex", "patlak zar", "penis", "pezevek", "pezeven", "pezeveng", "pezevengi", "pezevengin evlad\u0131", "pezevenk", "pezo", "pic", "pici", "picler", "pi\u00e7", "pi\u00e7in o\u011flu", "pi\u00e7 kurusu", "pi\u00e7ler", "pipi", "pipi\u015f", "pisliktir", "porno", "pussy", "pu\u015ft", "pu\u015fttur", "rahminde", "revizyonist", "s1kerim", "s1kerm", "s1krm", "sakso", "saksofon", "saxo", "sekis", "serefsiz", "sevgi koyar\u0131m", "sevi\u015felim", "sexs", "s\u0131\u00e7ar\u0131m", "s\u0131\u00e7t\u0131\u011f\u0131m", "s\u0131ecem", "sicarsin", "sie", "sik", "sikdi", "sikdi\u011fim", "sike", "sikecem", "sikem", "siken", "sikenin", "siker", "sikerim", "sikerler", "sikersin", "sikertir", "sikertmek", "sikesen", "sikesicenin", "sikey", "sikeydim", "sikeyim", "sikeym", "siki", "sikicem", "sikici", "sikien", "sikienler", "sikiiim", "sikiiimmm", "sikiim", "sikiir", "sikiirken", "sikik", "sikil", "sikildiini", "sikilesice", "sikilmi", "sikilmie", "sikilmis", "sikilmi\u015f", "sikilsin", "sikim", "sikimde", "sikimden", "sikime", "sikimi", "sikimiin", "sikimin", "sikimle", "sikimsonik", "sikimtrak", "sikin", "sikinde", "sikinden", "sikine", "sikini", "sikip", "sikis", "sikisek", "sikisen", "sikish", "sikismis", "siki\u015f", "siki\u015fen", "siki\u015fme", "sikitiin", "sikiyim", "sikiym", "sikiyorum", "sikkim", "sikko", "sikleri", "sikleriii", "sikli", "sikm", "sikmek", "sikmem", "sikmiler", "sikmisligim", "siksem", "sikseydin", "sikseyidin", "siksin", "siksinbaya", "siksinler", "siksiz", "siksok", "siksz", "sikt", "sikti", "siktigimin", "siktigiminin", "sikti\u011fim", "sikti\u011fimin", "sikti\u011fiminin", "siktii", "siktiim", "siktiimin", "siktiiminin", "siktiler", "siktim", "siktim", "siktimin", "siktiminin", "siktir", "siktir et", "siktirgit", "siktir git", "siktirir", "siktiririm", "siktiriyor", "siktir lan", "siktirolgit", "siktir ol git", "sittimin", "sittir", "skcem", "skecem", "skem", "sker", "skerim", "skerm", "skeyim", "skiim", "skik", "skim", "skime", "skmek", "sksin", "sksn", "sksz", "sktiimin", "sktrr", "skyim", "slaleni", "sokam", "sokar\u0131m", "sokarim", "sokarm", "sokarmkoduumun", "sokay\u0131m", "sokaym", "sokiim", "soktu\u011fumunun", "sokuk", "sokum", "soku\u015f", "sokuyum", "soxum", "sulaleni", "s\u00fclaleni", "s\u00fclalenizi", "s\u00fcrt\u00fck", "\u015ferefsiz", "\u015f\u0131ll\u0131k", "taaklarn", "taaklarna", "tarrakimin", "tasak", "tassak", "ta\u015fak", "ta\u015f\u015fak", "tipini s.k", "tipinizi s.keyim", "tiyniyat", "toplarm", "topsun", "toto\u015f", "vajina", "vajinan\u0131", "veled", "veledizina", "veled i zina", "verdiimin", "weled", "weledizina", "whore", "xikeyim", "yaaraaa", "yalama", "yalar\u0131m", "yalarun", "yaraaam", "yarak", "yaraks\u0131z", "yaraktr", "yaram", "yaraminbasi", "yaramn", "yararmorospunun", "yarra", "yarraaaa", "yarraak", "yarraam", "yarraam\u0131", "yarragi", "yarragimi", "yarragina", "yarragindan", "yarragm", "yarra\u011f", "yarra\u011f\u0131m", "yarra\u011f\u0131m\u0131", "yarraimin", "yarrak", "yarram", "yarramin", "yarraminba\u015f\u0131", "yarramn", "yarran", "yarrana", "yarrrak", "yavak", "yav\u015f", "yav\u015fak", "yav\u015fakt\u0131r", "yavu\u015fak", "y\u0131l\u0131\u015f\u0131k", "yilisik", "yogurtlayam", "yo\u011furtlayam", "yrrak", "z\u0131kk\u0131m\u0131m", "zibidi", "zigsin", "zikeyim", "zikiiim", "zikiim", "zikik", "zikim", "ziksiiin", "ziksiin", "zulliyetini", "zviyetini"];
client.chatKoruma = async mesajIcerik => {
  if (!mesajIcerik) return;
  let inv = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
  if (inv.test(mesajIcerik)) return true;

  let link = /(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;
  if (link.test(mesajIcerik)) return true;

  if ((kufurler).some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(mesajIcerik))) return true;
  return false;
};

client.splitEmbedWithDesc = async function (description, author = false, footer = false, features = false) {
  let embedSize = parseInt(`${description.length/2048}`.split('.')[0]) + 1
  let embeds = new Array()
  for (var i = 0; i < embedSize; i++) {
    let desc = description.split("").splice(i * 2048, (i + 1) * 2048)
    let x = new MessageEmbed().setDescription(desc.join(""))
    if (i == 0 && author) x.setAuthor(author.name, author.icon ? author.icon : null)
    if (i == embedSize - 1 && footer) x.setFooter(footer.name, footer.icon ? footer.icon : null)
    if (i == embedSize - 1 && features && features["setTimestamp"]) x.setTimestamp(features["setTimestamp"])
    if (features) {
      let keys = Object.keys(features)
      keys.forEach(key => {
        if (key == "setTimestamp") return
        let value = features[key]
        if (i !== 0 && key == 'setColor') x[key](value[0])
        else if (i == 0) {
          if (value.length == 2) x[key](value[0], value[1])
          else x[key](value[0])
        }
      })
    }
    embeds.push(x)
  }
  return embeds
};

client.yolla = async function (mesaj, msg, kanal) {
  if (!mesaj || typeof mesaj !== "string") return
  const embd = new Discord.MessageEmbed()
    .setAuthor(msg.tag, msg.displayAvatarURL({
      dynamic: true
    }))
    .setColor("RANDOM")
    .setDescription(mesaj)
  kanal.send(embd).then(msg => {
      msg.delete({
        timeout: 15000
      })
    })
    .catch(console.error);
}

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dk.]');
};

client.wait = async function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
};
Array.prototype.shuffle = function () {
  let i = this.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
};
Array.prototype.temizle = function () {
  let yeni = [];
  for (let i of this) {
    if (!yeni.includes(i)) yeni.push(i);
  }
  return yeni;
};

client.savePunishment = async () => {
  sunucuayar.findOne({}, async (err, res) => {
    if (!res) return
    res.WARNID = res.WARNID + 1
    res.save().catch(e => console.log(e))
  })
}

client.Embed = async (kanal, message) => {

  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(message)
  client.channels.cache.get(kanal).send(embed).then(x => x.delete({
    timeout: 5000
  }))
  return embed
}

function aaddAudit(id, value) {
  Stat.updateMany({
    userID: id,
    guildID: client.ayarlar.sunucuId
  }, {
    $inc: {
      "yedi.Invite": value
    }
  }).exec((err, res) => {
    if (err) console.error(err);
  });
};


client.addAudit = function (id, value, Type) {
  if (Type == "Erkek") {
    Stat.updateMany({
      userID: id,
      guildID: client.ayarlar.sunucuId
    }, {
      $inc: {
        "yedi.Register": value,
        "Man": value,
        ["coin"]: 0.6666666666666666
      }
    }, {
      upsert: true
    }).exec((err, res) => {
      if (err) console.error(err);
    });

  } else if (Type == "Kadin") {
    Stat.updateMany({
      userID: id,
      guildID: client.ayarlar.sunucuId
    }, {
      $inc: {
        "yedi.Register": value,
        "Woman": value,
        ["coin"]: 0.6666666666666666
      }
    }, {
      upsert: true
    }).exec((err, res) => {
      if (err) console.error(err);
    });
  } else return;
}
client.on("guildMemberRoleAdd", async (member, role) => {
  member.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => {
    let ayar = audit.entries.first()
    let hedef = ayar.target
    let yapan = ayar.executor
     
  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setFooter(`Ana sunucunuzda .rollog ${member.id} komutunu kullanabilirsin.`)
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))

    .setDescription(`\`${member.user.tag}\` (\`${member.id}\`) isimli üyeye \`${yapan.tag}\` (\`${yapan.id}\`) adlı yetkili tarafından bir rol **eklendi.**`)
    .addField(`Kullanıcı`,`${member}`, true)
    .addField(`Yetkili`,`${yapan}`, true)
    .addField(`Tarih`,`${moment(Date.now()).locale("tr").format("LLL")} `, true)
    .addField(`Rol Detayları;`,`${role} - (\`${role.id}\` - \`${role.name}\``)
    client.channels.cache.get(client.channels.cache.find(x => x.name == `role-log-basic`).id).send(`:key: \`${member.user.tag}\` üyeye \`${role.name}\` rolü eklendi. [\`${yapan.tag}\`]`)
    client.channels.cache.get(client.channels.cache.find(x => x.name == `role-log`).id).send({embeds: [embed]})}) })

        
    client.on("messageDelete", async (message) => {
      if (message.author.bot) return;
      let embed = new MessageEmbed()
        .setThumbnail(message.author.avatarURL({
          dynamic: true
        }))
        .setColor("RED")
        .setTimestamp()
        .setFooter(conf.footer)
        .setAuthor(message.author.tag, message.author.avatarURL({
          dynamic: true
        }))
        .setDescription(`
    ${message.author} üyesi ${message.channel} kanalında mesajını sildi.
    **__Silinen Mesaj:__**
    ${message.content.length > 0 ? message.content : "Silinen mesaj yoktur"}
    **__Silinen Mesajdaki Resimler:__**
    ${message.attachments.size > 0 ? message.attachments.filter(({ proxyURL }) => /\.(gif|jpe?g|png|webp)$/i.test(proxyURL)).map(({ proxyURL }) => proxyURL) : "Silinen resim yoktur"}s
    \`\`\`Kanal: #${message.channel.name} (${message.channel.id})\nKullanıcı: ${message.author.tag} (${message.author.id})\nMesaj ID: ${message.id}\nMesaj Atılma: ${moment(message.createdTimestamp).locale("tr").format("LLL")}\`\`\`
    `)
      client.channels.cache.get(client.channels.cache.find(x => x.name == "mesaj-log").id).send({embeds: [embed]})
    });
    client.on("messageUpdate", async (oldMessage, newMessage) => {
      if (newMessage.author.bot) return;
      let embed = new MessageEmbed()
        .setColor("BLUE")
        .setTimestamp()
        .setFooter(conf.footer)
        .setAuthor(newMessage.author.tag, newMessage.author.avatarURL({
          dynamic: true
        }))
        .setDescription(`
    ${newMessage.author} üyesi ${newMessage.channel} kanalında bir mesajı düzenledi.
    **__Düzenlenmeden Önce:__**
    ${oldMessage.content}
    **__Düzenlendikten Sonra:__**
    ${newMessage.content}
    \`\`\`Kanal: #${newMessage.channel.name} (${newMessage.channel.id})\nKullanıcı: ${newMessage.author.tag} (${newMessage.author.id})\nMesaj ID: ${newMessage.id}\nMesaj Atılma: ${moment(newMessage.createdTimestamp).locale("tr").format("LLL")}\`\`\`
    `)
      client.channels.cache.get(client.channels.cache.find(x => x.name == "mesaj-log").id).send({embeds: [embed]})
    });
    
client.on("guildMemberRoleRemove", async (member, role) => {
  member.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => {
    let ayar = audit.entries.first()
    let hedef = ayar.target
    let yapan = ayar.executor
     
  let embed = new MessageEmbed()
    .setColor("RED")
    .setFooter(`Ana sunucunuzda .rollog ${member.id} komutunu kullanabilirsin.`)
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))

    .setDescription(`\`${member.user.tag}\` (\`${member.id}\`) isimli üyeden \`${yapan.tag}\` (\`${yapan.id}\`) adlı yetkili tarafından bir rol **alındı.**`)
    .addField(`Kullanıcı`,`${member}`, true)
    .addField(`Yetkili`,`${yapan}`, true)
    .addField(`Tarih`,`${moment(Date.now()).locale("tr").format("LLL")} `, true)
    .addField(`Rol Detayları;`,`${role} - (\`${role.id}\` - \`${role.name}\``)
    client.channels.cache.get(client.channels.cache.find(x => x.name == `role-log-basic`).id).send(`:wastebasket: \`${member.user.tag}\` üyesinden \`${role.name}\` rolü alındı. [\`${yapan.tag}\`]`)
    client.channels.cache.get(client.channels.cache.find(x => x.name == `role-log`).id).send({embeds: [embed]})}) })
     
    client.on("message", async (message) => {
      if (message.author.bot) return;
      const prefixes = client.ayarlar.prefix;
      let prefix = prefixes.filter(p => message.content.startsWith(p))[0];
      if (!prefix) return;
      let yazilanKomut = message.content.split(" ")[0];
      yazilanKomut = yazilanKomut.slice(prefix.length);
      if (!yazilanKomut) return;
      client.channels.cache.get(client.channels.cache.find(x => x.name == "cmd-log").id).send(`:wrench: **${message.author.tag}** (\`${message.author.id}\`) üyesi ${message.channel} kanalında bir komut kullandı: \`${prefix + yazilanKomut}\``)
    })
    
    client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
      if (oldNickname === newNickname) return;

      member.guild.fetchAuditLogs({
      type: "MEMBER_UPDATE"}).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        
  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(conf.footer)
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`\`${member.user.tag}\` (\`${member.id}\`) üyesinin sunucu içerisinde ismi **değiştirildi.**`)
    .addField(`Kullanıcı`,`${member}`, true)
    .addField(`Yetkili`,`\`${yapan.tag}\``, true)
    .addField(`Tarih`,`${moment(Date.now()).locale("tr").format("LLL")}`, true)
    .addField(`Değişiklikler;`,`**${oldNickname || member.user.tag}** \`=>\` **${newNickname|| member.user.tag}**`, true)
  client.channels.cache.get(client.channels.cache.find(x => x.name == `nickname-log`).id).send({embeds: [embed]})
})});



//

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (!oldState.channelId && newState.channelId) { 
      //  let users = newState.guild.members.cache.get(newState.id)
  let member = newState.guild.members.cache.get(newState.id)
  let microphone = member.voice.selfMute ? "kapalı" : "açık";
  let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
  let Embed = new MessageEmbed().setColor("GREEN")
  .setColor("GREEN")
  .setAuthor(oldState.member.user.tag, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
  .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
  .setDescription(`<@${newState.member.user.id}> üyesi <#${newState.channel.id}> kanalına giriş yaptı.\n\n**Kanala girdiği anda:**\n\`•\` Mikrofon durumu: \`${microphone}\`.\n\`•\` Kulaklık durumu: \`${headphones}\`.\n\`\`\`Giridiği kanal: ${newState.channel.name} (${newState.channelId})\nKullanıcı: ${newState.member.user.tag} (${newState.member.user.id})\nEylem Gerçekleşme: ${moment(newState.createdAt).locale("tr").format('LLL')}\n\n\n\`\`\`\nGirdiği kanalda bulunan üyeler:\n${newState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")}`)   
  client.channels.cache.find(a => a.name === "ses-log-basic").send(`\`${newState.member.user.tag}\` isimli üye \`${newState.channel.name}\` isimli kanala \`${moment(newState.createdAt).locale("tr").format('LLL')}\` tarihinde giriş yaptı.`)
  client.channels.cache.find(a => a.name === "ses-log").send({ embeds: [Embed]})}});


  client.on('voiceStateUpdate', async (oldState, newState) => {
    if(oldState.channelId && !newState.channelId){
    let member = newState.guild.members.cache.get(newState.id);
    let microphone = member.voice.selfMute ? "kapalı" : "açık";
    let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
    if(oldState.channel.members.map(x => x)[0]){
    var makro = oldState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")} else { var makro = "Maalesef bu kanalda üye bulunmamaktadır."; }
    let SesMicEmbed = new MessageEmbed()
    .setColor("RED")
    .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
    .setDescription(`<@${oldState.member.user.id}> üyesi <#${oldState.channel.id}> kanalından ayrıldı.\n\n**Kanaldan Çıktığı anda:**\n\`•\` Mikrofon durumu: \`${microphone}\`.\n\n\`•\` Kulaklık durumu: \`${headphones}\`.\n\n\`\`\`Çıktığı kanal: ${oldState.channel.name} (${oldState.channelId})\nKullanıcı: ${oldState.member.user.tag} (${oldState.member.user.id})\nEylem Gerçekleşme: ${moment(oldState.createdAt).locale("tr").format('LLL')}\`\`\`\nÇıktığı kanalda bulunan üyeler:\n${makro}`)   
    client.channels.cache.find(a => a.name === "ses-log-basic").send(`\`${newState.member.user.tag}\` isimli üye \`${oldState.channel.name}\` isimli isimli kanaldan \`${moment(newState.createdAt).locale("tr").format('LLL')}\` tarihinde ayıldı.`)
 
    client.channels.cache.find(a => a.name === "ses-log").send({ embeds: [SesMicEmbed]})}});


  
    client.on('voiceStateUpdate', async (oldState, newState) => {
      //console.log("sa") 
    if (oldState.channelId && newState.channelId && oldState.channel && newState.channel) {
    if (oldState.channelId !== newState.channelId) {
    //console.log("sam")
    let member = newState.guild.members.cache.get(newState.id);
    let microphone = member.voice.selfMute ? "kapalı" : "açık";
    let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
    if(oldState.channel.members.map(x => x)[0]){
    var makro = oldState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")} else {
    var makro = "Maalesef bu kanalda üye bulunmamaktadır.";}
    let SesMicEmbed1 = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor(oldState.member.user.tag, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
    .setDescription(`<@${oldState.member.user.id}> üyesi <#${oldState.channel.id}> kanalından <#${newState.channel.id}> kanalına geçiş yaptı.\n\n**Kanal Değiştirdiği Anda:**\n\`•\` Mikrofon durumu: \`${microphone}\`.\n\`•\` Kulaklık durumu: \`${headphones}\`.\n\n\`\`\`Çıktığı kanal: ${oldState.channel.name} (${oldState.channelId})\nKullanıcı: ${oldState.member.user.tag} (${oldState.member.user.id})\nEylem Gerçekleşme: ${moment(oldState.createdAt).locale("tr").format('LLL')}\`\`\`\n\nEski Kanalında Bulunan Üyeler:\n${makro}\n\nYeni Kanalında Bulunan Üyeler:\n${newState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")}`)   
    client.channels.cache.find(a => a.name === "ses-log-basic").send(`\`${newState.member.user.tag}\` isimli üye \`${oldState.channel.name}\` isimli kanaldan \`${newState.channel.name}\` isimli kanala \`${moment(newState.createdAt).locale("tr").format('LLL')}\` tarihinde geçiş yaptı.`)
    client.channels.cache.find(a => a.name === "ses-log").send({embeds: [SesMicEmbed1]})}}});   

    client.on("interactionCreate", async interaction => {
      const member = await client.guilds.cache.get(mainSettings.sunucuId).members.fetch(interaction.member.user.id)
      let görevCheckdavet = await randMiss.findOne({userID: member.id, "Mission.MISSION": "davet"}) 
      let görevCheckmesaj = await randMiss.findOne({userID: member.id, "Mission.MISSION": "mesaj"}) 
      let görevCheckses = await randMiss.findOne({userID: member.id, "Mission.MISSION": "ses"}) 
      if (interaction.customId === 'taglıGörev') {
        let taglıRandom = getRandomInt(1, 3)
        let coinMiktar = getRandomInt(10, 200)
        if(görevCheckdavet) return interaction.reply({content: `Aktif bir taglı görevin var görevin hakkında bilgi: **${görevChecktaglı.Mission.AMOUNT}** taglı kullanıcı kaydet! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})
        const ewqew = new randMiss({userID: member.id, Check: 0, Mission: {ID: member.id, MISSION: 'taglı', coin: coinMiktar, AMOUNT: taglıRandom}})
        interaction.reply({content: `Başarılı bir şekilde taglı görevi aldın! Bugün üzerine düşen **${taglıRandom}** taglı kullanıcı kaydet! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})
         await ewqew.save()}
     if (interaction.customId === 'teyitGörev') {
      let teyitRandom = getRandomInt(5, 20)
      let coinMiktar = getRandomInt(10, 200)
        if(görevCheckdavet) return interaction.reply({content: `Aktif bir teyit görevin var görevin hakkında bilgi: **${görevCheckdavet.Mission.AMOUNT}** kullanıcı kaydet! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})
        const ewqew = new randMiss({userID: member.id, Check: 0, Mission: {ID: member.id, MISSION: 'teyit', coin: coinMiktar, AMOUNT: teyitRandom}})
        interaction.reply({content: `Başarılı bir şekilde taglı görevi aldın! Bugün üzerine düşen **${teyitRandom}** kullanıcı kaydet! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})
         await ewqew.save()}

        if (interaction.customId === 'davetGörev') {
          let davetRandom = getRandomInt(5, 10)
          let coinMiktar = getRandomInt(10, 200)
          if(görevCheckdavet) return interaction.reply({content: `Aktif bir davet görevin var görevin hakkında bilgi: **${görevCheckdavet.Mission.AMOUNT}** taglı yapmak! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})
          const ewqew = new randMiss({userID: member.id, Check: 0, Mission: {ID: member.id, MISSION: 'davet', coin: coinMiktar, AMOUNT: davetRandom}})
          interaction.reply({content: `Başarılı bir şekilde davet görevi aldın! Bugün üzerine düşen **${davetRandom}** davet yapmak! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})
          await ewqew.save()
  
          }
  
        if (interaction.customId === 'mesajGörevi') {
          let dailyData = await puansystem.findOne({guildID: client.ayarlar.sunucuId}) || {DailyMission: {Type: false}};
          let messageKategori = dailyData.DailyMission.messageChannel;
          let MessageChannel = mainSettings.MesajChannels
          let mesajRandom = getRandomInt(300, 400)
          let coinMiktar = getRandomInt(10, 200)
          let MessageRandom = MessageChannel[Math.floor(Math.random() * MessageChannel.length)];
          if(görevCheckmesaj) return interaction.reply({content: `Aktif bir davet görevin var görevin hakkında bilgi: **${görevCheckmesaj.Mission.AMOUNT}** mesajs yapmak! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})
          const ewqewa = new randMiss({userID: member.id, Check: 0, Mission: {ID: member.id, MISSION: 'mesaj', AMOUNT: mesajRandom, coin: coinMiktar, CHANNEL: MessageRandom}})
          await ewqewa.save()
        interaction.reply({content: `Başarılı bir şekilde mesaj görevi aldın! Bugün üzerine düşen **${mesajRandom}** mesaj yazmak! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})

        }

        if (interaction.customId === 'sesGörev') {
          let dailyData = await puansystem.findOne({guildID: client.ayarlar.sunucuId}) || {DailyMission: {Type: false}};
          let messageKategori = dailyData.DailyMission.messageChannel;
          let MessageChannel = mainSettings.MesajChannels
          let sesRandom = getRandomInt(300, 400)
          let coinMiktar = getRandomInt(10, 200)
          let VoiceRandom = MessageChannel[Math.floor(Math.random() * MessageChannel.length)];
          if(görevCheckses) return interaction.reply({content: `Aktif bir ses görevin var görevin hakkında bilgi: **${görevCheckmesaj.Mission.AMOUNT}** ses kanallarında takılmak! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})
          const ewqewaa = new randMiss({userID: member.id, Check: 0, Mission: {ID: member.id, MISSION: "ses", coin: coinMiktar, AMOUNT: 1000*60*sesRandom, CHANNEL: VoiceRandom}})
          await ewqewaa.save()
        interaction.reply({content: `Başarılı bir şekilde mesaj görevi aldın! Bugün üzerine düşen **${sesRandom}** ses kanallarında takılmak! görevini 24 saat içerisinde tamamlamalısın.`, ephemeral: true})

        }


      })
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
client.dailyMission = async function (userID, type, value) {
  randMiss.findOne({
    userID: userID
  }, async (err, data) => {
    if (!data) return;
    if (data.Mission.MISSION == type) {
      data.Check += value;
      data.save()
    }
  })
}
client.easyMission = async function (userID, type, value) {
  easyMiss.findOne({
    userID: userID
  }, async (err, data) => {
    if (!data) return;
    if (data.Mission.Type == type) {
      data.Check += value;
      data.save()
    }
  })
}