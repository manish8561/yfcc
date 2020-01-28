const mongoose = require("mongoose");



const ScheduleSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    venue: {
        type: String,
        default: ''
    },
    location: {
        type: String, default: ''
    },
    days: {
        type: String, default: 'Sunday'
    },
    startTime: {
        type: String, default: ''
    },
    endTime: {
        type: String, default: ''
    },
    status: {
        type: String,
        default: 'Active'
    },


}, {
    timestamps: true
})

module.exports = mongoose.model('schedule', ScheduleSchema);