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
    if (durum || message.member.permissions.has(8n) || message.member.roles.cache.get(sunucuData.EnAltYetkiliRol)) {
        if(!ayarlar.commandChannel.some(kanal => message.channel.id.includes(kanal))) return message.react(`${client.emojis.cache.find(x => x.name === "wex_iptal")}`) 
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let loading = await message.channel.send(`Yetkili İstatistik Verileri Yükleniyor...`)

        let göster = await ozelKomut.find({
            guildID: message.guild.id,
            YetkiliROL: true
        });
        let arr = []
        let veri = göster.map(x => x.YetkiliData)
        veri.forEach(v => v.forEach(x => arr.push(x)));


        let statemoji = client.emojis.cache.find(x => x.name === "wex_stat_2");
        let data = await Stat.findOne({
            userID: target.id,
            guildID: message.guild.id
        }) || {
            yedi: {
                Chat: {},
                Voice: {},
                TagMember: 0,
                Invite: 0,
                Register: 0,
                Yetkili: 0
            },
            messageChannel: {}
        };
        let data2 = await taglıData.find({
            authorID: target.id,
            Durum: "puan"
        }) || [];
        let yetkiliData = await yetkiliDB.find({
            authorID: target.id,
            Durum: "puan"
        }) || [];
        let kanallar = await puansystem.findOne({
            guildID: message.guild.id
        });
        let puan = await xpData.findOne({
            userID: target.id
        }) || {
            currentXP: 0
        };

        let yetkiler = kanallar.PuanRolSystem;
        let ekPuan = puan.currentXP;

        let profilData = await profil.findOne({
            userID: target.id,
            guildID: message.guild.id
        }) || {
            userID: target.id,
            guildID: message.guild.id,
            BanAmount: 0,
            JailAmount: 0,
            MuteAmount: 0,
            VoiceMuteAmount: 0
        };
        let BanMiktar = profilData.BanAmount
        let JailMiktar = profilData.JailAmount
        let MuteMiktar = profilData.MuteAmount;
        let SesMuteMiktar = profilData.VoiceMuteAmount
        let ReklamMiktar = profilData.ReklamAmount


        let pubPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.PublicKanallar.Puan * 1.2 : kanallar.PublicKanallar.Puan;
        let oyunPuan = target.roles.cache.some(rol => kanallar.GameKanallar.Rol.includes(rol.id)) ? 8 : kanallar.GameKanallar.Puan;
        let kayitPuan = target.roles.cache.some(rol => kanallar.KayitKanallar.Rol.includes(rol.id)) ? 12 : kanallar.KayitKanallar.Puan;
        let streamPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.StreamKanallar.Puan * 1.2 : kanallar.StreamKanallar.Puan;
        let secretPuan = target.roles.cache.some(rol => kanallar.SecretKanallar.Rol.includes(rol.id)) ? 2 : kanallar.SecretKanallar.Puan;
        let mesajPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.MesajKanallar.Puan * 1.2 : kanallar.MesajKanallar.Puan;
        let sleepPuan = target.roles.cache.some(rol => kanallar.SleepingKanal.Rol.includes(rol.id)) ? 3 : kanallar.SleepingKanal.Puan;
        let alonePuan = target.roles.cache.some(rol => kanallar.AloneKanallar.Rol.includes(rol.id)) ? 2 : kanallar.AloneKanallar.Puan;
        let musicPuan = target.roles.cache.some(rol => kanallar.Müzik.Rol.includes(rol.id)) ? 2 : kanallar.Müzik.Puan;
        let taglıPuan = target.roles.cache.some(rol => kanallar.TagMember.Rol.includes(rol.id)) ? 30 : kanallar.TagMember.Puan;
        let invitePuan = target.roles.cache.some(rol => kanallar.Invite.Rol.includes(rol.id)) ? 12 : kanallar.Invite.Puan;
        let teyitPuan = target.roles.cache.some(rol => kanallar.Register.Rol.includes(rol.id)) ? 5 : kanallar.Register.Puan;
        let terapipuan = target.roles.cache.some(rol => kanallar.TerapiKanallar.Rol.includes(rol.id)) ? 10 : kanallar.TerapiKanallar.Puan;
        let sorunçözmepuan = target.roles.cache.some(rol => kanallar.SorunCozmeKanallar.Rol.includes(rol.id)) ? 10 : kanallar.SorunCozmeKanallar.Puan;
        let meetingPuan = target.roles.cache.some(rol => kanallar.Toplantı.Rol.includes(rol.id)) ? 10 : kanallar.Toplantı.Puan;
        let yetkiliPuan = target.roles.cache.some(rol => kanallar.Yetkili.Rol.includes(rol.id)) ? 25 : kanallar.Yetkili.Puan;


        let pubOda = yetkiliStat(data.yedi.Voice, kanallar.PublicKanallar.Id, kanallar.SleepingKanal.Id);
        let oyunodalar = yetkiliStat(data.yedi.Voice, kanallar.GameKanallar.Id, []);
        let kayıt = yetkiliStat(data.yedi.Voice, kanallar.KayitKanallar.Id, []);
        let stream = yetkiliStat(data.yedi.Voice, kanallar.StreamKanallar.Id, []);
        let secret = yetkiliStat(data.yedi.Voice, kanallar.SecretKanallar.Id, []);
        let mesaj = data.yedi.Chat ? yetkiliStat(data.yedi.Chat, kanallar.MesajKanallar.Id, []) : 0;
        let sleeping;
        if (!data.yedi.Voice) sleeping = 0;
        else sleeping = data.yedi.Voice[kanallar.SleepingKanal.Id] || 0;
        let alone = yetkiliStat(data.yedi.Voice, kanallar.AloneKanallar.Id, []);
        let music = yetkiliStat(data.yedi.Voice, kanallar.Müzik.Id, []);
        let terapi = yetkiliStat(data.yedi.Voice, kanallar.TerapiKanallar.Id, []);
        let sçözme = yetkiliStat(data.yedi.Voice, kanallar.SorunCozmeKanallar.Id, []);
        let meeting = yetkiliStat(data.yedi.Voice, kanallar.Toplantı.Id, []);
        let yetkili = yetkiliData.length;
        let taglı = data2.length;
        let invite = data.yedi.Invite;
        let teyit = data.yedi.Register;

        let totalpoints = parseInt((pubOda / (1000 * 60 * 60 * 1) * pubPuan)) +
            parseInt((oyunodalar / (1000 * 60 * 60 * 1) * oyunPuan)) +
            parseInt((kayıt / (1000 * 60 * 60 * 1) * kayitPuan)) +
            parseInt((stream / (1000 * 60 * 60 * 1) * streamPuan)) +
            parseInt((secret / (1000 * 60 * 60 * 1) * secretPuan)) +
            parseInt((mesaj * mesajPuan)) +
            parseInt((sleeping / (1000 * 60 * 60 * 1) * sleepPuan)) +
            parseInt((alone / (1000 * 60 * 60 * 1) * alonePuan)) +
            parseInt((music / (1000 * 60 * 60 * 1) * musicPuan)) +
            parseInt((terapi / (1000 * 60 * 60 * 1) * terapipuan)) +
            parseInt((sçözme / (1000 * 60 * 60 * 1) * sorunçözmepuan)) +
            parseInt((meeting / (1000 * 60 * 60 * 1) * meetingPuan)) +
            parseInt((yetkili * yetkiliPuan)) +
            parseInt((teyit * teyitPuan)) +
            parseInt((taglı * taglıPuan)) +
            parseInt((invite * invitePuan)) + Number(data.EtkinlikPuan)

        let mission = await missionSystem.findOne({
            userID: target.id
        })
        let eglencepuan = parseInt((stream / (1000 * 60 * 60 * 1) * streamPuan)) + parseInt((oyunodalar / (1000 * 60 * 60 * 1) * oyunPuan)) + parseInt((music / (1000 * 60 * 60 * 1) * musicPuan));
        let ses = client.convertDuration(data.totalVoice);


        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setPlaceholder('Aşağıdaki Panel ile Sunucu İstatistiklerini Görüntüle!')
              .setCustomId('kurulumselect')
              .addOptions([
              {
                    label: "Genel İstatistik",
                    description: "Genel İstatistiklerini Görüntüle!",
                    value: "genelStat",
                    emoji: "956213043572920330"
              },
              { 
                  label: "Puan İstatistiği",
                  value: "puanStat",
                  description: "Puan İstatistiklerini Görüntüle!",
                  emoji: "956213043572920330"

              },
              { 
                label: "Ceza Bilgileri",
                value: "cezaİnfo",
                description: "Ceza Bilgilerini Görüntüle!",
                emoji: "956213043572920330"

              },
              { 
                label: "Görev Bilgileri",
                value: "görevİnfo",
                description: "Görev Bilgilerini Görüntüle!",
                emoji: "956213043572920330"

              },
              { 
                label: "Yetki Durumu",
                value: "yetkiDurumu",
                description: "Yetki Durumunu Görüntüle!",
                emoji: "956213043572920330"

              },
              { 
                label: "Kapat",
                value: "closeMenu",
                emoji: "728939059480756267"
              }
            ])
            );
        

        let embed = new MessageEmbed().setColor("PURPLE").setFooter(client.ayarlar.footer)
            .setDescription(`${target} **Kullanıcısının Verileri Aşağıdaki Menüde Sıralanmıştır. Aşağıdaki Menüden İstediğiniz Verinin İstatistiğine Bakabilirsiniz.**`)
            .addField(`${statemoji}__**Toplam Mesaj**__`, `\`\`\`fix\n${mesaj ? mesaj + " Mesaj" : "Veri Bulunamadı"}\`\`\``, true)
            .addField(`${statemoji}__**Toplam Ses**__`, `\`\`\`fix\n${ses ? ses : "Veri Bulunamadı"}\`\`\``, true)
            .addField(`${statemoji}__**Toplam Kayıt**__`, `\`\`\`fix\n${teyit ? teyit + " Kayıt" : "Veri Bulunamadı"}\`\`\``, true)
            .addField(`${statemoji}__**Toplam Davet**__`, `\`\`\`fix\n${invite ? invite + " Davet" : "Veri Bulunamadı"}\`\`\``, true)
            .addField(`${statemoji}__**Toplam Taglı**__`, `\`\`\`fix\n${taglı ? taglı + " Taglı" : "Veri Bulunamadı"}\`\`\``, true)
            .addField(`${statemoji}__**Toplam Yetkili**__`, `\`\`\`fix\n${yetkili ? yetkili + " Yetkili" : "Veri Bulunamadı"}\`\`\``, true)
            .addField(`${statemoji} Ses Kanalları`,`${statemoji} **Sohbet Kanalları:** \`${client.convertDuration(pubOda)} (${parseInt(pubOda/(1000 * 60 * 60 * 1) * pubPuan)} puan)\`
            ${statemoji} **Kayıt Kanalları:** \`${client.convertDuration(kayıt)} (${parseInt(kayıt/(1000 * 60 * 60 * 1) * kayitPuan)} puan)\`
            ${statemoji} **Private Kanalları:** \`${client.convertDuration(secret)} (${parseInt(secret/(1000 * 60 * 60 * 1) * secretPuan)} puan)\`
            ${statemoji} **Toplantı Kanalları:** \`${client.convertDuration(meeting)} (${parseInt(meeting/(1000 * 60 * 60 * 1) * meetingPuan)} puan)\`
            ${statemoji} **Eğlence Kanalları:** \`${client.convertDuration(stream)} (${eglencepuan} puan)\`
            ${statemoji} **Sleep Odası:** \`${client.convertDuration(sleeping)} (${parseInt(sleeping/(1000 * 60 * 60 * 1) * sleepPuan)} puan)\``)
            
loading.delete();
let msg = await message.channel.send({ components: [row], embeds: [embed] }).then(async m => {
    let collector = m.createMessageComponentCollector({ filter: row => row.member.user.id === message.author.id, max: 5, time: 30000, errors: ['time'] })
    collector.on('collect', async (interaction) => {
        
if(interaction.values == "genelStat") {
    const Embed = new MessageEmbed().setColor("PURPLE").setFooter(client.ayarlar.footer)
    .setDescription(`${target} **Kullanıcısının Verileri Aşağıdaki Menüde Sıralanmıştır. Aşağıdaki Menüden İstediğiniz Verinin İstatistiğine Bakabilirsiniz.**`)
    .addField(`${statemoji}__**Toplam Mesaj**__`, `\`\`\`fix\n${mesaj ? mesaj + " Mesaj" : "Veri Bulunamadı"}\`\`\``, true)
    .addField(`${statemoji}__**Toplam Ses**__`, `\`\`\`fix\n${ses ? ses : "Veri Bulunamadı"}\`\`\``, true)
    .addField(`${statemoji}__**Toplam Kayıt**__`, `\`\`\`fix\n${teyit ? teyit + " Kayıt" : "Veri Bulunamadı"}\`\`\``, true)
    .addField(`${statemoji}__**Toplam Davet**__`, `\`\`\`fix\n${invite ? invite + " Davet" : "Veri Bulunamadı"}\`\`\``, true)
    .addField(`${statemoji}__**Toplam Taglı**__`, `\`\`\`fix\n${taglı ? taglı + " Taglı" : "Veri Bulunamadı"}\`\`\``, true)
    .addField(`${statemoji}__**Toplam Yetkili**__`, `\`\`\`fix\n${yetkili ? yetkili + " Yetkili" : "Veri Bulunamadı"}\`\`\``, true)
    .addField(`${statemoji} Ses Kanalları`,`${statemoji} **Sohbet Kanalları:** \`${client.convertDuration(pubOda)} (${parseInt(pubOda/(1000 * 60 * 60 * 1) * pubPuan)} puan)\`
    ${statemoji} **Kayıt Kanalları:** \`${client.convertDuration(kayıt)} (${parseInt(kayıt/(1000 * 60 * 60 * 1) * kayitPuan)} puan)\`
    ${statemoji} **Private Kanalları:** \`${client.convertDuration(secret)} (${parseInt(secret/(1000 * 60 * 60 * 1) * secretPuan)} puan)\`
    ${statemoji} **Toplantı Kanalları:** \`${client.convertDuration(meeting)} (${parseInt(meeting/(1000 * 60 * 60 * 1) * meetingPuan)} puan)\`
    ${statemoji} **Eğlence Kanalları:** \`${client.convertDuration(stream)} (${eglencepuan} puan)\`
    ${statemoji} **Sleep Odası:** \`${client.convertDuration(sleeping)} (${parseInt(sleeping/(1000 * 60 * 60 * 1) * sleepPuan)} puan)\``)
interaction.update({ components: [row], embeds: [Embed] }).then(e => setTimeout(() => button.message.delete().catch(() => { }), 15000))}		 

if(interaction.values == "puanStat") {
    let embed2 = new MessageEmbed().setColor("PURPLE").setFooter(client.ayarlar.footer)
    embed2.setDescription(
        `${target} **Kullanıcısının Verileri Aşağıdaki Menüde Sıralanmıştır. Aşağıdaki Menüden İstediğiniz Verinin İstatistiğine Bakabilirsiniz**
      
        ${statemoji} **Puan Bilgileri:**
        ${statemoji} **Toplam Puan:** \`${(totalpoints+parseInt(ekPuan))} Puanın bulunmakta.\`
        ${statemoji} **Ek Puan:** \`${(ekPuan)} Takviye Puan Almışsın.\`   
        `)
.addField(`${statemoji} Kategori Puanların;`, `
${statemoji} **Kayıt Kanalları:** \`(${parseInt(kayıt/(1000 * 60 * 60 * 1) * kayitPuan)} Puan)\`
${statemoji} **Private Kanalları:** \`(${parseInt(secret/(1000 * 60 * 60 * 1) * secretPuan)} Puan)\`
${statemoji} **Toplantı Kanalları:** \`(${parseInt(meeting/(1000 * 60 * 60 * 1) * meetingPuan)} Puan)\`
${statemoji} **Eğlence Kanalları:** \`(${eglencepuan} Puan)\`
${statemoji} **Sleep Kanalları:** \`(${parseInt(sleeping/(1000 * 60 * 60 * 1) * sleepPuan)} Puan)\`
**Kategorilerden Toplam** \`${parseInt(sleeping/(1000 * 60 * 60 * 1) * sleepPuan) + parseInt(meeting/(1000 * 60 * 60 * 1) * meetingPuan) + parseInt(secret/(1000 * 60 * 60 * 1) * secretPuan) + parseInt(kayıt/(1000 * 60 * 60 * 1) * kayitPuan) + parseInt(pubOda/(1000 * 60 * 60 * 1) * pubPuan)}\` **Puan.**
**Mesajlardan** \`${(mesaj*mesajPuan).toFixed(0)}\` **Puan.**`, true)
.addField(`${statemoji} Görev Puanların;`, `
${statemoji} Yetkili: \`${yetkili} (${yetkili*yetkiliPuan} puan)\`
${statemoji} Taglı: \`${taglı} (${taglı*taglıPuan} puan)\`
${statemoji} Davet: \`${invite} (${invite*invitePuan} puan)\`
${statemoji} Kayıt: \`${teyit} (${teyit*teyitPuan} puan)\`
**Görevlerden** \`${teyit*teyitPuan + invite*invitePuan + taglı*taglıPuan + yetkili*yetkiliPuan}\` **Puan Toplamışsın.**

`, true)

interaction.update({ components: [row], embeds: [embed2] })}		 

if(interaction.values == "cezaİnfo") {
    let embed3 = new MessageEmbed().setColor("PURPLE").setFooter(client.ayarlar.footer)
    embed3.setDescription(
        `${target} **Kullanıcısının Verileri Aşağıdaki Menüde Sıralanmıştır. Aşağıdaki Menüden İstediğiniz Verinin İstatistiğine Bakabilirsiniz**`)
    .addField(`${statemoji} Ceza Kullanımı`, `\`\`\`diff
- ${BanMiktar} Kullanıcıyı Sunucudan Yasaklamışsın.
- ${JailMiktar} Kullanıcıyı Cezalandırmışsın.
- ${ReklamMiktar || "0"} Kullanıcıyı Reklam Yaptığı İçin Cezalandırmışsın.
+ ${MuteMiktar} Kullanıcıyı Yazı Kanallarında Susturmuşsun.
+ ${SesMuteMiktar} Kullanıcıyı Sesli Kanallarda Susturmuşsun.\`\`\``, true)


interaction.update({ components: [row], embeds: [embed3] })}
if(interaction.values == "görevİnfo") {
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
     let msgcik = interaction.update({ components: [rowButton], embeds: [embed4] })
      var filter = (button) => button.user.id === message.author.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 })

      collector.on('collect', async (button) => {
        if (button.customId === "teyitPuan") {       
            let coin = teyitCoin.Mission.coin
           await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
           button.message.delete()
           interaction.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Teyit Görevini tamamladıgın için **${teyitCoin.Mission.coin}** bonus puan olarak eklendi.`)
            message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
      setTimeout(() => {
        teyitCoin.delete().catch(e => console.log(e))
        }, 1000);  
  
  }
          if (button.customId === "davetPuan") {       
              let coin = davetCoin.Mission.coin
             await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
             button.message.delete()
             interaction.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Davet Görevini tamamladıgın için **${davetCoin.Mission.coin}** bonus puan olarak eklendi.`)
              message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
        setTimeout(() => {
            davetCoin.delete().catch(e => console.log(e))
          }, 1000);  
    
    }
    if (button.customId === "mesajPuan") {       
        let coin = mesajCoin.Mission.coin
       await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
       button.message.delete()
       interaction.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Mesaj Görevini tamamladıgın için **${mesajCoin.Mission.coin}** bonus puan olarak eklendi.`)
        message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
  setTimeout(() => {
    mesajCoin.delete().catch(e => console.log(e))
    }, 1000);  }
    if (button.customId === "taglıPuan") {       
        let coin = taglıCoin.Mission.coin
       await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
       button.message.delete()
       interaction.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Taglı Görevini tamamladıgın için **${taglıCoin.Mission.coin}** bonus puan olarak eklendi.`)
        message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
  setTimeout(() => {
    taglıCoin.delete().catch(e => console.log(e))
    }, 1000);  

}
if (button.customId === "sesPuan") {       
    let coin = sesCoin.Mission.coin
   await xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(coin)}}, {upsert: true}).exec();
   button.message.delete()
   interaction.channel.send(`${client.emojis.cache.find(x => x.name === "wex_tik")} Ses Görevini tamamladıgın için **${sesCoin.Mission.coin}** bonus puan olarak eklendi.`)
    message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
setTimeout(() => {
    sesCoin.delete().catch(e => console.log(e))
}, 1000);  

}


    })
    })}

if(interaction.values == "yetkiDurumu") {
    let embed5 = new MessageEmbed().setColor("PURPLE").setFooter(client.ayarlar.footer)
embed5.setDescription(
    `${target} **Kullanıcısının Verileri Aşağıdaki Menüde Sıralanmıştır. Aşağıdaki Menüden İstediğiniz Verinin İstatistiğine Bakabilirsiniz**\n`)
.addField(`${statemoji} Yetki Durumu`, `${yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).length > 0 ? yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).map(y => `${statemoji} Yetki atlama durumunuz \`${totalpoints+parseInt(ekPuan) >= y.PUAN ? "Atlamaya uygun" : totalpoints+parseInt(ekPuan) >=( y.PUAN /2) ? "Atlamaya yakın": "Atlamaya uygun değil."}\`\n
${client.emojis.cache.find(x => x.name == "wex_newstat")} **Puan Durumu**
- Puanınız: \`${totalpoints+parseInt(ekPuan)}\` Gereken Puan: \`${y.PUAN}\`
${progressBar(totalpoints+parseInt(ekPuan), y.PUAN, 6)}  \`${totalpoints+parseInt(ekPuan)} / ${y.PUAN}\`
${totalpoints+parseInt(ekPuan) >= y.PUAN ? `
${client.emojis.cache.find(x => x.name == "wex_newstat")} **Yetki Atlayabilirsin!**
Gerekli \`Puan\`'a ulaşarak <@&${y.ROLE_2}> yetkisine atlama hakkı kazandın!` : target.roles.cache.get(y.ROLE_1) ? `
${client.emojis.cache.find(x => x.name == "wex_newstat")} **Yetki Durumu**
Şuan <@&${y.ROLE_1}> rolündesiniz. <@&${y.ROLE_2}> rolüne ulaşmak için **${Number(y.PUAN-(totalpoints+parseInt(ekPuan)).toFixed(0))}** \`Puan\` kazanmanız gerekiyor\n` : ""}`) : "**Üzerinde bir rol olmadığı için yükselme tablosunu gösteremiyorum.**"}`)

interaction.update({ components: [row], embeds: [embed5] })}

if(interaction.values == "closeMenu") {
    message.react(client.emojis.cache.find(x => x.name === "wex_tik"))
button.message.delete()}



    })
})

        if (kanallar.AutoRankUP.Type == true) {
            for (var i = 0; i < yetkiler.length; i++) {
                if (yetkiler[i].ROLE_1 === kanallar.AutoRankUP.sabitROL) break;
            };
            yetkiler.slice(0, i).filter(user => target.roles.cache.get(user.ROLE_1)).map(async user => {
                if (totalpoints+parseInt(ekPuan) >= user.PUAN) {
                    target.roles.remove(user.ROLE_1)
                    target.roles.add(user.ROLE_2)
                    client.channels.cache.get(kanallar.AutoRankUP.LogChannel).send(`:tada: ${target} tebrikler!Gerekli XP 'ye ulaşarak **${message.guild.roles.cache.get(user.ROLE_1).name}** rolünden **${message.guild.roles.cache.get(user.ROLE_2).name}** rolüne atladın!`)
                await Stat.updateOne({
                    userID: target.id,
                    guildID: message.guild.id
                }, {
                    $set: {
                        ["HanedanPuan"]: 0,
                        ["EtkinlikPuan"]: 0,
                        ["yedi.Id"]: target.id,
                        ["yedi.Voice"]: {},
                        ["yedi.Chat"]: {},
                        ["yedi.TagMember"]: 0,
                        ["yedi.Invite"]: 0,
                        ["yedi.Register"]: 0,
                        ["yedi.Yetkili"]: 0,
                    }
                }).exec(); await xpData.updateOne({
                    userID: target.id
                }, {
                    $set: {
                        currentXP: 0
                    }
                }, {
                    upsert: true
                }).exec(); await ozelKomut.updateMany({
                    guildID: message.guild.id,
                    komutAd: {
                        $exists: true
                    }
                }, {
                    $pull: {
                        YetkiliData: {
                            Author: target.id
                        }
                    }
                }).exec(); await taglıData.deleteMany({
                    Durum: "puan",
                    authorID: target.id
                }); await yetkiliDB.deleteMany({
                    Durum: "puan",
                    authorID: target.id
                });
            }
    });
}
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
} return

}
exports.conf = {
    aliases: ["yetkilistats", "ystat", "ystats", "Yetkilistats", "Yetkilistat"]
}
exports.help = {
    name: 'stattest'
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