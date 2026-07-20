const dotenv = require('dotenv');
const result = dotenv.config();
const envConfig = (result && result.parsed) ? result.parsed : process.env;

const TelegramBot = require('node-telegram-bot-api');

const token = envConfig.TELEGRAM_TOKEN || process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});

export const store = {
    bot,
    config: envConfig
};