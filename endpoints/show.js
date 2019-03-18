import Task from "../db/Models/Task";
import {bold} from "../components/formation";
import EMOJI from "../components/emoji";
import {store} from "../components/store";

export async function showTask(telegramId, taskId) {
    const opts = {
        reply_markup:{
            keyboard: [
                [`${EMOJI.pencil} Edit`],
                [`${EMOJI.cross_mark} Delete`]
            ]
        },
        parse_mode: store.config.PARSE_MODE
    };

    const task = await Task.getByTaskId(taskId.trim());
    task.name && await store.bot.sendMessage(telegramId, `${EMOJI.flag} ${bold('Name')}: ${task.name}`, opts);
    task.description && await store.bot.sendMessage(telegramId, task.description, opts);
    task.image && await store.bot.sendPhoto(telegramId, task.image, opts);
    task.voice && await store.bot.sendVoice(telegramId, task.voice, opts);
}