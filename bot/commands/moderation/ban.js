const Discord = require(`discord.js`);

module.exports = {

    description: `Issues a permanent ban to the specified member.`,

    process: function (bot, msg, prefix, args, isEdit) {
        if (!args){
            msg.channel.send( `Ussage: !ban [user] [reason]`);
        }

        let reason = args.slice(1).join(` `);
        let user = msg.mentions.users.first();
        if (reason.length < 1 ) return msg.channel.send(`Please provide a reason for the ban.`);
        if (!msg.mentions.users.size < 1) return msg.channel.send(`Please mention someone to ban them.`).catch(console.error);

        if (!msg.guild.member(user).bannable) return msg.channel.send(`I cannot ban that user.`);
        msg.guild.ban(user, 2);

    },

    conf: {
        enabled: true,
        guildOnly: false,
        aliases: [],
        permLevel: 2
    }

};
