import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";

export async function list(telegramId, userId) {
    const listOfTasks = await Task.listByUser(userId);

    if (!listOfTasks.length) {
        store.bot.sendMessage(telegramId, `${EMOJI.no_entry} List of tasks is empty!`);
        return new Promise((resolve, reject) => reject());
    }

    const opts = {
        reply_markup:{
            keyboard: listOfTasks.map(task => [`${EMOJI.balloon} /show ${task.taskId}`])
        },
        parse_mode: store.config.PARSE_MODE
    };

    await store.bot.sendMessage(
        telegramId,
        listOfTasks.map(task => `${EMOJI.balloon} ${bold(task.taskId)}: ${task.name}`).join('\n\n'),
        opts
    );

    return new Promise(resolve => resolve(listOfTasks));
}