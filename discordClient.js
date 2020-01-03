const Discord = require('discord.js');

const client = new Discord.Client();

const { DISCORD_BOT_TOKEN } = process.env;

if (!DISCORD_BOT_TOKEN) {
  console.log('Missing DISCORD_BOT_TOKEN');
  process.exit();
}

client.login(DISCORD_BOT_TOKEN);

module.exports = client;
