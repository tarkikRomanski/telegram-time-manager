import mongoose from 'mongoose';

const PROCESS = {
    NAME: 'name',
    DESCRIPTION: 'description',
    END: 'end',
};

const TASK_STATUS = {
    IDLE: 'idle',
    RUNNING: 'running',
    PAUSED: 'paused',
    COMPLETED: 'completed',
};

const TaskSchema = mongoose.Schema({
    name: {type: String},
    taskId: {type: String, unique: true, index: true, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId},
    description: String,
    image: String,
    voice: String,
    process: {type: String, required: true, default: PROCESS.NAME},
    status: {type: String, enum: ['idle', 'running', 'paused', 'completed'], default: TASK_STATUS.IDLE},
    startedAt: Date,
    pausedAt: Date,
    totalDuration: {type: Number, default: 0},
    intervals: [{
        start: Date,
        end: Date,
        duration: Number
    }]
}, {collection: 'tasks'});

const Task = mongoose.model('Task', TaskSchema);

Task.getByTaskId = taskId => Task.findOne({taskId});

Task.listByUser = userId => Task.find({userId});

Task.getNotCompleted = userId => Task.findOne({process: {$ne: PROCESS.END}, userId});
Task.getNotComplated = Task.getNotCompleted;

Task.createTask = newTask => newTask.save();

Task.setName = (taskId, name) => Task.findOneAndUpdate({taskId}, {$set: {name, process: PROCESS.DESCRIPTION}});

Task.setDescription = (taskId, description) =>  Task.findOneAndUpdate({taskId}, {$set: {description}});

Task.setImage = (taskId, file_id) =>  Task.findOneAndUpdate({taskId}, {$set: {image: file_id}});

Task.setVoice = (taskId, file_id) =>  Task.findOneAndUpdate({taskId}, {$set: {voice: file_id}});

Task.endCreate = taskId => Task.findOneAndUpdate({taskId}, {$set: {process: PROCESS.END}});

Task.startTracking = async (taskId) => {
    const task = await Task.findOne({taskId});
    if (!task) return null;
    task.status = TASK_STATUS.RUNNING;
    task.startedAt = new Date();
    return task.save();
};

Task.pauseTracking = async (taskId) => {
    const task = await Task.findOne({taskId});
    if (!task || task.status !== TASK_STATUS.RUNNING) return task;
    const now = new Date();
    const startTime = task.startedAt || now;
    const sessionDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    task.status = TASK_STATUS.PAUSED;
    task.pausedAt = now;
    task.totalDuration = (task.totalDuration || 0) + sessionDuration;
    if (!task.intervals) task.intervals = [];
    task.intervals.push({ start: startTime, end: now, duration: sessionDuration });
    return task.save();
};

Task.deleteByTaskId = taskId => Task.findOneAndDelete({taskId});

Task.updateTask = (taskId, updates) => Task.findOneAndUpdate({taskId}, {$set: updates}, {new: true});

export default Task;
export { PROCESS, TASK_STATUS };