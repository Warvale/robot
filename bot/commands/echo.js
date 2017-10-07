const Discord = require(`discord.js`);

module.exports = {

    description: `Echoes the specified text.`,

    process: function (bot, msg, prefix, args, isEdit) {

        if (!args){
            msg.channel.send( `Usage: !echo [text]`);
        }

        msg.channel.send(`${msg.author.tag} says: ${result}`);
    },

    conf: {
        enabled: true,
        guildOnly: false,
        aliases: [],
        permLevel: 2
    }

};
