const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('product', ProductSchema);