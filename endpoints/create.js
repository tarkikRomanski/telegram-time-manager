import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {store} from "../components/store";

export async function createTask(userId, telegramId, date) {
    const existingTask = await Task.getNotCompleted(userId);
    if (existingTask) {
        return existingTask;
    }

    const newTask = new Task({
        taskId: `${telegramId}-${date}`,
        userId: userId,
    });

    await Task.createTask(newTask);
    await store.bot.sendMessage(telegramId, `${EMOJI.pencil} Enter name`);
    return newTask;
}