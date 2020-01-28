const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'player'
    },
    status: {
        type: String,
        default: 'Active'
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    ip: {
        type: String
    },
    stats: {
        type: Array,
        default: []
    },
    profile: {
        type: String,
        default: 'default.jpeg'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('user', UserSchema);