const Discord = require('discord.js');

exports.log = function(bot, content, logChannel) {
    if (!bot.guilds.first().channels.find(`name`, `warvale-bot-logs`)) return;
    let now = new Date();
    let logChannel = bot.guilds.first().channels.find(`name`, logChannel);
    let embed = new Discord.MessageEmbed();
    embed.setColor(`0xf56d05`);
    embed.setDescription(`\`[${'hh:mm:ss'.timestamp}]\` ${content}`);
    logChannel.send({ embed: embed });
};