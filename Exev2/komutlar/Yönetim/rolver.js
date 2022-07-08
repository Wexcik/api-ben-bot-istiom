const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let rollog = require("../../models/rollog");
const sunucuayar = require("../../models/sunucuayar");
const bannedRole = require("../../models/bannedRole");
let moment = require("moment");
moment.locale("tr");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    let sunucuData = await sunucuayar.findOne({})
    logChannel = sunucuData.ROLEChannel
    await rollog.find({
        userID: message.author.id
    }, async (err, data) => {
        if (sunucuData.GKV.some(i => i == message.author.id) || message.author.id === message.guild.ownerID || message.member.permissions.has(8n) || durum) {

            let sec = args[0]
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let role = message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.get(args[1])
            let roller = await bannedRole.findOne({guildID: message.guild.id}) || {
                BanRole: []
            }
            let embeddd = new MessageEmbed().setColor("RANDOM")
            if (sec === "ver") {
                if (!target) return message.reply(client.Reply.üyeBelirt);
                if (!role) return message.reply(client.Reply.rolBelirt)
                if (roller.BanRole.some(x => x == role.id)) return message.reply("Bu komut yasaklı roller listesinde lütfen geçerli rolleri kullanınız!")
                if (target.roles.cache.get(role.id)) return message.reply(client.Reply.rolVar)

                let newData = new rollog({
                    userID: message.author.id,
                    Member: target.id,
                    Type: "[EKLENDİ]",
                    Zaman: Date.now(),
                    Role: role.id
                })
                newData.save()
                target.roles.add(role)
                let Embedvermesaj = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setDescription(`${message.author} adlı yetkili ${target} adlı üyeye ${role} rolünü verdi`)
               let Embedver = new MessageEmbed().setColor("RANDOM").setDescription(`
               **${target}** (\`${target.id}\`) adlı üyeye bir rol eklendi:
               
               **Rolü Ekleyen Yetkili:** ${message.author} (\`${message.author.id}\`)
               **Verilen Rol:** ${role} (${role.id})
               
               **Detaylı Bilgi İçin:** \`${conf.prefix[0]}r bilgi ${message.author.id}\``)
                message.channel.send({embeds: [Embedvermesaj]})
                client.channels.cache.get(logChannel).send({embeds: [Embedver]})
}

            if (sec === "al") {
                if (!target) return message.reply(client.Reply.üyeBelirt);
                if (!role) return message.reply(client.Reply.rolBelirt)
                if (!message.guild.members.cache.get(target.id).roles.cache.get(role.id)) return message.reply(client.Reply.rolYok)
                if (roller.BanRole.some(rol => rol === role.id)) return message.reply("Bu komut yasaklı roller listesinde lütfen geçerli rolleri kullanınız!")

                let newData = new rollog({
                    userID: message.author.id,
                    Member: target.id,
                    Type: "[ALINDI]",
                    Zaman: Date.now(),
                    Role: role.id
                })
                newData.save()
                let embedall = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setDescription(`${message.author} adlı yetkili ${target} adlı üyeden ${role} rolünü aldı`)

                let embedal = new MessageEmbed().setColor("RANDOM").setDescription(`
                **${target}** (\`${target.id}\`) adlı üyeden bir rol aldı:
                
                **Rolü Alan Yetkili:** ${message.author} (\`${message.author.id}\`)
                **Alınan Rol:** ${role} (${role.id})
                
                **Detaylı Bilgi İçin:** \`${conf.prefix[0]}r bilgi ${message.author.id}\``)
                target.roles.remove(role)
                message.channel.send({embeds: [embedall]})
                client.channels.cache.get(logChannel).send({embeds: [embedal]})
            }
            if (sec === "yasaklı") {
                if (sunucuData.GKV.some(i => i == message.author.id) || message.author.id === message.guild.ownerID) {
                    let rols = args.splice(1).join(" ");
                    let rols2 = rols.split(" ").map(rol => message.guild.roles.cache.get(rol.replace("<@&", "").replace(">", "")).id);
                    
                    rols2.map(async x => {
                        if (roller.BanRole.some(rol => rol === x)) return message.reply("<@&"+x +"> Bu rol zaten yasaklı roller listesinde o yüzden eklemedim!");
                        await bannedRole.updateOne({guildID: message.guild.id}, {$push: {BanRole: x}}, {upsert: true});
                        return message.reply("Başarılı bir şekilde <@&" + x + "> adlı rolü yasaklı roller listesine ekledin!")
                    })

                    
                } else return message.reply("Bu komutu sadece GK kullanıcıları kullanabilir.");
            }



            if (!sec) return;


        } else {
            return message.reply(
                "Bu komut sadece TAÇ sahibi tarafından kullanılabilir"
            );
        }
    })
}
exports.conf = {aliases: ["r", "rol"]}
exports.help = {name: 'rolver'}
