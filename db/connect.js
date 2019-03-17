import Mongoose from 'mongoose';
const config = require('dotenv').config();

Mongoose.Promise = global.Promise;

const connectToDb = async () => {
    try {
        await Mongoose.connect(
            `mongodb+srv://${config.parsed.MONGO_USER}:${config.parsed.MONGO_PASSWORD}@${config.parsed.MONGO_HOST}/${config.parsed.MONGO_DB}`
        );
        console.info('Connected to mongo!!!');
    }
    catch (err) {
        console.error('Could not connect to MongoDB');
    }
};

export default connectToDb;
