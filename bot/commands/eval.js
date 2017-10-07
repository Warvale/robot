const Discord = require(`discord.js`);

const clean = text => {
    if (typeof(text) === `string`)
        return text.replace(/`/g, `"` + String.fromCharCode(8203)).replace(/@/g, `@` + String.fromCharCode(8203));
    else
        return text;
};

module.exports = {

    description: `Evaluates Javascript, reserved for Bot Administrators.`,

    process: function (bot, msg, prefix, args, isEdit) {
        if (isEdit) return; //Don't rerun for safety precautions
        if (!msg.author.id.equals(`250536623270264833`)) return;
        try {
            let code = args.join(` `);
            let evaled = eval(code);

            if (typeof evaled !== `string`)
                evaled = require(`util`).inspect(evaled);

            msg.channel.send(clean(evaled), {code:`xl`});
        } catch (err) {
            msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }

};