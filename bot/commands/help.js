const Discord = require('discord.js');

module.exports = {

    description: "responds pong, useful for checking if bot is alive",

    process: function (bot, msg, prefix, args, isEdit) {
        let embed = new Discord.MessageEmbed();
        let cmds = [
            `**__Oh no! You need help with the Warvale bot? Read below!__** [prefix: ${prefix}]`,
            `**${prefix}about** - shows information about Warvale and this bot.`,
            `**${prefix}ping** - pong! (self explanatory, eh?)`
        ].join(`\n`);
        embed.setColor(`0xf56d05`);
        embed.setDescription(cmds);
        msg.channel.send({ embed: embed });
    }

};
