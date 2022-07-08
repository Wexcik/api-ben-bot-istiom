
const {
    MessageEmbed
} = require("discord.js");
module.exports.run = async (client, message, args, durum, kanal) => {
            if (!message.guild) return;
            if (kanal) return;
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!user) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Üye Belirtilmedi\` Geçerli bir **Üye Belirt** ve tekrar dene.`);
                if (!user.voice.channel) return message.reply(`${client.emojis.cache.find(x => x.name === "wex_iptal")} \`Hata!\` Belirttiğin üye ses kanalına baglı **değil.**`);
            let mic = user.voice.selfMute == true ? "Kapalı" : "Açık"
            let hop = user.voice.selfDeaf == true ? "Kapalı" : "Açık"
            let süresi = client.channelTime.get(user.id)
            let embed = new MessageEmbed()
            .setColor("PURPLE")
            .setDescription(`${user} kişisi <#${user.voice.channel.id}> kanalında. **Mikrofonu: ${mic}, Kulaklığı: ${hop}**
            ${süresi ? `\`\`\`Aktif Bilgiler:\`\`\`
            <#${user.voice.channel.id}> kanalına \`${await client.turkishDate(Date.now() - süresi.time)}\` önce giriş yapmış.` : ""}`)
            await message.channel.send({embeds: [embed]})
}
exports.conf = {aliases: ["sesbilgi","nerede","n","nerde"]}
exports.help = {name: 'ses-bilgi'}


