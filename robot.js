// DEPENDENCIES
const Discord = require('discord.js');
const client = new Discord.Client();
const PersistentCollection = require("djs-collection-persistent");
const timestamp = require('console-timestamp');
const animals = require('relevant-animals');
// BOT STUFF, NOT DEPENDENCIES
const config = require('./config.json');
const prefix = config.prefix;
const embed = new Discord.MessageEmbed();
// USE TOKEN FROM FILE TO LOGIN
client.login(require("./token"));


client.on('ready', () => {
    console.log(`Warvale bot is now ready to serve ${client.users.size} Warvale players.\nThis bot was made by Warvale and is not to be self-hosted.`);
    client.setGame(`with ${client.users.size} warvalers!`);
    client.setInterval(()=>{
        client.setGame(`with ${client.users.size} warvalers!`);
    }, 1000*60*5);
});


client.on('message', (msg) => {
    var args = msg.content.split(' ').slice(1);
    var result = args.join(' ');

    if (msg.author.bot) return;

    if (msg.content.startsWith(prefix + 'ping')) {
        embed.setColor("0xf56d05");
        embed.setDescription(`Pong! Use \`${config.prefix}help\` for commands.`);
        msg.channel.send({ embed: embed });
    }
    
});
