var client = require(`../robot`).client;
var log = require(`./LogManager`).log;
client.on(`messageDelete`, (msg) => {
log(`A message by ${msg.author.tag} has been removed.\nContent: ${msg.content}}`);
});
