import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {bold} from "../components/formation";
import {store} from "../components/store";
import {findTaskByParamOrLatest, getTelegramOptions} from "./helpers";

function parseEditParams(text) {
    const nameMatch = text.match(/name:\s*([^description:]+)/i);
    const descMatch = text.match(/description:\s*(.+)/i);

    const taskIdCandidate = text.split(/\s+/)[0];
    let taskId = null;
    if (!taskIdCandidate.toLowerCase().startsWith('name:') && !taskIdCandidate.toLowerCase().startsWith('description:')) {
        taskId = taskIdCandidate;
    }

    const updates = {};
    if (nameMatch) updates.name = nameMatch[1].trim();
    if (descMatch) updates.description = descMatch[1].trim();

    if (!nameMatch && !descMatch) {
        const fallbackName = text.replace(taskId || '', '').trim();
        if (fallbackName) updates.name = fallbackName;
    }

    return {taskId, updates};
}

export async function editTask(telegramId, userId, paramsText) {
    if (!paramsText || !paramsText.trim()) {
        await store.bot.sendMessage(
            telegramId,
            `${EMOJI.information} Usage: /edit [<taskId>] [name:<new_name>] [description:<new_description>]`
        );
        return null;
    }

    const text = paramsText.trim();
    const {taskId, updates} = parseEditParams(text);
    const task = await findTaskByParamOrLatest(userId, taskId);

    if (!task) {
        await store.bot.sendMessage(telegramId, `${EMOJI.no_entry} No task found to edit.`);
        return null;
    }

    const updatedTask = await Task.updateTask(task.taskId, updates);

    await store.bot.sendMessage(
        telegramId,
        `${EMOJI.pencil} Task updated:\nName: ${bold(updatedTask.name || 'Untitled')}\nDescription: ${updatedTask.description || 'None'}`,
        getTelegramOptions()
    );

    return updatedTask;
}
