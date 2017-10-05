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


client.on(`ready`, () => {
    console.log(`Warvale bot is now ready to serve ${client.users.size} Warvale players.\nThis bot was made by Warvale and is not to be self-hosted.`);
    client.user.setActivity(`with ${client.users.size} Warvalers!`);
    client.setInterval(()=>{
        client.user.setActivity(`with ${client.users.size} Warvalers!`);
    }, 1000*60*5);
});


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
    }

    
});
