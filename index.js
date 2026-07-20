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
        const startMatch = text.match(/^\/start(?:\s+(.+))?$/);
        const pauseMatch = text.match(/^\/pause(?:\s+(.+))?$/);
        const deleteMatch = text.match(/^\/delete(?:\s+(.+))?$/);
        const editMatch = text.match(/^\/edit(?:\s+(.+))?$/);
        const statMatch = text.match(/^\/statistic(?:\s+(.+))?$/);

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

            case !!startMatch:
                if (existEditableTasks) {
                    await endCreate(telegramUser.id, existEditableTasks.taskId);
                }
                await startTask(telegramUser.id, user._id, startMatch[1]);
                break;

            case !!pauseMatch:
                if (existEditableTasks) {
                    await endCreate(telegramUser.id, existEditableTasks.taskId);
                }
                await pauseTask(telegramUser.id, user._id, pauseMatch[1]);
                break;

            case !!deleteMatch:
                if (existEditableTasks) {
                    await endCreate(telegramUser.id, existEditableTasks.taskId);
                }
                await deleteTask(telegramUser.id, user._id, deleteMatch[1]);
                break;

            case !!editMatch:
                if (existEditableTasks) {
                    await endCreate(telegramUser.id, existEditableTasks.taskId);
                }
                await editTask(telegramUser.id, user._id, editMatch[1]);
                break;

            case !!statMatch:
                if (existEditableTasks) {
                    await endCreate(telegramUser.id, existEditableTasks.taskId);
                }
                await getStatistic(telegramUser.id, user._id, statMatch[1]);
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