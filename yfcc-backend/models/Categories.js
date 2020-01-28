const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'Active'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('category', CategorySchema);