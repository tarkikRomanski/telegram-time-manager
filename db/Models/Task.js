import mongoose from 'mongoose';

const PROCESS = {
    NAME: 'name',
    DESCRIPTION: 'description',
    END: 'end',
};

const TaskSchema = mongoose.Schema({
    name: {type: String},
    taskId: {type: String, unique: true, index: true, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId},
    description: String,
    image: String,
    voice: String,
    process: {type: String, required: true, default: PROCESS.NAME}
}, {collection: 'tasks'});

const Task = mongoose.model('Task', TaskSchema);

Task.getByTaskId = taskId => Task.findOne({taskId});

Task.listByUser = userId => Task.find({process: PROCESS.END, userId});

Task.getNotComplated = userId => Task.findOne({process: {$ne: PROCESS.END}, userId});

Task.createTask = newTask => newTask.save();

Task.setName = (taskId, name) => Task.findOneAndUpdate({taskId}, {$set: {name, process: PROCESS.DESCRIPTION}});

Task.setDescription = (taskId, description) =>  Task.findOneAndUpdate({taskId}, {$set: {description}});

Task.setImage = (taskId, file_id) =>  Task.findOneAndUpdate({taskId}, {$set: {image: file_id}});

Task.setVoice = (taskId, file_id) =>  Task.findOneAndUpdate({taskId}, {$set: {voice: file_id}});

Task.endCreate = taskId => Task.findOneAndUpdate({taskId}, {$set: {process: PROCESS.END}});

export default Task;
export { PROCESS };