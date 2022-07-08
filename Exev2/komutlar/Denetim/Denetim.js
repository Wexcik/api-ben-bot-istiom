const {
    MessageEmbed
} = require("discord.js");
require("moment-timezone")
let Stat = require("../../models/stats");
let sunucuayar = require("../../models/sunucuayar");
let xpData = require("../../models/stafxp");
let uyarıData = require("../../models/uyarı");
let puansystem = require("../../models/puansystem");
let taglıData = require("../../models/taglıUye");
const yetkiliDB = require("../../models/yetkili");
let ozelKomut = require("../../models/özelkomut");
let missionSystem = require("../../models/randomMission");
let yoklama = require("../../models/yoklama");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

    if (message.member.permissions.has("8") || durum) {

        let rol;
        let loading = await message.channel.send(`Veriler yükleniyor...`)
        let toplantiKatilanlar = await yoklama.findOne({guildID: message.guild.id}) || {Katılanlar: [],Katılmayanlar: []};
        if((message.mentions.roles.first() || message.guild.roles.cache.get(args[0]))) {            
            rol = (message.mentions.roles.first() || message.guild.roles.cache.get(args[0])).members
        } else {
            rol = message.guild.roles.cache.get("838817061362073686").members.filter(member => toplantiKatilanlar.Katılanlar.some(user => member.id == user));
        }
        
        message.channel.send(`${rol.map(target => `KullanıcıID: \`${target.id}\` - İsim Yaş: ${target.displayName}`).join("\n")}`, {
            code: "md",
            split: true
        }).then(async x => {

            rol.map(async target => {        let göster = await ozelKomut.find({
            guildID: message.guild.id,  
            YetkiliROL: true
        });
        let arr = []
        let veri = göster.map(x => x.YetkiliData)
        veri.forEach(v => v.forEach(x => arr.push(x)));


        let statemoji = client.emojis.cache.find(x => x.name === "wex_stat");
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
            }
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


        let embed = new MessageEmbed().setColor("RANDOM").setAuthor(target.displayName, target.user.avatarURL({
dynamic: true
            })).setFooter(client.ayarlar.footer)
            .addField(`Kategori İstatiktileri`, `
            **❯** Public Odalaro: \`${client.convertDuration(pubOda)} \`
            **❯** Streamer Odalaro: \`${client.convertDuration(stream)}\`
            **❯** Oyun Odaları: \`${client.convertDuration(oyunodalar)}\`
            **❯** Private Odaları: \`${client.convertDuration(secret)}\`
            **❯** Alone Odaları: \`${client.convertDuration(alone)}\` ${kanallar.AloneKanallar.Id.length > 0 ? "" : "(**Kapalı**)"}
            **❯** Müzik Odaları: \`${client.convertDuration(music)}\` ${kanallar.Müzik.Id.length > 0 ? "" : "(**Kapalı**)"}
            **❯** Sleep Odaları: \`${client.convertDuration(sleeping)}\` 
            **❯** Terapi Odaları: \`${client.convertDuration(terapi)}\` ${kanallar.TerapiKanallar.Id.length > 0 ? "" : "(**Kapalı**)"}
            **❯** Sorun Çözme Odaları: \`${client.convertDuration(sçözme)}\`
            **❯** Kayıt Odaları: \`${client.convertDuration(kayıt)}\`
            **❯** Toplantı Odaları: \`${client.convertDuration(meeting)}\`
            ─────────────────────
            **❯** Mesaj Bilgisi \`${mesaj} mesaj.\`
            ─────────────────────
            **❯** Yetkili: \`${yetkili}\`
            **❯** Taglı: \`${taglı}\`
            **❯** Davet: \`${invite}\`
            **❯** Kayıt: \`${teyit}\`
            `,true )
            
.addField(`Diğer Bilgiler`, `
${statemoji} Yetkili: \`${yetkili}\`
${statemoji} Taglı: \`${taglı}\`
${statemoji} Davet: \`${invite}\`
${statemoji} Kayıt: \`${teyit}\`
`, true)
.setDescription(`${statemoji} **Mesaj Bilgilendirmesi:** Mesaj: \`${mesaj}\``)

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

message.channel.send(`
${target} (\`${target.id}\`) adlı üyenin denetim bilgileri aşağıda belirtilmiştir.

**Kategori Bilgileri**
**❯** Public Odalaro: \`${client.convertDuration(pubOda)} \`
**❯** Streamer Odalaro: \`${client.convertDuration(stream)}\`
**❯** Oyun Odaları: \`${client.convertDuration(oyunodalar)}\`
**❯** Private Odaları: \`${client.convertDuration(secret)}\`
**❯** Alone Odaları: \`${client.convertDuration(alone)}\` ${kanallar.AloneKanallar.Id.length > 0 ? "" : "(**Alone Devre Dışı**)"}
**❯** Müzik Odaları: \`${client.convertDuration(music)}\` ${kanallar.Müzik.Id.length > 0 ? "" : "(**Müzik Devre Dışı**)"}
**❯** Sleep Odaları: \`${client.convertDuration(sleeping)}\` 
**❯** Terapi Odaları: \`${client.convertDuration(terapi)}\` ${kanallar.TerapiKanallar.Id.length > 0 ? "" : "(**Terapi Devre Dışı**)"}
**❯** Sorun Çözme Odaları: \`${client.convertDuration(sçözme)}\`
**❯** Kayıt Odaları: \`${client.convertDuration(kayıt)}\`
**❯** Toplantı Odaları: \`${client.convertDuration(meeting)}\`
─────────────────────
**❯** Mesaj Bilgisi \`${mesaj} mesaj.\`
─────────────────────
**Diğer Bilgiler**
**❯** Yetkili: \`${yetkili}\`
**❯** Taglı: \`${taglı}\`
**❯** Davet: \`${invite}\`
**❯** Kayıt: \`${teyit}\``);
            })
        })
        loading.delete();

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
    } else return

}
exports.conf = {
    aliases: ["denetim", "denetle", "denetleme", "Denetle"]
}
exports.help = {
    name: 'Denetim'
}

function progressBar(value, maxValue, size) {
    const percentage = value >= maxValue ? 100 / 100 : value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
    const progressText = `${client.emojis.cache.find(x => x.name === "wex_ortabar")}`.repeat(progress);
    const emptyProgressText = `${client.emojis.cache.find(x => x.name === "wex_griortabar")}`.repeat(emptyProgress);
    const bar = `${value ? client.emojis.cache.find(x => x.name === "wex_solbar") : client.emojis.cache.find(x => x.name === "wex_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "wex_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "wex_gribitisbar")}`}`;
    return bar;
};