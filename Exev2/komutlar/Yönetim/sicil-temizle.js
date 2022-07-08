let ceza = require("../../models/ceza");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    

	if (message.member.permissions.has(8n) || durum) {

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply(client.Reply.üyeBelirt);
        await ceza.deleteMany({userID: target.id}).exec().then(x => message.react(client.emojis.cache.find(x => x.name === "wex_tik"))).catch(y => message.react(client.emojis.cache.find(x => x.name === "wex_iptal")));

    }
};
exports.conf = {aliases: ["sicil-temizle", "siciltemizle"]}
exports.help = {name: 'sicil-affı'}
