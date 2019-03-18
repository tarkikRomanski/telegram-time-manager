const config = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(config.parsed.TELEGRAM_TOKEN, {polling: true});

export const store = {
    bot,
    config: config.parsed || {}
};