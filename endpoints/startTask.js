import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";
import {findTaskByParamOrLatest, getTelegramOptions} from "./helpers";

export async function startTask(telegramId, userId, targetParam) {
    const task = await findTaskByParamOrLatest(userId, targetParam);

    if (!task) {
        await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} No task found to start! Use /create to create one.`);
        return null;
    }

    await Task.startTracking(task.taskId);

    await store.bot.sendMessage(
        telegramId,
        `${EMOJI.high_voltage} Started time tracking for task: ${bold(task.name || task.taskId)}`,
        getTelegramOptions()
    );

    return task;
}
