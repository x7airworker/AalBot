require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    let found = 0;
    const parts = msg.content.split(" ");
    for (let i = 0; i < parts.length; i++) {
        const beginning = parts[i].substring(0, 2).toLowerCase();
        if (beginning == "al") {
            parts[i] = parts[i][0] + 'a' + parts[i].substring(1);
            found++;
        }
    }

    if (found > 0) {
        const newMsg = parts.join(' ');

        msg.reply(newMsg);
    }
});

client.login(process.env.DISCORD_TOKEN);