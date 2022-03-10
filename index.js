const TelegramBot = require('node-telegram-bot-api');
const ethers = require('ethers')
const ZKSTAKE = require('./zkStake.json')

require('dotenv').config()

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

// connect to smart contract
const provider = ethers.getDefaultProvider('kovan')
const stakecontract = new ethers.Contract(
  // config.Contract_Address,
  process.env.CONTRACT_ADDRESS,
  ZKSTAKE.abi,
  provider,
)

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/verify (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  console.log(`chatId: ${chatId}`);
  console.log(`resp: ${resp}`);

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});
