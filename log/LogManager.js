var client = require("../robot").client;
var log = function(content) {
    var now = new Date();
    var logChannel = client.guilds.first();
    logChannel.send(`\`[${'hh:mm:ss'.timestamp}]\`${content}`);
    console.log(`[Logging] \`[${'hh:mm:ss'.timestamp}]\`${content}`);
  }

exports.log = log;