const fetch = require('node-fetch');

const query = require('./query');

module.exports = () => new Promise(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor, max-len
  try {
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

    resolve(offers);
  } catch (err) {
    console.log(err);
    reject(err);
  }
});
