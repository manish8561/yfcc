const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: 'Active'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }, logo: {
        type: String,
        default: 'default.jpeg'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('team', TeamSchema);