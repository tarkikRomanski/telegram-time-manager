import Task, {TASK_STATUS} from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";
import {getTelegramOptions} from "./helpers";

const formatSeconds = sec => {
    const totalSec = Math.max(0, Math.floor(sec));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m}m ${s}s`;
};

function calculateTaskDuration(task) {
    let duration = task.totalDuration || 0;
    if (task.status === TASK_STATUS.RUNNING && task.startedAt) {
        duration += Math.floor((Date.now() - new Date(task.startedAt).getTime()) / 1000);
    }
    return duration;
}

function buildSingleTaskReport(task) {
    const duration = calculateTaskDuration(task);
    return [
        `${EMOJI.hundred_points} ${bold('Task Statistics')}: ${bold(task.name || task.taskId)}`,
        `Status: ${task.status}`,
        `Total Tracked Time: ${bold(formatSeconds(duration))}`,
        `Intervals Logged: ${(task.intervals && task.intervals.length) || 0}`
    ].join('\n');
}

function buildOverallReport(tasks) {
    let grandTotalSeconds = 0;
    const taskSummaries = tasks.map(task => {
        const duration = calculateTaskDuration(task);
        grandTotalSeconds += duration;
        return `${EMOJI.calendar} ${bold(task.name || task.taskId)}: ${formatSeconds(duration)} (${task.status})`;
    });

    return [
        `${EMOJI.hundred_points} ${bold('Overall Time Statistics')}`,
        `Total Tasks: ${tasks.length}`,
        `Grand Total Tracked: ${bold(formatSeconds(grandTotalSeconds))}`,
        '',
        ...taskSummaries
    ].join('\n');
}

export async function getStatistic(telegramId, userId, targetParam) {
    const tasks = await Task.listByUser(userId);
    if (!tasks || !tasks.length) {
        await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} No tasks found to generate statistics.`);
        return null;
    }

    const opts = getTelegramOptions();
    const param = (targetParam || '').trim();

    if (param && param.toLowerCase() !== 'all') {
        const task = await Task.getByTaskId(param) || await Task.findOne({userId, name: param});
        if (!task) {
            await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} Task "${param}" not found.`);
            return null;
        }

        await store.bot.sendMessage(telegramId, buildSingleTaskReport(task), opts);
        return task;
    }

    await store.bot.sendMessage(telegramId, buildOverallReport(tasks), opts);
    return tasks;
}
