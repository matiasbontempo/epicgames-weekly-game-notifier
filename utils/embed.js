const Discord = require('discord.js');

const generateDate = (str) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const date = new Date(str);
  const d = days[date.getDay()];
  const m = months[date.getMonth()];
  const n = date.getDate();
  return `${d}, ${m} ${n}`;
};

module.exports = ({
  title, slug, image, date, upcoming,
}) => new Discord.RichEmbed()
  .setColor(upcoming ? '#000' : '#0078f2')
  .setTitle(title)
  .setDescription(upcoming ? `COMING SOON: **${generateDate(upcoming)}**` : '**FREE NOW**')
  .setURL(`https://www.epicgames.com/store/en-US/product/${slug}`)
  // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
  // .setDescription(description)
  // .setThumbnail(image)
  .setImage(image)
  .setTimestamp(new Date(date || upcoming || undefined));
