import Task, {TASK_STATUS} from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";
import {getTelegramOptions} from "./helpers";

const formatSeconds = sec => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
};

export async function pauseTask(telegramId, userId, targetParam) {
    let task;
    if (targetParam && targetParam.trim()) {
        const query = targetParam.trim();
        task = await Task.getByTaskId(query) || await Task.findOne({userId, name: query});
    } else {
        task = await Task.findOne({userId, status: TASK_STATUS.RUNNING});
    }

    if (!task) {
        await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} No currently running task found to pause.`);
        return null;
    }

    const updatedTask = await Task.pauseTracking(task.taskId);

    await store.bot.sendMessage(
        telegramId,
        `${EMOJI.construction_sign} Paused time tracking for task: ${bold(updatedTask.name || updatedTask.taskId)}\nTotal duration tracked: ${bold(formatSeconds(updatedTask.totalDuration || 0))}`,
        getTelegramOptions()
    );

    return updatedTask;
}
