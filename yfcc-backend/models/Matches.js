const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    teamA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
        required: true,
    },
    teamB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
        required: true
    },
    teamA_goals: {
        type: Number,
        default: 0
    },
    teamB_goals: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'Pending'
    },
    remark: {
        type: String,
        default: 'Pending'
    },
    venue: {
        type: String,
    },
    schedule_date: {
        type: String,
    },
    schedule_time: {
        type: String,
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('match', TeamSchema);