/* Notice:
This bot is supposed to be used in one guild, Warvale's discord guild.
You are NOT allowed to self-host this without our permission.

The bot's tries to focus on moderation and music!
Pull Requests are greatly appreciated.

This bot is a one filer and will stay so as there's no need for multiple files right now.


PS: Let's make sure this bot stays pretty small.
*/
const Discord = require("discord.js");
const bot = new Discord.Client();
var config = require("./config");
var msgpersec = {};


// Anti spam
bot.on("message",(msg)=>{
if (msg.author.bot) return; // dont do this if its a bot
if (!msgpersec[msg.author.id]) msgpersec[msg.author.id] = 1; else msgpersec[msg.author.id]++; // if user not already registered, register them.
    if (msg.member.roles.find("name", "Muted") !== null) return; // if user is already w/ muted rule, dont try and mute them again as this can cause spam.
if (msgpersec[msg.author.id] >= 3) {
    msg.member.addRole(msg.guild.roles.find("name", "Muted")); // assuming server has that role.
    msg.channel.send(`${msg.author.tag} has been auto-muted due to spamming! (3+ messages per second!)`);
}
});
setInterval(()=>{msgpersec={}}, 1000);


function isStaff(memberlol) {
    return (!(!(memberlol.roles.find("name", "Junior Moderator")) && !(memberlol.roles.find("name", "Moderator")) && !(memberlol.roles.find("name", "Senior Moderator")) && !(memberlol.roles.find("name", "Administrator"))));
}

bot.on("ready",()=>{
console.log(`Logged in as ${bot.user.tag}`);
});


bot.on("message",(msg)=>{
    if (msg.author.bot || !(msg.content.startsWith(config.prefix))) return;
     let cmd = msg.content.toLowerCase().split(" ")[0].slice(config.prefix.length);
     let args = msg.content.split(" ").slice(1);

     switch (cmd) {
         case "ping":
         msg.channel.send("Pong! :ping_pong:").then((m)=>{
            m.edit(`Pong! :ping_pong: (Roundtrip: ${m.createdTimestamp - msg.createdTimestamp}ms | One-way: ${Math.round(bot.ping)}ms)`);
         });
         break;

         case "mute":
         if (!isStaff(msg.member)) {
             msg.channel.send("No permission! :x:");
             return;
         }
         if (msg.mentions.members.size !== 1) {
             msg.channel.send("You need to mention **one** user!");
             return;
         }
         let mutetarget = msg.mentions.members.first();
         if (mutetarget.roles.find("name", "Muted") !== null ) {
             msg.channel.send(":x: User is already muted!");
             return;
         }
         mutetarget.addRole(msg.guild.roles.find("name", "Muted")); // again, assuming muted rule exists.
         msg.channel.send(`<@!${msg.author.id}> has muted <@!${mutetarget.user.id}>`);
         break;

         case "unmute":
         if (!isStaff(msg.member)) {
            msg.channel.send("No permission! :x:");
            return;
        }
        if (msg.mentions.members.size !== 1) {
            msg.channel.send("You need to mention **one** user!");
            return;
        }
        let unmutetarget = msg.mentions.members.first();
        if (unmutetarget.roles.find("name", "Muted") == null ) {
            msg.channel.send(":x: User is not muted!");
            return;
        }
        unmutetarget.removeRole(unmutetarget.roles.find("name", "Muted"));
        msg.channel.send(`<@!${msg.author.id}> has unmuted <@!${unmutetarget.user.id}>`);

         break;

         case "about":
            msg.channel.send("Bot made using Discord.js on Node.js | Made by Warvale");
         break;
     }
});






bot.login(require("./token"));