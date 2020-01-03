
const logger = (msg, type = undefined) => console.log(JSON.stringify({
  timestamp: new Date(),
  message: msg,
  type,
}));

module.exports = logger;
