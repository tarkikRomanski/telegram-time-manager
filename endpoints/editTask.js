import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";

export async function editTask(telegramId, userId, paramsText) {
    if (!paramsText || !paramsText.trim()) {
        await store.bot.sendMessage(
            telegramId,
            `${EMOJI.information} Usage: /edit [<taskId>] [name:<new_name>] [description:<new_description>]`
        );
        return null;
    }

    const text = paramsText.trim();
    let nameMatch = text.match(/name:\s*([^description:]+)/i);
    let descMatch = text.match(/description:\s*(.+)/i);

    let taskIdCandidate = text.split(/\s+/)[0];
    let taskId = null;
    if (!taskIdCandidate.toLowerCase().startsWith('name:') && !taskIdCandidate.toLowerCase().startsWith('description:')) {
        taskId = taskIdCandidate;
    }

    let task;
    if (taskId) {
        task = await Task.getByTaskId(taskId) || await Task.findOne({userId, name: taskId});
    } else {
        const tasks = await Task.listByUser(userId);
        task = tasks && tasks.length ? tasks[tasks.length - 1] : null;
    }

    if (!task) {
        await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} No task found to edit.`);
        return null;
    }

    const updates = {};
    if (nameMatch) updates.name = nameMatch[1].trim();
    if (descMatch) updates.description = descMatch[1].trim();

    if (!nameMatch && !descMatch) {
        const fallbackName = text.replace(taskId || '', '').trim();
        if (fallbackName) updates.name = fallbackName;
    }

    const updatedTask = await Task.updateTask(task.taskId, updates);

    const opts = {};
    if (store.config.PARSE_MODE) {
        opts.parse_mode = store.config.PARSE_MODE;
    }

    await store.bot.sendMessage(
        telegramId,
        `${EMOJI.pencil} Task updated:\nName: ${bold(updatedTask.name || 'Untitled')}\nDescription: ${updatedTask.description || 'None'}`,
        opts
    );

    return updatedTask;
}
