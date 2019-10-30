const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: { type: Schema.Types.String, required: [true , 'Username is required!'], unique: [true, 'Username is already taken!'] },
    password:{type: Schema.Types.String,required: [true , 'Password is required!']},
    hashedPass: { type: Schema.Types.String, required: true },
    salt: { type: Schema.Types.String, required: true },
    roles: [{ type: Schema.Types.String }],
    expenses: [ { type: Schema.Types.ObjectId, ref: 'Expense' } ],
    amount: {type: Schema.Types.Number,default:0 , required: [true, 'Amount is required!']}
});

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, '123');
        return User.create({
            username: 'admin@abv.bg',
            password: '123',
            salt,
            hashedPass,
            roles: ['Admin']
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = User;
