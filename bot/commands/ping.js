const Discord = require('discord.js');

module.exports = {

    description: "responds pong, useful for checking if bot is alive",

    process: function (bot, msg, prefix, args, isEdit) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(`0xf56d05`);
        embed.setDescription(`Pong! Use ${prefix}help for commands.`);
        msg.channel.send({ embed: embed });
    }

};
