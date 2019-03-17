import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    username: {type: String, required: true},
    telegramId: {type: Number, unique: true, index: true},
    firstName: String,
    lastName: String,
    language: String,
}, {collection: 'users'});

UserSchema.pre('save', function (next) {
    const self = this;
    User.find({telegramId : self.telegramId}, (err, docs) => {
        if (!docs.length){
            next();
        }else{
            console.log('user exists: ',self.username);
        }
    });
});

const User = mongoose.model('User', UserSchema);

User.getByTelegramId = telegramId => User.findOne({telegramId});

User.createUser = newUser => newUser.save();

export default User;