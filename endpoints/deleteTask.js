import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";

export async function deleteTask(telegramId, userId, targetParam) {
    let task;
    if (targetParam && targetParam.trim()) {
        task = await Task.getByTaskId(targetParam.trim()) || await Task.findOne({userId, name: targetParam.trim()});
    } else {
        const tasks = await Task.listByUser(userId);
        task = tasks && tasks.length ? tasks[tasks.length - 1] : null;
    }

    if (!task) {
        await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} No task found to delete.`);
        return null;
    }

    await Task.deleteByTaskId(task.taskId);

    const opts = {};
    if (store.config.PARSE_MODE) {
        opts.parse_mode = store.config.PARSE_MODE;
    }

    await store.bot.sendMessage(
        telegramId,
        `${EMOJI.cross_mark} Deleted task: ${bold(task.name || task.taskId)}`,
        opts
    );

    return task;
}
