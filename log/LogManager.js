var client = require(`../robot`).client;
var log = function(content) {
    if (!client.guilds.first().channels.find(`name`, `warvale-bot-logs`)) return;
    var now = new Date();
    var logChannel = client.guilds.first().channels.find(`name`, `warvale-bot-logs`);
    logChannel.send(`\`[${'hh:mm:ss'.timestamp}]\`${content}`);
  }

exports.log = log;
