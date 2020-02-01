const fs = require('fs');
const schedule = require('node-schedule');

const client = require('./discordClient');
const getGames = require('./getGames');
const embed = require('./embed');

const logger = require('./logger');

const cacheFile = `${__dirname}/../persist/cache.json`;

let cache;
let scheduled;

try {
  cache = fs.readFileSync(cacheFile, 'utf8');
} catch (err) {
  logger('Cache file not found.');
}

const job = async () => {
  logger('Started running.');
  const games = await getGames();

  if (cache === JSON.stringify(games)) {
    logger('No new games.');
    return;
  }

  logger('New games found!');
  logger({ cache, games });

  cache = JSON.stringify(games);
  try {
    await fs.writeFileSync(cacheFile, JSON.stringify(games), 'utf8');
  } catch (err) {
    logger('Can\'t write cache file');
    console.error(err);
  }

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
