import Task from "../db/Models/Task";
import EMOJI from "../components/emoji";
import {store} from "../components/store";

export async function createTask(userId, telegramId, date) {
    Task.getNotComplated(userId).then(task => {
        if (task) {
            return new Promise((resolve, reject) => reject());
        }

        const newTask = Task({
            taskId: `${telegramId}-${date}`,
            userId: userId,
        });

        Task.createTask(newTask).then(() => {
            store.bot.sendMessage(telegramId, `${EMOJI.pencil} Enter name`);
        });

        return new Promise(resolve => resolve(newTask));
    });
}