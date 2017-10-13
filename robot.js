// DEPENDENCIES
const Discord = require(`discord.js`);
const client = new Discord.Client();
const PersistentCollection = require(`djs-collection-persistent`);
const timestamp = require(`console-timestamp`);
// BOT STUFF, NOT DEPENDENCIES
const config = require(`./config.json`);
const prefix = config.prefix;
// USE TOKEN FROM FILE TO LOGIN
client.login(require(`./token`));
exports.client = client;

/*
- All strings must be template literals (` `).
*/

// MISC FUNCTIONS

const clean = text => {
  if (typeof(text) === `string`)
    return text.replace(/`/g, `\`` + String.fromCharCode(8203)).replace(/@/g, `@` + String.fromCharCode(8203));
  else
      return text;
}

client.on(`ready`, () => {
    console.log(`Warvale bot is now ready to serve ${client.guilds.first().memberCount} Warvale players.\nThis bot was made by Warvale and is not to be self-hosted.`);
    client.user.setActivity(`with ${client.guilds.first().memberCount} Warvalers!`);
    client.setInterval(()=>{
        client.user.setActivity(`with ${client.guilds.first().memberCount} Warvalers!`);
    }, 1000*60*5);
});



// COMMANDS
client.on(`message`, (msg) => {
    var args = msg.content.split(` `).slice(1);
    var result = args.join(` `);

    if (msg.author.bot) return;

    // MISCELLANEOUS COMMANDS
    if (msg.content.toLowerCase().startsWith(prefix + `ping`)) {
        var embed = new Discord.MessageEmbed();
        embed.setColor(`0xf56d05`);
        embed.setDescription(`Pong! Use \`${prefix}help\` for commands.`);
        msg.channel.send({ embed: embed });
    } else 

    if (msg.content.toLowerCase().startsWith(prefix + `about`)) {
        var embed = new Discord.MessageEmbed();
        embed.setColor(`0xf56d05`);
        embed.setDescription(`Warvale is an upcoming Minecraft network featuring PVP games.`);
        embed.addField(`Players`, msg.guild.memberCount, true);
        embed.addField(`Links`, `[GitHub](https://github.com/Warvale/robot)\n[Warvale](https://warvale.net)\n[Twitter](https://twitter.com/warvalenetwork)`, true);
        msg.channel.send({ embed: embed });
    } else

    if (msg.content.toLowerCase().startsWith(prefix + `help`)) {
        var embed = new Discord.MessageEmbed();
        if (isStaff(msg.member)) {
            var cmds = [
                `**__Oh no! You need help with the Warvale bot? I gotchu fam!__** [prefix: ${prefix}]`,
                `**${prefix}about** - shows information about Warvale and this bot.`,
                `**${prefix}ping** - pong! (self explanatory, eh?)`,
                `**${prefix}dab [-h]** - dabs; on the haters is optional.`,
                `**${prefix}mute <member> <reason>** - mutes the member for the reason.`,
                `**${prefix}unmute <member> <reason>** - unmutes the member for the reason.`
            ].join(`\n`);
        } else {
            var cmds = [
                `**__Oh no! You need help with the Warvale bot? I gotchu fam!__** [prefix: ${prefix}]`,
                `**${prefix}about** - shows information about Warvale and this bot.`,
                `**${prefix}ping** - pong! (self explanatory, eh?)`,
                `**${prefix}dab [-h]** - dabs; on the haters is optional.`
            ].join(`\n`);
        }
        embed.setColor(`0xf56d05`);
        embed.setDescription(cmds);
        msg.channel.send({ embed: embed });
    } else

    if (msg.content.toLowerCase().startsWith(prefix + `eval`)) {
        if (!msg.author.id === `250536623270264833`) return;
        try {
            var code = args.join(` `);
            var evaled = eval(code);

            if (typeof evaled !== `string`)
                evaled = require(`util`).inspect(evaled);

            msg.channel.send(clean(evaled), {code:`xl`});
        } catch (err) {
            msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    } else 

    // FUN COMMANDS
    if (msg.content.toLowerCase().startsWith(prefix + `dab`)) {
        if (result.toLowerCase() === "-h") return msg.channel.send(`Dab incoming...`).then(m => m.edit(`<o/ on them haters!`).then(m => m.edit(`**<o/** on them haters!`)));
        msg.channel.send(`Dab incoming...`).then(m => m.edit(`<o/`).then(m => m.edit(`**<o/**`)));
    } else 

    // MODERATION COMMANDS
    if (msg.content.toLowerCase().startsWith(prefix + `mute`)) {
        var mutedRole = msg.guild.roles.find(`name`, `Muted`).id;
        var reason = result.split(` `).slice(1).join(` `);
        var muteMember = msg.mentions.members.first();   
        if (!isStaff(msg.member)) return msg.channel.send(`:x: Insufficient permission.`);
        if (!muteMember) return msg.channel.send(`:x: You must provide a member to mute.`);
        if (!reason) return msg.channel.send(`:x: You must provide a reason for the mute.`);
        if (muteMember.roles.has(mutedRole)) return msg.channel.send(`:x: This member is already muted. Use !unmute to unmute them.`);
        muteMember.addRole(mutedRole).catch(e => msg.channel.send(e));
        muteMember.setMute(true, reason);
        msg.channel.send(`:white_check_mark: ${muteMember.user.tag} was successfully muted (\`${reason}\`).`);
        log(`A member called **${muteMember.user.tag} (${muteMember.user.id})** was muted by **${msg.author.tag} (${msg.author.id})**.\n\n**Reason:** ${reason}`);
    } else

    if (msg.content.toLowerCase().startsWith(prefix + `unmute`)) {
        var mutedRole = msg.guild.roles.find(`name`, `Muted`).id;
        var reason = result.split(` `).slice(1).join(` `);
        var unmuteMember = msg.mentions.members.first();   
        if (!isStaff(msg.member)) return msg.channel.send(`:x: Insufficient permission.`);
        if (!unmuteMember) return msg.channel.send(`:x: You must provide a member to unmute.`);
        if (!reason) return msg.channel.send(`:x: You must provide a reason for the unmute.`);
        if (!unmuteMember.roles.has(mutedRole)) return msg.channel.send(`:x: This member is not currently muted.`);
        unmuteMember.removeRole(mutedRole).catch(e => msg.channel.send(e));
        unmuteMember.setMute(false, reason);
        msg.channel.send(`:white_check_mark: ${unmuteMember.user.tag} was successfully unmuted (\`${reason}\`).`);
        log(`A member called **${unmuteMember.user.tag} (${unmuteMember.user.id})** was unmuted by **${msg.author.tag} (${msg.author.id})**.\n\n**Reason:** ${reason}`);
    }

});

// LOGGING HANDLING & EVENTS
var log = function(content) {
    if (!client.guilds.first().channels.find(`name`, `warvale-bot-logs`)) return;
    var now = new Date();
    var logChannel = client.guilds.first().channels.find(`name`, config.logChannel);
    var embed = new Discord.MessageEmbed();
    embed.setColor(`0xf56d05`);
    embed.setDescription(`\`[${'hh:mm:ss'.timestamp}]\` ${content}`);
    logChannel.send({ embed: embed });
}

// FUNCTION TO CHECK IF MEMBER IS A STAFF MEMBER
var isStaff = function(member) {
    const staffRole = member.guild.roles.find(`name`, config.staffRole).id;
    if (!member.roles.has(staffRole)) return false;
    return true;
}
    

// MESSAGE EVENTS
client.on(`messageDelete`, (msg) => {
    if (msg.author.bot) return;
    log(`A message by **${msg.author.tag} (${msg.author.id})** was removed.\n\n**Content:** ${msg.content}`);
});

client.on(`messageUpdate`, (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;
    log(`A message by **${oldMessage.author.tag} (${oldMessage.author.id})** was edited.\n\n**Old:** ${oldMessage.content}\n**New:** ${newMessage.content}`);
});

// GUILD EVENTS
client.on(`guildMemberAdd`, (member) => {
    log(`A new member called **${member.user.tag} (${member.user.id})** joined the server.\n\n**Account created:** ${member.user.createdAt}.`);
});

client.on(`guildMemberRemove`, (member) => {
    log(`A member called **${member.user.tag} (${member.user.id})** left the server.\n\n**Joined:** ${member.joinedAt}.`);
});

client.on(`guildMemberUpdate`, (oldMember, newMember) => {
    if (newMember.nickname !== oldMember.nickname) {
        if (!oldMember.nickname) return log(`A member called **${oldMember.user.tag} (${oldMember.user.id})** has had their nickname updated.\n\n**Old:** ${oldMember.displayName}\n**New:** ${newMember.nickname}`);
        if (!newMember.nickname) return log(`A member called **${oldMember.user.tag} (${oldMember.user.id})** has had their nickname updated.\n\n**Old:** ${oldMember.nickname}\n**New:** ${newMember.displayName}`);
        log(`A member called **${oldMember.user.tag} (${oldMember.user.id})** has had their nickname updated.\n\n**Old:** ${oldMember.nickname}\n**New:** ${newMember.nickname}`);
    }
    // if (newMember.roles !== oldMember.roles) { log (`A member called **${oldMember.user.tag} (${oldMember.user.id})** has had their roles updated.\n\n**Old:** \`\`\`${oldMember.roles.map(r => `${r.name}\n`)}\`\`\`\n**New:** \`\`\`${newMember.roles.map(r =>  `${r.name}\n`)}\`\`\``); }
});

// USER EVENTS
client.on(`userUpdate`, (oldUser, newUser) => {
    if (newUser.avatar !== oldUser.avatar) { log(`A user called **${oldUser.tag} (${oldUser.id})** changed their avatar.\n\n**Old:** ${oldUser.avatarURL()}\n**New:** ${newUser.avatarURL()}`); }
    if (newUser.username !== oldUser.username) { log(`A user called **${oldUser.tag} (${oldUser.id})** changed their username.\n\n**Old:** ${oldUser.username}\n**New:** ${newUser.username}`); }
});

// ANTI ADVERTISEMENT
client.on(`message`, (msg) => {
    var mc = msg.content.toLowerCase();
    if (!(mc.includes(`discord.gg`) || mc.includes(`discordapp.com/invite`) || (mc.includes(`discord`) && mc.includes(`gg`) || ( (mc.includes(`discordapp`) || mc.includes(`discord`) ) && mc.includes(`invite`) )))) return;
    log(`A message by **${msg.author.tag} (${msg.author.id})** had potential advertising in it, the message was removed.`);
    msg.delete(500);
});