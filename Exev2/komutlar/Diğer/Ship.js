const { MessageEmbed } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
const Discord = require('discord.js');
const Canvas = require('canvas')

let sunucuayar = require("../../models/sunucuayar");
let Database = require("../../models/invite");
let muteInterval = require("../../models/muteInterval");
let vmuteInterval = require("../../models/vmuteInterval");
const moment = require("moment")
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
	let Server = await sunucuayar.findOne({guildID: message.guild.id});
    if(!message.channel.id.includes("987467601829564477")) return message.channel.send("sadas")

    const sayı = Math.floor(Math.random() * 100);
        

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d")
    const bg = await Canvas.loadImage("https://p4.wallpaperbetter.com/wallpaper/433/444/53/anime-landscape-anime-art-anime-scenery-waterfall-wallpaper-preview.jpg")
    ctx.drawImage(bg, 0, 0, 700, 250)
    ctx.font = "75px Sans-serif"
    ctx.fillStyle = "#f0f0f0"
    const messageAuthor = await Canvas.loadImage(message.member.displayAvatarURL({ format: "png" }))
    ctx.drawImage(messageAuthor, 50, 25, 200, 200)

    const heart = await Canvas.loadImage("https://media.discordapp.net/attachments/904664323769651211/980953931440091176/mutlukalp.png")
    const broken = await Canvas.loadImage("https://media.discordapp.net/attachments/904664323769651211/980953931184230420/uzgun.png")
    const think = await Canvas.loadImage("https://media.discordapp.net/attachments/904664323769651211/980953930924167218/dusunceli.png")
    const member = message.mentions.members.first() || message.guild.members.cache.filter(uye => uye.roles.cache.has(Server.WOMAN[0] && Server.MAN[0])).random()
    const targetMention = await Canvas.loadImage(member.displayAvatarURL({ format: "png" }))
    ctx.drawImage(targetMention, 500, 25, 200, 200)

    let mesaj;
    if(sayı > 80 && sayı < 100) mesaj = `**${member.user.username}**, **${message.author.username}** seni ne kadar seviyor?\n:cupcake: **%${sayı}**\n:heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire:`
    if(sayı > 60 && sayı < 80) mesaj = `**${member.user.username}**, **${message.author.username}** seni ne kadar seviyor?\n:cupcake: **%${sayı}**\n:heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::broken_heart::broken_heart:`
    if(sayı > 40 && sayı < 60) mesaj = `**${member.user.username}**, **${message.author.username}** seni ne kadar seviyor?\n:cupcake: **%${sayı}**\n:heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::broken_heart::broken_heart::broken_heart::broken_heart:`
    if(sayı > 20 && sayı < 40) mesaj = `**${member.user.username}**, **${message.author.username}** seni ne kadar seviyor?\n:cupcake: **%${sayı}**\n:heart_on_fire::heart_on_fire::heart_on_fire::heart_on_fire::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart:`
    if(sayı > 0 && sayı < 20) mesaj = `**${member.user.username}**, **${message.author.username}** seni ne kadar seviyor?\n:cupcake: **%${sayı}**\n:heart_on_fire::heart_on_fire::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart:`

    let mesaj2;


    if(sayı > 55 && sayı > 75) {
        ctx.drawImage(heart, 275, 60, 150, 150)
        let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "anime-landscape-anime-art-anime-scenery-waterfall-wallpaper-preview.jpg")
        let embed = new Discord.MessageEmbed()
        .setDescription(`${mesaj}`)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setImage(`attachment://anime-landscape-anime-art-anime-scenery-waterfall-wallpaper-preview.jpg`)
        .setColor('RANDOM')
        message.channel.send({ content: "<@" + member.id + ">", embeds: [embed], files: [attachment] })
        return
    }

    if(sayı > 55 && sayı < 75) {
        ctx.drawImage(think, 275, 60, 150, 150)
        let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "anime-landscape-anime-art-anime-scenery-waterfall-wallpaper-preview.jpg")
        let embed = new Discord.MessageEmbed()
        .setDescription(`${mesaj}`)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setImage(`attachment://anime-landscape-anime-art-anime-scenery-waterfall-wallpaper-preview.jpg`)
        .setColor('RANDOM')
        message.channel.send({ content: "<@" + member.id + ">", embeds: [embed], files: [attachment] })
        return
    }

    if(sayı > 0 && sayı < 55) {
        ctx.drawImage(broken, 275, 60, 150, 150)
        let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "anime-landscape-anime-art-anime-scenery-waterfall-wallpaper-preview.jpg")
        let embed = new Discord.MessageEmbed()
        .setDescription(`${mesaj}`)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setImage(`attachment://anime-landscape-anime-art-anime-scenery-waterfall-wallpaper-preview.jpg`)
        .setColor('RANDOM')
        message.channel.send({ content: "<@" + member.id + ">", embeds: [embed], files: [attachment] })
        return;
    }


}
exports.conf = {aliases: ["ship", "askım"]}
exports.help = {name: 'shipcik'}