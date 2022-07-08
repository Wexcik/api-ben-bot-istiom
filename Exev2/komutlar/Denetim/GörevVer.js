const {
    MessageEmbed
} = require("discord.js");
let easyMiss = require("../../models/easyMission");
let ms = require("ms");
let moment = require("moment");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    let sec = args[0];
            let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(client.ayarlar.footer)
            .setAuthor(message.guild.name, message.guild.iconURL({
                dynamic: true
            }))

    if (message.member.permissions.has("ADMINISTRATOR") || durum) {

        

        if (["ver", "oluştur", "ekle"].includes(sec)) {
            let arr = ["davet", "mesaj", "ses", "taglı", "teyit"];
            let rols = args[1].replace("<@&","").replace(">","")
            let rol = message.guild.roles.cache.get(rols);
            if (!rol) return message.reply(client.Reply.rolBelirt).then(e => setTimeout(() => e.delete(), 7000))
            if (!arr.includes(args[2])) return message.reply(client.Reply.görevverTür).then(e => setTimeout(() => e.delete(), 7000))
            if (!Number(args[3])) return message.reply(client.Reply.görevverMiktar).then(e => setTimeout(() => e.delete(), 7000))
            if (!args[4]) return message.reply(client.Reply.görevverYöntem).then(e => setTimeout(() => e.delete(), 7000))
           rol.members.map(async target => {
            easyMiss.updateOne({
                userID: target.id
            }, {
                $set: {
                    userID: target.id,
                    Check: 0,
                    Mission: {
                        Author: message.author.id,
                        Type: args[2],
                        Amount: args[2] == "ses" ? Number((1000 * 60 * args[3])) : Number(args[3])
                    },
                    Time: Number(Date.now() + ms(args[4]))
                }
            }, {
                upsert: true
            }).exec();
            let embed2 = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .addField(`Verilen Görev`, `${args[2]}`, true)
            .addField(`Görev Süresi`, `${args[4].replace("h", " Saat").replace("d", " Gün").replace("w"," Hafta").replace("m"," Dakika")}`, true)
            .addField(`Görev Süresi`, `${args[4].replace("h", " Saat").replace("d", " Gün").replace("w"," Hafta").replace("m"," Dakika")}`, true)
            .setDescription(`Hey! Başarılı bir şekilde ${target} üyesini görevlendirdin verdiğin görev hakkında bilgiler aşağıda belirtilmiştir.`)
            .setFooter(client.ayarlar.footer)
            .setAuthor(message.guild.name, message.guild.iconURL({
                dynamic: true
            }))
            message.channel.send({embeds: [embed2]})
           })
        }
        if (["bilgi", "bak", "Bak", "info"].includes(sec)) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.author;
            if (!target) return message.reply("Lütfen görev vermek istediğiniz kullanıcıyı etiketleyiniz veya ID'sini giriniz").then(e => setTimeout(() => e.delete(), 7000))
            let data = await easyMiss.findOne({
                userID: target.id
            });
            if (!data) return message.reply("Bakmaya çalıştığınız üye görevlendirilmemiş").then(e => setTimeout(() => e.delete(), 7000))
            message.channel.send({embeds: [embed
                .addField(`Görev Türü`, `${data.Mission.Type}`, true)
                .addField(`Yapılan Miktar`, `${data.Mission.Type == "ses" ? (data.Check/(1000*60*60)).toFixed(0)+" saat" : data.Check}`, true)
                .addField(`Gereken Miktar`, `${data.Mission.Type == "ses" ? (data.Mission.Amount/(1000*60*60)).toFixed(0)+" saat" : data.Mission.Amount}`, true)
                .addField(`Görev Durumu`, `${data.Check >= data.Mission.Amount ? "Bitti": "Devam Ediyor"}`, true)
                .addField(`Görev Süresi`, `${moment(data.Time).locale("tr").fromNow()} bitiyor`, true)
                .addField(`Bitiş Tarihi`, `${moment(data.Time).locale("tr").format("LLL")}`, true)
                .addField(`İlerleme Durumu`,`${client.emojis.cache.find(x => x.name == "yildiz")} **İlerleme**
                - Yapılan: \`${data.Mission.Type == "ses" ? (data.Check/(1000*60*60)).toFixed(0) : data.Check}\` Yapılması Gereken: \`${data.Mission.Type == "ses" ? (data.Mission.Amount/(1000*60*60)).toFixed(0) : data.Mission.Amount}\`
                    ${progressBar(data.Check, data.Mission.Amount, 8)} \`${data.Mission.Type == "ses" ? (data.Check/(1000*60*60)).toFixed(0) : data.Check} / ${data.Mission.Type == "ses" ? (data.Mission.Amount/(1000*60*60)).toFixed(0) : data.Mission.Amount}\``)]})

            }
        if (["yapanlar", "tamamlayanlar", "durum", "top"].includes(sec)) {
            
            let data = await easyMiss.find({});

            let görevYapanlar = data.filter(data => data.Check >= data.Mission.Amount).map((user, index) => `\`${index+1} -\` <@!${user.userID}> - **${user.Mission.Type}** - \`${user.Mission.Type == "ses" ? (user.Check/(1000*60*60)).toFixed(0) : user.Check} / ${user.Mission.Type == "ses" ? (user.Mission.Amount).toFixed(0)+" saat" : user.Mission.Amount}\``).join("\n");
            let devamEdenGörev = data.filter(data => data.Check < data.Mission.Amount).map((user, index) => `\`${index+1} -\` <@!${user.userID}> - **${user.Mission.Type}** - \`${user.Mission.Type == "ses" ? (user.Check/(1000*60*60)).toFixed(0) : user.Check} / ${user.Mission.Type == "ses" ? (user.Mission.Amount).toFixed(0)+"  saat" : user.Mission.Amount}\``).join("\n");

message.channel.send({embeds: [embed
.addField(`Görev Tamamlayanlar`, `${görevYapanlar ? görevYapanlar : "Yapılan görev bulunmamakta"}`, true)
.addField(`Devam Eden Görevler`, `${devamEdenGörev}`, true)
.setDescription(`Sunucu üzerinde toplam **${data.length}** aktif görev bulşunmakta, **${data.filter(x => x.Check >= x.Mission.Amount).length}** tanesi yapılmış. **${data.length-data.filter(x => x.Check >= x.Mission.Amount).length}** tane görev de hala devam etmektedir.
`)]})
     
        }
        if (["sil"].includes(sec)) {
            let data = await easyMiss.find({});
            let sec2 = args[1];
            if (["hepsi","tümü"].includes(sec2)) {
                data.filter(data => data.Check >= data.Mission.Amount || Date.now() >= data.Time).map(data => {
                    easyMiss.deleteOne({
                        userID: data.userID
                    }).exec();
                });
                return message.reply(`${client.emojis.cache.find(x => x.name === "wex_tik")} Başarılı bir şekilde tüm görevlendirmeler silindi.`)
            }
        }
    }

    if (!sec) {
        let data = await easyMiss.find({});
        let authorGörev = await easyMiss.findOne({userID: message.author.id});
        if(!authorGörev) return message.reply("dsads")
        message.channel.send({embeds: [embed.addField(`Görev Türü`, `${authorGörev.Mission.Type}`, true)
        .addField(`Yapılan Miktar`, `${authorGörev.Mission.Type == "ses" ? (authorGörev.Check/(1000*60*60)).toFixed(0)+" saat" : authorGörev.Check} ${authorGörev.Mission.Type}`, true)
        .addField(`Gereken Miktar`, `${authorGörev.Mission.Type == "ses" ? (authorGörev.Mission.Amount/(1000*60*60)).toFixed(0)+" saat" : authorGörev.Mission.Amount} ${authorGörev.Mission.Type}`, true)
        .addField(`Görev Durumu`, `${authorGörev.Check >= authorGörev.Mission.Amount ? "Bitti": "Devam Ediyor"}`, true)
        .addField(`Görev Süresi`, `${moment(authorGörev.Time).locale("tr").fromNow()} bitiyor`, true)
        .addField(`Bitiş Tarihi`, `${moment(authorGörev.Time).locale("tr").format("LLL")}`, true)
        .addField(`İlerleme Durumu`,`${client.emojis.cache.find(x => x.name == "yildiz")} **İlerleme**
        - Yapılan: \`${authorGörev.Mission.Type == "ses" ? (authorGörev.Check/(1000*60*60)).toFixed(0) : authorGörev.Check}\` Yapılması Gereken: \`${authorGörev.Mission.Type == "ses" ? (authorGörev.Mission.Amount/(1000*60*60)).toFixed(0) : authorGörev.Mission.Amount}\`
        ${progressBar(authorGörev.Check, authorGörev.Mission.Amount, 8)} \`${authorGörev.Mission.Type == "ses" ? (authorGörev.Check/(1000*60*60)).toFixed(0) : authorGörev.Check} / ${authorGörev.Mission.Type == "ses" ? (authorGörev.Mission.Amount/(1000*60*60)).toFixed(0) : authorGörev.Mission.Amount}\``)
        .setDescription(`Selam ${message.author} şuanda aktif **${data.length}** görevin bulunmakta. bunların **${data.filter(x => x.Check >= x.Mission.Amount).length}** tanesi tamamlanmış **${data.length-data.filter(x => x.Check >= x.Mission.Amount).length}** görev ise hala tamamlanmamış ve devam etmektedir.`)]})



        return;
    }
}
exports.conf = {
    aliases: ["görev"]
}
exports.help = {
    name: 'Görev'
}

function progressBar(value, maxValue, size) {
    const percentage = value >= maxValue ? 100 / 100 : value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
    const progressText = `${client.emojis.cache.find(x => x.name == "wex_ortabar")}`.repeat(progress);
    const emptyProgressText = `${client.emojis.cache.find(x => x.name == "wex_griortabar")}`.repeat(emptyProgress);
    const bar = `${value ? client.emojis.cache.find(x => x.name == "wex_solbar") : client.emojis.cache.find(x => x.name == "wex_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "wex_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "wex_gribitisbar")}`}`;
    return bar;
};