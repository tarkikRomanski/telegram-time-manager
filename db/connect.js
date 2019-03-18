import Mongoose from 'mongoose';
import {store} from "../components/store";

Mongoose.Promise = global.Promise;

const connectToDb = async () => {
    try {
        await Mongoose.connect(
            `mongodb+srv://${store.config.MONGO_USER}:${store.config.MONGO_PASSWORD}@${store.config.MONGO_HOST}/${store.config.MONGO_DB}`
        );
        console.info('Connected to mongo!!!');
    }
    catch (err) {
        console.error('Could not connect to MongoDB');
    }
};

export default connectToDb;
