import Task from "../db/Models/Task";
import {bold} from "../components/formation";
import EMOJI from "../components/emoji";
import {store} from "../components/store";

export async function showTask(telegramId, taskId) {
    if (!taskId) {
        return store.bot.sendMessage(telegramId, `${EMOJI.no_entry} Please provide a task ID.`);
    }

    const task = await Task.getByTaskId(taskId.trim());

    if (!task) {
        return store.bot.sendMessage(telegramId, `${EMOJI.no_entry} Task not found!`);
    }

    const opts = {
        reply_markup:{
            keyboard: [
                [`${EMOJI.pencil} Edit`],
                [`${EMOJI.cross_mark} Delete`]
            ]
        }
    };

    if (store.config.PARSE_MODE) {
        opts.parse_mode = store.config.PARSE_MODE;
    }

    if (task.name) {
        await store.bot.sendMessage(telegramId, `${EMOJI.flag} ${bold('Name')}: ${task.name}`, opts);
    }
    if (task.description) {
        await store.bot.sendMessage(telegramId, task.description, opts);
    }
    if (task.image) {
        await store.bot.sendPhoto(telegramId, task.image, opts);
    }
    if (task.voice) {
        await store.bot.sendVoice(telegramId, task.voice, opts);
    }
}