import User from './db/Models/User';
import connectToDb from './db/connect';
import Task, {PROCESS} from './db/Models/Task';
import {showTask, endCreate, setTaskDescription, createTask, list, setTaskName} from './endpoints';
import {store} from './components/store';

connectToDb();

const bot = store.bot;

console.log('Start session');

bot.on('message', async msg => {
    try {
        const telegramUser = msg.from;
        if (!telegramUser) return;

        let user = await User.getByTelegramId(telegramUser.id);
        if (!user) {
            const newUser = new User({
                username: telegramUser.username,
                telegramId: telegramUser.id,
                lastName: telegramUser.last_name,
                firstName: telegramUser.first_name,
                language: telegramUser.language_code,
            });

            user = await User.createUser(newUser);
        }

        const text = (msg.text || '').trim();
        const existEditableTasks = await Task.getNotCompleted(user._id);

        const showMatch = text.match(/^\/show(?:\s+(.+))?$/);

        switch (true) {
            case /^\/create(?:\s+|$)/.test(text):
                if (existEditableTasks) {
                    await endCreate(telegramUser.id, existEditableTasks.taskId);
                }
                await createTask(user._id, telegramUser.id, msg.date);
                break;

            case /^\/end(?:\s+|$)/.test(text):
                if (existEditableTasks) {
                    await endCreate(telegramUser.id, existEditableTasks.taskId);
                }
                break;

            case !!showMatch:
                if (existEditableTasks) {
                    await endCreate(telegramUser.id, existEditableTasks.taskId);
                }
                const targetTaskId = showMatch[1] ? showMatch[1].trim() : (existEditableTasks ? existEditableTasks.taskId : '');
                await showTask(telegramUser.id, targetTaskId);
                break;

            case /^\/list(?:\s+|$)/.test(text):
                if (existEditableTasks) {
                    await endCreate(telegramUser.id, existEditableTasks.taskId);
                }
                await list(telegramUser.id, user._id);
                break;

            case Boolean(existEditableTasks && existEditableTasks.process === PROCESS.NAME):
                await setTaskName(telegramUser.id, existEditableTasks.taskId, text);
                break;

            case Boolean(existEditableTasks && existEditableTasks.process === PROCESS.DESCRIPTION):
                await setTaskDescription(telegramUser.id, existEditableTasks.taskId, msg);
                break;
        }
    } catch (err) {
        console.error('Error handling message:', err);
    }
});