const TelegramBot = require('node-telegram-bot-api');
const ethers = require('ethers')
const ZKSTAKE = require('./zkStake.json')

require('dotenv').config()

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

// connect to smart contract
const provider = ethers.getDefaultProvider('kovan')
const stakecontract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ZKSTAKE.abi,
  provider,
)

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

async function main(resp, chatId, bot) {
  let valid = await checkWhitelist(resp);
  console.log(`valid: ${valid}`)
  if (valid && typeof valid === "boolean") {

      console.log(`User is verified`);
      bot.sendMessage(chatId, `User is verified`);
    } else {
      console.log(`Unable to verify user`);
      bot.sendMessage(chatId, `Unable to verify user`);
    }
}

async function checkWhitelist(message) {
  try {
    const decoded = new Buffer.from(message, 'hex').toString()
    const params = JSON.parse(decoded.toString())
    const r = await stakecontract.verifyIdentityChallenge(
      params.challenge,
      params.nullifierHash,
      params.entityId,
      params.proof,
    )
    return r
  } catch (error) {
    console.log(`Error: ${error}`);
    return false
  }

}

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
  main(resp, chatId, bot)

});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});
