import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";
import {findTaskByParamOrLatest, getTelegramOptions} from "./helpers";

export async function deleteTask(telegramId, userId, targetParam) {
    const task = await findTaskByParamOrLatest(userId, targetParam);

    if (!task) {
        await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} No task found to delete.`);
        return null;
    }

    await Task.deleteByTaskId(task.taskId);

    await store.bot.sendMessage(
        telegramId,
        `${EMOJI.cross_mark} Deleted task: ${bold(task.name || task.taskId)}`,
        getTelegramOptions()
    );

    return task;
}
