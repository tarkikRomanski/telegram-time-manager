import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    username: {type: String},
    telegramId: {type: Number, unique: true, index: true, required: true},
    firstName: String,
    lastName: String,
    language: String,
}, {collection: 'users'});

UserSchema.pre('save', function (next) {
    this.constructor.findOne({telegramId: this.telegramId})
        .then(existingUser => {
            if (existingUser && existingUser._id.toString() !== this._id.toString()) {
                console.log('User already exists:', this.username || this.telegramId);
            }
            next();
        })
        .catch(err => next(err));
});

const User = mongoose.model('User', UserSchema);

User.getByTelegramId = telegramId => User.findOne({telegramId});

User.createUser = newUser => newUser.save();

export default User;