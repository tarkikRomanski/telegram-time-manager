import Task, {TASK_STATUS} from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";

const formatSeconds = sec => {
    const totalSec = Math.max(0, Math.floor(sec));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m}m ${s}s`;
};

export async function getStatistic(telegramId, userId, targetParam) {
    const tasks = await Task.listByUser(userId);
    if (!tasks || !tasks.length) {
        await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} No tasks found to generate statistics.`);
        return null;
    }

    const opts = {};
    if (store.config.PARSE_MODE) {
        opts.parse_mode = store.config.PARSE_MODE;
    }

    const param = (targetParam || '').trim();

    if (param && param.toLowerCase() !== 'all') {
        const task = await Task.getByTaskId(param) || await Task.findOne({userId, name: param});
        if (!task) {
            await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} Task "${param}" not found.`);
            return null;
        }

        let duration = task.totalDuration || 0;
        if (task.status === TASK_STATUS.RUNNING && task.startedAt) {
            duration += Math.floor((Date.now() - new Date(task.startedAt).getTime()) / 1000);
        }

        const msgContent = [
            `${EMOJI.hundred_points} ${bold('Task Statistics')}: ${bold(task.name || task.taskId)}`,
            `Status: ${task.status}`,
            `Total Tracked Time: ${bold(formatSeconds(duration))}`,
            `Intervals Logged: ${(task.intervals && task.intervals.length) || 0}`
        ].join('\n');

        await store.bot.sendMessage(telegramId, msgContent, opts);
        return task;
    }

    let grandTotalSeconds = 0;
    const taskSummaries = tasks.map(task => {
        let duration = task.totalDuration || 0;
        if (task.status === TASK_STATUS.RUNNING && task.startedAt) {
            duration += Math.floor((Date.now() - new Date(task.startedAt).getTime()) / 1000);
        }
        grandTotalSeconds += duration;
        return `${EMOJI.calendar} ${bold(task.name || task.taskId)}: ${formatSeconds(duration)} (${task.status})`;
    });

    const summaryText = [
        `${EMOJI.hundred_points} ${bold('Overall Time Statistics')}`,
        `Total Tasks: ${tasks.length}`,
        `Grand Total Tracked: ${bold(formatSeconds(grandTotalSeconds))}`,
        '',
        ...taskSummaries
    ].join('\n');

    await store.bot.sendMessage(telegramId, summaryText, opts);
    return tasks;
}
