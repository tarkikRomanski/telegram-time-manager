import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {store} from "../components/store";

export async function endCreate(telegramId, taskId) {
    return Task.endCreate(taskId)
        .then(() => store.bot.sendMessage(telegramId, `${EMOJI.fire} Task has been created. id: ${taskId}`));
}