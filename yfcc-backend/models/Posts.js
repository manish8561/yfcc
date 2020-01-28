const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: 'Active'
    },


}, {
    timestamps: true
});

module.exports = mongoose.model('post', PostSchema);
