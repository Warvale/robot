module.exports = {

    "help": require('../commands/help'),
    "about": require('../commands/about'),
    "ping": require('../commands/ping'),
    "eval": require('../commands/eval'),

    //Moderation
    "ban": require('../commands/moderation/ban')

};

