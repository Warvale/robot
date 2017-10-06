const Discord = require('discord.js');

module.exports = {

    description: "Gives info about Warvale",

    process: function (bot, msg, prefix, args, isEdit) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(`0xf56d05`);
        embed.setDescription(`Warvale is an upcoming Minecraft network featuring PVP games.`);
        embed.addField(`Players`, msg.guild.memberCount, true);
        embed.addField(`Links`, `[GitHub](https://github.com/Warvale/robot)\n[Warvale](https://warvale.net)\n[Twitter](https://twitter.com/warvalenetwork)`, true);
        msg.channel.send({ embed: embed });

        if (args){
            msg.channel.sendMessage( "note that !about takes no arguments!");
        }
    }

};