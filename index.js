import User from './db/Models/User';
import connectToDb from './db/connect';
import Task, {PROCESS} from './db/Models/Task';
import {
    showTask,
    endCreate,
    setTaskDescription,
    createTask,
    list,
    setTaskName,
    startTask,
    pauseTask,
    deleteTask,
    editTask,
    getStatistic
} from './endpoints';
import {store} from './components/store';

connectToDb();

const bot = store.bot;

console.log('Start session');

async function getOrCreateUser(telegramUser) {
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
    return user;
}

const COMMAND_ROUTES = [
    { pattern: /^\/create(?:\s+|$)/, action: (tUser, user, text, msg) => createTask(user._id, tUser.id, msg.date) },
    { pattern: /^\/end(?:\s+|$)/, action: () => {} },
    { pattern: /^\/start(?:\s+(.+))?$/, action: (tUser, user, text, msg, m) => startTask(tUser.id, user._id, m[1]) },
    { pattern: /^\/pause(?:\s+(.+))?$/, action: (tUser, user, text, msg, m) => pauseTask(tUser.id, user._id, m[1]) },
    { pattern: /^\/delete(?:\s+(.+))?$/, action: (tUser, user, text, msg, m) => deleteTask(tUser.id, user._id, m[1]) },
    { pattern: /^\/edit(?:\s+(.+))?$/, action: (tUser, user, text, msg, m) => editTask(tUser.id, user._id, m[1]) },
    { pattern: /^\/statistic(?:\s+(.+))?$/, action: (tUser, user, text, msg, m) => getStatistic(tUser.id, user._id, m[1]) },
    { pattern: /^\/show(?:\s+(.+))?$/, action: (tUser, user, text, msg, m, existTasks) => {
        const targetTaskId = m[1] ? m[1].trim() : (existTasks ? existTasks.taskId : '');
        return showTask(tUser.id, targetTaskId);
    }},
    { pattern: /^\/list(?:\s+|$)/, action: (tUser, user) => list(tUser.id, user._id) }
];

async function dispatchCommand(text, telegramUser, user, msg, existEditableTasks) {
    if (text.startsWith('/') && existEditableTasks) {
        await endCreate(telegramUser.id, existEditableTasks.taskId);
    }

    for (const route of COMMAND_ROUTES) {
        const match = text.match(route.pattern);
        if (match) {
            await route.action(telegramUser, user, text, msg, match, existEditableTasks);
            return;
        }
    }

    if (existEditableTasks && existEditableTasks.process === PROCESS.NAME) {
        await setTaskName(telegramUser.id, existEditableTasks.taskId, text);
    } else if (existEditableTasks && existEditableTasks.process === PROCESS.DESCRIPTION) {
        await setTaskDescription(telegramUser.id, existEditableTasks.taskId, msg);
    }
}

bot.on('message', async msg => {
    try {
        const telegramUser = msg.from;
        if (!telegramUser) return;

        const user = await getOrCreateUser(telegramUser);
        const text = (msg.text || '').trim();
        const existEditableTasks = await Task.getNotCompleted(user._id);

        await dispatchCommand(text, telegramUser, user, msg, existEditableTasks);
    } catch (err) {
        console.error('Error handling message:', err);
    }
});