import User from './db/Models/User';

const TelegramBot = require('node-telegram-bot-api');
import connectToDb from './db/connect';

connectToDb();

const token = '822053129:AAHOTLLoBMykTFxv3yj7TlZmhMRx_j_yDiY';
const bot = new TelegramBot(token, {polling: true});

console.log('Start session');

bot.onText(new RegExp(/echo (.+)/), (msg, match) => {
    const telegramUser = msg.from;
    const resp = match[1];

    User.getByTelegramId(telegramUser.id).then(user => {
        if (!user) {
            return user;
        }

        bot.sendMessage(telegramUser.id, resp);
    });
});

bot.on('message', function (msg) {
    const telegramUser = msg.from;

    User.getByTelegramId(telegramUser.id).then(user => {
        if (!user) {
            const newUser = User({
                username: telegramUser.username,
                telegramId: telegramUser.id,
                lastName: telegramUser.last_name,
                firstName: telegramUser.first_name,
                language: telegramUser.language_code,
            });

            User.createUser(newUser);
        }
    });
});