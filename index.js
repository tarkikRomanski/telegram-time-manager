const config = require('dotenv').config();

import User from './db/Models/User';

const TelegramBot = require('node-telegram-bot-api');
import connectToDb from './db/connect';
import Task, {PROCESS} from "./db/Models/Task";

connectToDb();

const bot = new TelegramBot(config.parsed.TELEGRAM_TOKEN, {polling: true});

console.log('Start session');

function createTask(user, telegramId, date) {
    console.log('Create task');
    Task.getNotComplated(user._id).then(task => {
        if (task) {
            return task;
        }

        const newTask = Task({
            taskId: `${telegramId}-${date}`,
            userId: user._id,
        });

        Task.createTask(newTask).then(() => {
            bot.sendMessage(telegramId, 'Enter name');
        });
    });
}

bot.onText(new RegExp(/show (.+)/), async (msg, match) => {
    const taskId = match[1] || '';
    const task = await Task.getByTaskId(taskId.trim());
    task.name && await bot.sendMessage(msg.from.id, `Name: ${task.name}`);
    task.description && await bot.sendMessage(msg.from.id, task.description);
    task.image && await bot.sendPhoto(msg.from.id, task.image);
    task.voice && await bot.sendVoice(msg.from.id, task.voice);
});

bot.on('message', async msg => {
    const telegramUser = msg.from;

    if (!await User.getByTelegramId(telegramUser.id)) {
        const newUser = User({
            username: telegramUser.username,
            telegramId: telegramUser.id,
            lastName: telegramUser.last_name,
            firstName: telegramUser.first_name,
            language: telegramUser.language_code,
        });

        await User.createUser(newUser);
    }

    const text = msg.text || '';

    const user = await User.getByTelegramId(telegramUser.id);
    const existEditableTasks = await Task.getNotComplated(user._id);

    switch (true) {
        case text.indexOf('/create') === 0:
            createTask(user, telegramUser.id, msg.date);
            break;
        case text.indexOf('/end') === 0:
            Task.endCreate(existEditableTasks.taskId)
                .then(() => bot.sendMessage(telegramUser.id, `Task has been created. id: ${existEditableTasks.taskId}`));
            break;
        case text.indexOf('/show') === 0: break;
        case text.indexOf('/list') === 0:
            const listOfTasks = await Task.listByUser(user._id);
            if (!listOfTasks.length) {
                bot.sendMessage(telegramUser.id, 'List of tasks is empty!');
                break;
            }

            listOfTasks.forEach(async item => await bot.sendMessage(telegramUser.id, `${item.taskId}: ${item.name}`));
            break;
        case existEditableTasks && existEditableTasks.process === PROCESS.NAME:
            Task.setName(existEditableTasks.taskId, text).then(() => {
                bot.sendMessage(telegramUser.id, 'Enter description');
            });
            break;
        case existEditableTasks && existEditableTasks.process === PROCESS.DESCRIPTION:
            msg.text && Task.setDescription(existEditableTasks.taskId, msg.text)
                .then(() => bot.sendMessage(telegramUser.id, 'Text has been added'));

            msg.photo && Task.setImage(existEditableTasks.taskId, msg.photo[0].file_id)
                .then(() => bot.sendMessage(telegramUser.id, 'Image has been added'));

            msg.voice && Task.setVoice(existEditableTasks.taskId, msg.voice.file_id)
                .then(() => bot.sendMessage(telegramUser.id, 'Voice has been added'));
            break;
    }
});