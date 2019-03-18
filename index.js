import User from './db/Models/User';
import connectToDb from './db/connect';
import Task, {PROCESS} from './db/Models/Task';
import {showTask, endCreate, setTaskDescription, createTask, list, setTaskName} from './endpoints';
import {store} from './components/store';

connectToDb();

const bot = store.bot;

console.log('Start session');

bot.onText(new RegExp(/show (.+)/), async (msg, match) => await showTask(msg.from.id, match[1] || ''));

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
            existEditableTasks && await endCreate(telegramUser.id, existEditableTasks.taskId);
            await createTask(user._id, telegramUser.id, msg.date);
            break;

        case text.indexOf('/end') === 0:
            existEditableTasks && await endCreate(telegramUser.id, existEditableTasks.taskId);
            break;

        case text.indexOf('/show') === 0:
            existEditableTasks && await endCreate(telegramUser.id, existEditableTasks.taskId);
            break;

        case text.indexOf('/list') === 0:
            existEditableTasks && await endCreate(telegramUser.id, existEditableTasks.taskId);
            await list(telegramUser.id, user._id);
            break;

        case existEditableTasks && existEditableTasks.process === PROCESS.NAME:
            await setTaskName(telegramUser.id, existEditableTasks.taskId, text);
            break;

        case existEditableTasks && existEditableTasks.process === PROCESS.DESCRIPTION:
            await setTaskDescription(telegramUser.id, existEditableTasks.taskId, msg);
            break;
    }
});