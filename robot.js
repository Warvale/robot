// DEPENDENCIES
const Discord = require(`discord.js`);
const client = new Discord.Client();
const PersistentCollection = require(`djs-collection-persistent`);
const timestamp = require(`console-timestamp`);
const animals = require(`relevant-animals`);
// BOT STUFF, NOT DEPENDENCIES
const config = require(`./config.json`);
const prefix = config.prefix;
const embed = new Discord.MessageEmbed();
// USE TOKEN FROM FILE TO LOGIN
client.login(require(`./token`));

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
        embed.setColor(`0xf56d05`);
        embed.setDescription(`Pong! Use \`${config.prefix}help\` for commands.`);
        msg.channel.send({ embed: embed });
    } else 

    if (msg.content.startsWith(prefix + `about`)) {
        embed.setColor(`0xf56d05`);
        embed.setDescription(`Warvale is an upcoming Minecraft network featuring PVP games.`);
        embed.addField(`Players`, msg.guild.members.size, true);
        embed.addField(`Links`, `[GitHub](https://github.com/Warvale/robot)\n[Warvale](https://warvale.net)`, true);
        msg.channel.send({ embed: embed });
    } else

    if (msg.content.startsWith(prefix + `debug`)) {
        if (msg.author.id === "250536623270264833" || "142244934139904000") {
            embed.setImage();
        }
    }


    
});
