// DEPENDENCIES
const Discord = require(`discord.js`);
const client = new Discord.Client();
const PersistentCollection = require(`djs-collection-persistent`);
const timestamp = require(`console-timestamp`);
// BOT STUFF, NOT DEPENDENCIES
const config = require(`./config.json`);
const prefix = config.prefix;
// USE TOKEN FROM FILE TO LOGIN
client.login(require("./token"));
exports.client = client;

/*
- All strings must be template literals (` `).
*/

// MISC FUNCTIONS

const clean = text => {
  if (typeof(text) === `string`)
    return text.replace(/`/g, `"` + String.fromCharCode(8203)).replace(/@/g, `@` + String.fromCharCode(8203));
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
        var cmds = [
            `**__Oh no! You need help with the Warvale bot? I gotchu fam!__** [prefix: ${prefix}]`,
            `**${prefix}about** - shows information about Warvale and this bot.`,
            `**${prefix}ping** - pong! (self explanatory, eh?)`
        ].join(`\n`);
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
    

// MESSAGE EVENTS
client.on(`messageDelete`, (msg) => {
    if (msg.author.bot) return;
    log(`A message by **${msg.author.tag} (${msg.author.id})** has been removed.\n**Content:** ${msg.content}`);
});

client.on(`messageUpdate`, (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    log(`A message by **${oldMessage.author.tag} (${oldMessage.author.id})** has been edited.\n**Old:** ${oldMessage.content}\n**New:** ${newMessage.content}`);
});

// GUILD EVENTS
client.on(`guildMemberAdd`, (member) => {
    log(`A new member called **${member.user.tag} (${member.user.id})** has joined the server.\n**Account created:** ${member.user.createdAt}.`);
});

client.on(`guildMemberRemove`, (member) => {
    log(`A member called **${member.user.tag} (${member.user.id})** has left the server.\n**Joined:** ${member.joinedAt}.`);
});

client.on(`guildMemberUpdate`, (oldMember, newMember) => {
    if (newMember.nickname === oldMember.nickname) return;
    return log(`A member called **${oldMember.user.tag} (${oldMember.user.id})** has had their nickname updated.\n**Old:** ${oldMember.nickname}\n**New:** ${newMember.nickname}`);
    
});


    
