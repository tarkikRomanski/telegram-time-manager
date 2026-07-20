import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";

export async function startTask(telegramId, userId, targetParam) {
    let task;
    if (targetParam && targetParam.trim()) {
        task = await Task.getByTaskId(targetParam.trim()) || await Task.findOne({userId, name: targetParam.trim()});
    } else {
        const tasks = await Task.listByUser(userId);
        task = tasks && tasks.length ? tasks[tasks.length - 1] : null;
    }

    if (!task) {
        await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} No task found to start! Use /create to create one.`);
        return null;
    }

    await Task.startTracking(task.taskId);

    const opts = {};
    if (store.config.PARSE_MODE) {
        opts.parse_mode = store.config.PARSE_MODE;
    }

    await store.bot.sendMessage(
        telegramId,
        `${EMOJI.high_voltage} Started time tracking for task: ${bold(task.name || task.taskId)}`,
        opts
    );

    return task;
}
