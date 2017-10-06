const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const bot = new Discord.Client();
const loggerUtils = require('./utils/loggerUtils');
const commands = require('./managers/commands');
const perms = require('./managers/permissions');
const DiscordLogger = require('./utils/DiscordLogger');
let AuthDetails = {};
let Config = {};
let Guilds = {};

exports.init = function() {

    //set our logger prefix
    loggerUtils.setPrefix("[Robot]");

    // Get authentication data
    try {
        AuthDetails = require("../config/auth.json");
    } catch (e){

        AuthDetails.token = "bottoken";
        AuthDetails.googleAPIKey = "googleApiKey";

        try {
            if (fs.lstatSync("./config/auth.json").isFile()) {
                loggerUtils.warning("config.json found but we couldn't read it!\n" + e.stack);
            }
        } catch(e2) {
            fs.writeFile("./config/auth.json", JSON.stringify(AuthDetails, null, 2));
        }

        process.exit();
    }

    //set game to loading
    bot.login(AuthDetails.token);

    //load config data
    try {
        Config = require("../config/config.json");
    } catch(e){ //no config file, use defaults

        Config.debug = false;
        Config.prefix = '!';
        Config.logChannel = '';

        try {
            if (fs.lstatSync("./config/config.json").isFile()) {
                console.log("WARNING: config.json found but we couldn't read it!\n" + e.stack);
            }

        } catch(e2) {
            fs.writeFile("./config/config.json",JSON.stringify(Config,null,3));
        }
    }

    if(!Config.hasOwnProperty("prefix")){
        Config.prefix = '!';
    }

    //load permissions
    perms.init();

    //load guilds
    try {
        Guilds = require('../config/guilds.json');
    } catch (e) {

        Guilds.servers = {};

        try {

            if (fs.lstatSync("./config/guilds.json").isFile()) {
                console.log("WARNING: guilds.json found but we couldn't read it!\n" + e.stack);
            }

        } catch (e2){
            fs.writeFile("./config/guilds.json", JSON.stringify(Guilds, null, 1));
        }

    }

};

bot.on('ready', () => {

    console.log("Connected to discord");
    bot.user.setActivity(`with ${client.guilds.first().memberCount} Warvalers!`);
    bot.setInterval(()=>{
        bot.user.setActivity(`with ${client.guilds.first().memberCount} Warvalers!`);
    }, 1000*60*5);

});

exports.checkMessageForCommand = function(msg, isEdit) {

    //check if message is a command
    if(!msg.author.equals(bot.user) && (msg.content.startsWith(Config.prefix))) {
        console.log("treating " + msg.content + " from " + msg.author + " as command");
        let cmdTxt = msg.content.split(" ")[0].substring(Config.prefix.length);
        let args = msg.content.substring(cmdTxt.length + Config.prefix.length + 1); //add one for the ! and one for the space

        if (msg.isMentioned(bot.user)) {

            try {
                cmdTxt = msg.content.split(" ")[1];
                args = msg.content.substring(bot.user.mention().length + cmdTxt.length + Config.prefix.length + 1);
            } catch(e){ //no command
                msg.channel.sendMessage("Yes?");
                return;
            }

        }

        let cmd = commands[cmdTxt];

        if(cmd) {
            if(perms.checkPermission(msg.author, cmdTxt)){
                try{
                    cmd.process(bot,msg,Config.prefix,args,isEdit);
                } catch(e){
                    let msgTxt = "command " + cmdTxt + " failed :(";
                    if(Config.debug){
                        msgTxt += "\n" + e.stack;
                    }
                    msg.channel.sendMessage(msgTxt);
                }
            } else {
                msg.channel.sendMessage("You are not allowed to run " + cmdTxt + "!");
            }
        } else {
            msg.channel.sendMessage(cmdTxt + " not recognized as a command!").then((message => message.delete(5000)))
        }

    } else {
        //message isn't a command or is from us
        //drop our own messages to prevent feedback loops
        if(msg.author.bot){
            return;
        }

        if (!msg.author.equals(bot.user) && msg.isMentioned(bot.user)) {
            msg.channel.sendMessage(msg.author + ", you called?");
        }
    }
};

// MESSAGE EVENTS
bot.on("message", (msg) => this.checkMessageForCommand(msg, false));
bot.on("messageUpdate", (oldMessage, newMessage) => {
    this.checkMessageForCommand(newMessage,true);
    if (oldMessage.author.bot) return;
    DiscordLogger.log(bot, `A message by **${oldMessage.author.tag} (${oldMessage.author.id})** has been edited.\n**Old:** ${oldMessage.content}\n**New:** ${newMessage.content}`, Config.logChannel);
});
bot.on(`messageDelete`, (msg) => {
    if (msg.author.bot) return;
    DiscordLogger.log(bot, `A message by **${msg.author.tag} (${msg.author.id})** has been removed.\n**Content:** ${msg.content}`, Config.logChannel);
});

// GUILD EVENTS
bot.on(`guildMemberAdd`, (member) => {
    DiscordLogger.log(bot, `A new member called **${member.user.tag} (${member.user.id})** has joined the server.\n**Account created:** ${member.user.createdAt}.`, Config.logChannel);
});

bot.on(`guildMemberRemove`, (member) => {
    DiscordLogger.log(bot, `A member called **${member.user.tag} (${member.user.id})** has left the server.\n**Joined:** ${member.joinedAt}.`, Config.logChannel);
});

bot.on(`guildMemberUpdate`, (oldMember, newMember) => {
    if (newMember.nickname === oldMember.nickname) return;
    DiscordLogger.log(bot, `A member called **${oldMember.user.tag} (${oldMember.user.id})** has had their nickname updated.\n**Old:** ${oldMember.nickname}\n**New:** ${newMember.nickname}`, Config.logChannel);
    // if (newMember.roles === oldMember.roles) return;
    // return log (`A member called **${oldMember.user.tag} (${oldMember.user.id})** has had their roles updated.\n**Old:** ${oldMember.roles.map(r => r.name)}\n**New:** ${newMember.roles.map(r => r.name)}`);
});

// USER EVENTS
bot.on(`userUpdate`, (oldUser, newUser) => {
    let oox = `A member called **${newUser.tag} (${newUser.id})**
    ${oldUser.avatarURL() !== newUser.avatarURL() ? `\n**Old:** [avatar](${oldUser.avatarURL()})\n**New:**${newUser.avatarURL()}` : ``}${oldUser.tag !== newUser.tag ? `\n**Old:**${oldUser.tag}\n**New:**${newUser.tag}` : ``}`;
    DiscordLogger.log(bot, oox, Config.logChannel);
});

// Anti advert
bot.on(`message`, (msg) => {
    if (!msg.content.includes(`discord.gg`)) return;
    msg.delete();
    DiscordLogger.log(bot, `A message by **${msg.author.tag} (${msg.author.id})** had advertising in it, the message was removed.`, Config.logChannel);
    msg.author.send(`Your message has been removed for advertising.`);
});

exports.addCommand = (commandName, commandObject) => {
    try {
        commands[commandName] = commandObject;
    } catch(err){
        console.log(err);
    }
};