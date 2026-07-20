import Task from "../db/Models/Task";
import {store} from "../components/store";

export async function findTaskByParamOrLatest(userId, targetParam) {
    if (targetParam && targetParam.trim()) {
        const query = targetParam.trim();
        return (await Task.getByTaskId(query)) || (await Task.findOne({userId, name: query}));
    }
    const tasks = await Task.listByUser(userId);
    return tasks && tasks.length ? tasks[tasks.length - 1] : null;
}

export function getTelegramOptions() {
    const opts = {};
    if (store.config.PARSE_MODE) {
        opts.parse_mode = store.config.PARSE_MODE;
    }
    return opts;
}
