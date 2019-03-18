import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {store} from "../components/store";

export async function setTaskDescription(telegramId, taskId, msg) {
    msg.text && Task.setDescription(taskId, msg.text)
        .then(() => store.bot.sendMessage(telegramId, `${EMOJI.fire} Text has been added`));

    msg.photo && Task.setImage(taskId, msg.photo[0].file_id)
        .then(() => store.bot.sendMessage(telegramId, `${EMOJI.fire} Image has been added`));

    msg.voice && Task.setVoice(taskId, msg.voice.file_id)
        .then(() => store.bot.sendMessage(telegramId, `${EMOJI.fire} Voice has been added`));
}