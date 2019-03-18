import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {store} from "../components/store";

export async function setTaskName(telegramId, taskId, taskName) {
    return Task.setName(taskId, taskName).then(() => {
        store.bot.sendMessage(telegramId, `${EMOJI.pencil} Enter description`);
    });
}