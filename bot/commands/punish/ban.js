const Discord = require('discord.js');

module.exports = {

    description: "Allows banning of users from a guild",

    process: function (bot, msg, prefix, args, isEdit) {
        if (!args){
            msg.channel.sendMessage( "Ussage: !ban [user] [reason]");
        }

        let reason = args.slice(1).join(` `);
        let user = msg.mentions.users.first();
        if (reason.length < 1 ) return msg.reply(`Please provide a reason for the ban.`);
        if (!msg.mentions.users.size < 1) return msg.reply(`Please mention someone to ban them.`).catch(console.error);

        if (!msg.guild.member(user).bannable) return msg.reply(`I cannot ban that user.`);
        msg.guild.ban(user, 2);

    },

    conf: {
        enabled: true,
        guildOnly: false,
        aliases: [],
        permLevel: 2
    }

};
