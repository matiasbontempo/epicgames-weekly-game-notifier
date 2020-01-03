const Discord = require('discord.js');


const generateDate = (str) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const date = new Date(str);
  const d = days[date.getDay()];
  const m = months[date.getMonth()];
  const n = date.getDate();
  return `${d} ${n} de ${m}`;
};

module.exports = ({
  title, slug, image, date, upcoming,
}) => new Discord.RichEmbed()
  .setColor(upcoming ? '#000' : '#0078f2')
  .setTitle(title)
  .setDescription(upcoming ? `PRÓXIMAMENTE: **${generateDate(upcoming)}**` : '**GRATIS AHORA**')
  .setURL(`https://www.epicgames.com/store/es-ES/product/${slug}`)
  // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
  // .setDescription(description)
  // .setThumbnail(image)
  .setImage(image)
  .setTimestamp(new Date(date || upcoming || undefined));
