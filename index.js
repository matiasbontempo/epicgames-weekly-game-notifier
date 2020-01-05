const client = require('./utils/discordClient');
const cron = require('./utils/cron');

const logger = require('./utils/logger');

client.on('ready', () => {
  logger('Ready!');
  cron();
});

client.on('message', async (message) => {
  const { content, channel, author } = message;
  if (content === '!hello') {
    channel.send(`Hello ${author}`);
  }

  if (content === '!debug') {
    logger(message);
    channel.send(JSON.stringify(message));
  }

  if (content === '!epic') { cron(channel); }
});

client.on('error', (err) => {
  logger(err, 'error');
});
