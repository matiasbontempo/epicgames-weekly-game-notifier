require('dotenv').config();

const fetch = require('node-fetch');
const client = require('./discordClient');

const embed = require('./embed');
const query = require('./query');

const { DISCORD_BOT_TOKEN } = process.env;

let cache;

if (!DISCORD_BOT_TOKEN) {
  console.log('Missing DISCORD_BOT_TOKEN');
  process.exit();
}

client.on('ready', () => {
  console.log('Ready!');
  const botChannel = client.channels.find((x) => x.name === 'bot');
});

client.on('message', async (message) => {
  const { content, channel, author } = message;
  if (content === '!hello') {
    channel.send(`Hello ${author}`);
  }

  if (content === '!debug') {
    console.log(message);
    channel.send(JSON.stringify(message));
  }

  if (content === '!epic') {
    const res = await fetch('https://graphql.epicgames.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    const epic = await res.json();
    const { elements: games } = epic.data.Catalog.catalogOffers;

    const offers = games
      .filter((game) => game.promotions)
      .map((game) => ({
        title: game.title,
        slug: game.productSlug,
        image: game.keyImages.find((i) => i.type === 'DieselStoreFrontWide').url,
        date: game.promotions.promotionalOffers.length
          && game.promotions.promotionalOffers[0].promotionalOffers[0].startDate,
        upcoming: game.promotions.upcomingPromotionalOffers.length
          && game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate,
      }));

    if (cache === JSON.stringify(offers)) return;

    cache = JSON.stringify(offers);

    channel.send('Nuevos juegos gratis en EpicGames:');
    offers.forEach((o) => {
      const exampleEmbed = embed(o);
      channel.send(exampleEmbed);
    });
  }
});

client.on('error', (err) => {
  console.warn(err);
});

client.login(DISCORD_BOT_TOKEN);
