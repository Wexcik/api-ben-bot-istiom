let Stat = require("../models/stats");
let StaffXP = require("../models/stafxp");
let randMiss = require("../models/randomMission");
let sunucuayar = require("../models/sunucuayar");
let muteInterval = require("../models/muteInterval");
const {MessageEmbed, Collection,MessageAttachment} = require("discord.js");
const hanedan = require("../models/hanedanlik");
const {
    Canvas
} = require('canvas-constructor');
const {
    loadImage
} = require('canvas');
const {
    join
} = require("path");
module.exports = async message => {
  if (!message.guild) return
  if (message.author.bot) return;

  let sunucuData = await sunucuayar.findOne({guildID: message.guild.id});
  let muteRol = sunucuData.MUTED;
  let check = await muteInterval.findOne({userID: message.author.id});
  if (check && !message.member.roles.cache.get(muteRol)) {
    message.member.roles.add(muteRol)
  }
    await client.checkLevel(message.author.id, client.ayarlar.sunucuId, "mesaj")
    let data2 = await randMiss.findOne({"Mission.MISSION": "mesaj"});
    if (data2) {
      await randMiss.findOneAndUpdate({ userID: message.author.id, "Mission.MISSION": "mesaj" }, { $inc: {Check: 1 } }, { upsert: true });
    }


	  
	let data = await Stat.findOne({userID: message.author.id, guildID: message.guild.id}) || {messageLevel: 0};
			let siradakilevel = data.messageLevel * 643;

	 if (siradakilevel <= data.messageXP) {

	 	const avatar = await loadImage(message.author.avatarURL({format: "jpg"}));
	 	await Stat.updateOne({userID: message.author.id, guildID: message.guild.id}, {$set: {["messageXP"]: 0},$inc: {["messageLevel"]: 1, ["para"]: 10000*(data.messageLevel+1)}}, {upsert: true}).exec();
	 }
	
    await client.easyMission(message.author.id, "mesaj", 1);
    await addMessageStat(message.author.id, message.channel.id, 1, message.channel.parentID || "nocategory");

  };
async function addMessageStat(id, channel, value, category) {
	  let veris = await Stat.findOne({userID: id, guildID: client.ayarlar.sunucuId});
  if (!veris) {
      let newData = new Stat({
        userID: id,
        guildID: client.ayarlar.sunucuId,
        yedi: {
          Id: id,
          Invite: 0,
          Chat: {},
          Voice: {},
          TagMember: 0,
          Register: 0,
          Yetkili: 0
        }
      });
      newData.save();
    } else {
		  let randomMessageXP = [2, 4, 6, 8, 10, 12, 14, 16, 18].random();
	if ([client.ayarlar.CHAT_KANAL].includes(channel)) {
		hanedan.findOne({userID: id, guildID:client.ayarlar.sunucuId}, (err, data) => {
			if (!data) return;
			hanedan.updateOne({userID: id, guildID: client.ayarlar.sunucuId}, {
			  $inc: {
				[`Mesaj`]: value,
			  }
			}, {upsert: true}).exec()
		})
      Stat.updateOne({ userID: id, guildID: client.ayarlar.sunucuId}, { $inc: {coin: 0.2} }, { upsert: true }).exec();
	}
		Stat.updateOne({ userID: id, guildID: client.ayarlar.sunucuId}, { $inc: { messageXP: randomMessageXP, totalMessage: value, [`messageChannel.${channel}`]: value, [`messageCategory.${category}`]: value, [`yedi.Chat.${channel}`]: value} }, { upsert: true }).exec();
	}


  return;
};
