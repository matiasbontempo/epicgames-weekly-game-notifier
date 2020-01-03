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

  client.guilds.forEach((g) => g.channels.forEach((c) => {
    if (c.name === 'updates') updatesChannels.push(c);
  }));

  updatesChannels.forEach((uc) => {
    uc.send('Nuevos juegos gratis en EpicGames:');
    games.forEach((o) => { uc.send(embed(o)); });
  });
};

const cron = (channel) => {
  if (scheduled) {
    if (!channel) return;
    const games = JSON.parse(cache);
    channel.send('Nuevos juegos gratis en EpicGames:');
    games.forEach((o) => { channel.send(embed(o)); });
    return;
  }
  // scheduled = schedule.scheduleJob('0 */2 * * *', job); // Every two hours
  scheduled = schedule.scheduleJob('* * * * *', job); // Every minute
};

module.exports = cron;
