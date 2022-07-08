const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sorumluluk = require("../../models/sorumluluk");
let ozelKomut = require("../../models/özelkomut");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let sunucuData = await sunucuayar.findOne({guildID: message.guild.id});
    if (sunucuData.GKV.includes(message.author.id) || message.author.id == message.guild.owner.id || client.ayarlar.sahip.includes(message.author.id)) {
        let sec = args[0];
        let data = await sorumluluk.find({guildID: message.guild.id})

        if (["oluştur"].includes(sec)) {
            let komutAd = args[1];
            if (!komutAd) return message.reply(client.Reply.isimBelirtKomut);
            let args2 = args.splice(2).join(" ").split(" - ");
            if (!args2) return message.reply(client.Reply.özelKomutHata)
            let roller = args2[0].split(" ").map(rol => message.guild.roles.cache.get(rol.replace("<@&", "").replace(">", "")));
            let roller2 = args2[1].split(" ").map(rol => message.guild.roles.cache.get(rol.replace("<@&", "").replace(">", "")));
            let kişiler = args2[2] ? args2[2].split(" ").map(member => message.guild.members.cache.get(member.replace("<@!", "").replace(">", ""))) : [];
           
            let ozelKomutDATA = await ozelKomut.findOne({
                guildID: message.guild.id,
                komutAd: komutAd
            });
            if (ozelKomutDATA) return message.reply(client.Reply.zatenvarKomut);
            let newData = ozelKomut({
                guildID: message.guild.id,
                komutAd: komutAd,
                verilcekRol: roller,
                roller: roller2,
                kisiler: kişiler,
                YetkiliROL: false,
                YetkiliData: [],
                sorumluluk: []
            });
            newData.save();
           let embed = new MessageEmbed().setColor("RANDOM").setFooter(client.ayarlar.footer).setTimestamp()
           .addField(`Komut Hakkında`,`${komutAd}`)
           .addField(`Komut Esnasında Verilecek Roller`, `${roller}`)
           .addField(`Komutu Kullanabilecek Roller`, `${roller2}`)
           .addField(`Komut Kullanabilecek Kişiler`, `${args2[2] ? kişiler : "`Kişi eklenmedi.`"}`)
           .setDescription(`${client.emojis.cache.find(x => x.name === "wex_tik")} Başarılı bir şekilde bir komut oluşturuldu.`)
            message.channel.send({embeds: [embed]});
        }
        if (["güncelle"].includes(sec)) {
            let ozelKomutDATA = await ozelKomut.findOne({
                guildID: message.guild.id,
                komutAd: args[1]
            })
            if (!ozelKomutDATA) return message.reply(client.Reply.isimBelirtKomut);
            if (!args[2]) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hatalı Kullanım\` **Örnek Kullanım:**: __.özelkomut güncelle komutAd (rolller-kisiler-sorumluluk-yetkilialım)__`)
            if (["verilcekler"].includes(args[2])) {
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[3]);
                if (!role) return message.reply(client.Reply.rolBelirt);
                if (ozelKomutDATA.verilcekRol.includes(role.id)) {
                    message.reply(`${client.emojis.cache.find(x => x.name === "wex_tik")} Belirttiğin rol Kaldırıldı.`);
                    return await ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$pull: {verilcekRol: role.id}}).exec();
                };
                message.reply(`${client.emojis.cache.find(x => x.name === "wex_tik")} Belirttiğin rol Eklendi.`);
                return await ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$push: {verilcekRol: role.id}}).exec();
            }
            if (["roller"].includes(args[2])) {
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[3]);
                if (!role) return message.reply(client.Reply.rolBelirt);
                if (ozelKomutDATA.roller.includes(role.id)) {
                    message.reply(`${client.emojis.cache.find(x => x.name === "wex_tik")} Belirttiğin rol Kaldırıldı.`);
                    return await ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$pull: {roller: role.id}}).exec();
                };
                message.reply(`${client.emojis.cache.find(x => x.name === "wex_tik")} Belirttiğin rol Eklendi.`);
                return await ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$push: {roller: role.id}}).exec();
            };
            if (["kisiler"].includes(args[2])) {
                let kisi = message.mentions.members.first() || message.guild.members.cache.get(args[3]);
                if (!kisi) return message.reply("Lütfen bir kişi etiketleyiniz");
                if (ozelKomutDATA.kisiler.includes(kisi.id)) {
                    message.reply(`${client.emojis.cache.find(x => x.name === "wex_tik")} Belirttiğin kişi Kaldırıldı.`);
                    return await ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$pull: {kisiler: kisi.id}}).exec();
                };
                message.reply(`${client.emojis.cache.find(x => x.name === "wex_tik")} Belirttiğin kişi Eklendi.`);
                return await ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$push: {kisiler: kisi.id}}).exec();
            };
            if (["sorumluluk"].includes(args[2])) {
                let sorumluData = await sorumluluk.findOne({guildID: message.guild.id, Ad: args[3]});
                if (!sorumluData) return message.reply(`Lütfen bir sorumluluk rolü ekleyiniz.\nBazı Roller:\n\`${data.map(x => `${x.replace("_", " ")}`)}\``);
                if (data.some(veri => veri.Ad.includes(args[3]))) {
                    message.reply("başarılı bir şekilde sorumluluk rolünü kaldırdım.");
                    return await ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$pull: {sorumluluk: args[3]}}).exec();
                };
                message.reply("başarılı bir şekilde sorumluluk rolünü ekledim.");
                return await ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$push: {sorumluluk: args[3]}}).exec();
            };
            if (["yetkilialım"].includes(args[2])) {
                if (ozelKomutDATA.YetkiliROL == true) {
                               ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$set: {YetkiliROL: false, YetkiliData: []}}).exec()
                message.reply("Başarılı bir şekilde bu komutu global rol olarak tanımladınız.");     
                } else {
                                ozelKomut.updateOne({guildID: message.guild.id, komutAd: args[1]}, {$set: {YetkiliROL: true}}).exec()
                return message.reply("Başarılı bir şekilde bu kodu yetkili alım kodu yaptınız.");    
                }


            }
        };
        if (["sil"].includes(sec)) {
            let ozelKomutDATA = await ozelKomut.findOne({
                guildID: message.guild.id,
                komutAd: args[1]
            })
            if (!ozelKomutDATA) return message.reply(client.Reply.isimBelirtKomut);
                message.reply(`${client.emojis.cache.find(x => x.name === "wex_tik")} Başarılı bir şekilde \`${args[1]}\` isimli komutu sildim.`);

                await ozelKomut.deleteOne({guildID: message.guild.id, komutAd: args[1]}).exec();
        };
        if (["bak"].includes(sec)) {
            let data = await ozelKomut.find({});
            let data2 = await ozelKomut.findOne({guildID: message.guild.id, komutAd: args[1]});
            if (!data2) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hatalı Kullanım\` Geçerli bir **Komut Adı** Belirt ve tekrar dene. (İsimler: \`${data.map(x => x.komutAd).join(", ")}\`)`);
            let mesaj = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(client.ayarlar.footer)
            .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
            .setDescription(`**${args[1]}** adlı komutun bilgileri:
─────────────────────
**Kişiler:**   
${data2.kisiler.length > 0 ? data2.kisiler.map(x => `<@${x}>`) : "Veri yoktur."}
─────────────────────
**Yetkili Rolleri:**   
${data2.roller.length > 0 ? data2.roller.map(x => `<@&${x}>`) : "Veri yoktur."}
─────────────────────
**Sorumluluk Rolleri:**   
${data2.sorumluluk.length > 0 ? data2.sorumluluk.map(x => `\`${x}\``).join(" - ") : "Veri yoktur."}
─────────────────────

__Bu komutu sunucu içerisinde kullanabilmek için yazman gereken komut aşağıdaki gibidir.__

**Örnek Kullanım:**
\`\`\`
${client.ayarlar.prefix[0]}${data2.komutAd} @üye

Not: Komutu tekrar kullandığınızda üyeden rol alınır
\`\`\`
`)
 message.channel.send(mesaj)
};
        if (!sec) {
            let data = await ozelKomut.find({guildID: message.guild.id});
            let göster = data.length > 0 ? data.map((veri, index) => `**Ad:** \`${veri.komutAd}\` - **Rol:** ${veri.verilcekRol.map(x => `<@&${x}>`)}\n`).join("\n"): "Veri yoktur.";
            let embedcik = new MessageEmbed().setColor("RANDOM").setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setTimestamp().setFooter(client.ayarlar.footer).setDescription(`Aşağıdaki özel komutlar'ı daha detaylı bir şekilde görmek için aşağıdaki komutu yazınız.\n\`.özelkomut bak <komutAdı>\`\n\n${göster}`)
            message.channel.send({embeds: [embedcik]});
        };
    } else return;
};
exports.conf = {
    aliases: ["özelkomut"]
}
exports.help = {
    name: 'özelkomut'
}


function mesajGönder(message, author) {
    
}