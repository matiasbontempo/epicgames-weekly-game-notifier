const schedule = require('node-schedule');
const client = require('./discordClient');

const getGames = require('./getGames');
const embed = require('./embed');

const logger = require('./logger');

let cache;
let scheduled;

const job = async () => {
  logger('Started running.');
  const games = await getGames();

  if (cache === JSON.stringify(games)) {
    logger('No new games.');
    return;
  }

  logger('New games found!');

  cache = JSON.stringify(games);
  const updatesChannels = [];

  try {
    client.guilds.forEach((g) => g.channels.forEach((c) => {
      if (c.name === 'updates') updatesChannels.push(c);
    }));
  } catch (err) {
    logger(err);
    throw new Error('Can\'t read guilds');
  }

  updatesChannels.forEach((uc) => {
    try {
      uc.send('New free EpicGames this week:');
      games.forEach((o) => { uc.send(embed(o)); });
    } catch (err) {
      logger(err);
      throw new Error('Can\'t send message');
    }
  });
};

const cron = (channel) => {
  try {
    if (scheduled) {
      if (!channel || !cache) return;
      const games = JSON.parse(cache);
      channel.send('New free EpicGames this week:');
      games.forEach((o) => { channel.send(embed(o)); });
      return;
    }
    job();
    scheduled = schedule.scheduleJob('0 */2 * * *', job); // Every two hours
    // scheduled = schedule.scheduleJob('* * * * *', job); // Every minute
  } catch (err) {
    logger(err, 'error');
  }
};

module.exports = cron;
