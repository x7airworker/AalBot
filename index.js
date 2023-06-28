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

if (process.env.VIDEO_ENFORCE_ROLE_ID && process.env.VIDEO_ENFORCE_MESSAGE_CHANNEL_ID) {
    client.on('voiceStateUpdate', (_, e) => {
        if (e.channelID == null)
            return;

        if (!e.member.roles.cache.some(role => role.id === process.env.VIDEO_ENFORCE_ROLE_ID))
            return;
        
        if (e.selfVideo)
            return;

        const channel = e.guild.channels.cache.find(c => c.id == process.env.VIDEO_ENFORCE_MESSAGE_CHANNEL_ID);
        if (channel == null)
            return;
        channel.send(`<@${e.member.id}> bitte Kamera anmachen!`);
        setTimeout(() => {
            const voiceState = e.guild.voiceStates.cache.find(x => x.channelID == e.channelID);
            if (voiceState != null && !voiceState.selfVideo) {
                voiceState.kick();
                channel.send(`<@${e.member.id}> du wurdest wegen fehlender Kamera gekickt!`);
            }
        }, 10000)
    })
}

client.login(process.env.DISCORD_TOKEN);